import {MouseEventHandler, useEffect, useState} from 'react'

//import { useAppSelector } from '../../redux/store'
import { useNavigate } from 'react-router-dom'

import { SendLiveQuestion } from '../live/SendLiveQuestion'
import SendLiveText  from '../live/SendLiveText'
import { RecordViewTeacher } from './RecordViewTeacher'
import { SendLivePicture } from '../live/SendLivePicture'
import { getAClass } from '../../services/list'
import { useSocketContext } from '../../hooks/useSocketContext'


export default function TeacherControl(props: any ) {
    const strings: string[] = ["bg-red-200", "bg-blue-200", "bg-purple-200", "bg-cyan-200", "bg-slate-200",
        "bg-lime-200", "bg-green-200", "bg-amber-100", "bg-orange-100",  "bg-emerald-200", "bg-sky-200", "bg-indigo-100", "bg-rose-100",
        "bg-yellow-200", "bg-fuchsia-200", "bg-teal-100",
        ];
    const {socket, user_name, users} = useSocketContext()
    const [targetStudent , setTargetStudent ] = useState<string>('')
    //const { data: categories, loading, error } = useAxiosFetch<Category[]>({ url: '/categories', method: 'get' });
    const [gameId, setGameId] = useState<string>()
    const [liveYouTubeUrl, setLiveYouTubeUrl] = useState('')
    const [classstudents, setClassStudents] = useState<string[] | undefined>()
    const [targetClass , setTargetClass ] = useState<string>('')
    const navigate = useNavigate();

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

      
const enableGame = () => {
   
    function getRandomString() {
      const randomIndex = Math.floor(Math.random() * strings.length);
      return strings[randomIndex];
    }
    const randombackground = getRandomString()
    socket.emit("enable_game", {game_id: gameId, backcolor: randombackground})
  }
  
  const toggleLiveRecording = () => {
    socket.emit("toggle_live_recording", {})
  }
  
  const send_live_youtube_video: MouseEventHandler<HTMLButtonElement> = (event) => {
    //console.log("xxxxxxx xxxxxxxxx")
    const el = event.target as HTMLButtonElement
    
    const arg = { target_student: 'everybody', video_url: liveYouTubeUrl, video_duration: 2000000 }
    socket.emit('live_youtube_video', arg)
  }
  
 

  const send_enable_simple_peer = () => {
    
   const arg = {to_user: targetStudent}
      //alert("Home Teacher enable simple peer arg=", arg)
      //console.log(" ENABLE SIMPLE PEER")
      
      socket.emit('enable_simple_peer', arg)
      navigate('/simple_peer')
  }

return (

    <div className='m-14 bg-bgColor1'>
      <RecordViewTeacher student_names={classstudents} />

      <div className='mx-14 bg-bgColor3 text-textColor3 grid grid-rows-2'>
        <div className='text-textColor1 mx-2 font-bold'>Youtube URL:</div>
        <input className='mx-2 px-2 text-sm bg-bgColor4 text-textColor4 rounded-md mb-2 w-3/4' type="text" size={60} value={liveYouTubeUrl}
          onChange={e => setLiveYouTubeUrl(e.target.value)}
        />
        <div className='flex flex-row gap-1 mx-2 justify-start'>
        <button className=' text-textColorSubmitBtn bg-bgColorSubmitBtn rounded-md hover:bg-red-300 p-1 px-2' onClick={send_live_youtube_video}>Send</button>
        </div>
      </div>
      <div className='mx-14 mb-6'>
        <SendLiveText />
      </div>
 
      <div className='mx-14'>
        <SendLiveQuestion />
      </div>

      <div>
        <SendLivePicture user_name={user_name} />
      </div>
      <div className='mx-14 bg-bgColor3  mb-4'>
        <button className='p-1 rounded-md bg-bgColorSubmitBtn text-textColorSubmitBtn m-4' onClick={enableGame}>Enable Game</button>
        <span className='mx-1 text-textColor3 '>Game ID: <input className='bg-bgColor4 text-textColor4 px-2 text-sm rounded-md w-4/12' type="text" value={gameId}
          onChange={e => setGameId(e.target.value)}
        /></span>
      </div>

      <div className='mx-14 bg-bgColor3 mb-4'>
      <div><button className='p-1 bg-bgColorSubmitBtn text-textColorSubmitBtn' onClick={send_enable_simple_peer}>Enable Simple Peer</button></div>
      <div>
        <div className='text-textColor1'>Target student:</div>
        <div className='mx-1 '><input className='px-2 text-sm rounded-md w-4/12' type="text" value={targetStudent}
          onChange={e => setTargetStudent(e.target.value)}
        /></div>

      </div>
      </div>
     
     
     

      <div className='bg-bgColor2 text-textColor2'>Socket id: {socket.id}</div>

    </div>
  )

}

/*
 <div className='mx-14'>
        <button className='p-1 rounded-md text-textColor1 m-4' onClick={toggleLiveRecording}>Toggle Live Recording</button>
      </div>
*/