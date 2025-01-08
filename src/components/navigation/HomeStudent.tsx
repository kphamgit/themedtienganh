import { useEffect, useState} from 'react'

import { useSocketContext } from '../../hooks/useSocketContext'
import MainStudent from './MainStudent'
import { SideStudent } from './SideStudent'
//import Lottie from "lottie-react";
//import groovyWalkAnimation from "../../myanima.json";
//import groovyWalkAnimation from "../../groovywalk.json"


//const LiveAudioRecorder = lazy(() => import("../pages/LiveAudioRecorder"))

export default function HomeStudent(props: any ) {

  
  return (
        <div className='grid grid-cols-12 m-14 bg-bgColor1'>
            <div className='col-span-10'><MainStudent/></div>
            <div className='col-span-2'><SideStudent  /></div>
         
        </div>
  )
}

/*

  <Lottie animationData={groovyWalkAnimation} loop={true} />//
     <div className='m-14'>
          { showLiveRecording ?
          <LiveAudioRecorder />
          : 
          null
          }
        </div>



     <div className='bg-amber-300 col-span-3'>
            <div className='grid grid-rows-2'>
            <div className='h-20'><LiveAudioRecorder /></div>
            
            </div>
        </div>
   <div className='m-3 text-gray-400 bg-slate-200' >
            <ScoreBoard2 />
          </div>
         
*/