import { useContext, useEffect, useState } from 'react'
//import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
//import { useAxiosFetch } from '../../hooks';
//import { QuestionProps } from '../quiz_attempts/types';
//import { DynamicWordInputs } from '../quiz_attempts/question_attempts/DynamicWordInputs';
//import { processLiveQuestionAttempt } from '../quiz_attempts/question_attempts/services/list';
//import { DropDowns } from '../quiz_attempts/question_attempts/DropDowns';
//import { ButtonSelect } from '../quiz_attempts/question_attempts/ButtonSelect';
//import { WordScrambler } from '../quiz_attempts/question_attempts/WordScrambler';
//import { QuestionAttemptResults } from '../quiz_attempts/QuestionAttemptResults';
//import { FaPlayCircle } from "react-icons/fa";
//import { WordsSelect } from '../quiz_attempts/question_attempts/WordsSelect';
//import { RadioQuestion } from '../quiz_attempts/question_attempts/RadioQuestion';
//import { ButtonSelectCloze } from '../quiz_attempts/question_attempts/ButtonSelecCloze';
import SocketContext from '../../contexts/socket_context/Context';
//import { AzureAudioPlayer } from '../shared/AzureAudioPlayer';
//import { SRContinuous } from '../quiz_attempts/question_attempts/SRContinuous';
//import { useLocation, useNavigate } from 'react-router-dom';

//import { CounterRef } from '../shared/Counter';
//import { DynamicLetterInputs } from '../quiz_attempts/question_attempts/DynamicLetterInputs';
//import { useAudioBlobContext } from '../../contexts/AudioBlobContext'
import { ScoreBoard } from './ScoreBoard';
import LiveQuestion from './LiveQuestion';
import { QuestionAttemptAttributes, QuestionProps } from '../quiz_attempts/types';
import { QuestionAttemptResults } from '../quiz_attempts/QuestionAttemptResults';
//import {QuestionAttemptResponseProps} from '../components/services/list'

/*
type GetQuestionProps = {
    end_of_quiz: boolean,
    question: QuestionProps,

}

interface QuestionAttemptAttributes {
    answer: string;
    score: number;
    question_number: number | undefined;
    questionId: string | undefined;
    error_flag: boolean;
    audio_src: string;
    completed: boolean;
    //quizAttemptId: string;
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
*/

export default function LiveQuiz(props: any) {
    //const params = useParams<{ quizId: string, sub_category_name:string ,  startingQuestionId: string }>();
    //const location = useLocation();
    //const live_quiz_data = location.state;
    //console.log(" quizpagelive live quiz data", live_quiz_data)

    const user = useAppSelector(state => state.user.value)
    //const classIds = ['1', '2', '3']
    //const counterRef = useRef<CounterRef>(null)

    //const url = `/quizzes/${live_quiz_data.quiz_id}/get_question/${live_quiz_data.question_number}`

    //const { data: question_response, loading, error } =
       // useAxiosFetch<GetQuestionProps>({ url: url, method: 'get' })

    //const [question, setQuestion] = useState<QuestionProps | undefined>()
    //const [showSubmitButton, setShowSubmitButton] = useState(true)
    //const [questionAttemptResponse, setQuestionAttemptResponse] = useState<QuestionAttemptAttributes | null>(null)
    //const [questionAttemptResponse, setQuestionAttemptResponse] = useState<{question: QuestionProps | undefined, results: QuestionAttemptAttributes}>()
    //const [endOfQuiz, setEndOfQuiz] = useState(false)
    //const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number | undefined>()
    //const [answer, setAnswer] = useState<string>()

    const [currentQuestion, setCurrentQuestion] = useState<QuestionProps | undefined>()
    const [showQuestion, setShowQuestion] = useState(false)

    const [liveQuizId, setLiveQuizId] = useState<string | undefined>('')
    const [liveQuestionNumber, setLiveQuestionNumber] = useState<string | undefined>('')

    const [questionAttemptResponse, setQuestionAttemptResponse] = useState<QuestionAttemptAttributes | null>(null)

    //const [selectedClassId, setSelectedClassId] = useState<string>("2")
    const {socket, user_name, users} = useContext(SocketContext).SocketState;
    //const childRef = useRef<ChildRef>(null);
    //const {socket, user_name, users} = useContext(SocketContext).SocketState;

    //const { audioBlob } = useAudioBlobContext();
   // const [audioUrl, setAudioUrl] = useState('')

    //const navigate = useNavigate()
   
    //interface ChildRef {
    //    getAnswer: () => string | undefined;
    //  }

 useEffect(() => {
        if (socket) {
        socket.on('live_question', (arg: { quiz_id: string, question_number: string, target_student: string}) => {
            console.log("live question received...arg=", arg)   
            setLiveQuizId(arg.quiz_id)
            setLiveQuestionNumber(arg.question_number)
            setShowQuestion(true)
            setQuestionAttemptResponse(null)
          /*
          const temp = {...arg, target_student: user.user_name}
          socket.emit("live_question_received", temp)
 
          if (arg.target_student.trim() === 'everybody') {
            
            navigate("/live_quiz", { state: arg })
          }
          else if (arg.target_student.trim() === user.user_name?.trim()) {
            navigate("/live_quiz", { state: arg })
          }
          else {
            console.log(" invalid student target")
          }
          */
        })
        return () => {
          socket?.off("live_question")
        }
        }
    },[socket, user.user_name, user.classId])
    
    const set_question_attempt_results = (arg: any) => {
      //console.log("set_question_attempt_results: ", arg)
      setShowQuestion(false)
      setQuestionAttemptResponse(arg)
    }
 

//<audio controls src={audioUrl} />
    return (
        <>
          
            <div className='bg-white grid grid-cols-12 justify-start'>
                <div className='col-span-10  bg-blue-300 text-textColor2 text-lg m-10'>
                <div className='bg-bgColorQuestionContent mx-10 my-6 flex flex-col rounded-md'>
                { showQuestion ?
                   <LiveQuestion quiz_id={liveQuizId} question_number={liveQuestionNumber} set_results={set_question_attempt_results} 
                   />
                   :
                     <div>LIVE QUIZ</div>
                }
                { questionAttemptResponse &&
                      <div className='bg-bgColor1'>
                      <QuestionAttemptResults live_flag={true} question_id = {currentQuestion?.id.toString()} response={questionAttemptResponse }  />
                     </div>
                }
                </div>
                </div>
                <div className=' col-span-2 bg-bgColor1 text-textColor2 text-lg'>
                    <ScoreBoard classId={user.classId?.toString() } />
                </div>
            </div>
        </>
    )
}
//      <QuestionAttemptResults live_flag={false} question= {question} response={questionAttemptResponse }  />
/*
      <div className='bg-bgColor1 w-auto'>
                        {questionAttemptResponse ?
                                 <div className='bg-bgColor1'>
                                 <QuestionAttemptResults live_flag={true} response={questionAttemptResponse } user_answer={answer} />
                                </div>
                            :
                            <div></div>
                        }
                    </div>
*/

/*
                  {questionAttemptResponse?
                        <>
                         <QuestionAttemptResults live_flag={false} response={questionAttemptResponse } />
                        </>
                        :
                        <div></div>
                    }




 <QuestionAttemptResults live_flag={true} response={questionAttemptResponse} />

 <div className='mx-20'>
            <Counter initialSeconds={0} ref={counterRef}/>
        </div>
*/