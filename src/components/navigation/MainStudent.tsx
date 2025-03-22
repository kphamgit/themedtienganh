import { useEffect, lazy, useState, useContext} from 'react'

import { useAppSelector } from '../../redux/store'
import { Outlet, useNavigate } from 'react-router-dom'

import { useSocketContext } from '../../hooks/useSocketContext'
import NavBar from './NavBar'
import { ThemeContext } from '../../contexts/theme_context/ThemeContext';
import { ThemeContextInterface } from '../../types';
import { MdDarkMode } from 'react-icons/md';
//import AzureTranscription from '../shared/AzureTranscription'
//import { SRContinuous } from '../quiz_attempts/question_attempts/SRContinuous'
//import WatsonSpeechRecognition from '../shared/WatsonSpeechRecognition'


//import IBMSTT from '../shared/WatsonSpeechRecognition'

interface ChildRef {
  getAnswer: () => string | undefined;
}



//const LiveAudioRecorder = lazy(() => import("../pages/LiveAudioRecorder"))

export default function MainStudent(props: any ) {
    const user = useAppSelector(state => state.user.value)
    const [showLiveRecording, setShowLiveRecording] = useState(false)
    const { toggleTheme } = useContext(ThemeContext) as ThemeContextInterface;

    //const [localLiveQuizId, setLocalLiveQuizId] = useState<string>('')
    // this is not needed but keep it for Typescript learning
      /*  Initialize localLiveQuizId with an empty string to avoid this error:
        A component is changing an uncontrolled input to be controlled. This is likely caused...

         <select className='cloze_answer'>
          { (classIds as string[]).map( (classId, index) => {
               return <option key={index} id={index.toString()} >{classID} </option>
          })
          }
        </select>
    */

    //const {socket, user_name, users} = useContext(SocketContext).SocketState;
    const {socket, user_name, users} = useSocketContext()

    const navigate = useNavigate();


    useEffect(() => {
      navigate('/homepage/student');
    }, []);

    useEffect(() => {
      socket.on('live_quiz', (arg: any) => {
        //console.log("enable_live_quiz received...arg=", arg)
        navigate("/live_quiz", {state: arg})  
      })
      return () => {
        socket?.off("live_quiz")
      }
    }, [socket, navigate])
    
  useEffect(() => {   
      socket.on('live_text', (arg: { backchaining: boolean, text_complete: boolean, live_text: string, target_student: string, target_class: string }) => {
        if (arg.target_student.trim() === 'everybody') {
          navigate("/live_text", { state: arg })
        }

      })
      return () => {
        socket?.off("live_text")
      }
  }, [socket, navigate])
    
      ///live_audio_recorder/live_picture
      useEffect(() => {
          socket.on('live_youtube_video', (arg: { target_student: string, video_url: string, video_duration: number }) => {
            //if (arg.target_student.trim() === 'everybody') {
              navigate("/live_youtube_video", { state: {video_url: arg.video_url, video_duration: arg.video_duration} })
            //}
    
          })
          return () => {
            socket?.off("live_youtube_video")
          }
      }, [socket, navigate, user.user_name])
        

  useEffect(() => {
      socket.on('enable_game', (arg: { game_id: string, backcolor: string }) => {
        navigate(`/live_game/${arg.game_id}/${arg.backcolor}`)
      })
      return () => {
        socket?.off("enable_game")
      }
  }, [socket, navigate, user.user_name, user.role])

  useEffect(() => {
    socket.on('toggle_live_recording', (arg: {}) => {
      console.log(" receive toggle live recording")
      // setShowLiveRecording(!showLiveRecording)
       //setShowLiveRecording(prevShowLiveRecording => !prevShowLiveRecording);
       setShowLiveRecording(!showLiveRecording);
    })
    return () => {
      socket?.off("toggle_live_recording")
    }
}, [socket, showLiveRecording ])

  const pollyFunc = (selected_text: string) => {
      console.log("in polly function")
  }

  /*
    <Route path="/logout" element={<Logout onLogout={onLogout} />} />
                 <Route path="/" element={<Home />}>
                   
                   <Route path="sub_categories_student/:sub_categoryId" element={<SubCategoryPageStudent />} />
                   <Route path="sub_categories/:sub_category_name/quizzes/:quizId" element={<QuizPageVideo />} />
                   
                   <Route path="/front_page" element={<FrontPage />} />
                   <Route path="/live_text" element={<LiveText />} />
                   <Route path="/live_picture" element={<LivePicture />} />
                   <Route path="/simple_peer" element={<SimplePeer />} />
                   <Route path="/live_quiz" element={<LiveQuiz />} />
                   <Route path="/live_game/:game_id/:backcolor" element={<MemoryGame />} />
                   <Route path="/live_youtube_video" element={<YoutubeVideoPlayer />} />
                 </Route>
               </Routes>
  */

  return (
    <div>

      <div className=' bg-bgColor1'>
        <div>
          
          <div className='text-xl p-2 flex flex-row justify-start gap-2'>
            <div><span className='text-textColor1'>Welcome </span> 
            <span className='text-textColor4'>{user_name}</span>
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
          <NavBar role="student" />
       
          <Outlet  />
         
        </div>
    
      </div>
      <div>
        
      </div>
   
    </div>
  )
}

/*
    // TextToSpeech.tsx
    import React, { useState } from 'react';

    const TextToSpeech: React.FC = () => {
        const [text, setText] = useState('');
        const [audioUrl, setAudioUrl] = useState<string | null>(null);

        const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setText(e.target.value);
        };

        const handleSpeak = async () => {
            try {
                const response = await fetch('http://localhost:3001/synthesize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text }),
                });

                if (response.ok) {
                    const audioBlob = await response.blob();
                    const url = URL.createObjectURL(audioBlob);
                    setAudioUrl(url);
                } else {
                    console.error('Error synthesizing speech:', response.statusText);
                }
            } catch (error) {
                console.error('Error synthesizing speech:', error);
            }
        };

        return (
            <div>
                <textarea value={text} onChange={handleTextChange} />
                <button onClick={handleSpeak}>Speak</button>
                {audioUrl && <audio src={audioUrl} controls />}
            </div>
        );
    };

    export default TextToSpeech;
*/

/*
    // server.ts
    import express from 'express';
    import { TextToSpeechClient } from '@google-cloud/text-to-speech';
    import fs from 'fs';

    const app = express();
    app.use(express.json());

    const client = new TextToSpeechClient({
        keyFilename: 'path/to/your/serviceAccountKey.json', // Replace with your key file path
    });

    app.post('/synthesize', async (req, res) => {
        const { text } = req.body;

        const request = {
            input: { text: text },
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        try {
            const [response] = await client.synthesizeSpeech(request);
            const audioContent = response.audioContent;
            if (audioContent) {
                res.send(audioContent);
            }
        } catch (error) {
            console.error('Error synthesizing speech:', error);
            res.status(500).send('Error synthesizing speech');
        }
    });

    const port = 3001;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

*/