import { useAxiosFetch } from '../../hooks'
import { useAppSelector } from '../../redux/store'
import { MouseEventHandler, useContext, useEffect, useRef, useState } from 'react'
import SocketContext from '../../contexts/socket_context/Context'

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
    const {socket, user_name, users} = useContext(SocketContext).SocketState;
    
    const user = useAppSelector(state => state.user.value)
    const [targetStudent, setTargetStudent] = useState<string>()
    const studenDivRefs = useRef<HTMLSpanElement[]>([]);

    useEffect(() => {

        if (socket) {
            socket?.on('live_score', (arg : {question_number: string, 
                question_format: number, 
                question_content: string,  
                user_answer: string, 
                answer_key: string, 
                user_name: string, score: string, total_score: string}) => {
                //console.log("...live_score received ... arg=", arg)
                /*
{
    "question_format": 1,
    "question_content": " condensation trail left behind an [aircraft] is called [contrail].",
    "user_answer": "  ww/  ffefff",
    "answer_key": "..",
    "score": 0,
    "total_score": 0,
    "user_name": "basic2"
}
               */
  
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
                        target_student_div.childNodes[3].textContent = arg.score
                    }
                    if (user.role?.includes('admin')) {
                        console.log("..... arg.user_answer", arg.user_answer)
                        //target_student_div.childNodes[4].textContent = QuestionHelper.format_user_answer(arg.user_answer)|| null//arg.user_answer
                    }
//src/components/question_attempts/QuestionHelper.ts
//= (answer: string | undefined, format: number | undefined, content: string): string | undefined => {
                }
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
                    <div className='text-amber-700 mb-2'>Live Score Board</div>
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
