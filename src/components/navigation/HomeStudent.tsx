//import { useEffect, useState} from 'react'

//import { useSocketContext } from '../../hooks/useSocketContext'
import MainStudent from './MainStudent'
import { SideStudent } from './SideStudent'

//import groovyWalkAnimation from "../../groovywalk.json"


//const LiveAudioRecorder = lazy(() => import("../pages/LiveAudioRecorder"))

export default function HomeStudent(props: any ) {

  
  return (
        <div className='m-20 bg-bgColor1'>
        
            <div><MainStudent /></div>
           
        </div>
  )
}

/*
 return (
        <div className='grid grid-cols-12 m-14 bg-bgColor1'>
            <div className='col-span-10'><MainStudent/></div>
            <div className='col-span-2'><SideStudent  /></div>
         
        </div>
  )
*/
