import { KeyboardEventHandler, useState } from 'react';
//import { useSelector } from 'react-redux';
import { useSocketContext } from '../../hooks/useSocketContext';
//import { Button, Textarea } from "flowbite-react";

const ChatFooter = (props: any) => {
  const [message, setMessage] = useState('');
  //const user = useSelector((state) => state.user.value)
  const {socket, user_name} = useSocketContext()

  const sendMessage = () => {
    
    if (message.trim()) {
      socket.emit('chat_message', {
        text: message,
        name: user_name,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    
    setMessage('');
  }
  
  
  const handleKeyDown:KeyboardEventHandler = (e) => {
      //console.log(e.key)
      if (e.key === "Enter") {
        sendMessage()
        setMessage('');
      }
  }
  

  return (
    <div className=' m-1 mt-0'>
  
        <textarea className='bg-bgColor1 text-textColor2'
          placeholder="Write message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
         
        <div><button className='bg-bgColorSubmitBtn text-textColorSubmitBtn p-2 rounded-md' onClick={sendMessage}>Send</button></div>
    
    </div>
  );
};

export default ChatFooter;