import { useLocation, useNavigate, useParams } from "react-router-dom";
//import VoiceRecorder from "../components/VoiceRecorder";
import { useContext, useEffect, useState } from "react";
import { AudioVisualizer, LiveAudioVisualizer } from 'react-audio-visualize';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { upload_form_data_to_s3 } from "../../services/list";
import SocketContext from "../../contexts/socket_context/Context";
import { useAppSelector } from "../../redux/store";

export function LiveText(props: any) {
    const user = useAppSelector(state => state.user.value)
    const [liveText, setLiveText] = useState('')
    const location = useLocation();
    const live_text_data = location.state;
    //console.log("EEEEE", live_text_data)
    const [blob, setBlob] = useState<Blob>();
    const recorder = useAudioRecorder();
    //const [backChaining, setBackChaining] = useState(true)
    const [sendToS3, setSendToS3] = useState(false)
    const navigate = useNavigate();
    const {socket, uid, users} = useContext(SocketContext).SocketState;

    useEffect(() => {
        if (socket) {
          socket.on('live_text', (arg: { backchaining: boolean, text_complete: boolean, live_text: string, target_student: string, target_class: string }) => {
            //socket.on('live_text', (arg: any) => {
            //console.log("XXXXXXXXX live text message received:", arg)
            //const arg = {live_text: `${liveText}`, target_student: targetStudent, target_class: targetClass}
            if (arg.target_student.trim() === 'everybody' && arg.target_class.trim() === user.classId?.toString()) {
              //console.log("live text for everybody in my class", user.classId)
              if (arg.backchaining) {
                setLiveText(prev => arg.live_text + ' ' + prev )
              }
              else {
                console.log(" not backchaining")
                setLiveText(arg.live_text)
              }
              if (arg.text_complete) {
                  console.log("TEXT COMPLETE")
                  setSendToS3(true)
              }
              else {
                  setSendToS3(false)
              }
            }
     
            
          })
          return () => {
            socket?.off("live_text")
          }
        }
      },[socket, navigate, user.user_name, user.classId])
      

    function addZero(i: number) {
        let str = i.toString()
        if (i < 10) {
            str = "0" + i.toString()
        }
        return str;
      }

      const send_to_s3 = () => {
        const date = new Date();
        let hour = addZero(date.getHours());
        let minute = addZero(date.getMinutes());
        let second = addZero(date.getSeconds());
        const month = date.toLocaleString('default', { month: 'short' });
        const formattedDate = `${date.getFullYear()}-${month}-${date.getDate()}-${hour}${minute}${second}`;
        const fileName = `${formattedDate}-${user.user_name}`;
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
        upload_form_data_to_s3(formData, config)
        .then((response) => {
          //setHasBeenSent(true)
          //https://kevinphambucket.s3.amazonaws.com/audios/basic1/2024-Aug-3-170159-basic1
          const full_s3_path = `https://kevinphambucket.s3.amazonaws.com/${s3_file_path}/${fileName}`
          if (socket) {
          socket.emit('s3_received_recording', {
            username: user.user_name,
            path: full_s3_path
          });
            }
        })
    };

    useEffect(() => {
        if (blob) {
            console.log("blob setvvvv sentToS3=", sendToS3)
            if (sendToS3) {
              send_to_s3()
              setSendToS3(false)
            }
        }
    
    },[blob])

   

    //const params = useParams<{ live_text: string, target_student: string, target_class: string }>();
    //console.log("...", params)
    //= {live_text: `${liveText}`, target_student: targetStudent, target_class: targetClass}
    return (
        <>
            <div className="m-8">
                <div className="mb-5 mx-3 text-amber-800 text-lg">{liveText} </div>

            </div>
            <div>
                <AudioRecorder
                    onRecordingComplete={setBlob}
                    recorderControls={recorder}
                />

                {recorder.mediaRecorder && (
                    <LiveAudioVisualizer
                        mediaRecorder={recorder.mediaRecorder}
                        width={200}
                        height={75}
                    />
                )}
            </div>
        </>
    )
}

/*
 {blob && (
        <AudioVisualizer
          blob={blob}
          width={500}
          height={75}
          barWidth={1}
          gap={0}
          barColor={'#f76565'}
        />
      )}

      {blob && (
        <AudioVisualizer
          blob={blob}
          width={500}
          height={75}
          barWidth={3}
          gap={2}
          barColor={'lightblue'}
        />
      )}
*/