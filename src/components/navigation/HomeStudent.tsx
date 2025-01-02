import { useEffect, useState} from 'react'

import { useSocketContext } from '../../hooks/useSocketContext'
import MainStudent from './MainStudent'
import { Side } from './Side'


//const LiveAudioRecorder = lazy(() => import("../pages/LiveAudioRecorder"))

export default function HomeStudent(props: any ) {

  const [roomId, setRoomID] = useState('')
  const {socket, user_name} = useSocketContext()

  //console.log(" IIIIII user_name", user_name)
  useEffect(() => {
    socket.on('chat_invite', (arg: { room_id: string, target_student: string }) => {
      //console.log("receive chat invite...arg =", arg)
      //console.log("receive chat invite...user_name =", user_name)
      if (arg.target_student.trim() === user_name?.trim()) {
        setRoomID(arg.room_id)
      }
       
    })
    return () => {
      socket?.off("chat_invite")
    }
},[socket, user_name])

  return (
        <div className='grid grid-cols-12 m-14 bg-bgColor1'>
            <div className='col-span-9'><MainStudent/></div>
            { roomId.length > 0 ?
            <div className='col-span-3'><Side room_id={roomId} /></div>
            :
            <div className='col-span-3 text-textColor1 bg-bgColor2'>SIDE STUDENT NO CHAT YET</div>
            }
        </div>
  )
}

/*
     <div className='m-14'>
          { showLiveRecording ?
          <LiveAudioRecorder />
          : 
          null
          }
        </div>



     <div className='bg-amber-300 col-span-3'>
            <div className='grid grid-rows-2'>
            <div className='h-20'><LiveAudioRecorder /></div>
            
            </div>
        </div>
   <div className='m-3 text-gray-400 bg-slate-200' >
            <ScoreBoard2 />
          </div>
         
*/