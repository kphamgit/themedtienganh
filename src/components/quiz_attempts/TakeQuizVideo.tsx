import { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAxiosFetch } from "../../hooks";
import YoutubeVideoPlayer, { YouTubePlayerRef } from "../shared/YoutubeVideoPlayer";
import { useQuestionAttempt } from "../../hooks/useQuestionAttempt";
import { useQuizAttempt } from "../../hooks/useQuizAttempt";
import { useAppSelector } from "../../redux/store";
//import { ChildRef, DynamicWordInputs } from './question_attempts/DynamicWordInputs';
import { ChildRef, QuestionAttemptAttributes, QuestionProps, QuizAttemptProps } from "./types";
import { AzureAudioPlayer } from "../shared/AzureAudioPlayer";
import { DynamicWordInputs } from "./question_attempts/DynamicWordInputs";
import { ButtonSelectCloze } from "./question_attempts/ButtonSelecCloze";
import { ButtonSelect } from "./question_attempts/ButtonSelect";
import { RadioQuestion } from "./question_attempts/RadioQuestion";
import { CheckboxQuestion } from "./question_attempts/CheckboxQuestion";
import DragDrop from "./question_attempts/dragdrop/DragDrop";
import { SRContinuous } from "./question_attempts/SRContinuous";
import { WordsSelect } from "./question_attempts/WordsSelect";
import { DropDowns } from "./question_attempts/DropDowns";
import { DynamicLetterInputs } from "./question_attempts/DynamicLetterInputs";
import { QuestionAttemptResults } from "./QuestionAttemptResults";
import { processQuestion } from "../live/processQuestion";
import { updateQuestionAttempt } from "../api/updateQuestionAttempt";
import { useMutation } from "@tanstack/react-query";
import { useQuiz } from "../../hooks/useQuiz";
import { QueryClient , QueryClientProvider} from '@tanstack/react-query'
import { VideoSegmentProps } from "./types";


export default function TakeQuizVideo() {
    
    const params = useParams<{ sub_category_name: string, quizId: string,  }>();
    //console.log("params in TakeQuiz=", params)

   // const [quizAttempt, setQuizAttempt] = useState<QuizAttemptProps | null>(null);
   // const quizAttempt = useRef<QuizAttemptProps | null>(null);
    const user = useAppSelector(state => state.user.value)
    const rootpath = useAppSelector(state => state.rootpath.value)
   // console.log("user in TakeQuiz=", user)

   const youTubeVideoRef  = useRef<YouTubePlayerRef>(null);

        const [nextQuestionEnabled, setNextQuestionEnabled] = useState(false)

        const [fetchQuizEnabled, setFetchQuizEnabled] = useState(true)  // only fetch quiz once
        const [fetchQuizAttemptEnabled, setFetchQuizAttemptEnabled] = useState(true)  // only fetch quiz attempt once
        const [question, setQuestion] = useState<QuestionProps | undefined>()
        const [questionAttemptId, setQuestionAttemptId] = useState<string | undefined>()
   
        const [showQuestion, setShowQuestion] = useState(false)
        const [showNextButton, setShowNextButton] = useState(false)
        const [showYoutubeVideo, setShowYoutubeVideo] = useState(false)
        const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false)
        const [questionAttemptResponse, setQuestionAttemptResponse] = useState< QuestionAttemptAttributes>()

        const [endOfQuiz, setEndOfQuiz] = useState(false)
     
        const childRef = useRef<ChildRef>(null);
        const [submitDisabled, setSubmitDisabled] = useState(false)

        const queryClient = new QueryClient()

       
        const [videoSegments, setVideoSegments] = useState<VideoSegmentProps[]>([])
        const videoSegmentIndex = useRef<number>(0)

        const {data: quiz} = useQuiz(
            params.quizId ? params.quizId : ""
            , fetchQuizEnabled
        )
        //console.log("quiz data ****** in TakeQuiz=", quiz)
        useEffect(() => {
            if (quiz) {
                console.log("New quiz data received:", quiz);
                setFetchQuizEnabled(false) // only fetch quiz once
                setVideoSegments(quiz.video_segments ?? [])
            }
        }, [quiz])

    // use fetch uility to get quiz attempt
    const { data: quizAttempt } = useQuizAttempt(
        quiz?.id?.toString() ?? "",
        quiz?.video_url ?? null,
        user?.id?.toString() ?? "",
        fetchQuizAttemptEnabled
    );

    useEffect(() => {
        if (quizAttempt) {
            console.log("New quiz attempt data received:", quizAttempt);
            
            setFetchQuizAttemptEnabled(false) // only fetch quiz attempt once
            setEndOfQuiz(false) // make sure to reset end of quiz
            setShowYoutubeVideo(quiz?.video_url && quiz.video_url.trim().length > 0 ? true : false)
            //get_next_question()
        }
    }
    , [quizAttempt]);
      //console.log("RIVHT HERE quiz_attempt=", quizAttempt);

      const { data: questionAttemptData } = useQuestionAttempt(
        quizAttempt?.quiz_attempt.id.toString()!,
        nextQuestionEnabled)

   

    //use javascript fetch quiz data from backend API
    //console.log("IN TAKE QUIZ, quiz id=", params.quizId)

    /*
 Yes, **line 132 will be executed again** on every re-render of the `TakeQuiz` component.
- This is because React re-evaluates the entire function body, including the JSX, during each render.
- To avoid unnecessary executions, you can use `useMemo` or `useEffect` to control when specific code runs.
    */
   //const { data: quiz } = useAxiosFetch<VideoQuizData>({ url: `/quizzes/${params.quizId}`, method: 'get' });
    //onsole.log("quiz data=", quiz);

    useEffect(() => {
        if (questionAttemptData) {
            console.log("*********88888888 QuizPageVideo questionAttemptData = ", questionAttemptData)
            if (questionAttemptData.end_of_quiz) {
                console.log(" END OF QUIX")
                setEndOfQuiz(true)
            }
            else {
                console.log(" NOT END OF QUIZ question = ", questionAttemptData.question)
                setQuestion(questionAttemptData.question)
                setQuestionAttemptId(String(questionAttemptData.question_attempt_id))
                setNextQuestionEnabled(false)   // disable the useQuestionAttempt hook
                setShowNextButton(false)
                setShowSubmitButton(true)
                // if this quiz is not a video quiz, show question right away
                //if (!quiz?.video_url || quiz?.video_url.trim().length === 0) {
                setShowQuestion(true)
               // }
               // else {
                    // show youtube video first, then show question when video segment ends
              //      setShowQuestion(false)
              //      setShowYoutubeVideo(true)

              //  }
                //setShowQuestion(true)
            }
        }
   }, [questionAttemptData])
   
   const enableSubmmitButton = () => {
    setSubmitDisabled( false  )
}
const get_next_question = async () => {
    console.log("get_next_question ")
    setShowNextButton(false)
    setShowQuestion(false)
    setQuestionAttemptResponse(undefined)
    console.log("get_next_question setNextQuestionEnabled to true ")
    setNextQuestionEnabled(true)  // trigger the useQuestionAttempt hook to get the next question
}

    // question id: 6085
    /*
    const handleVideoSegmentPlayingEnd = (segmentIndex: number) => {
        console.log("Video Segment ended, get first question of the segment segment index=", segmentIndex);
       // setNextQuestionEnabled(true);
        //setShowQuestion(true)
        // You can add logic here to navigate to the next segment or display quiz questions
    };
   */
   

const handleVideoSegmentPlayingEnd = useCallback((segmentIndex: number) => {
    console.log("Video Segment ended, get  question of the segment segment index=", segmentIndex);
  // Add your logic here, e.g., fetching the next question or navigating to the next segment
   setNextQuestionEnabled(true);
}, []);

    const mutation = useMutation({
        mutationFn: ({  user_answer, score, error_flag }: { user_answer: string, score: string | undefined, error_flag: boolean | undefined  }) =>
          updateQuestionAttempt(questionAttemptId ? String(questionAttemptId) : "", user_answer, score, error_flag),
        onSuccess: (response) => {
            //console.log('✅ Get XXXXXXX question attempt results:', response)
            setShowNextButton(true)
            setShowSubmitButton(false)
            setShowQuestion(false)
            setQuestionAttemptResponse(response)
            //props.set_question_attempt_result(data)   
            
          }
      })


   const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
        console.log("in TakeQuiz..... handleSubmit ")
        const button_el = event.target as HTMLButtonElement    
        //button_el.disabled = true
        const the_answer = childRef.current?.getAnswer()
        //console.log("handleSubmit the_answer = ", the_answer)
        if ((the_answer!.trim()).length > 0) {
            const result = processQuestion(question?.format?.toString() ?? "", question?.answer_key ?? "", the_answer ?? "")
              //console.log("handleSubmit result = ", result)
            if (result) { // update the question attempt on the server
                mutation.mutate({  // next question button will be enabled in onSuccess callback from mutation
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
    

    if (endOfQuiz) {
        // reset react query cache for quiz attempt and question attempt
        // using queryClient from react-query
        //queryClient.removeQueries({ queryKey: ['quiz_attempt'] })
        //queryClient.removeQueries({ queryKey: ['question_attempt'] })
        //queryClient.invalidateQueries({ queryKey: ['quiz'] })
        console.log("END OF QUIZ - setShowYoutubeVideo to false")
        youTubeVideoRef.current?.playVideo()
        /*
        return (
        <div className='flex flex-col items-center'>
            <div className='bg-red-500 text-white text-lg m-4 rounded-md p-4'>
                <h1>End of Quiz</h1>
            </div>
        </div>
        )
        */

        /*

        */

    }

    return (
        <div className='flex flex-col items-center bg-green-800'>
        <h2>{endOfQuiz}</h2>
        <div>
            {videoSegments.length > 0 &&
                <div className='text-white m-2'>Video Segments length: {videoSegments.length} Current Segment index: {videoSegmentIndex.current}
                <div>{videoSegments[videoSegmentIndex.current].start_time}</div>
                 </div>
            }
        </div>
        
        <div><YoutubeVideoPlayer
                ref={youTubeVideoRef}
                video_url={quiz?.video_url || ""} 
               
                parentCallback={handleVideoSegmentPlayingEnd} 

                startTime= {videoSegments  &&
                    videoSegments[videoSegmentIndex.current]?.start_time}
                endTime= {videoSegments  &&
                    videoSegments[videoSegmentIndex.current]?.end_time}
                />
                
            </div>
     
        {showQuestion ?
                <div className='flex flex-col items-center bg-red-600'>

                    <div className='flex flex-row justify-start items-center w-full mx-10 bg-cyan-200 px-20 py-1  rounded-md'>
                    <div className='mb-2'>Question: {question?.question_number}</div>
                    </div>
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
                    <div className='bg-cyan-200 flex flex-colrounded-md justify-center'>
                        {question?.format === 1 ? (
                            <DynamicWordInputs content={question.content} ref={childRef} />
                        ) : question?.format === 2 ? (
                            <ButtonSelectCloze 
                            content={question.content} 
                            choices={question.button_cloze_options} 
                            parentFuncEnableSubmitButton={(enableSubmmitButton)}
                            ref={childRef} />
                        ) : question?.format === 3 ? (
                            <ButtonSelect content={question.content} ref={childRef} />
                        ) : question?.format === 4 ? (
                            <RadioQuestion content={question.content} ref={childRef} />
                        ) : question?.format === 5 ? (
                            <CheckboxQuestion content={question.content} ref={childRef} />
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
                    response={questionAttemptResponse} />
                    </div>
            }


            <div className='flex flex-col items-center justify-center m-4'>
                {showNextButton &&
                    <button className='bg-green-500 p-2 mt-2 rounded-md' onClick={() => {
                        get_next_question()
                    }}>Next</button>
                }
                {showSubmitButton &&
                    <button className='m-4 bg-amber-500 p-2 rounded-md' 
                  
                    disabled={false} 
                    onClick={(e) => handleSubmit(e)}>Submit</button>
                }
            </div>
            <button className='m-4 bg-red-500 p-2 rounded-md' onClick={() => {
                youTubeVideoRef.current?.playVideo()
            }
            }>Replay Video</button>

        </div>
    )

}