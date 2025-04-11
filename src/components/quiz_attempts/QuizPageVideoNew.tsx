import { useEffect, useRef, useState } from 'react'
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
import { createQuestionAttempt, processQuestionAttempt } from './question_attempts/services/list';
import { Counter, CounterRef } from '../shared/Counter';
import { useAxiosFetch } from '../../hooks';

//import Popup from 'reactjs-popup';
import ModalPopup from '../shared/ModalPopup';
//import DragAndDropList from './question_attempts/DragAndDropList';
import DragDrop from './question_attempts/dragdrop/DragDrop';

import { useQuizAttempt } from '../../hooks/useQuizAttempt';
import { useQuestionAttempt } from '../../hooks/useQuestionAttempt';

import { QuestionAttemptProps } from './types';
import { useLiveQuestion } from '../../hooks/useLiveQuestion';
import { useQuestion } from '../../hooks/useQuestion';
import { useQuestionAttemptResults } from '../../hooks/useQuestionAttemptResults';

import { processLiveQuestion } from '../live/processLiveQuestion';

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

export default function QuizPageVideoNew(props:any) {
    
    const params = useParams<{ sub_category_name: string, quizId: string,  }>();
    //const user = useAppSelector(state => state.user.value)
    const user = useAppSelector(state => state.user.value)
    //console.log("QuizPageVideo wwwww user = ", user)

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
    const videoParams:VideoProps = useLocation().state
   
    const playerRef = useRef<ReactPlayer>(null);

    const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false)

    const [question, setQuestion] = useState<QuestionProps | undefined>()
    const [questionId, setQuestionId] = useState<string | undefined>()
    const [showQuestion, setShowQuestion] = useState(false)
    //const [showQuestionAttemptResults, setShowQuestionAttemptResults] = useState(false)
    const [showNextButton, setShowNextButton] = useState(false)
    const [questionAttemptResponse, setQuestionAttemptResponse] = useState< QuestionAttemptAttributes>()
    const [endOfQuiz, setEndOfQuiz] = useState(false)
    const childRef = useRef<ChildRef>(null);

    const counterRef = useRef<CounterRef>(null)

    const [answer, setAnswer] = useState<string>()

    const [playing, setPlaying] = useState(false);

    const [quizAttemptId, setQuizAttemptId] = useState<string | undefined>(undefined)
    
   // const videoParams:VideoProps = location.state

   const [nextQuestionEnabled, setNextQuestionEnabled] = useState(false)
   const [testCount, setTestCount] = useState(1)
   const [ processAttemptEnabled, setProcessAttemptEnabled] = useState(false)
   
   const { data } = useQuizAttempt(params.quizId!, user?.id?.toString() ?? "")

   console.log("QuizPageVideo xxx  data quiz attempt = ", data)

   const {data: my_question} = useLiveQuestion(data?.quiz_attempt.quizId.toString(), data?.question_attempt?.question_number!.toString())

    console.log("QuizPageVideo my_question = ", my_question)

    useEffect(() => {
        if (my_question) {
            setQuestion(my_question.question)
        }
    }, [my_question])

    const {data: next} = useQuestion("47", testCount.toString(), nextQuestionEnabled)

    useEffect(() => {
        if (next) {
            console.log("QuizPageVideo next question = ", next)
            setQuestion(next.question)
        }
    }, [next])
    
    const get_next_question = async () => {
        setTestCount(testCount + 1)
        setNextQuestionEnabled(true)
    }

    const clear_question = async () => {
        setQuestion(undefined)
        
    }
    const process_question = async () => {
        //console.log("HEEERE process_question")
        //setProcessAttemptEnabled(true)
        const result = processLiveQuestion(question?.format.toString(), question?.answer_key, "my_ansser")
        console.log("QuizPageVideo process_question result = ", result)
        /*
{
    "user_answer": "my_ansser",
    "answer_key": "",
    "score": 0,
    "error_flag": true
}
        */
    }
    
    const {data: question_attempt_results} = useQuestionAttemptResults(data?.quiz_attempt.id?.toString() ?? "", "my answer", processAttemptEnabled)
    
    useEffect(() => {
        if (question_attempt_results) {
            //setQuestionAttemptResponse(question_attempt_results)
            console.log("QuizPageVideo question_attempt_results = ", question_attempt_results)
            //setProcessAttemptEnabled(false)
        }
    }, [question_attempt_results])
    //console.log("QuizPageVideo question_attempt_response = ", questionAttemptResponse)

  // const quiz_attempt_id = data?.quiz_attempt.id

   //const {data: question_attempt} = useQuestionAttempt(quiz_attempt_id!.toString())
 
   //console.log("QuizPageVideo question_attempt = ", question_attempt)

   /*
{
    "id": 2513,
    "completion_status": "uncompleted",
    "score": 0,
    "userId": 15,
    "questions_exhausted": false,
    "errorneous_questions": "",
    "quizId": 77,
    "createdAt": "2025-03-31T22:35:48.000Z",
    "updatedAt": "2025-03-31T22:35:48.000Z",
    "question_attempts": [
        {
            "id": 32421,
            "answer": null,
            "score": 0,
            "question_number": 1,
            "questionId": 1339,
            "error_flag": false,
            "audio_src": "",
            "completed": false,
            "quizAttemptId": 2513
        }
    ]
}
   */


    return (
        <>
       { data && 
         <>
         { question && 
             <div>question id {question?.content} </div>
         }
        <div>
         <button onClick={() => {
            get_next_question()
         }}>Get Next Question</button>
        </div>
        <div>
        <button onClick={() => {
            clear_question()
         }}>Clear Question</button>
        </div>
        <div>
        <button onClick={() => {
            process_question()
         }}>Process Question</button>
        </div>
        </>
        }

        </>
    )

}

/*
   <QuestionAttemptResults live_flag={false} question_id= {questionId} response={questionAttemptResponse }  />

          ) : question.format === 6 ? (
            <WordScrambler content={question.content} ref={childRef} />
*/