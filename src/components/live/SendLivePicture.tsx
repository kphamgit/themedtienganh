import React, { useContext, useEffect, useState } from 'react'
import SocketContext from '../../contexts/socket_context/Context'
////import { getAClass } from './services/list'
//import { text } from 'stream/consumers'

    type StudentProps = 
    {
            id: number,
            user_name: string
            full_name: string
            role: string
            level: string
            classId: number
            message: string
            password: string
        
    }

export function SendLivePicture(props: any) {

    
    const [liveUrl , setLiveUrl] = useState<string>('')
    const [width, setWidth] = useState<string>('100')
    const [height, setHeight] = useState<string>('100')
    const [audioDescription, setAudioDescription] = useState<string>('')
    const [personal, setPersonal] = useState<string>('')
    const [text, setText] = useState<string>('')
    //const [targetStudent , setTargetStudent ] = useState<string>('everybody')
    //const [targetClass , setTargetClass ] = useState<string>('')
    const {socket, user_name, users} = useContext(SocketContext).SocketState;
    //const [userName, setUserName] = useState<string | undefined>('')
   // const [selectedBackChainingValue, setSelectedBackChainingValue] = useState('');

    //const send_live_text: MouseEventHandler<HTMLButtonElement> = (event) => {

    //https://kevinphambucket.s3.us-east-1.amazonaws.com/images/students/nhatminh1/me.jpeg
    //`https://kevinphambucket.s3.us-east-1.amazonaws.com/images/students/${user_name}/${img_name}.jpeg`

    //useEffect(() => {
     //   setUserName(props.user_name)
    //},[props.user_name])

    const send_live_picture= () => {
        //console.log(" in send_live_picture ,,,,,,,,,,,")
        if (liveUrl.length === 0 &&  personal.length === 0) {
           
                alert("Enter picture URL or personal ...")
                return 
            
        }
        else if (liveUrl.length > 0 &&  personal.length > 0) {
            alert("you can only either a general picture or a personal picture")
        }       
        else {
            //const el = event.target as HTMLButtonElement
            //console.log(el)
            if (personal.length > 0) {
                //const url = `https://kevinphambucket.s3.us-east-1.amazonaws.com/images/students/${userName}/${personal}.jpeg`
                const url = `https://kevinphambucket.s3.us-east-1.amazonaws.com/images/students`
                //console.log("ZZZZZ PERSONAL::::", url)
                const arg = { picture_url: `${url}`, type: 'personal', description: `${personal}`, audio_description: audioDescription, width: parseInt(width), height: parseInt(height), target_student: 'everybody', target_class: '3' }
                //console.log("SENNNN arg=", arg)
                socket?.emit('live_picture', arg)
            }
            else {
                const arg = { picture_url: `${liveUrl}`, type: 'general',description: `${text}`, audio_description: audioDescription, width: parseInt(width), height: parseInt(height), target_student: 'everybody', target_class: '3' }
                //console.log("SENNNN arg=", arg)
                socket?.emit('live_picture', arg)
            }
           
        }
    }

    //const clearLiveText = () => {
      //  setLiveText(' ')
      //  send_live_text()
   // }
   
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // Access the key code using event.key 
        if (event.key === 'Enter') {
          console.log('Enter key pressed!', liveUrl);
          send_live_picture()
        }
      };

    return (
        <>
            <div className='mx-14 my-6 grid grid-row-2 bg-bgColor3 text-textColor3'>
                    <div className='grid grid-row-2'>
                        <div className='grid grid-rows-2'>
                            <div className='mx-2 font-bold'>Image URL:</div>
                            <input className='bg-bgColor4 text-textColor4 px-2 text-sm rounded-md ' type="text" size={60} value={liveUrl}
                                    onChange={e => setLiveUrl(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                />
                            <div>
                            <span className='mx-1 '>
                            
                                <label>Width:</label>
                                <input className='bg-bgColor4 text-textColor4 px-2 text-sm rounded-md ' type="text" size={5} value={width}
                                    onChange={e => setWidth(e.target.value)}
                                />
                                <label>Height:</label>
                                <input className='bg-bgColor4 text-textColor4 px-2 text-sm rounded-md ' type="text" size={5} value={height}
                                    onChange={e => setHeight(e.target.value)}
                                />
                                <label>Audio description:</label>
                                <input className='bg-bgColor4 text-textColor4 px-2 text-sm rounded-md ' type="text" size={10} value={audioDescription}
                                    onChange={e => setAudioDescription(e.target.value)}
                                />
                                <label>Personal:</label>
                                <input className='bg-bgColor4 text-textColor4 px-2 text-sm rounded-md ' type="text" size={10} value={personal}
                                    onChange={e => setPersonal(e.target.value)}
                                />
                                <label>Text:</label>
                                <input className='bg-bgColor4 text-textColor4 px-2 text-sm w-1/3 rounded-md ' type="text" size={10} value={text}
                                    onChange={e => setText(e.target.value)}
                                />
                            </span>
                            <span><button className='bg-green-700 text-white rounded-md hover:bg-green-600 p-1 px-2' onClick={send_live_picture}>Send</button></span>
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