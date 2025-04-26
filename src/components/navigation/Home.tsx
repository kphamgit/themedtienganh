import { useAppSelector, useAppDispatch} from '../../redux/store'
import HomeTeacher  from './HomeTeacher'
import  HomeStudent  from './HomeStudent'
import { useEffect, useRef, useState } from 'react';
import ChatPage, { MessageProps } from '../chat/ChatPage';
import { useSocketContext } from '../../hooks/useSocketContext';
import { ChatPageRef } from '../chat/ChatPage';


export default function Home() {
    const user = useAppSelector(state => state.user.value)
  const {socket} = useSocketContext()

  const chatPageRef = useRef<ChatPageRef>(null);
    //const [message, setMessage] = useState<MessageProps>({id: "1", name: "test", role: "teacher", text: "test from test"});
    //const {socket, user_name, users} = useSocketContext()
    const [message, setMessage] = useState<MessageProps>();
   
   // const [isChatOpen, setIsChatOpen] = useState(true);
  
    useEffect(() => {
      //console.log("in ChatPage socket id"+ socket.id)
      //socket.on('chat_message', (data) => setMessages([...messages, data]));
      socket.on('chat_message', (data) => {
        console.log("xxxx is Chat Open=", chatPageRef.current?.get_isChatOpen())
     
        if (user.role === "teacher") {
          return
        }
          
        if (data.role === "teacher" ) {
          // console.log(" receive message from teacher or student/adminh")
           // if ChatPage is not open, the open it
       
           if (chatPageRef.current?.get_isChatOpen() === false) {
            chatPageRef.current.set_isChatOpen()
          }
          
        }
        else {
          return
        }
      });
      return () => {
        socket.off("chat_message")
      }   
    }, [socket, user.role]);

  

  return (
  
    <>
      {user.role === 'teacher' ?
        <HomeTeacher />
        : (
        <HomeStudent />
        )
      }
     
      <div className="fixed bottom-20 right-5 ">
        <div className="bg-amber-400 rounded-md p-0">
            <ChatPage id={message?.id} name={message?.name} role={message?.role} text={message?.text} ref={chatPageRef} />
        </div>
      </div>
      <div className="fixed bottom-10 right-5 ">
     
   
      </div>
     </>
   
  )
}


