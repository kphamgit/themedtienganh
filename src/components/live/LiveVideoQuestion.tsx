import { MouseEventHandler, useContext, useEffect, useRef, useState } from 'react'
//import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
//import { useAxiosFetch } from '../../hooks';
//import { LiveQuestionAttemptAttributes, QuestionProps } from '../quiz_attempts/types';
import { DynamicWordInputs } from '../quiz_attempts/question_attempts/DynamicWordInputs';

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
import { processQuestion } from './processQuestion';
import { QuestionAttemptAttributes, QuestionProps } from '../quiz_attempts/types';
import { useLiveQuestionNumber } from '../../contexts/livequiz/LiveQuestionNumber';


interface LiveQuestionProps {
    question: QuestionProps | undefined,
    set_question_attempt_result?: (question_attempt_results: QuestionAttemptAttributes) => void
}

/*
 question_number: string | undefined,
    quiz_id: string | undefined 
*/

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


export default function LiveVideoQuestion(props: LiveQuestionProps) {
    //const { data, error, isLoading } = useLiveQuestion(props.quiz_id, props.question_number)

    const {socket, user_name, users} = useContext(SocketContext).SocketState;

    //const { questionNumber, setQuestionNumber } = useLiveQuestionNumber();

    const user = useAppSelector(state => state.user.value)
    const counterRef = useRef<CounterRef>(null)

    const [showSubmitButton, setShowSubmitButton] = useState(true)

    //const [questionAttemptResponse, setQuestionAttemptResponse] = useState<{question: QuestionProps | undefined, results: LiveQuestionAttemptAttributes}>()
    const [endOfQuiz, setEndOfQuiz] = useState(false)
 
    const childRef = useRef<ChildRef>(null);
   
    const { questionNumber, setQuestionNumber } = useLiveQuestionNumber();

    const { audioBlob } = useAudioBlobContext();
    //const [audioUrl, setAudioUrl] = useState('')

    const [submitEnabled, setSubmitEnabled] = useState(false)

    const navigate = useNavigate()
   
    interface ChildRef {
        getAnswer: () => string | undefined;
      }
   
    if (endOfQuiz) {
       navigate('/')
    }

      const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
            const button_el = event.target as HTMLButtonElement    
            button_el.disabled = true
            const my_answer = childRef.current?.getAnswer();
            if (my_answer) {
                //setSubmitEnabled(true)
                //console.log("handleSubmit format = ", props.question?.format)
                if (props.question) {
                    const result = processQuestion(props.question.format.toString(), props.question.answer_key, my_answer)
                    console.log("handleSubmit result = ", result)
                    if (result) {
                        props.set_question_attempt_result?.(result);
                        const live_score_params: LiveScoreProps = {
                            question_format: props.question?.format,
                            question_number: props.question.question_number,
                            question_content: props.question?.content,
                            user_answer: childRef.current?.getAnswer(),
                            answer_key: props.question?.answer_key,
                            score: result.score.toString(),
                            total_score: 0, 
                            user_name: user.user_name
                        }
                        // emit live score to other students
                        socket?.emit('live_score', live_score_params) 
                        // reset questionNumber in context
                        //console.log("LiveQuestion: resetting question number in context")
                        setQuestionNumber("")
                    } else {
                        console.error("Result is undefined");
                    }
                } else {
                    console.error("Question data is undefined");
                }
            }
          }

    return (
        <>
            <div>
                <div className='text-textColor2 bg-bgColor1 p-2 rounded-xl ml-12 mr-2 mt-3'>
                    {props.question &&
                    <>
                       <div className='mb-2'>Question: {questionNumber}</div>
                        

                       <div className='mt-3'>
                       { props.question.format === 1 ? (
                           <DynamicWordInputs content={props.question.content} ref={childRef} />
                       ) : props.question.format === 2 ? (
                           <ButtonSelectCloze 
                           content={props.question.content} 
                           choices={props.question.button_cloze_options} 
                           ref={childRef} />
                       ) : props.question.format === 3 ? (
                           <ButtonSelect content={props.question.content} ref={childRef} />
                       ) : props.question.format === 4 ? (
                           <RadioQuestion content={props.question.content} ref={childRef} />
                       ) : props.question.format === 4 ? (
                        <RadioQuestion content={props.question.content} ref={childRef} />
                       ) : props.question.format === 6 ? (
                           <DragDrop content={props.question.content} ref={childRef} />
                       ) : props.question.format === 7 ? (
                           <SRContinuous content={props.question.content} ref={childRef} />
                       ) : props.question.format === 8 ? (
                           <WordsSelect content={props.question.content} ref={childRef} />
                       ) : props.question.format === 10 ? (
                           <DropDowns content={props.question.content} ref={childRef} />
                       ) : props.question.format === 11 ? (
                           <DynamicLetterInputs content={props.question.content} ref={childRef} />
                       ) : (
                           <div>UNKNOWN question format</div>
                       )}
                        <button className='bg-green-500 text-white m-1 text-lg p-1 mt-3 rounded-md' onClick={handleSubmit}>Submit</button>
                       </div>
                    </>                      
                    }
                </div>

            </div>
        </>
    )
}

