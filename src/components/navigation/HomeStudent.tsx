import {useContext, useEffect} from 'react'

import { useAppSelector } from '../../redux/store'
import { Outlet, useNavigate } from 'react-router-dom'
import SocketContext from '../../contexts/socket_context/Context'
//import ReactTextareaAutosize from 'react-textarea-autosize'
//import PeerComponentStudent from './PeerComponentStudent'
//import { Dictaphone } from './Dictaphone'
import { NavigationBar } from './NavigationBar'
//import SimplePeer from '../../components/SimplePeer'


//import VoiceRecorder from './VoiceRecorder'


export function HomeStudent() {
    const user = useAppSelector(state => state.user.value)
    const strings: string[] = ["bg-red-200", "bg-blue-200", "bg-purple-200", "bg-cyan-200", "bg-slate-200",
  "bg-lime-200", "bg-green-200", "bg-amber-100", "bg-orange-100",  "bg-emerald-200", "bg-sky-200", "bg-indigo-100", "bg-rose-100",
  "bg-yellow-200", "bg-fuchsia-200", "bg-teal-100",
  ];

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

    const {socket, uid, users} = useContext(SocketContext).SocketState;
    const navigate = useNavigate();
  
    useEffect(() => {
      if (socket) {
        socket.on('live_question', (arg: { quiz_id: string, question_number: string, target_student: string, target_class: string }) => {
          if (arg.target_student.trim() === 'everybody' && arg.target_class.trim() === user.classId?.toString()) {
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
      }
    },[socket, navigate, user.user_name, user.classId])

    
    useEffect(() => {
      if (socket) {
        socket.on('enable_live_text', (arg: { target_student: string, target_class: string }) => {
          console.log("Home student: enable_live_text message received:", arg)
          //const arg = {live_text: `${liveText}`, target_student: targetStudent, target_class: targetClass}
          if (arg.target_student.trim() === 'everybody' && arg.target_class.trim() === user.classId?.toString()) {
            //console.log("live text for everybody in my class", user.classId)
            //console.log("navigate to /live_text")
            navigate("/live_text", { state: arg })
          }
          else if (arg.target_student.trim() === user.user_name?.trim()) {
            navigate("/live_text", { state: arg })
          }
          else {
            console.log(" invalid student target")
          }
          
        })
        return () => {
          socket?.off("enable_live_text")
        }
      }
    },[socket, navigate, user.user_name, user.classId])

  useEffect(() => {
    if (socket) {
      socket.on('enable_game', (arg: { game_id: string, backcolor: string }) => {
        //console.log(" game....", arg)
        navigate(`/live_game/${arg.game_id}/${arg.backcolor}`)
      })
      return () => {
        socket?.off("enable_game")
      }
    }
  }, [socket, navigate, user.user_name, user.role])

/*
        {user.role.include('teacher') ?
        <PeerComponentTeacher items={['aaaaa', 'bbbbb']} />
        :
        <PeerComponentStudent />
        }
//
*/
  return (
 
      <div className='bg-bgColor mx-10 p-5'>
        <div>Student</div>
      </div>

 
  )
}
