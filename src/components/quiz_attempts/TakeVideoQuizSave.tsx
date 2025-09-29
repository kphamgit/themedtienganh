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

interface QuestionStatusProps 
    {
        question_number: number,
        status: 'not_taken' | 'taken'
    }

export default function TakeVideoQuizSave() {
    
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


        const [videoSegments, setVideoSegments] = useState<VideoSegmentProps[]>([])

        const currentSegmentIndex = useRef<number>(0)
        //const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0) // starting at segment 0, will be incremented when 
        const [currentSegmentQuestionNumbers, setCurrentSegmentQuestionNumbers] = useState<number[]>([])
        const [currentSegmentQuestionStatus, setCurrentSegmentQuestionStatus] = useState<QuestionStatusProps[]>([])

        //const numQuestionsTaken = useRef<number>(0) // total number of questions taken so far in the quiz, across all segments

        const {data: quiz} = useQuiz(
            params.quizId ? params.quizId : ""
            , fetchQuizEnabled
        )
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

        useEffect(() => {
            //console.log(" q nums for current segment", output_array[currentSegmentIndex]);
            // create a map between input_array and output_array
            const question_numbers_str = videoSegments[currentSegmentIndex.current]?.question_numbers
            if (question_numbers_str && question_numbers_str.trim().length > 0) {
                const question_numbers = question_numbers_str.split(",").map(numStr => parseInt(numStr.trim(), 10));
                console.log(" question_numbers for current video segment = ", question_numbers)
               
                const current_segment_question_status: QuestionStatusProps[] = []

                question_numbers.forEach((qnum, index) => {
                    console.log(`Question number ${index + 1}: ${qnum}`);
                    current_segment_question_status.push({ question_number: qnum, status: 'not_taken' })
                });
                setCurrentSegmentQuestionNumbers(question_numbers)
                setCurrentSegmentQuestionStatus(current_segment_question_status)
             
                // fetch the first question of the segment
            }
        }, [videoSegments, currentSegmentIndex])

const get_next_question = async () => {
    // search array currentSegmentQuestionStatus for the next untaken question
    const next_question_in_segment = currentSegmentQuestionStatus.find(qs => qs.status === 'not_taken')
    if (!next_question_in_segment) {
        console.log("get_next_question, All questions in the current segment have been taken ---->>>>>")
        // clear currentSegmentQuestionStatus
        //setCurrentSegmentQuestionStatus([])
        // play the next video segment if there is one
        console.log("XXXXX YYYYYYYY currentSegmentIndex.current = ", currentSegmentIndex.current)
        console.log(" videoSegments.length = ", videoSegments.length)


        if (currentSegmentIndex.current + 1 < videoSegments.length) {
            console.log("We have finished all questions of the current segment. Play the next video segment")
            //setCurrentSegmentIndex(currentSegmentIndex + 1)
            currentSegmentIndex.current = currentSegmentIndex.current + 1
            setShowNextButton(false) // hide next button if we have reached the end of the segment
            setShowQuestion(false)
            setQuestion(undefined)
            //youTubeVideoRef.current?.playSegment(currentSegmentIndex.current)
            return
        }
        else {
            console.log("We have finished all video segments. End of quiz")
            setEndOfQuiz(true)
            return
        }
    }
    setShowNextButton(false)
    setShowQuestion(false)
    setQuestionAttemptResponse(undefined)
 
     // fetch the next question attempt directly using fetch utility
     fetch(`${rootpath}/api/quiz_attempts/${quizAttempt.current?.id.toString()}/create_video_question_attempt/${quiz?.id?.toString() ?? ""}/${next_question_in_segment.question_number}`)
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

const handleVideoSegmentPlayingEnd = useCallback(() => {
    //console.log(" End segment playing. Current segment index = ", currentSegmentIndex)
  
    // print out the question status for the current segment
    console.log("handleVideoSegmentPlayingEnd Question status for the current segment: ", currentSegmentQuestionStatus)
    // search for the first untaken question in the current segment
    const untaken_question = currentSegmentQuestionStatus.find(qs => qs.status === 'not_taken')
    if (!untaken_question) {
        console.log("handleVideoSegmentPlayingEnd, All questions in the current segment have been taken")
        // play the next video segment if there is one
        return;
    }
    
    const first_question_in_segment = currentSegmentQuestionNumbers[0];   // play the first question of the current segment

    if (!quiz) {
        console.log("quiz is undefined, return")
        return
    }

    console.log("HEEEEEE quiz attempt = ", quizAttempt)
   // const url = `${rootpath}/api/quiz_attempts/${quiz_attempt_id}/create_video_question_attempt/${quiz_id}/${question_number}`;
   //const url = `${rootpath}/api/quiz_attempts/${quizAttempt.current?.id}/create_video_question_attempt/${quiz?.id?.toString() ?? ""}/${untaken_question.question_number}`;
   const url = `${rootpath}/api/quiz_attempts/${quizAttempt.current?.id}/create_video_question_attempt/${quiz?.id?.toString() ?? ""}/${first_question_in_segment}`;
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
   
},[rootpath, quiz, quizAttempt, currentSegmentQuestionNumbers, currentSegmentQuestionStatus]);
//}, [quiz, rootpath]);

    const mutation = useMutation({
        mutationFn: ({  user_answer, score, error_flag }: { user_answer: string, score: string | undefined, error_flag: boolean | undefined  }) =>
          updateQuestionAttempt(questionAttemptId ? String(questionAttemptId) : "", user_answer, score, error_flag),
        onSuccess: (response) => {
            //console.log('✅ Get XXXXXXX question attempt results:', response)
            setShowNextButton(true)
            setShowSubmitButton(false)
            setShowQuestion(false)
            //setQuestionAttemptResponse(response)
            // update currentSegmentQuestionStatus
            const updated_status = currentSegmentQuestionStatus.map(qs => {
                if (qs.question_number === question?.question_number) {
                    return { ...qs, status: 'taken' as 'taken' }
                }
                return qs
            })
            setCurrentSegmentQuestionStatus(updated_status)
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

    const rewatch = () => {
        setShowQuestion(false)
        setQuestion(undefined)
        //youTubeVideoRef.current?.playSegment(currentSegmentIndex.current)
    }

    const watch_next_video = () => {
        //setCurrentSegmentIndex(currentSegmentIndex + 1)
        currentSegmentIndex.current = currentSegmentIndex.current + 1
        setShowQuestion(false)
        setQuestion(undefined)
       // youTubeVideoRef.current?.playSegment(currentSegmentIndex.current)
    }

    /*
 { videoSegments.length > 0 &&
        <div><YoutubeVideoPlayer
                ref={youTubeVideoRef}
                video_url={quiz?.video_url || ""} 
                parentCallback={handleVideoSegmentPlayingEnd}
                videoSegments={videoSegments}  // currentSegmentIndex starts at 1
                currentSegmentIndex = {currentSegmentIndex.current}
                />
                
            </div>
        }
    */

    return (
        <div className='flex flex-col items-center bg-green-800'>
            <h2>Current segment index: {currentSegmentIndex.current}</h2>
            <h2>Current segment questions: {JSON.stringify(currentSegmentQuestionStatus)}</h2>
        
       
     
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
               rewatch()
            }
            }>Watch again</button>
                  <button className='m-4 bg-red-500 p-2 rounded-md' onClick={() => {
               watch_next_video()
            }
            }>Watch next</button>

        </div>
    )

}