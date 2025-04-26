import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useSocketContext } from '../../hooks/useSocketContext';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { useAppSelector } from '../../redux/store';

export interface MessageProps {
    id: string | undefined,
    name: string | undefined,
    role:string | undefined,
    text: string | undefined,
  }

  export interface ChatPageRef {
    get_isChatOpen: () => boolean | undefined;
    set_isChatOpen: () => void | undefined;
  }

export const ChatPage = forwardRef<ChatPageRef, MessageProps>((props, ref) => {

    const [messages, setMessages] = useState<MessageProps[]>([]);
    const {socket} = useSocketContext()
    const [isChatOpen, setIsChatOpen] = useState(true);

    const user = useAppSelector(state => state.user.value)
    
    useEffect(() => {
      //console.log("in ChatPage socket id"+ socket.id)
      //socket.on('chat_message', (data) => setMessages([...messages, data]));
      socket.on('chat_message', (data) => {
        if(user.role?.includes("student")) {
          //console.log(" In ChatPage useEffect.... chat_message received user role is student user name=", user.user_name)
          if (data.role !== "teacher" && data.name !== user.user_name) {
            return
          }
        }
        setMessages((prevMessages) => {

          return [...prevMessages, data]
        }
        );
      });
      return () => {
        socket.off("chat_message");
      }   
    }, [socket, user.role]);
   
    const setChatOpen = (value:boolean) => {
      setIsChatOpen(value);
    }

    useImperativeHandle(ref, () => ({
      get_isChatOpen: () => isChatOpen,
      set_isChatOpen: () => setIsChatOpen(true)
    }));

 
    return (
      <>
     
        <div className='grid grid-cols-1'  >
        {isChatOpen && 
        (
           <>
            <ChatBody messages={messages}  />
            <ChatFooter messages={messages}  />
            </>
        )}
        <div className='flex justify-center bg-white rounded-md p-2'>
          <button  onClick={e => setChatOpen(!isChatOpen)}> {isChatOpen ? 'Close Chat' : 'Open Chat'}</button>
          </div>
        </div>
        </>
    );
  });
  
  export default ChatPage;

  //   {isChatOpen ? 'Close Chat' : 'Open Chat'}