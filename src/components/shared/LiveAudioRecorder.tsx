//import { Outlet } from "react-router-dom";
//import VoiceRecorder from "../components/VoiceRecorder";

import { useContext, useEffect, useState } from "react";
//import { LiveAudioVisualizer } from 'react-audio-visualize';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { upload_form_data_to_s3 } from '../../services/list'
import SocketContext from "../../contexts/socket_context/Context";
import { useAppSelector } from "../../redux/store";
import { v4 as uuidv4 } from 'uuid';
import { useAudioBlobContext } from "../../contexts/AudioBlobContext";

export default function LiveAudioRecorder(props: any) {
    const user = useAppSelector(state => state.user.value)
    
    const [blob, setBlob] = useState<Blob>();
    const recorder = useAudioRecorder();
    //const [backChaining, setBackChaining] = useState(true)
    //const [sendToS3, setSendToS3] = useState(true)
    //const navigate = useNavigate();
    const {socket} = useContext(SocketContext).SocketState;
    const { setAudioBlob} = useAudioBlobContext();

  
      const send_to_s3 = () => {
        /*
        const date = new Date();
        let hour = addZero(date.getHours());
        let minute = addZero(date.getMinutes());
        let second = addZero(date.getSeconds());
        const month = date.toLocaleString('default', { month: 'short' });
        const formattedDate = `${date.getFullYear()}-${month}-${date.getDate()}-${hour}${minute}${second}`;
        */
        const newUuid = uuidv4();
        const fileName = `${newUuid}-${user.user_name}`;
        //console.log("LIveAudioRecrodefileName=", fileName)
        const myFile = new File([blob as Blob], fileName, {
               type: (blob as Blob).type,
        });
        const formData = new FormData();
        const s3_file_path =  `audios/recordings/${user.user_name}`
        formData.append("s3_file_path", s3_file_path)
        formData.append("file", myFile);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        //setBlob(undefined)
        upload_form_data_to_s3(formData, config)
        .then((response) => {
         
          /*
         
          //https://kevinphambucket.s3.amazonaws.com/audios/basic1/2024-Aug-3-170159-basic1
          const full_s3_path = `https://kevinphambucket.s3.amazonaws.com/${s3_file_path}/${fileName}`
          if (socket) {
          socket.emit('s3_received_recording', {
            username: user.user_name,
            path: full_s3_path
          });
            }
          */
         //console.log("response=", response)
         if (response.message.includes("OK")) {
            setBlob(undefined)
            /*
            audios/recordings/basic2
            const full_s3_path = `https://kevinphambucket.s3.amazonaws.com/${s3_file_path}/${fileName}`
            if (socket) {
            socket.emit('s3_received_recording', {
              username: user.user_name,
              path: full_s3_path
            });
              }
              */
         }
        })
    };

    
    useEffect(() => {
      if (!blob) return;
        //setAudioSrc(URL.createObjectURL(recordingBlob))
        setAudioBlob(blob)
    }, [blob, setAudioBlob])
    
    
    return (
        <>
         
           
              <div className=" flex flex-row justify-center mx-2 text-sm">
                <AudioRecorder
                    onRecordingComplete={setBlob}
                    recorderControls={recorder}
                    showVisualizer={true}
                    
                />
              </div>

             
            {blob 

            && <div className="flex flex-row justify-center items-center gap-2">
            <div><audio src={URL.createObjectURL(blob)} controls /></div>
            <div><button className="bg-green-700 rounded-md p-2 text-white text-sm" onClick={send_to_s3}>Send</button></div>
              </div>
            }
           
         
        </>
        
    )
}

/*
 return (
        <>
              <div className=" flex flex-row justify-center mx-2">
                <AudioRecorder
                    onRecordingComplete={setBlob}
                    recorderControls={recorder}
                />
              </div>
              <div className="mx-2">
                {recorder.mediaRecorder && (
                    <LiveAudioVisualizer
                        mediaRecorder={recorder.mediaRecorder}
                        width={200}
                        height={50}
                    />
                )}
              </div>
         
            <div className="flex flex-col justify-center">
            {blob 
            && <>
            <div><audio src={URL.createObjectURL(blob)} controls /></div>
            <div><button className="bg-green-700 rounded-md p-2 text-white" onClick={send_to_s3}>Send</button></div>
              </>
            }
            </div>
        </>
        
    )
*/
