import { useAxiosFetch } from '../../hooks'
import { useAppSelector } from '../../redux/store'
import { useContext, useEffect, useRef, useState } from 'react'
import SocketContext from '../../contexts/socket_context/Context'
import QuestionHelper from '../quiz_attempts/QuestionHelper'

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

export function ScoreBoard(props:{classId: string | undefined}) {
    const { data: my_class, loading, error } = useAxiosFetch<ClassProps>({ url: `/classes/${props.classId}`, method: 'get' });
    const {socket, user_name, users} = useContext(SocketContext).SocketState;
    
    const user = useAppSelector(state => state.user.value)
    const [targetStudent, setTargetStudent] = useState<string>()
    const studenDivRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {

        if (socket) {
            socket?.on('live_score', (arg : {
                question_number: string, 
                question_format: number, 
                question_content: string,  
                user_answer: string, 
                answer_key: string, 
                user_name: string, 
                score: string, 
                total_score: string
                }) => {
               // console.log("xxxx", studenDivRefs.current[0].childNodes[0].textContent)
               //const target_student_div =  studenDivRefs.current.find( (student_ref) => student_ref.childNodes[0].childNodes[0].textContent?.trim() === "basic2" )
               const target_student_div =  studenDivRefs.current.find( (student_ref) => student_ref.childNodes[0].childNodes[0].textContent?.trim() ===  arg.user_name.trim() )
               
                if (target_student_div) {
                    target_student_div.childNodes[0].childNodes[1].childNodes[1].textContent = arg.score
                    let current_total = target_student_div.childNodes[0].childNodes[1].childNodes[2].textContent  //total score span ref
                    if (current_total) {
                        let total_score_int = parseInt(current_total)
                        total_score_int = total_score_int + parseInt(arg.score)
                        target_student_div.childNodes[0].childNodes[1].childNodes[2].textContent = total_score_int.toString()
                    }
                    else {
                        target_student_div.childNodes[0].childNodes[1].childNodes[2].textContent = arg.score
                    }
                    if (user.role?.includes('admin')) {
                        target_student_div.childNodes[1].textContent = QuestionHelper.format_user_answer(arg.user_answer, arg.answer_key!,  arg.question_format, arg.question_content! )|| null            
                     }

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
          console.log("IN score board live_question", arg)
          if (arg.target_student.trim() === 'everybody' || 
            arg.target_student.trim() === user.user_name?.trim()
            ) {
            for (let my_div of studenDivRefs.current) {
                console.log(my_div.childNodes[0].childNodes[0].textContent);
                if (my_div.childNodes[0].childNodes[0].textContent === user.user_name) {
                    my_div.childNodes[0].childNodes[1].childNodes[0].textContent = arg.question_number
                    my_div.childNodes[0].childNodes[1].childNodes[1].textContent = ''   // clear score span
                    break;
                }
            }
            
            socket.emit('live_question_acknowledgement', {quiz_id: arg.quiz_id, 
                question_number: arg.question_number, target_student: user.user_name
            })
            /*
            studenDivRefs.current.forEach((my_div) => {
               console.log("IN score board live_question everybody", my_div.childNodes[0].childNodes[0].textContent)   
               if (my_div.childNodes[0].childNodes[0].textContent === user.user_name) {
                  
               }
               // my_div.childNodes[0].childNodes[1].childNodes[0].textContent = arg.question_number
               // my_div.childNodes[0].childNodes[1].childNodes[1].textContent = ''   // clear score span
            })
            */
          }
          else {
            console.log(" invalid student target")
          }
          
        })
        socket.on('live_question_acknowledgement', (arg: { quiz_id: string, question_number: string, target_student: string }) => {
            console.log("IN score board ON live_question_acknowledgement", arg)
            for (let my_div of studenDivRefs.current) {
                console.log(my_div.childNodes[0].childNodes[0].textContent);
                if (my_div.childNodes[0].childNodes[0].textContent === arg.target_student) {
                    my_div.childNodes[0].childNodes[1].childNodes[0].textContent = arg.question_number
                    my_div.childNodes[0].childNodes[1].childNodes[1].textContent = ''   // clear score span
                    break;
                }
            }
        })

        return () => {
          socket?.off("live_question")
          socket?.off("live_question_acknowledgement")
        }
      }
    },[socket, user.user_name])
    
    /*
  else if (arg.target_student.trim() === user.user_name?.trim()) {
           
            let for_student_index = 0
            studenDivRefs.current.forEach((my_div, index) => {
                //console.log(my_div.childNodes[0].textContent)  //student name span
                if (arg.target_student === my_div.childNodes[0].childNodes[0].textContent) { //student name div
                    for_student_index = index
                }
            });
            let target_student_div = studenDivRefs.current[for_student_index]
            target_student_div.childNodes[0].childNodes[1].childNodes[1].textContent = ''   //clear score span 

          }
    */

    /*
    const handleNameClicked: MouseEventHandler<HTMLButtonElement> = (event) => {
        const el = event.target as HTMLButtonElement
            setTargetStudent(el.textContent!)
        //}
       
    }
    */
   
    return (
        <>
            {my_class &&
                <div className='bg-bgColor1 text-textColor3'>
                    <div className='text-textColor3 p-1'>Live Score Board</div>
                    <div>
                        {my_class.users.map((student, index) => (
                            <div className='bg-bgColor3 mb-2 main_student_div' key={index} ref={(el) => {
                                if (el) {
                                    studenDivRefs.current[index] = el;
                                }
                            }}>
                                <div className='flex flex-row justify-start student_info_div'>
                                    <div className='mx-1 student_name_div'>{student.user_name}</div>
                                    <div className='student_score_div'>
                                        <span className='mx-2 text-green-700 question_number' ></span>
                                        <span className='mx-2 text-orange-600'></span>
                                        <span className='mx-2 text-orange-700 font-bold' ></span>
                                        
                                    </div>
                                </div>
                                <div className='mb-1 p-1 student_answer_div'>
                                </div>
                            </div>
                        ))
                        }
                    </div>

                </div>
            }
        </>
    )
}

/*
 return (
        <>
            {my_class &&
                <div className='bg-bgColor1 text-textColor3'>
                    <div className='text-textColor3 mb-2'>Live Score Board</div>
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
                  
                </div>
            }
        </>
    )
*/