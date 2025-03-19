//import { useEffect, useState} from 'react'

//import { useSocketContext } from '../../hooks/useSocketContext'
import MainStudent from './MainStudent'
import { SideStudent } from './SideStudent'

//import groovyWalkAnimation from "../../groovywalk.json"


//const LiveAudioRecorder = lazy(() => import("../pages/LiveAudioRecorder"))

export default function HomeStudent(props: any ) {

   return (
          <div className='grid grid-cols-12 m-2 bg-bgColor1'>
              <div className='col-span-9'><MainStudent/></div>
              <div className='col-span-3'>
              <div className='flex flex-col justify-between'>
                <div className=' bg-bgColor3 text-textColor1'><SideStudent /></div>
                </div>
              </div>
          </div>
      )
  
 
}


/*
 return (
        <div className='m-20 bg-bgColor1'>
        
            <div><MainStudent /></div>
           
        </div>
  )
*/