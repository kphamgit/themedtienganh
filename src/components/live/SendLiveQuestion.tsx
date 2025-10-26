import { MouseEventHandler, useContext, useState } from 'react'
import SocketContext from '../../contexts/socket_context/Context'
import { NameList } from './NameList'
//import { getAClass } from './services/list'

    export function SendLiveQuestion(props: any) {
    
    const [liveQuizId , setLiveQuizId ] = useState<string>('')
    const [questionNumber , setQuestionNumber ] = useState<string>('')
    const [targetStudent , setTargetStudent ] = useState<string>('')
    //const [targetClass , setTargetClass ] = useState<string>('')
    const {socket} = useContext(SocketContext).SocketState;

    const enable_live_quiz: MouseEventHandler<HTMLButtonElement> = (event) => {
        if (socket) {
            console.log("enable_live_quiz")
            //const el = event.target as HTMLButtonElement
            const arg = {}
            socket.emit('enable_live_quiz', arg)
        }
      }
      
      const live_video_quiz: MouseEventHandler<HTMLButtonElement> = (event) => {
        
        if (socket) {
            console.log("sending live_video_quiz ...")
            //const el = event.target as HTMLButtonElement
            //const arg = {}
            const arg = {quizId: liveQuizId}
            socket.emit('live_video_quiz', arg)
        }
      }


    const send_live_question: MouseEventHandler<HTMLButtonElement> = (event) => {
        if (liveQuizId.length === 0) {
            alert("Enter quiz id")
            return 
        }
        else if (questionNumber.length === 0) {
            alert("Enter question number")
            return 
        }
        else if (targetStudent.length === 0) {
            alert("Enter target student")
            return 
        }
        else {
        const el = event.target as HTMLButtonElement
        //console.log(el)
        //console.log("XXX id=", el.id)
        const arg = {quiz_id: `${el.id}`, question_number: `${questionNumber}`, target_student: targetStudent}
        //console.log("SENNNN arg=", arg)
        socket?.emit('live_question', arg)
        }
    }

    const handleNameClick = (name: string) => {
        setTargetStudent(name)
    }

        return (
            <>
                <div className='grid grid-row-2 mt-0'>
                    <NameList parentFunct={handleNameClick} />

                    <div className='flex flex-row gap-1 bg-bgColor2 text-textColor2'>
                        <div className='text-md flex flex-col'>
                            <div className='mx-14 m-2'>
                            <button className='p-1 rounded-md bg-bgColorSubmitBtn text-textColorSubmitBtn mx-2' onClick={enable_live_quiz}>Enable Live Quiz</button>
                             </div>
                             <div className='mx-14 m-2'>
                            <button className='p-1 rounded-md bg-bgColorSubmitBtn text-textColorSubmitBtn mx-2' onClick={live_video_quiz}>Send Live Video Quiz</button>
                             </div>
                            <div>
                            <span className='mx-1 text-textColor3'>Quiz id 1:</span>
                            <span className='mx-1 '><input className='bg-bgColor4 text-textColor4 px-2 text-sm rounded-md w-4/12' type="text" value={liveQuizId}
                                onChange={e => setLiveQuizId(e.target.value)}
                            /></span>
                            </div>
  
                        </div>

                        <div className='grid grid-rows-2'>
                            <div className='flex flex-row justify-around gap-1'>
                                <span className='mx-1 text-textColor3 '>Target student:<input className='bg-bgColor4 text-textColor4 px-2 text-sm rounded-md w-4/12' type="text" value={targetStudent}
                                    onChange={e => setTargetStudent(e.target.value)}
                                /></span>
                            </div>
                            <div className='flex flext-row justify-start mt-1'>
   
                                <span className='text-textColor3'>Question number:</span>
                                <span className='mx-1'><input className='bg-bgColor4 text-textColor4 px-2 text-sm rounded-md w-4/12' type="text" value={questionNumber}
                                    onChange={e => setQuestionNumber(e.target.value)}
                                />
                                </span>
                                <button className='bg-green-700 text-white rounded-md hover:bg-green-500 p-1 px-2' id={liveQuizId} onClick={send_live_question}>Send</button>
                            </div>
                        </div>


                    </div>
                </div>
            </>
        )
}
