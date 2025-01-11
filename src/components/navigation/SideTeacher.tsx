import React, { MouseEventHandler, useEffect, useState } from 'react'
//import Room from '../shared/Room'
import { v4 as uuidv4 } from "uuid";
//import RoomAudio from '../shared/RoomAudioStudent';
import { useSocketContext } from '../../hooks/useSocketContext';
import { NameList } from '../live/NameList';
import RoomAudioTeacher from '../shared/RoomAudioTeacher';

const roomids: string[] = [];
for (let i = 0; i < 4; i++) {
    roomids.push(uuidv4());
  }
//console.log(roomids)

//kpham: roomID has to be defined outsite the component to stay constant.

export function SideTeacher(props: any) {
    //room_id={roomId}
    //const [rooms, setRooms] = useState<string[]>([])   // an array of roomId (uuid)
    const {socket} = useSocketContext()
    const [targetStudent , setTargetStudent ] = useState<string>('')
    const [targetRoomId , setTargetRoomId ] = useState<string>('')
    //const roomID = uuid();  defining roomId here will cause it to be changed when send_chat_invite is called. kpham. Why?
  

    const send_chat_invite = () => {
        const arg = {room_id: targetRoomId,  target_student: targetStudent}
        socket?.emit('chat_invite', arg )
    }

    const activate_room = () => {
        socket.emit("join room", targetRoomId);
    }
    
    const handleNameClick = (name: string) => {
        setTargetStudent(name)
    }

    const handleRoomIdClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        const el = event.target as HTMLButtonElement
        setTargetRoomId(el.textContent as string)
        //props.parentFunct(el.textContent as string)
    }
    return (
        <>
            <div>Side Teacher</div>
            <div className='bg-bgColor2'>
                {roomids.map((roomId, index) => (
                    <div key={index} className='flex flex-row justify-start mb-2'>
                        <button className='mx-2 p-1 rounded-md bg-bgColor1' onClick={handleRoomIdClick}>{roomId}</button>

                    </div>
                )
                )}
            </div>

            <div className='bg-bgColor1 text-textColor1'>
                <div className='mx-1 bg-bgColor1 text-textColor1'>Selected Room:<input className='px-2 bg-bgColor1 text-textColor1 text-sm rounded-md ' type="text" value={targetRoomId}
                    onChange={e => setTargetRoomId(e.target.value)}
                /></div>
            </div>
            <button className='mx-2 rounded-md bg-bgColor3 mb-2 p-2' onClick={activate_room}>Activate selected room</button>
            <div className='bg-bgColor1 text-textColor1'>
                <button onClick={send_chat_invite}>Invite student to selected room</button>
            </div>

            <div className='bg-bgColor1 text-textColor1'>{targetStudent}</div>
            <div className=' bg-bgColor1 text-textColor1'><NameList parentFunct={handleNameClick} /></div>

            <div><RoomAudioTeacher roomID={roomids[0]} /></div>

        </>
    )
}
