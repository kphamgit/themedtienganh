import { useRef, useEffect } from 'react';

interface MessageProps {
    id: string,
    name: string,
    text: string
  }

const ChatBody = (props: {messages: MessageProps[]}) => {

    const messagesEndRef = useRef<null | HTMLDivElement>(null); 
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ block: 'nearest', inline: 'start'  })
    }    
    
  useEffect(() => {
    scrollToBottom()
  }, [props.messages])

  return (
    <>
      {/*This shows messages sent from you*/}
      <div className='m-1 h-40 text-sm bg-bgColor2 text-textColor2 overflow-scroll'>
      <div>
        {props.messages.map((message) =>
            <div key={message.id}>
                <p ref={messagesEndRef}>{message.name}: {message.text}</p>
            </div>
        )}
      </div>
      </div>
    </>
  );
};

export default ChatBody
