import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { QuestionAttemptAttributes, QuestionProps, QuizAttemptProps } from './types';
import { ChildRef, DynamicWordInputs } from './question_attempts/DynamicWordInputs';
import { ButtonSelectCloze } from './question_attempts/ButtonSelecCloze';
import { ButtonSelect } from './question_attempts/ButtonSelect';
import { RadioQuestion } from './question_attempts/RadioQuestion';
import { WordScrambler } from './question_attempts/WordScrambler';
import { SRContinuous } from './question_attempts/SRContinuous';
import { WordsSelect } from './question_attempts/WordsSelect';
import { DropDowns } from './question_attempts/DropDowns';
import { DynamicLetterInputs } from './question_attempts/DynamicLetterInputs';
import { QuestionAttemptResults } from './QuestionAttemptResults';
import { AzureAudioPlayer } from '../shared/AzureAudioPlayer';
import { useAxiosFetch } from '../../hooks/useAxiosFetch';

import ReactPlayer from 'react-player';
import { createQuestionAttempt, processQuestionAttempt } from './question_attempts/services/list';

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

export default function QuizPageVideo(props:any) {
    
    const params = useParams<{ sub_category_name: string, quizId: string,  }>();
    const user = useAppSelector(state => state.user.value)
    const url = `/quiz_attempts/find_create/${params.quizId}/${user.id}`
    //const url = `/quiz_attempts/${params.quizId}/${user.id}`
    //quiz_id/:user_id",
    const { data: quiz_attempt, loading, error } =
        useAxiosFetch<QuizAttemptProps>({ url: url, method: 'get' })

    const videoParams:VideoProps = useLocation().state
   
    const playerRef = useRef<ReactPlayer>(null);

    const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false)

    const [question, setQuestion] = useState<QuestionProps | undefined>()
    const [showNextButton, setShowNextButton] = useState(false)
    const [questionAttemptResponse, setQuestionAttemptResponse] = useState<{question: QuestionProps | undefined, results: QuestionAttemptAttributes}>()
    const [endOfQuiz, setEndOfQuiz] = useState(false)
    const childRef = useRef<ChildRef>(null);

    const [answer, setAnswer] = useState<string>()

    const [playing, setPlaying] = useState(false);
    
    //const location = useLocation()
   // const videoParams:VideoProps = location.state

    useEffect(() => {
        //console.log(quiz_attempt)
        setQuestion(quiz_attempt?.question)
        setShowSubmitButton(true)
    }, [quiz_attempt])

    const handlePlay = () => {
        //console.log("in handle play")
        //playerRef.current.seekTo(31);
        setPlaying(true);
    
        //if (playerRef.current && currentVideoPage?.startTime) {
          //  playerRef.current.seekTo(currentVideoPage.startTime);
       // }
    };

    const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
        //if (currentVideoPage?.endTime && state.playedSeconds >= currentVideoPage?.endTime) {
           // console.log(" in handleProgress HERE. Stop playing because playedSeconds > video page endtime")
           //console.log(Math.floor(state.playedSeconds*1000))
           const whole_milis = Math.floor(state.playedSeconds*1000)
           if (whole_milis >= 60000)
                setPlaying(false);
          //if (playerRef.current && currentVideoPage?.startTime) {
           // playerRef.current.seekTo(currentVideoPage.startTime );
          //}
       // }
      };

      const seekForward = () => {
        //playerRef.current?.seekTo(playerRef.current.getCurrentTime() + 10);
        playerRef.current?.seekTo(31);
    };

      const handlePlayPause = () => {
        setPlaying(!playing);
      };

      const do_next_question_attempt = () => {
        //kpham. typescript tips: non-null assertion
        //server will decide the next question to fetch. KP
        //console.log(" in QuizPageVideo get_next_question createQuestionAttempt......")
        createQuestionAttempt(quiz_attempt!.quiz_attempt_id)
            .then((response) => {
                //console.log(" in QuizPageVideo do_next_question_attempt createQuestionAttempt..... response=", response)
                if (response.end_of_quiz) {
                    setEndOfQuiz(true)
                }
                else {
                    //console.log("next question", response.question)
                    setQuestion(response.question)
                    setShowSubmitButton(true)
                    setShowNextButton(false)
                    setQuestionAttemptResponse(undefined)
                }
                
            })
            .catch(error => {
                console.log(error)
            });
    }

    const handleSubmit = () => {
        const my_answer = childRef.current?.getAnswer();
        //console.log("ZZZZZZ handleSubmit", my_answer)
        
        if (my_answer) {
            setAnswer(my_answer)
            //console.log("in handleSubmit ")
            // use the ! (exclamation mark) = non-null assertion operator to avoid warning undefined not assignable to string
            processQuestionAttempt(quiz_attempt?.quiz_attempt_id, my_answer!)
                .then((response) => {
                    setShowNextButton(true)
                    setShowSubmitButton(false)
                    setQuestionAttemptResponse({question: question, results: response})
                    setQuestion(undefined)
                })
                .catch(error => {
                    console.log(error)
                });
        }
        else {
            alert("Enter answer")
        }
        
    }

    if (endOfQuiz) {
        return (
            <div>END OF QUIZ.</div>
        )
    }

    return (
        <>
           
           <div className='flex flex-row justify-center text-lg m-1'>{params.sub_category_name}</div>
            <div className='flex flex-col mx-20 mt-4'>
            <div className='mx-10 my-6 flex flex-col'>
                <div className='bg-gray-100 p-2 rounded-xl'>
                    {question &&
                        <>
                            <div className='text-amber-800'>Question: {question.question_number}</div>
                           
                            <div dangerouslySetInnerHTML={{ __html: question.instruction }}></div>
                            <div className='m-2'>{question.prompt}</div>
                            <div>
                                {(question.audio_str && question.audio_str.trim().length > 0) &&
                                    <AzureAudioPlayer text={question.audio_str} />
                                }
                                {(question.audio_src && question.audio_src.trim().length > 0) &&
                                    <audio src={question.audio_src} controls />
                                }
                            
                            </div>
                      
                            <div className='mt-3'>
                            { question.format === 1 ? (
                                <DynamicWordInputs content={question.content} ref={childRef} />
                            ) : question.format === 2 ? (
                                <ButtonSelectCloze content={question.content} ref={childRef} />
                            ) : question.format === 3 ? (
                                <ButtonSelect content={question.content} ref={childRef} />
                            ) : question.format === 4 ? (
                                <RadioQuestion question={question} ref={childRef} />
                            ) : question.format === 6 ? (
                                <WordScrambler content={question.content} ref={childRef} />
                            ) : question.format === 7 ? (
                                <SRContinuous content={question.content} ref={childRef} />
                            ) : question.format === 8 ? (
                                <WordsSelect content={question.content} ref={childRef} />
                            ) : question.format === 10 ? (
                                <DropDowns content={question.content} ref={childRef} />
                            ) : question.format === 11 ? (
                                <DynamicLetterInputs content={question.content} ref={childRef} />
                            ) : (
                                <div>UNKNOWN question format</div>
                            )}
                            </div>
                        </>
                    }
                </div>
                <div className='bg-green-200'>
                    {questionAttemptResponse?
                        <>
                         <QuestionAttemptResults live_flag={false} response={questionAttemptResponse } user_answer={answer} />
                        </>
                        :
                        <div></div>
                    }
                </div>
            </div>
            <div className='mx-10'>
            {showNextButton ?
                <button className='bg-amber-300 mt-0 text-lg p-1 rounded-md' onClick={do_next_question_attempt}>Next</button>
                :
                ( showSubmitButton &&
                <button className='bg-green-300 mt-0 text-lg p-1 rounded-md' onClick={handleSubmit}>Submit</button>
                )
            }
            </div>
            
            </div>




        </>
    )
}
