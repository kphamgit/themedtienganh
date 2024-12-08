import { useAxiosFetch } from '../hooks'
import { useAppSelector} from '../redux/store'
import { MouseEventHandler, useContext, useEffect, useRef, useState } from 'react'
import SocketContext from '../contexts/socket_context/Context'
 type ClassProps = 
    {
        class_id: number,
        class_name: string,
        users: {
            user_name: string
            full_name: string
            role: string
            level: string
            classId: number
            message: string
            password: string
        }[]
    }

export function ScoreBoard(props:{classId: string | undefined, startingQuestionId: string | undefined }) {
    const { data: my_class, loading, error } = useAxiosFetch<ClassProps>({ url: `/classes/${props.classId}`, method: 'get' });
    const {socket, uid, users} = useContext(SocketContext).SocketState;
    
    const user = useAppSelector(state => state.user.value)
    const [targetStudent, setTargetStudent] = useState<string>()
    const studenDivRefs = useRef<HTMLSpanElement[]>([]);

    useEffect(() => {

        if (socket) {
            socket?.on('live_score', (arg : {question_number: string, user_answer: string, user_name: string, score: string, total_score: string}) => {
                //console.log(arg)
                let for_student_index = 0
                studenDivRefs.current.forEach((my_div, index) => {
                    
                    //console.log(my_div.childNodes[0].textContent)  //student name span
                    if (arg.user_name === my_div.childNodes[0].textContent) { //student name span
                        for_student_index = index
                    }
                });
                //console.log("MM", studenDivRefs.current[for_student_index])
                let target_student_div = studenDivRefs.current[for_student_index]
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
                if (user.role?.includes('admin') )
                    target_student_div.childNodes[2].textContent = arg.user_answer
         
            })
            return () => {
                socket?.off("live_score")
            }
        }
    }, [socket, user.user_name, user.role])

    useEffect(() => {
     
      if (socket) {
        socket.on('live_question', (arg: { quiz_id: string, question_number: string, target_student: string }) => {
          //console.log("IN USE EFFECT SCOREBOATD")
          if (arg.target_student.trim() === 'everybody') {
            studenDivRefs.current.forEach((my_div, index) => {
                my_div.childNodes[2].textContent = ''
            })
          }
          else if (arg.target_student.trim() === user.user_name?.trim()) {
            let for_student_index = 0
            studenDivRefs.current.forEach((my_div, index) => {
                
                //console.log(my_div.childNodes[0].textContent)  //student name span
                if (arg.target_student === my_div.childNodes[0].textContent) { //student name span
                    for_student_index = index
                }
            });
            let target_student_div = studenDivRefs.current[for_student_index]
            target_student_div.childNodes[2].textContent = ''   //score span ref

          }
          else {
            console.log(" invalid student target")
          }
        })
        return () => {
          socket?.off("live_question")
        }
      }
    },[socket, user.user_name])
    
    const handleNameClicked: MouseEventHandler<HTMLButtonElement> = (event) => {
        const el = event.target as HTMLButtonElement
            setTargetStudent(el.textContent!)
        //}
       
    }

    return (
        <>
            {my_class &&
                <>
                   <div>
                    {my_class.users.map((student, index) => (
                        <div key={index} ref={(el) => {
                            if (el) {
                                studenDivRefs.current[index] = el;
                            }
                        }}>

                            <span className='mx-1 name' onClick={handleNameClicked}>{student.user_name}</span>
                                <span className='mx-2 text-green-700 question_number' >{props.startingQuestionId}</span>
                                <span className='mx-2 text-orange-600'></span>
                                <span className='mx-2 text-orange-700 font-bold' ></span>
                                <span className='mx-2 text-blue-700' ></span>
                        </div>
                    ))
                    }
                </div>
                  
                </>
            }
        </>
    )
}
