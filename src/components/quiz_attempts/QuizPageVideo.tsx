import { useEffect, useRef, useState } from 'react'
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

import ReactPlayer from 'react-player';
import { createQuestionAttempt, processQuestionAttempt } from './question_attempts/services/list';
import { Counter, CounterRef } from '../shared/Counter';
import { useAxiosFetch } from '../../hooks';

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
    const url = `quiz_attempts/find_create/${params.quizId}/${user.id}`
    const [quizAttempt, setQuizAttempt] = useState<QuizAttemptProps | undefined>()
    const [quizAttemptId, setQuizAttemptId] = useState<string | undefined>()

    //const url = `/quiz_attempts/${params.quizId}/${user.id}`
    //const url = `/http://localhost:5001/api/quiz_attempts/${params.quizId}/${user.id}`
   
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
    const { data, loading, error } =
          useAxiosFetch<QuizAttemptProps>({ url: url, method: 'get' })
       
    const videoParams:VideoProps = useLocation().state
   
    const playerRef = useRef<ReactPlayer>(null);

    const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false)

    const [question, setQuestion] = useState<QuestionProps | undefined>()
    const [questionId, setQuestionId] = useState<string | undefined>()
    const [showQuestion, setShowQuestion] = useState(false)
    const [showQuestionAttemptResults, setShowQuestionAttemptResults] = useState(false)
    const [showNextButton, setShowNextButton] = useState(false)
    const [questionAttemptResponse, setQuestionAttemptResponse] = useState< QuestionAttemptAttributes>()
    const [endOfQuiz, setEndOfQuiz] = useState(false)
    const childRef = useRef<ChildRef>(null);

    const counterRef = useRef<CounterRef>(null)

    const [answer, setAnswer] = useState<string>()

    const [playing, setPlaying] = useState(false);
    
   // const videoParams:VideoProps = location.state
   
   const startTimeout = (timeout: number) => {
    //console.log("startTimeout timeout", question?.timeout) 
    timeoutRef.current = setTimeout(() => {
      //console.log("Timeout executed!");
        handleTimeOut()
        counterRef.current?.stopCount()
    }, timeout);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

   const do_next_question_attempt = () => {
    //kpham. typescript tips: non-null assertion
    //server will decide the next question to fetch. KP
    //console.log(" in QuizPageVideo get_next_question createQuestionAttempt......")
    createQuestionAttempt(data!.quiz_attempt.id)
        .then((response) => {
            //console.log(" in QuizPageVideo do_next_question_attempt createQuestionAttempt..... response=", response)
            if (response.end_of_quiz) {
                setEndOfQuiz(true)
            }
            else {
                //console.log("next question", response.question)
                setQuestion(response.question)
                setQuestionId(response.question.id.toString())  // to be used by QuestionAttemptResults
                setShowQuestion(true)
                setShowSubmitButton(true)
                setShowNextButton(false)
                setQuestionAttemptResponse(undefined)
                counterRef.current?.startCount()
                startTimeout(response.question.timeout)
            }
            
        })
        .catch(error => {
            console.log(error)
        });
}

    useEffect(() => {
        if (data) {
            do_next_question_attempt();
        }
        else {
            console.log("in useEffect quiz_attempt is null")
        }
    },[data])

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

    
    if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error Loading Quiz Attempt</div>;
      }

    const handleTimeOut = () => {
        /*
        setShowNextButton(true)
        setShowSubmitButton(false)
        //setQuestionAttemptResponse({question: question, results: response})
        setQuestion(undefined)
        setIsModalOpen(true)
        */
        setAnswer("TIMEOUT")
        processQuestionAttempt(data?.quiz_attempt.id, "TIMEOUT"!)
        .then((response) => {
            setShowNextButton(true)
            setShowSubmitButton(false)
            setQuestionAttemptResponse(response)
            setShowQuestion(false)
            setQuestion(undefined)
            
        })
        .catch(error => {
            console.log(error)
        });
    }

    const handleSubmit = () => {
        const my_answer = childRef.current?.getAnswer();
        //console.log("ZZZZZZ handleSubmit my_answer = ", my_answer)
        
        if (my_answer) {
            setAnswer(my_answer)
            // use the ! (exclamation mark) = non-null assertion operator to avoid warning undefined not assignable to string
            processQuestionAttempt(data?.quiz_attempt.id, my_answer!)
                .then((response) => {
                    setShowNextButton(true)
                    setShowSubmitButton(false)
                    setQuestionAttemptResponse(response)
                    setShowQuestion(false)
                    setQuestion(undefined)
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    counterRef.current?.stopCount()
                })
                .catch(error => {
                    console.log(error)
                });
        }
        else {
            alert("Enter answer")
        }
        
    }
/*
    useEffect(() => {
          //console.log("startttttt...")
          counterRef.current?.startCount()
        //}
      },[])
      */

    if (endOfQuiz) {
        return (
            <div className='bg-bgColor2 text-textColor2'>END OF QUIZ.</div>
        )
    }

    return (
        <>
           
           <div className='flex flex-row justify-center text-lg  text-textColor2 m-4'>{params.sub_category_name}</div>
          
            <div className='bg-gradient-to-b from-bgColorQuestionAttempt to-green-100 flex flex-col mx-40 mt-4 rounded-md'>
            <div className='mt-2 ml-10'><Counter initialSeconds={0} ref={counterRef} /></div>
            <div className='bg-bgColorQuestionContent mx-10 my-6 flex flex-col rounded-md'>
                <div className='p-2 rounded-xl'>
                    {question && showQuestion &&
                        <>
                        <div className='mb-2'>Question: {question.question_number}</div>
                            <div className='bg-bgColorQuestionContent text-textColor1'>
                            
                            <div  className='text-textColor2' dangerouslySetInnerHTML={{ __html: question.instruction }}></div>
                            <div className='m-2 text-textColor3'>{question.prompt}</div>
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
                            </div>
                        </>
                    }
                </div>
                <div>
                    {questionAttemptResponse  &&
                        <>
                         <QuestionAttemptResults live_flag={false} question_id= {questionId} response={questionAttemptResponse }  />
                        </>
                     
                    }
                </div>
            </div>
            <div className='mx-10'>
            {showNextButton ?
                <button className='bg-bgColor2 mt-0 text-lg text-textColor2 p-1 rounded-md' onClick={do_next_question_attempt}>Next</button>
                :
                ( showSubmitButton &&
                <button className='bg-bgColorSubmitBtn mt-0 text-textColorSubmitBtn text-lg p-2 rounded-md mb-2' onClick={handleSubmit}>Submit</button>
                )
            }
            </div>
            
            </div>




        </>
    )

}
