import { useEffect, lazy} from 'react'

import { useAppSelector } from '../../redux/store'
import { Outlet, useNavigate } from 'react-router-dom'

import LiveAudioRecorder  from "../shared/LiveAudioRecorder"
import { ScoreBoard2 } from '../quiz_attempts/ScoreBoard2'
import { NavigationBar } from './NavigationBar'
import { useSocketContext } from '../../hooks/useSocketContext'

//const LiveAudioRecorder = lazy(() => import("../pages/LiveAudioRecorder"))

export default function HomeStudent(props: any ) {
    const user = useAppSelector(state => state.user.value)
    //const [localLiveQuizId, setLocalLiveQuizId] = useState<string>('')
    // this is not needed but keep it for Typescript learning
      /*  Initialize localLiveQuizId with an empty string to avoid this error:
        A component is changing an uncontrolled input to be controlled. This is likely caused...

         <select className='cloze_answer'>
          { (classIds as string[]).map( (classId, index) => {
               return <option key={index} id={index.toString()} >{classID} </option>
          })
          }
        </select>
    */

    //const {socket, user_name, users} = useContext(SocketContext).SocketState;
    const {socket, user_name, users} = useSocketContext()

    const navigate = useNavigate();

    useEffect(() => {
        socket.on('live_question', (arg: { quiz_id: string, question_number: string, target_student: string}) => {
          console.log("emit live question received...arg=", arg)
          const temp = {...arg, target_student: user.user_name}
          socket.emit("live_question_received", temp)
 
          if (arg.target_student.trim() === 'everybody') {
            //console.log("live question for everybody in my class", user.classId)
            navigate("/live_quiz", { state: arg })
          }
          else if (arg.target_student.trim() === user.user_name?.trim()) {
            navigate("/live_quiz", { state: arg })
          }
          else {
            console.log(" invalid student target")
          }
        })
        return () => {
          socket?.off("live_question")
        }
    },[socket, navigate, user.user_name, user.classId])

   
  useEffect(() => {   
      socket.on('live_text', (arg: { backchaining: boolean, text_complete: boolean, live_text: string, target_student: string, target_class: string }) => {
        if (arg.target_student.trim() === 'everybody') {
          navigate("/live_text", { state: arg })
        }

      })
      return () => {
        socket?.off("live_text")
      }
  }, [socket, navigate])
    
      ///live_audio_recorder/live_picture
      useEffect(() => {
          socket.on('live_youtube_video', (arg: { target_student: string, video_url: string, video_duration: number }) => {
            if (arg.target_student.trim() === 'everybody') {
              navigate("/live_youtube_video", { state: {video_url: arg.video_url, video_duration: arg.video_duration} })
            }
    
          })
          return () => {
            socket?.off("live_youtube_video")
          }
      }, [socket, navigate, user.user_name])
        

    useEffect(() => {
   
        socket.on('live_picture', (arg: { live_text: string, target_student: string, target_class: string }) => {
           //console.log("....xxxxxx xxxxx xxx .... live_picture message received:", arg)
           navigate("/live_picture", { state: arg })
        })

        return () => {
          socket?.off("live_picture")
        }
    },[socket, navigate])
  

  useEffect(() => {
      socket.on('enable_game', (arg: { game_id: string, backcolor: string }) => {
        navigate(`/live_game/${arg.game_id}/${arg.backcolor}`)
      })
      return () => {
        socket?.off("enable_game")
      }
  }, [socket, navigate, user.user_name, user.role])

  const pollyFunc = (selected_text: string) => {
      console.log("in polly function")
  }

  return (
    <div>
   
      <div className='grid grid-cols-12'>
        <div className='bg-green-200 col-span-9 h-screen'>
          <NavigationBar />
          <Outlet />
        </div>
        <div>
          <LiveAudioRecorder />
        </div>
      </div>
    
    </div>
  )
}

/*

     <div className='bg-amber-300 col-span-3'>
            <div className='grid grid-rows-2'>
            <div className='h-20'><LiveAudioRecorder /></div>
            
            </div>
        </div>
   <div className='m-3 text-gray-400 bg-slate-200' >
            <ScoreBoard2 />
          </div>
         
*/