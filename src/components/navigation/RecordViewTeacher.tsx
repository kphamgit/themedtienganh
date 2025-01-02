import React, { MouseEventHandler, useContext, useEffect, useRef, useState } from 'react'
import SocketContext from '../../contexts/socket_context/Context';

interface Props {
    student_names: string[] | undefined;
  }
 
interface MProps {
    url: string
    index: number
    uname: string
}

    const AudioControl: React.FC<MProps> = ({ url, index, uname }) => {  
        const [mySrc, setMySrc] = useState<string>('')
        const [userName, setUserName] = useState<string>('')
        const [newAudioReceived, setNewAudioReceived] = useState<boolean>()
        const myRef = useRef<HTMLAudioElement>(null)
  
   const {socket} = useContext(SocketContext).SocketState;

   useEffect(() => {
        setUserName(uname)
   },[uname])

    useEffect(() => {
        if (socket) {
            socket.on('s3_received_recording', (arg: { username: string, path: string }) => {
              
                if (arg.username.trim() === userName.trim()) {
                  
                    setNewAudioReceived(true)
                    setMySrc(arg.path)
                }
            })
            return () => {
                socket?.off("s3_received_recording")
            }
        }
    }, [socket, userName])

    const loadSrc = () => {
            if (myRef.current) {
                console.log(myRef.current)
                console.log("nnn", myRef.current.src)
                //if (myRef.current.src && myRef.current.src.length > 0) {
                    myRef.current.load()
                    myRef.current.play()
                    .then (() => setNewAudioReceived(false)

                    )
                    .catch(error => {
                        console.error('Error playing audio:', error);
                        alert(" no audio src available!")
                        // Handle the error, such as displaying a message to the user
                      });
                //}
            }
        }

    return (
        <div className='flex flex-row gap-2'>
            <div>{userName}</div>
              
                { newAudioReceived && 
                  <div>
                    <div><button className='bg-amber-400 rounded-md p-1' onClick={loadSrc}>Play</button></div>
                    </div>
                }
            <audio id={userName} controls
                src={mySrc} ref={myRef}
            />
        </div>
    )
}

export const RecordViewTeacher: React.FC<Props> = ({ student_names }) => {
    const [students, setStudents] = useState<string[] | undefined>([])
    const liveScoreRefs = useRef<HTMLInputElement[]>([]);
    //const childRefs = useRef<AudioControlRef[]>([]);
    const {socket} = useContext(SocketContext).SocketState;
    const send_live_score: MouseEventHandler<HTMLButtonElement> = (event) => {
        const el = event.target as HTMLButtonElement
       
        const name = el.id.split('_')[0]
        const index = el.id.split('_')[1]
        //console.log("UUUUU", index)
        console.log(liveScoreRefs.current[parseInt(index)].value)
        //const arg = { target_student: name, score: liveScoreRefs.current[parseInt(index)].value}

        const arg:any = { user_name: name, score: liveScoreRefs.current[parseInt(index)].value}
           //alert("emiet emable live picture")
       socket?.emit('live_score_new', arg)
      }

      useEffect(() => {
        setStudents(student_names)
      },[student_names])

    return (
        <>
         
            {students && students.map((name, index) => (
                <div key={index} className='flex flex-row gap-2'>
                    <div>
                    <AudioControl url='' index={index} uname={name}
                    />
                    </div>
                    <div className='p-2'>
                        <input className='bg-blue-200' type="text" size={10}
                            ref={(element) => {
                                if (element) {
                                    liveScoreRefs.current[index] = element;
                                }
                            }}
                        />
                        <button className='bg-amber-500 rounded-md p-2 mx-2' id={`${name}_${index}`} onClick={send_live_score}>Send Live Score</button>
                    </div>
                </div>
            ))}
        </>
    );
}
