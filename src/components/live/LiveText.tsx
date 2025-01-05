import { useLocation } from "react-router-dom";
//import VoiceRecorder from "../components/VoiceRecorder";
import { useEffect, useState } from "react";
//import { AudioVisualizer, LiveAudioVisualizer } from 'react-audio-visualize';
//import { useAudioRecorder } from 'react-audio-voice-recorder';
//import { upload_form_data_to_s3 } from "../components/services/list";
//import SocketContext from "../components/context/Socket/Context";
import { useAppSelector } from "../../redux/store";

export default function LiveText(props: any) {
    const user = useAppSelector(state => state.user.value)
   
    const location = useLocation();
    const live_text_data = location.state;
    //console.log("EEEEE", live_text_data)
    /*
{
    "backchaining": false,
    "text_complete": false,
    "live_text": " r3r3r3r3r",
    "target_student": "everybody"
}
    */
    const [liveText, setLiveText] = useState('')
    /*
{
    "backchaining": false,
    "text_complete": false,
    "live_text": "eefefef",
    "target_student": "everybody",
    "target_class": "3"
}
    */

    const [blob, setBlob] = useState<Blob>();
    //const recorder = useAudioRecorder();
    //const [backChaining, setBackChaining] = useState(true)
    //const [sendToS3, setSendToS3] = useState(false)
    //const navigate = useNavigate();
    //const {socket, uid, users} = useContext(SocketContext).SocketState;

   useEffect(() => {
      setLiveText(live_text_data.live_text)
   },[live_text_data])

    function addZero(i: number) {
        let str = i.toString()
        if (i < 10) {
            str = "0" + i.toString()
        }
        return str;
      }
      
    //const params = useParams<{ live_text: string, target_student: string, target_class: string }>();
    //console.log("...", params)
    //= {live_text: `${liveText}`, target_student: targetStudent, target_class: targetClass}
    return (
        <>
            <div className="m-8">
                <div className="mb-5 mx-3 text-amber-800 text-lg">{liveText} </div>

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
