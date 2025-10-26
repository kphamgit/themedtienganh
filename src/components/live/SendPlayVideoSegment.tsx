import { MouseEventHandler, useContext, useState } from 'react'
import SocketContext from '../../contexts/socket_context/Context'
//import { getAClass } from './services/list'

    export function SendPlayVideoSegment(props: any) {
    
    const [liveQuizId , setLiveQuizId ] = useState<string>('')
    const [videoSegmentIndex , setVideoSegmentIndex ] = useState<string>('')
    const [targetStudent , setTargetStudent ] = useState<string>('')
    //const [targetClass , setTargetClass ] = useState<string>('')
    const {socket} = useContext(SocketContext).SocketState;

      const live_video_quiz: MouseEventHandler<HTMLButtonElement> = (event) => {  
        if (socket) {
            console.log("sending live_video_quiz ...")
            //const el = event.target as HTMLButtonElement
            //const arg = {}
            const arg = {quizId: '310'}
            socket.emit('live_video_quiz', arg)
        }
      }

      ////on('play_video_segment', (arg: { segment_number: number }) => {

    const send_play_video_segment =  () => {
        console.log("send_play_video_segment videoSegmentIndex=", videoSegmentIndex)
        const arg = {segment_index: videoSegmentIndex}
        console.log("send_play_video_segment ***** arg=", arg)
        socket?.emit('play_video_segment', arg)
        
    }

   
        return (
            <>
                <div className='grid grid-row-2 mt-0'>
                    <div className='flex flex-row gap-1 bg-bgColor2 text-textColor2'>
                        <div className='grid grid-rows-2'>
                          
                            <div className='flex flext-row justify-start mt-1'>
   
                                <span className='text-textColor3'>Video Segment Index:</span>
                                <span className='mx-1'><input className='bg-bgColor4 text-textColor4 px-2 text-sm rounded-md w-4/12' type="text" value={videoSegmentIndex}
                                    onChange={e => setVideoSegmentIndex(e.target.value)}
                                />
                                </span>
                                <button className='bg-green-700 text-white rounded-md hover:bg-green-500 p-1 px-2'  onClick={send_play_video_segment}>Send Segment Index</button>
                            </div>
                        </div>


                    </div>
                </div>
            </>
        )
}
