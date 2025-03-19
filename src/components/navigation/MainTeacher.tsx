import { useEffect, useContext} from 'react'

import { useAppSelector } from '../../redux/store'
import { Outlet, useNavigate } from 'react-router-dom'

import Navbar from './NavBar'

import { ThemeContext } from '../../contexts/theme_context/ThemeContext';
import { ThemeContextInterface } from '../../types';

import { MdDarkMode } from 'react-icons/md'

export default function MainTeacher(props: any ) {
    const user = useAppSelector(state => state.user.value)
    const { toggleTheme } = useContext(ThemeContext) as ThemeContextInterface;

    const navigate = useNavigate();

    useEffect(() => {
      navigate('/homepage/teacher');
    }, []);

return (
    <div>

      <div className=' bg-bgColor1'>
        <div>
          <div className='text-xl p-2 flex flex-row justify-start gap-2'>
            <div><span className='text-textColor1'>Welcome </span> 
            <span className='text-textColor4'>{user.user_name}</span>
            <span className='text-textColor1'> to Tieng Anh Tuy Hoa</span></div>
            <div>
              <button
                onClick={toggleTheme}
                className="rounded-none bg-bgColor1 p-1 text-center text-2xl uppercase tracking-[3px] text-textColor2 transition-all duration-300 ease-in-out hover:rounded-lg"
              >
                <MdDarkMode />
              </button>
            </div>
          </div>
          <Navbar role="teacher" />
          <Outlet  />
         
        </div>
    
      </div>
      <div>
        
      </div>
   
    </div>
  )

/*
  return (
    <div className='m-14 bg-bgColor1'>
    <Navbar />
      <div className='mx-1 '>Class Id:<input className='px-2 text-sm rounded-md w-4/12' type="text" value={targetClass}
        onChange={e => setTargetClass(e.target.value)}

      /></div>
      <RecordViewTeacher student_names={classstudents} />

      <div className='mx-10 grid grid-rows-2'>
        <div className='m-2 text-textColor2 bg-bgColor2'>Youtube URL:</div>
        <input className='px-2 text-sm rounded-md mb-2' type="text" size={60} value={liveYouTubeUrl}
          onChange={e => setLiveYouTubeUrl(e.target.value)}
        />
        <span><button className=' text-textColor2 bg-bgColor2 rounded-md hover:bg-red-300 p-1 px-2' onClick={send_live_youtube_video}>Send</button></span>
      </div>
      <div className='mx-14'>
        <SendLiveText />
      </div>
      <div className='mx-14'>
        <SendLiveQuestion />
      </div>

      <div>
        <SendLivePicture user_name={user.user_name} />
      </div>
      <div><button className='p-1 text-textColor1' onClick={send_enable_simple_peer}>Enable Simple Peer</button></div>
      <div>
        <div className='text-textColor1'>Target student:</div>
        <div className='mx-1 '><input className='px-2 text-sm rounded-md w-4/12' type="text" value={targetStudent}
          onChange={e => setTargetStudent(e.target.value)}
        /></div>

      </div>
      <div className='mx-14'>
        <button className='p-1 rounded-md text-textColor1 m-4' onClick={enableGame}>Enable Game</button>
        <span className='mx-1 '><input className='px-2 text-sm rounded-md w-4/12' type="text" value={gameId}
          onChange={e => setGameId(e.target.value)}
        /></span>
      </div>

      <div className='mx-14'>
        <button className='p-1 rounded-md text-textColor1 m-4' onClick={enable_live_quiz}>Enable Live Quiz</button>
      </div>
      <div className='mx-14'>
        <button className='p-1 rounded-md text-textColor1 m-4' onClick={toggleLiveRecording}>Toggle Live Recording</button>
      </div>

      < ReactTextareaAutosize className='w-auto m-14 px-3' id="prompt" value={user.message} />

      <div className='bg-bgColor2 text-textColor2'>Socket id: {socket.id}</div>

    </div>
  )
    */

}
