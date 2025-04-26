//import { useEffect, useState} from 'react'

//import { useSocketContext } from '../../hooks/useSocketContext'
import { useEffect, useRef, useState } from 'react';
import { useSocketContext } from '../../hooks/useSocketContext';
import ModalPopup, { ModalHandle } from '../shared/ModalPopup'
//import ModalPopupSave from '../shared/ModalPopupSave'
import MainStudent from './MainStudent'
import { SideStudent } from './SideStudent'
import Accordion from '../shared/Accordion';
import ChatPage, { MessageProps } from '../chat/ChatPage';

//import groovyWalkAnimation from "../../groovywalk.json"


//const LiveAudioRecorder = lazy(() => import("../pages/LiveAudioRecorder"))

export default function HomeStudent(props: any ) {

  const {socket} = useSocketContext()
const [message, setMessage] = useState<MessageProps>({id: "1", name: "test", role: "teacher", text: "test from test"});
  

  //const {chatMessage, setChatMessage} = 

  const modalPopupRef = useRef<ModalHandle>(null);

 
/*
{
    "text": "e33333",
    "name": "kpham",
    "role": "teacher",
    "id": "mPSn7wWM0Ljpnv96AAA90.9291986040657213",
    "socketID": "mPSn7wWM0Ljpnv96AAA9"
}
        */
   return (
          <div className='flex flex-col justify-stretch  m-2 bg-bgColor1 h-screen'>
           
              <div className='col-span-9'><MainStudent/></div>
              <div className='flex flex-row justify-end'>
            
             
              
              </div>
     
          </div>
      )
  
 
}

/*

    <Accordion title='Open Chat'>

                <ChatPage message ={message} />
                </Accordion>
return (
          <div className='flex flex-col justify-stretch  m-2 bg-red-400 h-screen'>
           
              <div className='col-span-9'><MainStudent/></div>
              <div className='flex flex-row justify-end'>
                <ModalPopup ref = {modalPopupRef} />
              </div>
     
          </div>
      )
*/


/*
 return (
        <div className='m-20 bg-bgColor1'>
        
            <div><MainStudent /></div>
           
        </div>
  )
*/