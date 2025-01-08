import React, { useEffect, useState } from 'react'
//import Room from '../shared/Room'
import LiveAudioRecorder  from "../shared/LiveAudioRecorder"
import RoomAudio from '../shared/RoomAudio';
import { useSocketContext } from '../../hooks/useSocketContext';
import Lottie from "lottie-react";
import telephoneAnimation from "../../telephone.json";

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
            console.log("Side , receive chat invite...room id =", arg.room_id)
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
            <div><LiveAudioRecorder /></div>
            {showAcceptButton &&
                <div className='bg-bgColor2 text-textColor2'>Teacher calling...
                 <Lottie animationData={telephoneAnimation} style={{ width: 150, height: 150 }} loop={true} />
                <button className='bg-bgColor4 text-textColor2 p-2 rounded-md' onClick={acceptCall}>Accept</button>
                </div>
            }
            { callAccepted &&
            <>
                 <RoomAudio roomID = {roomID} />
            </>
            }
           
        </>
    )
}

/*
            {showAcceptButton &&
                <div className='bg-bgColor2 text-textColor2'>Teacher calling...
               
                
                <button className='bg-bgColor2 text-textColor2' onClick={acceptCall}>Accept call</button>
                </div>
            }
            { callAccepted ?
            <div className='col-span-2'><Side room_id={roomId} /></div>
            :
            <div className='col-span-2 text-textColor1 bg-bgColor2'>Side</div>
            }
*/
