import { MouseEventHandler, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { YouTubePlayerRef } from "../shared/YoutubeVideoPlayer";
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


export default function TakeQuiz() {
    
    const params = useParams<{ subCagegoryId: string, quizId: string,  }>();
    //console.log("params in TakeQuiz=", params)
    const user = useAppSelector(state => state.user.value)
    if (!user) {
        alert("User is not logged in. Please log in to continue.");
        return null; // Prevent further rendering of the component
    }

        const [nextQuestionEnabled, setNextQuestionEnabled] = useState(false)

        const [fetchQuizEnabled, setFetchQuizEnabled] = useState(true)  // only fetch quiz once
        const [fetchQuizAttemptEnabled, setFetchQuizAttemptEnabled] = useState(true)  // only fetch quiz attempt once
        const [question, setQuestion] = useState<QuestionProps | undefined>()
        const [questionAttemptId, setQuestionAttemptId] = useState<string | undefined>()
   
        const [showQuestion, setShowQuestion] = useState(false)
        const [showNextButton, setShowNextButton] = useState(false)
        const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false)
        const [questionAttemptResponse, setQuestionAttemptResponse] = useState< QuestionAttemptAttributes>()

        const [endOfQuiz, setEndOfQuiz] = useState(false)
     
        const childRef = useRef<ChildRef>(null);
        const [submitDisabled, setSubmitDisabled] = useState(false)

        const {data: quiz} = useQuiz(
            params.quizId ? params.quizId : ""
            , fetchQuizEnabled
        )
        //console.log("quiz data ****** in TakeQuiz=", quiz)
        useEffect(() => {
            if (quiz) {
                console.log("New quiz data received:", quiz);
                setFetchQuizEnabled(false) // only fetch quiz once
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
           
            get_next_question()
        }
    }
    , [quizAttempt]);
      //console.log("RIVHT HERE quiz_attempt=", quizAttempt);

    const { data: questionAttemptData } = useQuestionAttempt(
        quizAttempt?.quiz_attempt.id.toString()!,
        nextQuestionEnabled)

    useEffect(() => {
        if (questionAttemptData) {
            if (questionAttemptData.end_of_quiz) {
                //console.log(" END OF QUIX")
                setEndOfQuiz(true)
            }
            else {
                //console.log(" NOT END OF QUIZ question = ", questionAttemptData.question)
                setQuestion(questionAttemptData.question)
                setQuestionAttemptId(String(questionAttemptData.question_attempt_id))
                setNextQuestionEnabled(false)   // disable the useQuestionAttempt hook
                setShowNextButton(false)
                setShowSubmitButton(true)
                setShowQuestion(true)
            }
        }
   }, [questionAttemptData])
   
   const enableSubmmitButton = () => {
    setSubmitDisabled( false  )
}
const get_next_question = async () => {
    //console.log("get_next_question ")
    setShowNextButton(false)
    setShowQuestion(false)
    setQuestionAttemptResponse(undefined)
    //console.log("get_next_question setNextQuestionEnabled to true ")
    setNextQuestionEnabled(true)  // trigger the useQuestionAttempt hook to get the next question
}
    const mutation = useMutation({
        mutationFn: ({  user_answer, score, error_flag }: { user_answer: string, score: string | undefined, error_flag: boolean | undefined  }) =>
          updateQuestionAttempt(questionAttemptId ? String(questionAttemptId) : "", user_answer, score, error_flag),
        onSuccess: (response) => {
            //console.log('✅ Get XXXXXXX question attempt results:', response)
            setShowNextButton(true)
            setShowSubmitButton(false)
            //setShowQuestion(false)
            setQuestionAttemptResponse(response)
            //props.set_question_attempt_result(data)   
            
          }
      })


   const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
        //console.log("in TakeQuiz..... handleSubmit ")
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

    if (endOfQuiz) {
        // reset react query cache for quiz attempt and question attempt
        // using queryClient from react-query
        //queryClient.removeQueries({ queryKey: ['quiz_attempt'] })
        //queryClient.removeQueries({ queryKey: ['question_attempt'] })
        //queryClient.invalidateQueries({ queryKey: ['quiz'] })
        return (
        <div className='flex flex-col items-center'>
            <div className='bg-blue-200 text-white text-lg m-4 rounded-md p-4'>
                <h1>End of Quiz</h1>
            </div>
        </div>
        )
    }

    return (
        <div className='flex flex-row items-center bg-gray-200 mx-16'> 
            <div className="flex flex-col items-center mx-5 bg-gray-300 justify-center w-3/4">
                {showQuestion &&
                <div className='flex flex-col items-center bg-green-200'>
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
                        {displayQuestion()}
                    </div>
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
    )

}
