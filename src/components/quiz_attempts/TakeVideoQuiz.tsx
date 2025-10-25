import React, { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

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
import { processQuestion, ProcessQuestionResultsProps } from "../live/processQuestion";
import { updateQuestionAttempt } from "../api/updateQuestionAttempt";
import { useMutation } from "@tanstack/react-query";
import { useQuiz } from "../../hooks/useQuiz";
import { QueryClient } from '@tanstack/react-query'
import YoutubeVideoPlayer, { YouTubePlayerRef } from "../shared/YoutubeVideoPlayer";
import { VideoSegmentPlayerRefProps } from "./VideoSegmentPlayer";
import { VideoSegmentPlayer } from "./VideoSegmentPlayer";

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

        const [processQuestionResults, setProcessQuestionResults] = useState<ProcessQuestionResultsProps | undefined>(undefined)

        const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | undefined>(0) // index in the videoSegments array, starts from 0
             
        const {data: quiz} = useQuiz(
            params.quizId ? params.quizId : ""
            , fetchQuizEnabled
        )
        
 useEffect(() => {
            if (quiz) {
                //console.log("New VIDEO quiz data received:", quiz);
                setFetchQuizEnabled(false) // only fetch quiz once
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
                    //console.log(" *********** quiz attempt created = ", data.quiz_attempt)
                    //setQuizAttempt(data.quiz_attempt)
                    quizAttempt.current = data.quiz_attempt
                    setEndOfQuiz(false) // make sure to reset end of quiz
                    
                }
                )

            }
        }, [quiz])

        // Dynamically initialize refs based on the number of video segments
        videoSegmentRefs.current = useMemo(() => {
            if (!quiz || !quiz.video_segments) {
                return [];
            }
            return quiz.video_segments.map(() => React.createRef<VideoSegmentPlayerRefProps>());
        }, [quiz]);

/*
       console.log(
                "TakeVideoQuiz: Initializing videoSegmentRefs for quiz id:",
                quiz.id,
                " with ",
                quiz.video_segments.length,
                " segments."
            );
*/

const handleYoutubePlayingEnds = useCallback(() => {
    //console.log("handleYoutubePlayingEnds: active_segment_number sent from YoutubeVideoPlayer = ", active_segment_number)
    //console.log("handleYoutubePlayingEnds: activeSegmentNumber in TakeVideoQuiz = ", activeSegmentNumber)
    //console.log(" *************** Segment: ", activeSegmentNumber , " playing ended.")
    // get next question number for the current segment
    // normally this would be the first question in the segment
    // but here we get the first question (within the questions of the active segment in case
    // the user has already answered some questions in this segment and rewatched the segment
    const show_question = () => {
        //console.log(" show_question called ,current activeSegmentIndex = ", activeSegmentIndex)
        const next_question_number = activeSegmentIndex !== undefined 
        ? videoSegmentRefs.current[activeSegmentIndex]?.current?.getNextQuestionNumber() 
        : undefined;
     
    if (next_question_number === undefined) {
       console.log("next_question_number is undefined, return")
       return
    }
      
    //console.log(" handleYoutubePlayingEnds ***** next_question_number = ", next_question_number)

    if (!quiz) {
        console.log("quiz is undefined, return")
        return
    }

   const url = `${rootpath}/api/quiz_attempts/${quizAttempt.current?.id}/create_video_question_attempt/${quiz?.id?.toString() ?? ""}/${next_question_number}`;
   //console.log(" handleYoutubePlayingEnds ***** fetch next question attempt directly from TakeVideoQuiz, url=", url)
   fetch(url)
   .then(response => {
       if (!response.ok) {
           throw new Error('Network response was not ok');
       }
       return response.json();
   }
   )
   .then(data => {
       //console.log(" handleYoutubePlayingEnds ***** questionAttemptData fetched = ", data)
       setQuestion(data.question)
       setQuestionAttemptId(String(data.question_attempt_id))
       setShowNextButton(false)
       setShowSubmitButton(true)
       setShowQuestion(true)
       // enable the play button for the current segment (which was disabled in VideoSegmentPlayer.tsx
       // when the segment started playing)
         videoSegmentRefs.current[activeSegmentIndex ?? 0]?.current?.enablePlayButton();
     
   }
   )
    }
    //show_question()
    setTimeout(() => {
        show_question()
    }
    , 500); // show question after 1 second
   
//}
},[rootpath, quiz, quizAttempt, activeSegmentIndex,]);

    const mutation = useMutation({
        mutationFn: ({  user_answer, score, error_flag }: { user_answer: string, score: string | undefined, error_flag: boolean | undefined  }) =>
          updateQuestionAttempt(questionAttemptId ? String(questionAttemptId) : "", user_answer, score, error_flag),
        onSuccess: (response) => {
            
            setShowNextButton(true)
            setShowSubmitButton(false)
            setShowQuestion(false)
           
            const currentVideoSegmentRef = videoSegmentRefs.current[activeSegmentIndex ?? 0];
            //console.log("TakeVideoQuiz: mutation onSuccess, activeSegmentNumber = ", activeSegmentIndex)
            //console.log("Mutation successful, current questionsTakenStatus for this segment: ", currentVideoSegmentRef?.current?.getQuestionsTakenStatus());
            currentVideoSegmentRef.current?.updateQuestionsTakenStatus(question?.question_number ?? 0, 'taken');

            setQuestionAttemptResponse(response)
           
        }
      })

      const get_next_question = async () => {
        // console.log(" ^^^^^^ get_next_question: active Segment = ", activeSegmentNumber)
         setQuestionAttemptResponse(undefined) // reset previous question attempt response
         if (activeSegmentIndex === undefined) {
             console.log("currentPlayingSegmentIndex is undefined, setting to 0")
             return
         }
     
         const activeVideoSegmentRef = videoSegmentRefs.current[activeSegmentIndex];
     
         if (activeVideoSegmentRef?.current) {
             const nextQuestionNumber = activeVideoSegmentRef.current.getNextQuestionNumber();
             if (nextQuestionNumber === -1) { // all questions in this segment have been taken
                 //console.log("All questions in this segment have been taken.");
                 //console.log("Currently active segment is: ", activeSegmentNumber, " let's move on to the next segment if any");
                 // check if there are more video segments to play
                 if (activeSegmentIndex + 1 < (quiz?.video_segments?.length ?? 0)) {
                     const nextSegmentIndex = activeSegmentIndex + 1;  // index starting at 0
                     //console.log("There are more video segments to play. Move to segment #", nextSegmentIndex);
                     setActiveSegmentIndex(nextSegmentIndex);
                     
                     // play the next segment
                     //const start_time = videoSegments[nextSegmentNumber]?.start_time
                     //const end_time = videoSegments[nextSegmentNumber]?.end_time
                     // disable next question
                     setShowNextButton(false)
                     videoSegmentRefs.current[nextSegmentIndex]?.current?.playSegment();
                     //youTubeVideoRef.current?.playSegment(start_time, end_time);
                 } else {
                     //console.log("No more video segments to play. Quiz has ended.");
                     setEndOfQuiz(true)
                     // set quiz attempt to completed on the server
                     //mark_as_completed
                     const url = `${rootpath}/api/quiz_attempts/${quizAttempt.current?.id}/mark_as_completed`;
                     fetch(url, {
                         method: 'PUT',
                         headers: {  
                             'Content-Type': 'application/json',
                         },
                     })
                     .then(response => {
                         if (!response.ok) { 
                         }
                         return response.json();
                     })
     
                     // quiz has ended
                 }
                 return
             }
             //console.log(`******* get_next_question: Next question number for segment ${activeSegmentNumber} is:`, nextQuestionNumber);
             if (!quiz) {
                 console.log("quiz is undefined, return")
                 return
             }
         
            const url = `${rootpath}/api/quiz_attempts/${quizAttempt.current?.id}/create_video_question_attempt/${quiz?.id?.toString() ?? ""}/${nextQuestionNumber}`;
            //console.log("fetch next question attempt for question number ", nextQuestionNumber ,"url=", url)
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
             console.log(`No ref found for segment index ${activeSegmentIndex}`);
         }
     }

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
                setProcessQuestionResults(result)
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

    const displayQuestion = () => {
            if (question?.format === 1) {  //word scramble
                return (
                    <div>
                     <DynamicWordInputs content={question.content} ref={childRef} />
                    </div>
                )
            }
            if (question?.format === 2) {  //button cloze
                return (
                    <div>
                     <ButtonSelectCloze content={question.content} choices={question.button_cloze_options}  ref={childRef} />
                    </div>
                )
            }
            if (question?.format === 3) {  //button select
                return (
                    <div>
                     <ButtonSelect content={question.content} ref={childRef} />
                    </div>
                )   
            }
            if (question?.format === 4) {  //radio
                return (
                    <div>
                     <RadioQuestion content={question.content} ref={childRef} />
                    </div>
                )   
            }
            if (question?.format === 5) {  //checkbox
                return (
                    <div>
                     <CheckboxQuestion content={question.content} ref={childRef} />
                    </div>
                )   
            }
            if (question?.format === 6) {  //drag and drop
                return (
                    <div>
                     <DragDrop content={question.content} ref={childRef} />
                    </div>
                )   
            }
            if (question?.format === 7) {  //speech recognition continuous
                return (
                    <div>
                     <SRContinuous content={question.content} ref={childRef} />
                    </div>
                )   
            }
            if (question?.format === 8) {  //words select
                return (
                    <div>
                     <WordsSelect content={question.content} ref={childRef} />
                    </div>
                )   
            }
            if (question?.format === 10) {  //dropdown
                return (
                    <div>
                     <DropDowns content={question.content} ref={childRef} />
                    </div>
                )   
            }
            if (question?.format === 11) {  //dynamic letter inputs
                return (
                    <div>
                     <DynamicLetterInputs content={question.content} ref={childRef} />
                    </div>
                )   
            }
            return (<div>UNKNOW question format</div>)
        }
  
    return (
        <div className='flex flex-row items-center bg-gray-100 mx-16'> 
        <div className='flex flex-col  bg-gray-200'>
            <h1>Current Playing Segment: {activeSegmentIndex}</h1>
            <div>
                <YoutubeVideoPlayer
                ref={youTubeVideoRef}
                video_url={quiz?.video_url || ""} 
                parent_playingEnds={handleYoutubePlayingEnds}
                /> 
      
            </div>
            <div>
    {quiz && quiz?.video_segments && quiz?.video_segments.length > 0 && videoSegmentRefs.current &&
        quiz.video_segments.map((segment, index) => {
          
            return (
                <VideoSegmentPlayer
                    youtubePlayerRef={youTubeVideoRef}
                    key={index}
                    ref={videoSegmentRefs.current[index]} // Assign the ref
                    segment={segment}
                    isActive={index === activeSegmentIndex}
                    parent_setShowQuestion={setShowQuestion}
                />
            );
        })
    }
</div>
           
           
        {showQuestion &&
                <div className='flex flex-col items-center bg-gray-300'>
                    <div className='flex flex-row justify-start items-center  mx-10 bg-cyan-200 px-20 py-1  rounded-md'>
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
                    <div className='bg-cyan-200 flex flex-col rounded-md justify-center'>
                    {displayQuestion()}
                    </div>
                </div>
            }

            <div className='flex flex-col items-center justify-center m-4'>
            {showNextButton &&
                    <button className='bg-red-500 p-2 mt-2 rounded-md' onClick={() => {
                        get_next_question()
                    }}>Next</button>
                }
                {showQuestion &&
                    <button className='m-4 bg-amber-500 p-2 rounded-md' 
                  
                    disabled={false} 
                    onClick={(e) => handleSubmit(e)}>Submit</button>
                }
            </div>
        </div>
        <div className='w-1/4'>
                { questionAttemptResponse && processQuestionResults &&
                <div className='flex flex-col justify-center items-center'><QuestionAttemptResults
                    live_flag={false}
                    question={question}
                    response={processQuestionResults} />
                    </div>
                }
            </div>
        </div>
    )

}

/*
   <div className='w-1/4'>
                { questionAttemptResponse &&
                <div className='flex flex-col justify-center items-center'><QuestionAttemptResults
                    live_flag={false}
                    question={question}
                    response={questionAttemptResponse} />
                    </div>
                }
            </div>
        </div>
*/

/*
  :
                questionAttemptResponse &&
                <div className='flex flex-col justify-center items-center'><QuestionAttemptResults
                    live_flag={false}
                    question={question}
                    response={questionAttemptResponse} />
                    </div>
*/
