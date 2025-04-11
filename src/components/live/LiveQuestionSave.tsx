import { MouseEventHandler, useContext, useEffect, useRef, useState } from 'react'
//import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
//import { useAxiosFetch } from '../../hooks';
import { QuestionAttemptAttributes, QuestionProps } from '../quiz_attempts/types';
import { DynamicWordInputs } from '../quiz_attempts/question_attempts/DynamicWordInputs';
import { processLiveQuestionAttempt } from '../quiz_attempts/question_attempts/services/list';
import { DropDowns } from '../quiz_attempts/question_attempts/DropDowns';
import { ButtonSelect } from '../quiz_attempts/question_attempts/ButtonSelect';
//import { WordScrambler } from '../quiz_attempts/question_attempts/WordScrambler';
//import { QuestionAttemptResults } from '../quiz_attempts/QuestionAttemptResults';
//import { FaPlayCircle } from "react-icons/fa";
import { WordsSelect } from '../quiz_attempts/question_attempts/WordsSelect';
import { RadioQuestion } from '../quiz_attempts/question_attempts/RadioQuestion';
import { ButtonSelectCloze } from '../quiz_attempts/question_attempts/ButtonSelecCloze';
//import { useSocket} from '../components/context/socketContext'
import SocketContext from '../../contexts/socket_context/Context';
import { AzureAudioPlayer } from '../shared/AzureAudioPlayer';
import { SRContinuous } from '../quiz_attempts/question_attempts/SRContinuous';
import { useNavigate } from 'react-router-dom';
//import { Counter} from '../components/Counter';
import { CounterRef } from '../shared/Counter';
import { DynamicLetterInputs } from '../quiz_attempts/question_attempts/DynamicLetterInputs';
import { useAudioBlobContext } from '../../contexts/AudioBlobContext'
import DragDrop from '../quiz_attempts/question_attempts/dragdrop/DragDrop';
import { useLiveQuestion } from '../../hooks/useLiveQuestion';
import { useLiveQuestionAttemptResults } from '../../hooks/useLiveQAResults';
import { useMutation } from '@tanstack/react-query';
import { fetchLiveQuestionAttemptResults } from '../api/fetchLiveQAResults';



interface LiveQuestionProps {
    question_number: string | undefined,
    quiz_id: string | undefined 
    set_question_attempt_result: (question_attempt_results: QuestionAttemptAttributes) => void
}

  interface LiveScoreProps {
    question_format: number | undefined,
    question_number: number | undefined,
    question_content: string | undefined,
    user_answer: string | undefined,
    answer_key: string | undefined,
    score: string | undefined,
    total_score: number | undefined, 
    user_name: string | undefined
  }


export default function LiveQuestionSave(props: LiveQuestionProps) {
    const { data, error, isLoading } = useLiveQuestion(props.quiz_id, props.question_number)
    const user = useAppSelector(state => state.user.value)
    const counterRef = useRef<CounterRef>(null)

    const [showSubmitButton, setShowSubmitButton] = useState(true)

    const [questionAttemptResponse, setQuestionAttemptResponse] = useState<{question: QuestionProps | undefined, results: QuestionAttemptAttributes}>()
    const [endOfQuiz, setEndOfQuiz] = useState(false)
 
    const childRef = useRef<ChildRef>(null);
    //const {socket, user_name, users} = useContext(SocketContext).SocketState;

    const { audioBlob } = useAudioBlobContext();
    //const [audioUrl, setAudioUrl] = useState('')

    const [submitEnabled, setSubmitEnabled] = useState(false)

    //const {data} = useLiveQuestionAttemptResults(props.quiz_id, props.question_number, )

    const navigate = useNavigate()
   
    interface ChildRef {
        getAnswer: () => string | undefined;
      }

   

      const mutation = useMutation({
        mutationFn: ({ quiz_id, question_number, user_answer }: { quiz_id: string; question_number: string; user_answer: string }) =>
          fetchLiveQuestionAttemptResults(quiz_id, question_number, user_answer),
        onSuccess: (data) => {
            console.log('✅ Get live question attempt results:', data)
            
   /*
     {
    "user_answer": "  ee",
    "score": 0,
    "questionId": "1062",
    "error_flag": true,
    "audio_src": "",
    "completed": true
}
      */
            
            setShowSubmitButton(false)
            props.set_question_attempt_result(data)   
            
          }
      })

      const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
        const button_el = event.target as HTMLButtonElement    
        button_el.disabled = true
        const my_answer = childRef.current?.getAnswer();
        if (my_answer) {
            mutation.mutate({
                quiz_id: props.quiz_id ?? '',
                question_number: props.question_number ?? '',
                user_answer: my_answer})
        }
      }
      /*
      const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
        const button_el = event.target as HTMLButtonElement    
        button_el.disabled = true
        const my_answer = childRef.current?.getAnswer();
        if (my_answer) {
            setSubmitEnabled(true)
        }
      }
      */

      /*
      useEffect(() => {
        if (result) {
            setShowSubmitButton(false)
            setQuestionAttemptResponse({question: data?.question, results: result})   
            props.set_question_attempt_result(result)   
            const live_score_params: LiveScoreProps = {
                question_format: data?.question?.format,
                question_number: result.question_number,
                question_content: data?.question?.content,
                user_answer: childRef.current?.getAnswer(),
                answer_key: data?.question?.answer_key,
                score: result.score.toString(),
                total_score: 0, 
                user_name: user.user_name
            }
           socket?.emit('live_score', live_score_params) 
        }
      }, [result])
      */

    if (endOfQuiz) {
       navigate('/')
    }

    return (
        <>
            <div>
                
                    <div className='text-textColor2 bg-bgColor1 p-2 rounded-xl ml-12 mr-2 mt-3'>
                       
                        { data?.question &&
                            <>
                              <div className='mb-2'>Question: {data?.question.question_number}</div>
                            <div className='bg-bgColorQuestionContent text-textColor1'>
                            
                            <div  className='text-textColor2' dangerouslySetInnerHTML={{ __html: data?.question.instruction }}></div>
                            <div className='m-2 text-textColor3'>{data?.question.prompt}</div>
                            <div>
                                {(data?.question.audio_str && data?.question.audio_str.trim().length > 0) &&
                                    <AzureAudioPlayer text={data?.question.audio_str} />
                                }
                                {(data?.question.audio_src && data?.question.audio_src.trim().length > 0) &&
                                    <audio src={data?.question.audio_src} controls />
                                }
                            
                            </div>
                      
                            <div className='mt-3'>
                            { data?.question.format === 1 ? (
                                <DynamicWordInputs content={data?.question.content} ref={childRef} />
                            ) : data?.question.format === 2 ? (
                                <ButtonSelectCloze content={data?.question.content} ref={childRef} />
                            ) : data?.question.format === 3 ? (
                                <ButtonSelect content={data?.question.content} ref={childRef} />
                            ) : data?.question.format === 4 ? (
                                <RadioQuestion question={data?.question} ref={childRef} />
                            ) : data?.question.format === 6 ? (
                                <DragDrop content={data?.question.content} ref={childRef} />
                            ) : data?.question.format === 7 ? (
                                <SRContinuous content={data?.question.content} ref={childRef} />
                            ) : data?.question.format === 8 ? (
                                <WordsSelect content={data?.question.content} ref={childRef} />
                            ) : data?.question.format === 10 ? (
                                <DropDowns content={data?.question.content} ref={childRef} />
                            ) : data?.question.format === 11 ? (
                                <DynamicLetterInputs content={data?.question.content} ref={childRef} />
                            ) : (
                                <div>UNKNOWN question format</div>
                            )}
                            </div>
                            </div>
                                <div>
                        {showSubmitButton &&
                            <button className='bg-bgColor3 text-textColor3 m-1 text-lg p-1 rounded-md' onClick={handleSubmit}>Submit</button>
                        }
                    </div>
                            </>
                        }
                    </div>
       
            </div>
        </>
    )
}

