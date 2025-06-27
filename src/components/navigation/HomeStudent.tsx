//import { useEffect, useState} from 'react'

//import { useSocketContext } from '../../hooks/useSocketContext'
//import { useRef, useState } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { useSocketContext } from '../../hooks/useSocketContext';
//import { ModalHandle } from '../shared/ModalPopup'
//import ModalPopupSave from '../shared/ModalPopupSave'
import MainStudent from './MainStudent'
import { MyVerticalGrid } from './MyVerticalGrid';
//import { SideStudent } from './SideStudent'
//import Accordion from '../shared/Accordion';
////import ChatPage, { MessageProps } from '../chat/ChatPage';

//import groovyWalkAnimation from "../../groovywalk.json"


//const LiveAudioRecorder = lazy(() => import("../pages/LiveAudioRecorder"))

export default function HomeStudent(props: any ) {

  const {socket} = useSocketContext()

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'vertical-grid', // Unique identifier for the draggable element
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined, // Apply the drag transformation
  };
 
   return (
    <DndContext>
        <div className='flex flex-row  bg-bgColor1'>
       
          <div
             ref={setNodeRef}
             style={style}
             {...listeners}
             {...attributes}
          >
            <MyVerticalGrid />
          </div>
        
          <div className='col-span-11 flex flex-col justify-stretch bg-bgColor1 h-screen'>
              <div><MainStudent/></div>
              <div className='flex flex-row justify-end'>
              </div>
          </div>
         
        </div>
         </DndContext>
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