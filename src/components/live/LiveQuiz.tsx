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
//import { QuestionAttemptAttributes, QuestionProps } from '../quiz_attempts/types';
import { QuestionAttemptResults } from '../quiz_attempts/QuestionAttemptResults';
import { QuestionAttemptAttributes, QuestionProps } from '../quiz_attempts/types';
import { useQuestion } from '../../hooks/useQuestion';
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

/*
interface LiveQuestionAttemptResultsProps {
  user_answer: string;
  score: number;
  error_flag: boolean;
 
}
*/

export default function LiveQuiz(props: any) {
   
    const user = useAppSelector(state => state.user.value)
  
    const [getQuestionEnabled, setGetQuestionEnabled] = useState(false)

    const [showLivePicture, setShowLivePicture] = useState(false)
    const [pictureUrl, setPictureUrl] = useState<string>('')
    const [pictureText, setPictureText] = useState<string>('')
 
    const [showQuestion, setShowQuestion] = useState(false)

    const [question, setQuestion] = useState<QuestionProps | undefined>(undefined)

    const [liveQuizId, setLiveQuizId] = useState<string | undefined>('')
    const [liveQuestionNumber, setLiveQuestionNumber] = useState<string | undefined>('')

    const [questionAttemptResponse, setQuestionAttemptResponse] = useState<QuestionAttemptAttributes | null>(null)

    const {socket} = useContext(SocketContext).SocketState;
 
    const { data, error, isLoading } = useQuestion(liveQuizId, liveQuestionNumber, getQuestionEnabled)

    useEffect(() => {
      if (data) {
        //console.log("LiveQuiz data = ", data)
        setQuestion(data.question)
      }
    }
    , [data])
      
    useEffect(() => {
      if (socket) {
        socket.on('live_question', (arg: { quiz_id: string, question_number: string, target_student: string }) => {
          //console.log("live question received...arg=", arg) 
          setGetQuestionEnabled(true)  //retrieve the question from the server

          setShowLivePicture(false)
          setLiveQuizId(arg.quiz_id)
          setLiveQuestionNumber(arg.question_number)
          setShowQuestion(true)
          setQuestionAttemptResponse(null)
        })
        socket.on('live_picture', (arg: any) => {
          //console.log("... .... live_picture message received:")
          setPictureUrl(arg.picture_url)
          setPictureText(arg.description)
          setShowLivePicture(true)
          setShowQuestion(false)
          setQuestionAttemptResponse(null)
        })
        return () => {
          socket?.off("live_question")
          socket?.off("live_picture")
        }
      }
    }, [socket, user.user_name, user.classId])

    const set_question_attempt_results = (arg: QuestionAttemptAttributes) => {
      //console.log("LiveQuz: set_question_attempt_results: arg= ", arg)
      //setLiveQuizId(arg.quiz_id)
      setShowQuestion(false)
      setQuestionAttemptResponse(arg)
    }
 
    return (
        <>
          <div className='flex justify-center bg-blue-200 text-textColor2 w-screen mx-2'>
            <div className='bg-yellow-100 grid grid-cols-12'>
                <div className='col-span-10  bg-blue-300 text-textColor2 text-lg m-5'>
                <div className='bg-bgColorQuestionContent mx-10 my-6 flex flex-col rounded-md'>
                { showQuestion ?
                <>
                   <LiveQuestion question={question}
                    set_question_attempt_result={set_question_attempt_results} 
                    
                   />
                   </>
                   :
                     <div>Live Quiz</div>
                }
                { questionAttemptResponse &&
                      <div className='bg-bgColor1'>
                      <QuestionAttemptResults 
                        live_flag={true} 
                        question= {question}
                        response={questionAttemptResponse }  />
                     </div>
                }
                { showLivePicture &&
                      <div className='bg-bgColor1'>
                     
                      <img src={pictureUrl} alt="Live Picture" />
                      <div>{pictureText}</div>
                     </div>
                }
                </div>
                </div>
                <div className=' col-span-2 bg-bgColor1 text-textColor2 text-lg'>
                    <ScoreBoard classId={user.classId?.toString() } />
                </div>
            </div>
            </div>
        </>
    )
}
//  
