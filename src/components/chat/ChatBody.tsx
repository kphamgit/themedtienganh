import { useRef, useEffect } from 'react';
import { MessageProps } from './ChatPage';


const ChatBody = (props: {messages: MessageProps[]}) => {

    const messagesEndRef = useRef<null | HTMLDivElement>(null); 
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ block: 'nearest', inline: 'start'  })
    }    
    
  useEffect(() => {
    scrollToBottom()
  }, [props.messages])

  // {{console.log("message in ChatBody=", message)}}
  return (
    <>
      {/*This shows messages sent from you*/}
      <div className='m-1 h-40 text-sm bg-white text-textColor2 overflow-scroll'>
      <div>
        {props.messages.map((message) => {
          
           return (<div key={message.id} className='m-1'>
                <p ref={messagesEndRef}>{message.name}: {message.text}</p>
            </div> )
          }
        )}
      </div>
      </div>
    </>
  );
};

export default ChatBody
