import { useEffect, useState } from 'react'
//import Room from '../shared/Room'
import LiveAudioRecorderSave  from "../shared/LiveAudioRecorder"
import RoomAudio from '../shared/RoomAudioStudent';
import { useSocketContext } from '../../hooks/useSocketContext';
//import Lottie from "lottie-react";
//import telephoneAnimation from "../../telephone.json";
import ChatPage from '../chat/ChatPage';

export function SideStudent(props: any) {
    //room_id={roomId}
    const [roomID, setRoomID] = useState('')
    const {socket, user_name} = useSocketContext()
    const [showAcceptButton, setShowAcceptButton] = useState(false)
    const [callAccepted, setCallAccepted] = useState(false)
  

    useEffect(() => {
        socket.on('chat_invite', (arg: { room_id: string, target_student: string }) => {
          console.log("Side , receive chat invite...arg =", arg)
          //console.log("receive chat invite...user_name =", user_name)
          if (arg.target_student.trim() === user_name?.trim()) {
            //console.log("Side , receive chat invite...room id =", arg.room_id)
            setRoomID(arg.room_id)
            setShowAcceptButton(true)
          }
          
        })
        return () => {
          socket?.off("chat_invite")
        }
    },[socket, user_name])
    
    const acceptCall = () => {
        //console.log(" accept call...")
        setCallAccepted(true)
        setShowAcceptButton(false)
    }

    return (
        <>  
           
            {showAcceptButton &&
                <div className='bg-bgColor2 text-textColor2'>Teacher calling...
                <div>{roomID}</div>
                <button className='bg-bgColor4 text-textColor2 p-2 rounded-md' onClick={acceptCall}>Accept</button>
                </div>
            }
            { callAccepted &&
            <>
                 <RoomAudio roomID = {roomID} />
            </>
            }
            <LiveAudioRecorderSave />
          
        </>
    )
}

/*
       return (
        <>  
            <div><LiveAudioRecorder /></div>
            {showAcceptButton &&
                <div className='bg-bgColor2 text-textColor2'>Teacher calling...
                <div>{roomID}</div>
                 <Lottie animationData={telephoneAnimation} style={{ width: 150, height: 150 }} loop={true} />
                <button className='bg-bgColor4 text-textColor2 p-2 rounded-md' onClick={acceptCall}>Accept</button>
                </div>
            }
            { callAccepted &&
            <>
                 <RoomAudio roomID = {roomID} />
            </>
            }
           <ChatPage />
        </>
    )
*/
