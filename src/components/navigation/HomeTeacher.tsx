import { useState} from 'react'
import { useSocketContext } from '../../hooks/useSocketContext'
import MainTeacher from './MainTeacher'
import { Side } from './Side'
import { v1 as uuid } from "uuid";
import { NameList } from '../live/NameList'

const roomID = uuid();
//kpham: roomID has to be defined outsite the component to stay constant.

export default function HomeTeacher(props: any ) {

  const {socket} = useSocketContext()
  const [targetStudent , setTargetStudent ] = useState<string>('')
  //const roomID = uuid();  defining roomId here will cause it to be changed when send_chat_invite is called. kpham. Why?

  const send_chat_invite = () => {
      //console.log("sending chat invite room id =", roomID ) // target_student: targetStudent
      const arg = {room_id: roomID,  target_student: targetStudent}
      socket?.emit('chat_invite', arg )
  }

  const handleNameClick = (name: string) => {
    setTargetStudent(name)
}
    return (
        <div className='grid grid-cols-12 m-2 bg-bgColor1'>
            <div className='col-span-9'><MainTeacher/></div>
            <div className='col-span-3'>
            <div className='flex flex-col justify-between'>
              <div className=' bg-bgColor3 text-textColor1'><Side room_id={roomID}/></div>
              <div className='bg-bgColor1 text-textColor1'><button onClick={send_chat_invite}>Invite ... student</button></div>
              <div className='bg-bgColor1 text-textColor1'>{targetStudent}</div>
              <div className=' bg-bgColor1 text-textColor1'><NameList parentFunct={handleNameClick} /></div>
              </div>
            </div>
        </div>
    )
}
