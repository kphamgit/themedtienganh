import React, { MouseEventHandler, useContext, useEffect, useState } from 'react'
import SocketContext from '../../contexts/socket_context/Context';

export default function SendLiveText(props: any) {
    
    //const live_quiz_id = useAppSelector(state => state.live_quiz_id.value)
    
    const [liveText , setLiveText ] = useState<string>('')
    const [targetStudent , setTargetStudent ] = useState<string>('everybody')
    //const [classstudents, setClassstudents] = useState<string[] | undefined>()
    const {socket, user_name, users} = useContext(SocketContext).SocketState;
    const [selectedBackChainingValue, setSelectedBackChainingValue] = useState('');

    //const send_live_text: MouseEventHandler<HTMLButtonElement> = (event) => {

        const send_live_text = () => {
        if (liveText.length === 0) {
            console.log("Enter text")
            return 
        }
    
        else {
        //const el = event.target as HTMLButtonElement
        //console.log(el)
        //console.log("XXX id=", el.id)
        let backChaining = false
        if (selectedBackChainingValue === 'yes')
            backChaining = true
        //else
            //backChaining = false

        const arg = {backchaining: backChaining, text_complete: false, live_text: `${liveText}`, target_student: targetStudent}
        //console.log("SENNNN arg=", arg)
        socket?.emit('live_text', arg)
        }
    }

    const send_text_complete = () => {
        if (liveText.length === 0) {
            console.log("Enter quiz id")
            return 
        }
        else {
        //const el = event.target as HTMLButtonElement
        //console.log(el)
        //console.log("XXX id=", el.id)
        let backChaining = false
        if (selectedBackChainingValue === 'yes')
            backChaining = true
        //else
            //backChaining = false

        const arg = {backchaining: backChaining, text_complete: true,  live_text: `${liveText}`, target_student: targetStudent}
        //console.log("SENNNN arg=", arg)
        socket?.emit('live_text', arg)
        }
    }

    //useEffect(() => {
    //    setClassstudents(props.students)
   // },[props.students])

    const handleNameClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        const el = event.target as HTMLButtonElement
        setTargetStudent(el.textContent as string)
    }

    const handleRadioSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedBackChainingValue(event.target.value);
        
      };

    const clearLiveTextInput = () => {
        setLiveText(' ')
    }

    const clearLiveText = () => {
        setLiveText(' ')
        send_live_text()
    }
   
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // Access the key code using event.key 
        if (event.key === 'Enter') {
          console.log('Enter key pressed!', liveText);
          send_live_text()
        }
      };

    return (
        <>
          <div className='m-10'>
      
       </div>
            <div className='grid grid-row-2'>
                <div className='flex flex-row justify-end gap-2 mt-2'>
                <button className='bg-blue-600 text-white p-1 rounded-md' onClick={handleNameClick}>everybody</button>
                    {users &&
                        users.map((student, index) => (
                            <button key={index} className='bg-blue-500 text-white p-1 rounded-md' onClick={handleNameClick}>{student.user_name}</button>
                        ))
                    }
                   
                </div>
          
            <div className='flex flex-row gap-2'>
                <div className='grid grid-row-2'>
                <div className='text-md flex flex-row'>
                    <span className='mx-1 text-textColor1'>Live Text:</span>
                    <span className='mx-1 '><input className='bg-bgColor2 px-2 text-textColor2 text-sm rounded-md ' type="text" size={60} value={liveText}
                        onChange={e => setLiveText(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)}
                    /></span>
                     <span><button className='bg-bgColor2 text-white rounded-md hover:bg-green-600 p-1 px-2' onClick={send_live_text}>Send</button></span>
                     <span><button className='bg-bgColor2 text-white rounded-md hover:bg-amber-600 p-1 px-2' onClick={send_text_complete}>Send Complete</button></span>
                </div>
                <div className='flex flex-row gap-2'>
               
                    <span className='text-textColor1'>Back Chaining:</span>
                    <label className='text-textColor1'>Yes</label>
                    <input className="m-2 bg-bgColor2"
                        type="radio"
                        value="yes"
                        checked={selectedBackChainingValue === "yes"}
                        onChange={handleRadioSelect}
                    />
                     <label className='text-textColor1'>No</label>
                        <input className="m-2 bg-bgColor2"
                        type="radio"
                        value="no"
                        checked={selectedBackChainingValue === "no"}
                        onChange={handleRadioSelect}
                    />
                     <div><button className='bg-blue-300 rounded-md p-1 mx-4' onClick={clearLiveTextInput}>Clear</button></div>
                     <div><button className='bg-blue-300 rounded-md p-1 mx-4' onClick={clearLiveText}>Clear Live Text</button></div>
                </div>
               
                </div>
                <div className='grid grid-rows-2'>
                   
                    <div className='flex flex-row justify-around gap-2 mt-2'>
             
                        <span className='mx-1 '>Target student:<input className='bg-amber-300 px-2 text-sm rounded-md w-4/12' type="text" value={targetStudent}
                            onChange={e => setTargetStudent(e.target.value)}
                        /></span>
                      
                    </div>
                 
                </div>
               
            </div>
            
            </div>
           
        </>
    )
}

/*
 <div>
                    <span>Back Chaining:</span>
                    <label>Yes</label>
                    <input className="m-2"
                        type="radio"
                        value="yes"
                        checked={selectedBackChainingValue === "yes"}
                        onChange={handleRadioSelect}
                    />
                     <label>No</label>
                        <input className="m-2"
                        type="radio"
                        value="no"
                        checked={selectedBackChainingValue === "no"}
                        onChange={handleRadioSelect}
                    />
                    </div>
*/