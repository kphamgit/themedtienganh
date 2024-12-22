import { MouseEventHandler, useContext, useState } from 'react'
import SocketContext from '../../contexts/socket_context/Context'
//import { getAClass } from './services/list'

    export function SendLiveQuestion(props: any) {
    
    //const live_quiz_id = useAppSelector(state => state.live_quiz_id.value)
    const [liveQuizId , setLiveQuizId ] = useState<string>('')
    const [questionNumber , setQuestionNumber ] = useState<string>('')
    const [targetStudent , setTargetStudent ] = useState<string>('')
    //const [targetClass , setTargetClass ] = useState<string>('')
    const {socket, user_name, users} = useContext(SocketContext).SocketState;

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

    const handleNameClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        const el = event.target as HTMLButtonElement
        setTargetStudent(el.textContent as string)
    }

    return (
        <>
            <div className='grid grid-row-2'>
                <div className='flex flex-row justify-end gap-2 mt-2'>

                    {users &&
                        users.map((student, index) => (
                            <div key={index} >
                            <button className='bg-blue-500 text-white p-1 rounded-md' onClick={handleNameClick}>{student.user_name}</button>
                            </div>
                        ))
                    }
                    <button className='bg-blue-600 text-white p-1 rounded-md' onClick={handleNameClick}>everybody</button>
                </div>
          
            <div className='flex flex-row gap-2 bg-green-50'>
                <div className='text-md flex flex-row'>
                    <span className='mx-1'>Live quiz id 1:</span>
                    <span className='mx-1 '><input className='bg-amber-400 px-2 text-sm rounded-md w-4/12' type="text" value={liveQuizId}
                        onChange={e => setLiveQuizId(e.target.value)}
                    /></span>
                </div>

                <div className='grid grid-rows-2'>
                   
                    <div className='flex flex-row justify-around gap-2 mt-2'>
                        <span className='mx-1 '>Target student:<input className='bg-amber-300 px-2 text-sm rounded-md w-4/12' type="text" value={targetStudent}
                            onChange={e => setTargetStudent(e.target.value)}
                        /></span>
                      
                    </div>
                    <div className='mt-2'>
                    <span>Question number:</span>
                       <span className='mx-1'><input className='bg-amber-300 px-2 text-sm rounded-md w-4/12' type="text" value={questionNumber}
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
