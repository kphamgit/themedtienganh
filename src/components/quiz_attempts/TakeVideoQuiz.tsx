import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAxiosFetch } from "../../hooks";

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
import { VideoSegmentPlayer } from "./VideoSegmentPlayer";
import YoutubeVideoPlayer, { YouTubePlayerRef } from "../shared/YoutubeVideoPlayer";
import {VideoSegmentPlayerRefProps} from "./VideoSegmentPlayer";

interface QuestionStatusProps 
    {
        question_number: number,
        status: 'not_taken' | 'taken'
    }

export default function TakeVideoQuiz() {
    
    const params = useParams<{ subCagegoryId: string, quizId: string,  }>();
    //console.log("params in TakeQuiz=", params)

    const youTubeVideoRef  = useRef<YouTubePlayerRef>(null);

   // const [quizAttempt, setQuizAttempt] = useState<QuizAttemptProps | null>(null);
   // const quizAttempt = useRef<QuizAttemptProps | null>(null);
    const user = useAppSelector(state => state.user.value)
    const rootpath = useAppSelector(state => state.rootpath.value)
   // console.log("user in TakeQuiz=", user)
   //
   // create an array of refs of type VideoSegmentPlayerRefProps, one for each video segment
    const videoSegmentRefs = useRef<React.RefObject<VideoSegmentPlayerRefProps>[]>([]);
    


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


        const [videoSegments, setVideoSegments] = useState<VideoSegmentProps[]>([])

        const [activeSegmentNumber, setActiveSegmentNumber] = useState<number | undefined>()
     
        const {data: quiz} = useQuiz(
            params.quizId ? params.quizId : ""
            , fetchQuizEnabled
        )

        // Dynamically initialize refs based on the number of video segments
        useEffect(() => {
            videoSegmentRefs.current = videoSegments.map(
                (_, index) => videoSegmentRefs.current[index] || React.createRef()
            );
        }, [videoSegments]);

        //console.log("quiz data ****** in TakeQuiz=", quiz)
        useEffect(() => {
            if (quiz) {
                console.log("New VIDEO quiz data received:", quiz);
                setFetchQuizEnabled(false) // only fetch quiz once
                setVideoSegments(quiz.video_segments ?? [])
                const url = `${rootpath}/api/quiz_attempts/create/${quiz.id}/${user.id}`;
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
                    console.log(" *********** quiz attempt created = ", data.quiz_attempt)
                    //setQuizAttempt(data.quiz_attempt)
                    quizAttempt.current = data.quiz_attempt
                    setEndOfQuiz(false) // make sure to reset end of quiz
                    
                }
                )

            }
        }, [quiz])

      

const get_next_question = async () => {
    console.log(" ^^^^^^ get_next_question: active Segment = ", activeSegmentNumber)
    if (activeSegmentNumber === undefined) {
        console.log("currentPlayingSegmentIndex is undefined, setting to 0")
        return
    }

    const videoSegmentRef = videoSegmentRefs.current[activeSegmentNumber];

    if (videoSegmentRef?.current) {
        const nextQuestionNumber = videoSegmentRef.current.getNextQuestionNumber();
        if (nextQuestionNumber === -1) { // all questions in this segment have been taken
            console.log("All questions in this segment have been taken.");
            console.log("Currently active segment is: ", activeSegmentNumber, " let's move on to the next segment if any");
            // check if there are more video segments to play
            if (activeSegmentNumber + 1 < videoSegments.length) {
                const nextSegmentIndex = activeSegmentNumber + 1;
                console.log("There are more video segments to play. Move to segment #", nextSegmentIndex);
                setActiveSegmentNumber(nextSegmentIndex);
                // play the next segment
                const start_time = videoSegments[nextSegmentIndex]?.start_time
                const end_time = videoSegments[nextSegmentIndex]?.end_time
                youTubeVideoRef.current?.playSegment(videoSegments[nextSegmentIndex]?.segment_number, start_time, end_time);
            } else {
                console.log("No more video segments to play. Quiz has ended.");
                setEndOfQuiz(true)
                // quiz has ended
            }
            return
        }
        console.log(`******* get_next_question: Next question number for segment ${activeSegmentNumber} is:`, nextQuestionNumber);
        if (!quiz) {
            console.log("quiz is undefined, return")
            return
        }
    
       const url = `${rootpath}/api/quiz_attempts/${quizAttempt.current?.id}/create_video_question_attempt/${quiz?.id?.toString() ?? ""}/${nextQuestionNumber}`;
       console.log("fetch next question attempt for question number ", nextQuestionNumber ,"url=", url)
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
    } else {
        console.log(`No ref found for segment index ${activeSegmentNumber}`);
    }
}

const handleYoutubePlayingEnds = useCallback((active_segment_number: number) => {
    console.log(" *************** Segment: ", activeSegmentNumber , " playing ended.")
    // get next question number for the current segment
  
    const next_question_number = videoSegmentRefs.current[active_segment_number].current?.getNextQuestionNumber();
    // normally this would be the first question in the segment
    // unless the user has already answered some questions in this segment and rewatched the segment
    // will take care of this later
     
       console.log(" handleYoutubePlayingEnd, next_question_number = ", next_question_number)
   

    if (!quiz) {
        console.log("quiz is undefined, return")
        return
    }

   //const url = `${rootpath}/api/quiz_attempts/${quizAttempt.current?.id}/create_video_question_attempt/${quiz?.id?.toString() ?? ""}/${untaken_question.question_number}`;
   const url = `${rootpath}/api/quiz_attempts/${quizAttempt.current?.id}/create_video_question_attempt/${quiz?.id?.toString() ?? ""}/${next_question_number}`;
   console.log("fetch next question attempt directly from TakeVideoQuiz, url=", url)
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
   
},[rootpath, quiz, quizAttempt]);
//}, [quiz, rootpath]);

    const mutation = useMutation({
        mutationFn: ({  user_answer, score, error_flag }: { user_answer: string, score: string | undefined, error_flag: boolean | undefined  }) =>
          updateQuestionAttempt(questionAttemptId ? String(questionAttemptId) : "", user_answer, score, error_flag),
        onSuccess: (response) => {
            //console.log('✅ Get XXXXXXX question attempt results:', response)
            setShowNextButton(true)
            setShowSubmitButton(false)
            setShowQuestion(false)

            const currentVideoSegmentRef = videoSegmentRefs.current[activeSegmentNumber ?? 0];
            currentVideoSegmentRef.current?.updateQuestionsTakenStatus(question?.question_number ?? 0, 'taken');

            //setQuestionAttemptResponse(response)
            // update currentSegmentQuestionStatus
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

           const playSegment = (segment_number: number) => {
                console.log("playSegment called, segment index = ", segment_number)
                const start_time = videoSegments[segment_number]?.start_time
                const end_time = videoSegments[segment_number]?.end_time
                setActiveSegmentNumber(segment_number)
                youTubeVideoRef.current?.playSegment(segment_number, start_time, end_time);
           }

  

    return (
        <div className='flex flex-col items-center bg-green-800'>
          
         
            <h1>Current Playing Segment: {activeSegmentNumber}</h1>
               
        
            <div><YoutubeVideoPlayer
                ref={youTubeVideoRef}
                video_url={quiz?.video_url || ""} 
                parent_playingEnds={handleYoutubePlayingEnds}
                />
                { videoSegments.length > 0 && 
                    videoSegments.map((segment, index) => (
                        <div key={segment.id} className={`m-2 p-2 border ${index === activeSegmentNumber ? 'bg-yellow-300' : 'bg-bgColor2 text-textColor2'}`}>
                            <VideoSegmentPlayer 
                                ref={videoSegmentRefs.current[index]} // Assign the ref
                                segment={segment} 
                                parent_playSegment={playSegment}
                            />
                        </div>
                    ))
                }
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
          
        

        </div>
    )

}