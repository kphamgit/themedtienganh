import { useContext, useEffect, useRef, useState } from 'react'
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
import { useLiveQuestionNumber } from '../../contexts/livequiz/LiveQuestionNumber';
//import { AzureAudioPlayer } from '../shared/AzureAudioPlayer';
//import { SRContinuous } from '../quiz_attempts/question_attempts/SRContinuous';
//import { useLocation, useNavigate } from 'react-router-dom';

//import { CounterRef } from '../shared/Counter';
//import { DynamicLetterInputs } from '../quiz_attempts/question_attempts/DynamicLetterInputs';
//import { useAudioBlobContext } from '../../contexts/AudioBlobContext'
//import { ScoreBoard } from './ScoreBoard';
import LiveQuestion from './LiveQuestion';
//import { QuestionAttemptAttributes, QuestionProps } from '../quiz_attempts/types';
import { QuestionAttemptResults } from '../quiz_attempts/QuestionAttemptResults';
import { QuestionAttemptAttributes, QuestionProps } from '../quiz_attempts/types';
import { ScoreBoard, ScoreBoardRefProps } from './ScoreBoard';
//import {QuestionAttemptResponseProps} from '../components/services/list'

export default function LiveQuiz(props: any) {
   
    const user = useAppSelector(state => state.user.value)
  
    const [showLivePicture, setShowLivePicture] = useState(false)
    const [pictureUrl, setPictureUrl] = useState<string>('')
    const [pictureText, setPictureText] = useState<string>('')
 
    const [showQuestion, setShowQuestion] = useState(false)

    const [question, setQuestion] = useState<QuestionProps | undefined>(undefined)

    const [liveQuizId, setLiveQuizId] = useState<string | undefined>('')
    //const [liveQuestionNumber, setLiveQuestionNumber] = useState<string | undefined>('')

    const [questionAttemptResponse, setQuestionAttemptResponse] = useState<QuestionAttemptAttributes | null>(null)

    const {socket} = useContext(SocketContext).SocketState;

    const { questionNumber, setQuestionNumber } = useLiveQuestionNumber();
 
    const rootpath = useAppSelector(state => state.rootpath.value)

    const scoreBoardRef = useRef<ScoreBoardRefProps>(null);
    
    useEffect(() => {
      // reset question number when component mounts
      //console.log("LiveQuiz mounted, resetting question number")
      setQuestionNumber('')
    }, [])
      
    useEffect(() => {
      if (socket) {
        socket.on('live_question', (arg: { quiz_id: string, question_number: string, target_student: string }) => {
          //console.log("live question received...new question number=", arg.question_number) 
          //console.log("... for target student=", arg.target_student, " current student=", user.user_name)
          //console.log("current live question number is", questionNumber === '' ? 'EMPTY' : questionNumber);
          if (questionNumber && questionNumber.length > 0) {
            //console.log("... user not finished with previous question, ignoring new live question");
            return;
          }
          if (arg.target_student.trim() !== 'everybody' && arg.target_student.trim() !== user.user_name) {
            //console.log("... live question not for this student, ignoring");
            return;
          }

          // use fetch to get the question data from the server
          const response = fetch(`${rootpath}/api/quizzes/${arg.quiz_id}/get_question/${arg.question_number}`);
          response.then(res => {
            if (!res.ok) throw new Error("Failed to fetch live question");
            const data = res.json();
            data.then((data) => {
              //console.log("LiveQuiz fetched question data = ", data)
              setQuestion(data.question)
              setQuestionNumber(arg.question_number)
              setShowLivePicture(false)
              setLiveQuizId(arg.quiz_id)
              setShowQuestion(true)
              setQuestionAttemptResponse(null)
            })
            //console.log(" call onLiveQuestionReceived in ScoreBoard from LiveQuiz for question_number=", arg.question_number)
            scoreBoardRef.current?.onLiveQuestionReceived(arg.question_number)
            //console.log("LiveQuiz: emitting live_question_acknowledgement for quiz_id=", arg.quiz_id, "from student", user.user_name)
             socket.emit('live_question_acknowledgement', {quiz_id: arg.quiz_id, 
              question_number: arg.question_number, target_student: user.user_name
              })
          })
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
    }, [socket, user.user_name, user.classId, questionNumber])

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
                  <div>Live quiz: question number: {questionNumber}</div>
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
                    <ScoreBoard classId={user.classId?.toString()} ref={scoreBoardRef} />
                </div>
            </div>
            </div>
        </>
    )
}
//  
