import { KeyboardEventHandler, useState } from 'react';
//import { useSelector } from 'react-redux';
import { useSocketContext } from '../../hooks/useSocketContext';
import { useAppSelector } from '../../redux/store';
import { v4 as uuidv4 } from "uuid";

const ChatFooter = (props: any) => {
  const [message, setMessage] = useState('');
  //const user = useSelector((state) => state.user.value)
  const {socket, user_name} = useSocketContext()

  const user = useAppSelector(state => state.user.value)

  const sendMessage = () => {
    
    if (message.trim()) {
      //console.log("in ChatFooer, sendMessage message=", message)
      socket.emit('chat_message', {
        text: message,
        name: user_name,
        role: user.role,
        //id: `${socket.id}${Math.random()}`,
        id: uuidv4(),
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
        <div className=' flex flex-row justify-center gap-2 mb-3'>
        <button className='bg-bgColorSubmitBtn text-textColorSubmitBtn p-2 rounded-md' onClick={sendMessage}>Send</button>
        </div>
    </div>
  );
};

export default ChatFooter;