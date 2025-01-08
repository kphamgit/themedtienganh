import React, { useEffect, useState } from 'react'
import Room from '../shared/Room'
import { v1 as uuid } from "uuid";
import RoomAudio from '../shared/RoomAudio';
import { useSocketContext } from '../../hooks/useSocketContext';
import { NameList } from '../live/NameList';

const roomID = uuid();
//kpham: roomID has to be defined outsite the component to stay constant.

export function SideTeacher(props: any) {
    //room_id={roomId}
    const {socket} = useSocketContext()
    const [targetStudent , setTargetStudent ] = useState<string>('')
    //const roomID = uuid();  defining roomId here will cause it to be changed when send_chat_invite is called. kpham. Why?
  

    const send_chat_invite = () => {
        console.log("sending chat invite room id =", roomID ) // target_student: targetStudent
        const arg = {room_id: roomID,  target_student: targetStudent}
        socket?.emit('chat_invite', arg )
    }
    
    const handleNameClick = (name: string) => {
        setTargetStudent(name)
    }

    return (
        <>  
            <div>Side Teacher</div>
              <div className='bg-bgColor1 text-textColor1'><button onClick={send_chat_invite}>Invite ... student</button></div>
              <div className='bg-bgColor1 text-textColor1'>{targetStudent}</div>
              <div className=' bg-bgColor1 text-textColor1'><NameList parentFunct={handleNameClick} /></div>
              { roomID &&
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
