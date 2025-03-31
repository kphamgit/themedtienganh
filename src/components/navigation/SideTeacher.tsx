import React, { MouseEventHandler, useEffect, useState } from 'react'
//import Room from '../shared/Room'
//import { v4 as uuidv4 } from "uuid";
//import RoomAudio from '../shared/RoomAudioStudent';
import { useSocketContext } from '../../hooks/useSocketContext';
import { NameList } from '../live/NameList';
import RoomAudioTeacher from '../shared/RoomAudioTeacher';
import ChatPage from '../chat/ChatPage';
import { getAClass } from '../../services/list';
import { RecordViewTeacher } from './RecordViewTeacher';

//const roomids: string[] = [];
//for (let i = 0; i < 4; i++) {
  //  roomids.push(uuidv4());
  //}
//console.log(roomids)

//kpham: roomID has to be defined outsite the component to stay constant.

export function SideTeacher(props: any) {
    //room_id={roomId}
    //const [rooms, setRooms] = useState<string[]>([])   // an array of roomId (uuid)
    const {socket} = useSocketContext()
    const [targetStudent , setTargetStudent ] = useState<string>('')
    const [targetRoomId , setTargetRoomId ] = useState<string>('')
    const [targetClass , setTargetClass ] = useState<string>('')
    const [classstudents, setClassStudents] = useState<string[] | undefined>()
    //const roomID = uuid();  defining roomId here will cause it to be changed when send_chat_invite is called. kpham. Why?
  

    const send_chat_invite = () => {
        const arg = {room_id: targetRoomId,  target_student: targetStudent}
        socket?.emit('chat_invite', arg )
    }

    useEffect(() => {
          if (targetClass.length > 0 ) {
              getAClass(targetClass)
              .then((response) => {
                  //console.log("users ...", response.users)
                  if (response.users) {
                    const names = response.users.map(usr => usr.user_name); 
                    setClassStudents(names)
                  }
              })
              .catch(error => {
                  console.log(error)
              });
          }
        },[targetClass])
  
    
    const handleNameClick = (name: string) => {
        setTargetStudent(name)
    }

   
    return (
        <>
            <div>Side Teacher</div>

          
            <div className='bg-bgColor1 text-textColor1'>
                <button onClick={send_chat_invite}>Invite student </button>
            </div>

            <div className='bg-bgColor1 text-textColor1'>{targetStudent}</div>
            <div className=' bg-bgColor1 text-textColor1'><NameList parentFunct={handleNameClick} /></div>

            <div><RoomAudioTeacher /></div>
            <ChatPage />
            <div className='mx-1 bg-bgColor2 text-textColor2'>Class Id:<input className='px-2 text-sm rounded-md w-4/12' type="text" value={targetClass}
                 onChange={e => setTargetClass(e.target.value)}
            /></div>
             <RecordViewTeacher student_names={classstudents} />
        </>
    )
}
