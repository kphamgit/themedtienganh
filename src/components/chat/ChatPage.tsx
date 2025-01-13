import { useEffect, useState } from 'react';
import { useSocketContext } from '../../hooks/useSocketContext';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

interface MessageProps {
    id: string,
    name: string,
    text: string
  }

const ChatPage = (props: any) => {

    //const socket = useContext(SocketContext);
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const {socket} = useSocketContext()

    useEffect(() => {
      //console.log("in ChatPage socket id"+ socket.id)
      socket.on('chat_message', (data) => setMessages([...messages, data]));
      return () => {
        socket.off("chat")
      }   
    }, [socket, messages]);
   
    return (
      <>
        <div className='grid grid-cols-1'  >
            <ChatBody messages={messages}  />
            <ChatFooter messages={messages}  />
           
        </div>
        </>
    );
  };
  
  export default ChatPage;