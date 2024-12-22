import { useLocation } from "react-router-dom";
//import VoiceRecorder from "../components/VoiceRecorder";
import { useEffect, useState } from "react";
//import { AudioVisualizer, LiveAudioVisualizer } from 'react-audio-visualize';
//import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
//import { upload_form_data_to_s3 } from "../components/services/list";
//import SocketContext from "../components/context/Socket/Context";
//import { useAppSelector } from "../redux/store";
//import { AzureButton } from "../components/AzureButton";
import { AzureAudioPlayer } from "../shared/AzureAudioPlayer";

export default function LivePicture(props: any) {
    //const user = useAppSelector(state => state.user.value)
    const [audioDescription, setAudioDescription] = useState<string>('')
    //const [description, setDescription] = useState<string>('')
    //const [imgSrc, setImgSrc] = useState('')
    const [width, setWidth] = useState<number>(200)
    const [height, setHeight] = useState<number>(200)
    //const [showAudio, setShowAudio] = useState<boolean>(true)
    
    const location = useLocation();
    const live_picture_data = location.state;
   
    console.log("MMMMM live picture data", live_picture_data)
    
    useEffect(() => {
        //setWidth(live_picture_data.width)
        //setHeight(live_picture_data.height)
        if (live_picture_data.type === 'general') {  // general pictures
           // setImgSrc(live_picture_data.picture_url)
        }
        else { // personal pictures
   
        }

        setAudioDescription(live_picture_data.audio_description)
    },[live_picture_data])
    

    return (
        <>
        
            <div className="mt-5">
          
            <div><img style={{width: width, height:height}}  src = {live_picture_data.picture_url} alt="card" />
            </div>
            { audioDescription.length > 0 && 
            <AzureAudioPlayer text={audioDescription} />
            }
            </div>
        </>
    )
}

/*
      

          //live_picture_data.picture_url = `https://kevinphambucket.s3.us-east-1.amazonaws.com/images/students`
          
           const url = `${live_picture_data.picture_url}/${user.user_name}/${live_picture_data.description}.jpeg`
           console.log("MMMEEEEEE url", url)
           //https://kevinphambucket.s3.us-east-1.amazonaws.com/images/students/basic3/test.jpeg
           setImgSrc(url)
           

          
*/