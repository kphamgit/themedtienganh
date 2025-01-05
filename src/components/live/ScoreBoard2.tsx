import { useAppSelector } from '../../redux/store'
import { useContext, useEffect, useRef } from 'react'
//import SocketContext from '../contexts/socket_context/Context'
import SocketContext from '../../contexts/socket_context/Context'
import QuestionHelper from './QuestionHelper'

  interface ElapsedTime {
    minutes: number | undefined, seconds: number
  }

  interface LiveScoreProps {
    question_format: number | undefined,
    question_number: number | undefined,
    question_content: string | undefined,
    user_answer: string | undefined,
    answer_key: string | undefined,
    score: string,
    total_score: number | undefined, 
    user_name: string
  }

export function ScoreBoard2(props:any) {
   // export function ScoreBoard2(props:{users: SocketInfo[] | undefined }) {
    //const { data: my_class, loading, error } = useAxiosFetch<ClassProps>({ url: `/classes/${props.classId}`, method: 'get' });
    const {socket, user_name, users} = useContext(SocketContext).SocketState;
    const user = useAppSelector(state => state.user.value)
    const studenDivRefs = useRef<HTMLSpanElement[]>([]);
   

    useEffect(() => {
        if (socket) {
            socket?.on('live_score_new', (arg : LiveScoreProps) => {
                //console.log(" on live score NEW.....arg =", arg)
                const target_student_div =  studenDivRefs.current.find( (student_ref) => student_ref.childNodes[0].textContent?.trim() === arg.user_name.trim() )
                if (target_student_div) {
                    target_student_div.childNodes[2].textContent = arg.score   //score span ref
                    let current_total = target_student_div.childNodes[3].textContent  //total score span ref
                    if (current_total) {
                        //console.log(".... total present")
                        let total_score_int = parseInt(current_total)
                        total_score_int = total_score_int + parseInt(arg.score)
                        target_student_div.childNodes[3].textContent = total_score_int.toString()
                    }
                    else {
                        //console.log(".... total empty")
                        target_student_div.childNodes[3].textContent = arg.score
                    }
                    if (user.role?.includes('admin')) {
                        target_student_div.childNodes[4].textContent = QuestionHelper.format_user_answer(arg.user_answer, arg.answer_key!,  arg.question_format, arg.question_content! )|| null
                    }
                }
                
            })
            return () => {
                socket?.off("live_score_new")
            }
        }
    }, [socket, user.user_name, user.role])

    useEffect(() => {
        if (socket) {
            socket?.on('live_question_received', (arg : { quiz_id: string, question_number: string, target_student: string} ) => {
                //console.log(",,,,live_question_received arg ", arg)
                const target_student_div =  studenDivRefs.current.find( (student_ref) => student_ref.childNodes[0].textContent?.trim() === arg.target_student.trim() )
                if (target_student_div) {
                    target_student_div.childNodes[1].textContent = arg.question_number   //elaped time span ref
                    target_student_div.childNodes[2].textContent = '..'   //score span ref
                    target_student_div.childNodes[4].textContent = ''   //score span ref
                }
            })
            return () => {
                socket?.off("live_question_received")
            }
        }
    },[socket])

    useEffect(() => {
        if (socket) {
            socket?.on('game_over', (arg : { game_name: string, student_name: string, elapsed_time: ElapsedTime}) => {
                //console.log("GGGGGG", arg)
                const target_student_div =  studenDivRefs.current.find( (student_ref) => student_ref.childNodes[0].textContent?.trim() === arg.student_name.trim() )
                const minutes_string = (arg.elapsed_time.minutes === undefined || arg.elapsed_time.minutes === 0 ) ?  '' : `${arg.elapsed_time.minutes} +  minutes `
                const time_string = minutes_string + arg.elapsed_time.seconds + ' seconds'
                if (target_student_div) {
                    target_student_div.childNodes[1].textContent = time_string   //elaped time span ref
                }
            })
            return () => {
                socket?.off("game_over")
            }
        }
    }, [socket])

    useEffect(() => {
        if (socket) {
            socket?.on('game_started', (arg : { game_name: string, student_name: string, elapsed_time: ElapsedTime}) => {
                const target_student_div =  studenDivRefs.current.find( (student_ref) => student_ref.childNodes[0].textContent?.trim() === arg.student_name.trim() )
                /*
<div><span class="mx-1">PtLBsMEsTjHt2AQ4AAAI</span>
<span class="mx-1">basic2</span>
<span class="mx-2 text-green-900">19 seconds</span>
<span class="mx-2 text-orange-700 font-bold"></span>
<span class="mx-2 text-blue-700"></span></div>
                */
               if (target_student_div) {
                    target_student_div.childNodes[1].textContent = ''
               }
            })
            return () => {
                socket?.off("game_over")
            }
        }
    }, [socket])

    return (
        <>
              
                   <div className='text-lg'>
                    {  users && 
                        users.map((student, index) => (
                        <div key={index} ref={(el) => {
                            if (el) {
                                studenDivRefs.current[index] = el;
                            }
                        }}>
                        <span className='mx-1 text-blue-800'>{student.user_name}</span>
                        <span className='mx-2 text-red-700'></span>
                        <span className='mx-2 text-orange-700 font-bold' ></span>
                        <span className='mx-2 text-blue-700' ></span>
                        <span className='mx-2 text-green-700' ></span>
                        </div>
                    ))
                    }
                </div> 
        </>
    )
}
