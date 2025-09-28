import { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAxiosFetch } from "../../hooks";
import YoutubeVideoPlayer, { YouTubePlayerRef } from "../shared/YoutubeVideoPlayer";
import { useQuestionAttempt } from "../../hooks/useQuestionAttempt";
import { useQuizAttempt } from "../../hooks/useQuizAttempt";
import { useAppSelector } from "../../redux/store";
//import { ChildRef, DynamicWordInputs } from './question_attempts/DynamicWordInputs';
import { ChildRef, PartialQuizProps, QuestionAttemptAttributes, QuestionProps, QuizAttemptProps, QuizProps } from "./types";
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
import { QueryClient } from '@tanstack/react-query'
import { VideoSegmentProps } from "./types";



export default function TakeVideoQuiz() {
    
    const params = useParams<{ subCagegoryId: string, quizId: string,  }>();
    //console.log("params in TakeQuiz=", params)

   // const [quizAttempt, setQuizAttempt] = useState<QuizAttemptProps | null>(null);
   // const quizAttempt = useRef<QuizAttemptProps | null>(null);
    const user = useAppSelector(state => state.user.value)
    const rootpath = useAppSelector(state => state.rootpath.value)
   // console.log("user in TakeQuiz=", user)

   const youTubeVideoRef  = useRef<YouTubePlayerRef>(null);

        const [fetchQuizEnabled, setFetchQuizEnabled] = useState(true)  // only fetch quiz once
       
        const [question, setQuestion] = useState<QuestionProps | undefined>()
        const [questionAttemptId, setQuestionAttemptId] = useState<string | undefined>()
   
        const [showQuestion, setShowQuestion] = useState(false)
        const [showNextButton, setShowNextButton] = useState(false)
        
        const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false)
        const [questionAttemptResponse, setQuestionAttemptResponse] = useState< QuestionAttemptAttributes>()

        const [endOfQuiz, setEndOfQuiz] = useState(false)
     
        const childRef = useRef<ChildRef>(null);
        

        const queryClient = new QueryClient()

 
        const quizAttempt = useRef<QuizAttemptProps | null>(null);
        //const myQuiz = useRef<PartialQuizProps | undefined>(undefined);

        const [segmentStartTime, setSegmentStartTime] = useState<string>("0:00")
        const [segmentEndTime, setSegmentEndTime] = useState<string>("0:00")

        const [videoSegments, setVideoSegments] = useState<VideoSegmentProps[]>([])

        const currentSegmentNumber = useRef<number>(1)  // starting at segment 1, will be incremented when 
        // the last question of a segment is answered
        const currren_question_number = useRef<number>(1) // current question number WITHIN a segment, starts at 1, 2...

        const numQuestionsTaken = useRef<number>(0) // total number of questions taken so far in the quiz, across all segments

        const {data: quiz} = useQuiz(
            params.quizId ? params.quizId : ""
            , fetchQuizEnabled
        )
        //console.log("quiz data ****** in TakeQuiz=", quiz)
        useEffect(() => {
            if (quiz) {
                
                //console.log("New VIDEO quiz data received:", quiz);
                // video_segments is an array, hence its index starts at 0
                // while currentSegmentNumber starts at 1, so we need to subtract 1
                setSegmentStartTime(quiz.video_segments && quiz.video_segments.length > 0 ? quiz.video_segments[currentSegmentNumber.current-1].start_time : "0:00")
                setSegmentEndTime(quiz.video_segments && quiz.video_segments.length > 0 ? quiz.video_segments[currentSegmentNumber.current-1].end_time : "0:00")

                setFetchQuizEnabled(false) // only fetch quiz once
                setVideoSegments(quiz.video_segments ?? [])
                // use fetch utility to create a new quiz attempt on the server
                const url = `${rootpath}/api/quiz_attempts/create/${quiz.id}/${user.id}`;
               // console.log("fetch quiz attempt directly from TakeVideoQuiz, url=", url)
                fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                }
                )
                .then(data => { 
                    //console.log(" *********** quiz attempt create ", data.quiz_attempt)
                    //setQuizAttempt(data.quiz_attempt)
                    quizAttempt.current = data.quiz_attempt
                    setEndOfQuiz(false) // make sure to reset end of quiz
                    
                }
                )

            }
        }, [quiz])


const get_next_question = async () => {
   
    //console.log(" get_next_question ENTRY,  number of questions taken so far =", numQuestionsTaken.current)
    //console.log("  get_next_question ENTRY, current videoSegment question numbers: ", videoSegments[currentSegmentNumber.current-1].question_numbers)
    const num_questions_in_segment = videoSegments[currentSegmentNumber.current-1].question_numbers.split(",").length
    setShowNextButton(false)
    setShowQuestion(false)
    setQuestionAttemptResponse(undefined)
 
    currren_question_number.current = currren_question_number.current + 1  // increment the question number within a segment
    if (numQuestionsTaken.current === num_questions_in_segment) {
         //console.log("we have reached the end of the current segment")
         numQuestionsTaken.current = 0  // reset the number of questions taken so far within the segment
         // is this the last segment?
            if (currentSegmentNumber.current === videoSegments.length) {
                //console.log("we have reached the end of the quiz")
                // use fetch utility to update quiz_attempt status on the server
                fetch(`${rootpath}/api/quiz_attempts/${quizAttempt.current?.id.toString()}/mark_as_completed`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        completion_status: 'completed'
                    }),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    //console.log("Quiz marked as completed on the server")
                    //return response.json();
                    setEndOfQuiz(true)
                })
            }
            else {
                //console.log("Play the next segment")
                currentSegmentNumber.current = currentSegmentNumber.current + 1
                const segment_start_time = videoSegments && videoSegments.length >= currentSegmentNumber.current ? videoSegments[currentSegmentNumber.current-1].start_time : "0:00"
                const segment_end_time = videoSegments && videoSegments.length >= currentSegmentNumber.current ? videoSegments[currentSegmentNumber.current-1].end_time : "0:00"
                youTubeVideoRef.current?.playSegment(segment_start_time, segment_end_time)
            }
    }
    else {   // we are still within the current segment. Get the next question of the segment
     
        // fetch the next question attempt directly using fetch utility
        fetch(`${rootpath}/api/quiz_attempts/${quizAttempt.current?.id.toString()}/create_video_question_attempt/${quiz?.id?.toString() ?? ""}/${currren_question_number.current}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }
        )
        .then(data => {
            //console.log(" Next questionAttemptData = ", data)
            setQuestion(data.question)
            setQuestionAttemptId(String(data.question_attempt_id))
            setShowNextButton(false)
            setShowSubmitButton(true)
            setShowQuestion(true)
        }
        )

    }
}

const handleVideoSegmentPlayingEnd = useCallback((segmentIndex: number) => {
    //console.log("Video Segment ended, get  question of the segment segment index=", segmentIndex);

    if (!quiz) {
        console.log("quiz is undefined, return")
        return
    }

   //console.log("HEEEEEE quiz attempt = ", quizAttempt)
   // const url = `${rootpath}/api/quiz_attempts/${quiz_attempt_id}/create_video_question_attempt/${quiz_id}/${question_number}`;
   const url = `${rootpath}/api/quiz_attempts/${quizAttempt.current?.id}/create_video_question_attempt/${quiz?.id?.toString() ?? ""}/${currren_question_number.current}`;
   //console.log("fetch next question attempt directly from TakeVideoQuiz, url=", url)
   fetch(url)
   .then(response => {
       if (!response.ok) {
           throw new Error('Network response was not ok');
       }
       return response.json();
   }
   )
   .then(data => {
       //console.log(" &&&)((((((%%%%%% Next questionAttemptData = ", data)
       setQuestion(data.question)
       setQuestionAttemptId(String(data.question_attempt_id))
       setShowNextButton(false)
       setShowSubmitButton(true)
       setShowQuestion(true)
   }
   )
}, [quiz, rootpath]);

    const mutation = useMutation({
        mutationFn: ({  user_answer, score, error_flag }: { user_answer: string, score: string | undefined, error_flag: boolean | undefined  }) =>
          updateQuestionAttempt(questionAttemptId ? String(questionAttemptId) : "", user_answer, score, error_flag),
        onSuccess: (response) => {
            //console.log('✅ Get XXXXXXX question attempt results:', response)
            setShowNextButton(true)
            setShowSubmitButton(false)
            setShowQuestion(false)
            setQuestionAttemptResponse(response)
            numQuestionsTaken.current = numQuestionsTaken.current + 1  // increment total number of questions taken so far in the quiz
          }
      })


   const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
       // console.log("in TakeQuiz..... handleSubmit ")
       
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
        queryClient.invalidateQueries({ queryKey: ['quiz'] })
  
        return (
        <div className='flex flex-col items-center'>
            <div className='bg-red-500 text-white text-lg m-4 rounded-md p-4'>
                <h1>End of Quiz</h1>
            </div>
        </div>
        )
        

    }

    return (
        <div className='flex flex-col items-center bg-green-800'>
        <h2>{numQuestionsTaken.current}</h2>
     
        
        <div><YoutubeVideoPlayer
                ref={youTubeVideoRef}
                video_url={quiz?.video_url || ""} 
               
                parentCallback={handleVideoSegmentPlayingEnd} 

                startTime = {segmentStartTime}
                endTime= {segmentEndTime}
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
                currentSegmentNumber.current = currentSegmentNumber.current + 1
                const segment_start_time = videoSegments && videoSegments.length >= currentSegmentNumber.current ? videoSegments[currentSegmentNumber.current-1].start_time : "0:00"
                const segment_end_time = videoSegments && videoSegments.length >= currentSegmentNumber.current ? videoSegments[currentSegmentNumber.current-1].end_time : "0:00"
                youTubeVideoRef.current?.playSegment(segment_start_time, segment_end_time)
            }
            }>Play Next Segment</button>

        </div>
    )

}