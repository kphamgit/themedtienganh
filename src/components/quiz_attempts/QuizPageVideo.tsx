import { MouseEventHandler, useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { QuestionAttemptAttributes, QuestionProps, QuizAttemptProps } from './types';
import { ChildRef, DynamicWordInputs } from './question_attempts/DynamicWordInputs';
import { ButtonSelectCloze } from './question_attempts/ButtonSelecCloze';
import { ButtonSelect } from './question_attempts/ButtonSelect';
import { RadioQuestion } from './question_attempts/RadioQuestion';
import { SRContinuous } from './question_attempts/SRContinuous';
import { WordsSelect } from './question_attempts/WordsSelect';
import { DropDowns } from './question_attempts/DropDowns';
import { DynamicLetterInputs } from './question_attempts/DynamicLetterInputs';
//import { QuestionAttemptResults } from './QuestionAttemptResults';
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
    
    const modalRef = useRef<ModalHandle>(null);

    const params = useParams<{ sub_category_name: string, quizId: string,  }>();
    //const user = useAppSelector(state => state.user.value)
    const user = useAppSelector(state => state.user.value)
    //console.log("QuizPageVideo wwwww user = ", user)

    //google text to speech test
    const [audioSrc, setAudioSrc] = useState<string | null>(null);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
    const videoParams:VideoProps = useLocation().state
   
    const playerRef = useRef<ReactPlayer>(null);

    const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false)

    const [question, setQuestion] = useState<QuestionProps | undefined>()
    const [questionAttemptId, setQuestionAttemptId] = useState<string | undefined>()

    const [showQuestion, setShowQuestion] = useState(false)
  
    const [showNextButton, setShowNextButton] = useState(false)
    const [questionAttemptResponse, setQuestionAttemptResponse] = useState< QuestionAttemptAttributes>()
    const [endOfQuiz, setEndOfQuiz] = useState(false)
    const childRef = useRef<ChildRef>(null);

    const counterRef = useRef<CounterRef>(null)

    const [playing, setPlaying] = useState(false);

   // const videoParams:VideoProps = location.state

   const [nextQuestionEnabled, setNextQuestionEnabled] = useState(false)
  
   const { data } = useQuizAttempt(params.quizId!, user?.id?.toString() ?? "")

   const rootpath = useAppSelector(state => state.rootpath.value)

   useEffect(() => {
        if (data) {
            //console.log("QuizPageVideo data = ", data)
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

    if (endOfQuiz) {
        return (
            <div className='flex flex-col items-center'>
                <div className='m-4'>
                    <h1>End of Quiz</h1>
                </div>
            </div>
        )
    }

    
    useEffect(() => {
       console.log("XXXXXX QuizPageVideo useEffect question?.audio_str = ", question?.audio_str)
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
    
    const openHelpModal = () => {
        //if (modalRef.current) {
          //  modalRef.current.updateValue(true);
       // }
    };


    return (
        <>

            {showQuestion ?
                <div className='flex flex-col items-center'>
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
                    <div className='bg-green-500 flex flex-colrounded-md justify-center'>
                        {question?.format === 1 ? (
                            <DynamicWordInputs content={question.content} ref={childRef} />
                        ) : question?.format === 2 ? (
                            <ButtonSelectCloze content={question.content} ref={childRef} />
                        ) : question?.format === 3 ? (
                            <ButtonSelect content={question.content} ref={childRef} />
                        ) : question?.format === 4 ? (
                            <RadioQuestion question={question} ref={childRef} />
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
                    <button className='m-4 bg-amber-500 p-2 rounded-md' onClick={(e) => handleSubmit(e)}>Submit</button>
                }
            </div>


        </>
    )

}

