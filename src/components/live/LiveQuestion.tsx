import { MouseEventHandler, useContext, useEffect, useRef, useState } from 'react'
//import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { useAxiosFetch } from '../../hooks';
import { QuestionAttemptAttributes, QuestionProps } from '../quiz_attempts/types';
import { DynamicWordInputs } from '../quiz_attempts/question_attempts/DynamicWordInputs';
import { processLiveQuestionAttempt } from '../quiz_attempts/question_attempts/services/list';
import { DropDowns } from '../quiz_attempts/question_attempts/DropDowns';
import { ButtonSelect } from '../quiz_attempts/question_attempts/ButtonSelect';
import { WordScrambler } from '../quiz_attempts/question_attempts/WordScrambler';
import { QuestionAttemptResults } from '../quiz_attempts/QuestionAttemptResults';
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


type GetQuestionProps = {
    end_of_quiz: boolean,
    question: QuestionProps,

}

interface LiveQuestionProps {
    question_number: string | undefined,
    quiz_id: string | undefined 
    set_results: (question_attempt_results: QuestionAttemptAttributes) => void
    setQuestionId: (question_id: string) => void
}

/*
interface QuestionAttemptAttributes {
    user_answer: string;
    score: number;
    question_number: number | undefined;
    questionId: string | undefined;
    error_flag: boolean;
    audio_src: string;
    completed: boolean;
    //quizAttemptId: string;
  }
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


export default function LiveQuestion(props: LiveQuestionProps) {
    //const params = useParams<{ quizId: string, sub_category_name:string ,  startingQuestionId: string }>();
   // const location = useLocation();
    //const live_quiz_data = location.state;
    //console.log(" quizpagelive live quiz data", live_quiz_data)

    const user = useAppSelector(state => state.user.value)
    //const classIds = ['1', '2', '3']
    const counterRef = useRef<CounterRef>(null)

    const url = `/quizzes/${props.quiz_id}/get_question/${props.question_number}`

    const { data: question_data, loading, error } =
       useAxiosFetch<GetQuestionProps>({ url: url, method: 'get' })

    const [question, setQuestion] = useState<QuestionProps | undefined>()
    const [showSubmitButton, setShowSubmitButton] = useState(true)
    //const [questionAttemptResponse, setQuestionAttemptResponse] = useState<QuestionAttemptAttributes | null>(null)
    const [questionAttemptResponse, setQuestionAttemptResponse] = useState<{question: QuestionProps | undefined, results: QuestionAttemptAttributes}>()
    const [endOfQuiz, setEndOfQuiz] = useState(false)
    //const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number | undefined>()
    //const [selectedClassId, setSelectedClassId] = useState<string>("2")

    const childRef = useRef<ChildRef>(null);
    const {socket, user_name, users} = useContext(SocketContext).SocketState;

    const { audioBlob } = useAudioBlobContext();
    //const [audioUrl, setAudioUrl] = useState('')

    const navigate = useNavigate()
   
    interface ChildRef {
        getAnswer: () => string | undefined;
      }

      useEffect(() => {
        if (props && question_data) {
            setQuestion(question_data?.question)
            props.setQuestionId(question_data?.question.id.toString())   
        }
      }, [props, question_data])
    
    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
        const button_el = event.target as HTMLButtonElement  
        button_el.disabled = true
        const my_answer = childRef.current?.getAnswer();
        if (my_answer) {
            // use the ! (exclamation mark) = non-null assertion operator to avoid warning undefined not assignable to string
            processLiveQuestionAttempt(question?.id, my_answer!)
                .then((response) => {
                    setShowSubmitButton(false)
                    setQuestion(undefined)
                    setQuestionAttemptResponse({question: question, results: response})   
                    //console.log(" in LiveQuestion response=", response)   
                    props.set_results(response)         

                    const live_score_params: LiveScoreProps = {
                        question_format: question?.format,
                        question_number: response.question_number,
                        question_content: question?.content,
                        user_answer: my_answer,
                        answer_key: question?.answer_key,
                        score: response.score.toString(),
                        total_score: 0, 
                        user_name: user.user_name
                    }
                    const live_score_new_params: LiveScoreProps = {
                        question_format: question?.format,
                        question_number: response.question_number,
                        question_content: question?.content,
                        user_answer: my_answer,
                        answer_key: question?.answer_key,
                        score: response.score.toString(),
                        total_score: 0, 
                        user_name: user.user_name
                    }
                   socket?.emit('live_score', live_score_params)
                    //console.log(" in QuizPageLive send live_score_new message params=", live_score_new_params)
                   socket?.emit('live_score_new', live_score_new_params)
                    counterRef.current?.stopCount()
                })
                .catch(error => {
                    console.log(error)
                });
        }
        else {
            alert(" Please enter answer")
        }

    }

    if (endOfQuiz) {
       navigate('/')
    }

/*
    return (
        <>
            <div>LIVE QUESTION{question.id}</div>
        </>
    )
        */
    return (
        <>
            
          
            <div>
                    <div className='text-textColor2 bg-bgColor1 p-2 rounded-xl ml-12 mr-2 mt-3'>
                        { question &&
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

/*
                    <div className='bg-bgColor1 w-auto'>
                        {questionAttemptResponse ?
                                 <div className='bg-bgColor1'>
                                 <QuestionAttemptResults live_flag={true} response={questionAttemptResponse }  />
                                </div>
                            :
                            <div></div>
                        }
                    </div>



 <QuestionAttemptResults live_flag={true} response={questionAttemptResponse} />

 <div className='mx-20'>
            <Counter initialSeconds={0} ref={counterRef}/>
        </div>
*/