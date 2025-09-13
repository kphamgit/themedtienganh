import { MouseEventHandler, useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { ChildRef, QuestionAttemptAttributes, QuestionProps } from './types';
import { DynamicWordInputs } from './question_attempts/DynamicWordInputs';
import { ButtonSelectCloze } from './question_attempts/ButtonSelecCloze';
import { ButtonSelect } from './question_attempts/ButtonSelect';
import { RadioQuestion } from './question_attempts/RadioQuestion';
import { SRContinuous } from './question_attempts/SRContinuous';
import { WordsSelect } from './question_attempts/WordsSelect';
import { DropDowns } from './question_attempts/DropDowns';
import { DynamicLetterInputs } from './question_attempts/DynamicLetterInputs';
import { AzureAudioPlayer } from '../shared/AzureAudioPlayer';

import ReactPlayer from 'react-player';

import { Counter, CounterRef } from '../shared/Counter';

import { ModalHandle } from '../shared/ModalPopup';

import ModalPopup from '../shared/ModalPopup';

import DragDrop from './question_attempts/dragdrop/DragDrop';

import { useQuizAttempt } from '../../hooks/useQuizAttempt';
import { useQuestionAttempt } from '../../hooks/useQuestionAttempt';


import { processQuestion } from '../live/processQuestion';
import { useMutation } from '@tanstack/react-query';
import { updateQuestionAttempt } from '../api/updateQuestionAttempt';
import { QuestionAttemptResults } from './QuestionAttemptResults';
import axios from 'axios';
import { CheckboxQuestion } from './question_attempts/CheckboxQuestion';

interface PageParamsProps {
    page_num: number
    numQuestions: number;
    startTime?: number;
    endTime?: number;
  }

interface VideoProps {
    video_url: string,
    video_pages: PageParamsProps[]
  }

export default function QuizPageVideoSave(props:any) {
    
    const modalRef = useRef<ModalHandle>(null);

    const params = useParams<{ sub_category_name: string, quizId: string,  }>();
    //const user = useAppSelector(state => state.user.value)
    const user = useAppSelector(state => state.user.value)
    //console.log("QuizPageVideo wwwww user = ", user)

    //google text to speech test
    const [audioSrc, setAudioSrc] = useState<string | null>(null);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
    const videoParams:VideoProps = useLocation().state
   
    

    const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false)

    const [question, setQuestion] = useState<QuestionProps | undefined>()
    const [questionAttemptId, setQuestionAttemptId] = useState<string | undefined>()

    const [showQuestion, setShowQuestion] = useState(false)
  
    const [showNextButton, setShowNextButton] = useState(false)
    const [questionAttemptResponse, setQuestionAttemptResponse] = useState< QuestionAttemptAttributes>()
    const [endOfQuiz, setEndOfQuiz] = useState(false)
    const childRef = useRef<ChildRef>(null);

    const [submitDisabled, setSubmitDisabled] = useState(false)

    //const buttonSelectClozeChildRef  = useRef<ButtonSelectClozeChildRef>(null);

    const counterRef = useRef<CounterRef>(null)

    // video play state. This state is needed to control the play/pause of the video
    const [playing, setPlaying] = useState(false);
    // video player ref, needed to do seeking to specific time
    const playerRef = useRef<ReactPlayer>(null);

   // const videoParams:VideoProps = location.state

   const [nextQuestionEnabled, setNextQuestionEnabled] = useState(false)
  
   const { data } = useQuizAttempt(params.quizId!, user?.id?.toString() ?? "", true)

   const rootpath = useAppSelector(state => state.rootpath.value)

   const videoUrl = "https://www.youtube.com/watch?v=iltIAal8Djg"
   let videoDuration = useRef<number>(10000); // in miliseconds

   const startTime = 15;
  const endTime = 55;

   useEffect(() => {
        if (data) {
            console.log("QuizPageVideo questioin  = ", data.question)
            setQuestion(data.question)
            setShowSubmitButton(true)
            setQuestionAttemptId(String(data.question_attempt_id))
            setEndOfQuiz(false)
            setShowQuestion(true)
            
        }
      
    }, [data])

    // on component mount, nextQuestionEnabled is set to false, so this hook will not run
    // it only runs after the user submits the first answer and sets nextQuestionEnabled to true
   const { data: questionAttemptData } = useQuestionAttempt(data?.quiz_attempt.id.toString()!, nextQuestionEnabled)

   useEffect(() => {
        if (questionAttemptData) {
            //console.log("QuizPageVideo questionAttemptData = ", questionAttemptData)
            if (questionAttemptData.end_of_quiz) {
                console.log(" END OF QUIX")
                setEndOfQuiz(true)
            }
            else {
                setQuestion(questionAttemptData.question)
                setQuestionAttemptId(String(questionAttemptData.question_attempt_id))
                setNextQuestionEnabled(false)   // disable the useQuestionAttempt hook
                setShowNextButton(false)
                setShowSubmitButton(true)
                setShowQuestion(true)
               
            }
            
        }
        
   }, [questionAttemptData])
   
    
    const get_next_question = async () => {
        setShowNextButton(false)
        setShowQuestion(false)
        setQuestionAttemptResponse(undefined)
        setNextQuestionEnabled(true)  // trigger the useQuestionAttempt hook to get the next question
    }

    const mutation = useMutation({
        mutationFn: ({  user_answer, score, error_flag }: { user_answer: string, score: string | undefined, error_flag: boolean | undefined  }) =>
          updateQuestionAttempt(questionAttemptId ? String(questionAttemptId) : "", user_answer, score, error_flag),
        onSuccess: (response) => {
            //console.log('✅ Get XXXXXXX question attempt results:', response)
            setShowNextButton(true)
            setShowSubmitButton(false)
            setShowQuestion(false)
            setQuestionAttemptResponse(response)
            props.set_question_attempt_result(data)   
            
          }
      })

      
      const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
        //console.log("handleSubmit ")
        const button_el = event.target as HTMLButtonElement    
        //button_el.disabled = true
        const the_answer = childRef.current?.getAnswer()
        //console.log("handleSubmit the_answer = ", the_answer)
        if ((the_answer!.trim()).length > 0) {
            const result = processQuestion(question?.format?.toString() ?? "", question?.answer_key ?? "", the_answer ?? "")
              //console.log("handleSubmit result = ", result)
            if (result) { // update the question attempt on the server
                mutation.mutate({
                    user_answer: result?.user_answer,
                    score: result?.score.toString(),
                    error_flag: result?.error_flag
                })
            }
        }
        else {
            alert(" Please enter an answer")
            button_el.disabled = false
        }
      }
    
    /*
    const playAudio = async () => {
        console.log("playAudio  = ", )
        const response = await axios.post('http://localhost:5001/api/tts/text_to_speech',{
            text: question?.audio_str,
           // voice: "en-US-JennyNeural",
        })
        //console.log("response data audioContent= ", response.data.audioContent)
        const audioSrc = `data:audio/mp3;base64,${response.data.audioContent}`;
        setAudioSrc(audioSrc);
    }
    */

    
    useEffect(() => {
       //console.log("XXXXXX QuizPageVideo useEffect question?.audio_str = ", question?.audio_str)
        const fetchAudio = async () => {
            //const url = 'http://localhost:5001/api/tts/text_to_speech'
            const url = `${rootpath}/api/tts/text_to_speech`
           // console.log("playAudio url = ", url)
            //console.log("playAudio question.audio_str = ", question?.audio_str)
            const response = await axios.post(url,{
                text: question?.audio_str,
               // voice: "en-US-JennyNeural",
            })
           // console.log("response data audioContent= ", response.data.audioContent)
            const audioSrc = `data:audio/mp3;base64,${response.data.audioContent}`;
            setAudioSrc(audioSrc);
        };
        if (question?.audio_str && question.audio_str.trim().length > 0) {
            fetchAudio();
        }
    },[question?.audio_str])
    

    const enableSubmmitButton = () => {
        setSubmitDisabled( false  )
    }


    const handleProgressOld = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
        //if (currentVideoPage?.endTime && state.playedSeconds >= currentVideoPage?.endTime) {
           // console.log(" in handleProgress HERE. Stop playing because playedSeconds > video page endtime")
           //console.log(Math.floor(state.playedSeconds*1000))
           const breakpoints = [10000,20000,30000]

           console.log(" video duration in miliseconds= ",videoDuration)
           const whole_milis = Math.floor(state.playedSeconds*1000)
           console.log(" ***** whole_milis = ",whole_milis)
        //if (videoDuration) {
          if (whole_milis >= videoDuration.current) {
            //if video has been playing for the duration, pause the video
            setPlaying(false);
            // add 10 more seconds to the duration 
            videoDuration.current += 10000
          }
          //if (playerRef.current && currentVideoPage?.startTime) {
          // playerRef.current.seekTo(currentVideoPage.startTime );
          //}
          // }
       // }
          
      };    

      //const handleProgress = (state) => {
        const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
        if (state.playedSeconds > endTime) {
          setPlaying(false); // Pause the video
          playerRef.current?.seekTo(startTime, 'seconds'); // Seek to the beginning of the segment
        }
      };

      const handlePlayPause = () => {
        if (!playing) {
          // if the video is not playing, seek to the start time of the current video page
          if (playerRef.current) {
            playerRef.current.seekTo(startTime, 'seconds');
          }
        }
        setPlaying(!playing);
      };

      const seekForward = () => {
        playerRef.current?.seekTo(playerRef.current.getCurrentTime() + 10);
        //playerRef.current?.seekTo(31);
    };

    const seekBackward = () => {
      //playerRef.current?.seekTo(playerRef.current.getCurrentTime() - 10);
      playerRef.current?.seekTo(0);
      setPlaying(true);
  };

    const displayYoutubeVideo = () => {
        return (
          <div className='grid grid-rows-2'>
              <div className='w-full h-full'>
                <div className="player-wrapper">
                  <div className="player-overlay"></div>
                  <ReactPlayer
                    ref={playerRef}
                    onProgress={handleProgress}
                    playing={playing}
                    url={videoUrl}
                    muted={false}
                    controls={true}
                  />
                </div>
              </div>
              <div className='flex flex-row justify-start gap-2 mt-3 mb-1'>
                  <div className='text-textColor1'>
                  <button className='bg-amber-500 p-1 rounded-md' onClick={handlePlayPause}>
                  {playing ? 'Pause' : 'Play'}
                </button>
                  </div>
                  <div className='text-textColor1'>
                  <button className='bg-green-400 p-1 rounded-md' onClick={seekForward}>Forward</button>
                  </div>
                  <div className='text-textColor1'>
                  <button className='bg-cyan-400 p-1 rounded-md' onClick={seekBackward}>Backward</button>
                  </div>
              </div>
            </div>
        )
    }

    return (
        <>
            { endOfQuiz &&
                <div className='flex flex-col items-center'>
                    <div className='bg-red-500 text-white text-lg m-4 rounded-md p-4'>
                        <h1>End of Quiz</h1>
                    </div>
                </div>
            }
            {showQuestion ?
                <div className='flex flex-col items-center'>

                    <div className='flex flex-row justify-start items-center w-full mx-10 bg-cyan-200 px-20 py-1  rounded-md'>
                    <div className='mb-2'>Question: {question?.question_number}</div>
                    </div>
                    <div>{displayYoutubeVideo()}</div>
                    <div className='text-textColor2 m-2' dangerouslySetInnerHTML={{ __html: question?.instruction ?? '' }}></div>
                    <div className='m-2 text-textColorQuestionPrompt'>{question?.prompt}</div>
                    <div>
                        {(question?.audio_str && question.audio_str.trim().length > 0) &&
                            <AzureAudioPlayer text={question.audio_str} />
                        }
                        {(question?.audio_src && question.audio_src.trim().length > 0) &&
                            <audio src={question.audio_src} controls />
                        }
                    </div>
                    <div className='bg-cyan-200 flex flex-colrounded-md justify-center'>
                        {question?.format === 1 ? (
                            <DynamicWordInputs content={question.content} ref={childRef} />
                        ) : question?.format === 2 ? (
                            <ButtonSelectCloze 
                            content={question.content} 
                            choices={question.button_cloze_options} 
                            parentFuncEnableSubmitButton={(enableSubmmitButton)}
                            ref={childRef} />
                        ) : question?.format === 3 ? (
                            <ButtonSelect content={question.content} ref={childRef} />
                        ) : question?.format === 4 ? (
                            <RadioQuestion question={question} ref={childRef} />
                        ) : question?.format === 5 ? (
                            <CheckboxQuestion content={question.content} ref={childRef} />
                        ) : question?.format === 6 ? (
                            <DragDrop content={question.content} ref={childRef} />
                        ) : question?.format === 7 ? (
                            <SRContinuous content={question.content} ref={childRef} />
                        ) : question?.format === 8 ? (
                            <WordsSelect content={question.content} ref={childRef} />
                        ) : question?.format === 10 ? (
                            <DropDowns content={question.content} ref={childRef} />
                        ) : question?.format === 11 ? (
                            <DynamicLetterInputs content={question.content} ref={childRef} />
                        ) : (
                            null
                        )}

                    </div>
                </div>
                :
                questionAttemptResponse &&
                <div className='flex flex-col justify-center items-center'><QuestionAttemptResults
                    live_flag={false}
                    question={question}
                    response={questionAttemptResponse} /></div>
            }


            <div className='flex flex-col items-center justify-center m-4'>
                {showNextButton &&
                    <button className='bg-green-500 p-2 mt-2 rounded-md' onClick={() => {
                        get_next_question()
                    }}>Next</button>
                }
                {showSubmitButton &&
                    <button className='m-4 bg-amber-500 p-2 rounded-md' 
                  
                    disabled={false} 
                    onClick={(e) => handleSubmit(e)}>Submit</button>
                }
            </div>


        </>
    )

}

/*
   {showSubmitButton &&
                    <button className='m-4 bg-amber-500 p-2 rounded-md' disabled={submitDisabled} onClick={(e) => handleSubmit(e)}>Submit</button>
                }
*/

/*
  style={{
                        opacity: submitDisabled ? 0.5 : 1, // Fully visible when enabled, semi-transparent when disabled
                        cursor: submitDisabled ? "pointer" : "not-allowed", // Pointer cursor when enabled, not-allowed when disabled
                      }}
*/

/*
       {showSubmitButton &&
                    <button className='m-4 bg-amber-500 p-2 rounded-md' 
                    style={{
                        opacity: submitDisabled ? 0.5 : 1, // Fully visible when enabled, semi-transparent when disabled
                        cursor: submitDisabled ? "pointer" : "not-allowed", // Pointer cursor when enabled, not-allowed when disabled
                      }}
                    disabled={submitDisabled} 
                    onClick={(e) => handleSubmit(e)}>Submit</button>
                }
*/