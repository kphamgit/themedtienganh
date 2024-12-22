import { ReactNode, useEffect, useState } from 'react'
import { FaSmile } from 'react-icons/fa';
import { FaFrown } from 'react-icons/fa';
//import ReactPlayer from 'react-player';
import { QuestionProps } from './types';
import  QuestionHelper from './QuestionHelper';


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

  type RadioProps =
  {
    id: number
    choice_1_text: string
    choice_2_text: string
    choice_3_text: string
    choice_4_text: string
    selected: string
    questionId: number
  }

  interface DynamicObject {
    [key: string]: any;
  }

export function QuestionAttemptResults(props:{ 
    live_flag: boolean, 
    response: {question: QuestionProps| undefined, 
    results: QuestionAttemptAttributes}, 
    user_answer: string | undefined }) 

   {
    //console.log("XXXXQQQQQQQQ", props.response.question_attempt_results)
    const [format, setFormat] = useState<number>()
    const [answerKey, setAnswerKey] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [radio, setRadio] = useState<RadioProps>()
    const [userAnswer, setUserAnswer] = useState('')
        
    useEffect(() => {
        if (props.response.question?.content) {
            setContent(props.response.question.content)
        }
        if (props.response.question?.answer_key) {
            if (props.response.question?.format === 4) { //radio
                if (props.response.question.answer_key === 'choice1')
                    setAnswerKey(props.response.question.radio.choice_1_text)
                if (props.response.question.answer_key === 'choice2')
                    setAnswerKey(props.response.question.radio.choice_2_text)
                if (props.response.question.answer_key === 'choice3')
                    setAnswerKey(props.response.question.radio.choice_3_text)
                if (props.response.question.answer_key === 'choice4')
                    setAnswerKey(props.response.question.radio.choice_4_text)
            }
            else {
                setAnswerKey(props.response.question.answer_key)
            }
        }
        if (props.response.question?.format) {
            setFormat(props.response.question.format)
        }
        if (props.response.question?.radio) {
            setRadio(props.response.question.radio)
        }
        if (props.user_answer) {
            if (props.response.question?.format === 4) { //radio
                if (props.user_answer === 'choice1')
    
                    setUserAnswer(props.response.question.radio.choice_1_text)
    
                if (props.user_answer === 'choice2')
    
                    setUserAnswer(props.response.question.radio.choice_2_text)
    
                if (props.user_answer === 'choice3')
    
                    setUserAnswer(props.response.question.radio.choice_3_text)
    
                if (props.user_answer === 'choice4')
    
                    setUserAnswer(props.response.question.radio.choice_4_text)
    
            }
            else {
                //console.log("MMMMMM props.user_answer", props.user_answer)
                setUserAnswer(props.user_answer)
            }
        }
    }, [props.response.question, props.user_answer])


    const displayContentOrRadioChoices = (): ReactNode => {
        if (format === 6) {  //word scramble
            if (answerKey) {
                const answer_parts: string[] = answerKey.split('/')
                return (
                    <div>
                     &nbsp;
                    </div>
                )
            }
        }
        else if (format === 4) { // radio
                return (
                   radio &&
                    <div>
                        <div>{radio.choice_1_text}</div>
                        <div>{radio.choice_2_text}</div>
                        <div>{radio.choice_3_text}</div>
                        { radio.choice_4_text && 
                        <div>{radio.choice_4_text}</div>
                        }
                    </div>
                   
                )
         
        }
        else if (format === 1) {
              const replacements: DynamicObject = {};
              const answer_parts = answerKey.split('/')
              answer_parts.forEach( (part, index) => {
                if (part.includes('*')) {
                    const first_answer = part.split('*')[0]  // only use the first answer
                    
                    replacements[first_answer] = '_______'
                }
                else {
                    replacements[part] = '_______'
                }

              })
            const newStr = content.replace(/\[(.*?)\]/g, (match, p1) => 
                replacements[p1] || match // Replace if found in object, otherwise keep original
            );
            return ( 
                <div>{newStr}</div>
            )
        }
        else if (format === 10 || format === 2) {
            //console.log(" question format 10")
            return (
                <div>{content.replace(/[\[\]^']+/g,'')}</div>
            )
        }
        else {
            return (
                <div>{content}</div>
            )
        }
    }


    // (answer: string | undefined, answer_key: string, format: number | undefined, content: string): string | undefined => {
    const displayAnswerKey = (): ReactNode => {
        const result = QuestionHelper.format_answer_key(answerKey, format, content)
        return (
            <div>{result}</div>
        )
    }

    const displayUserAnswer = (): ReactNode => {
       
        if (userAnswer.length > 0) {
           // console.log(" xxxxx userAnswer=", userAnswer)
            const result = QuestionHelper.format_user_answer(userAnswer, answerKey, format, content)
            return (
                <div>{result}</div>
            )
        }
        else {
            return (
                <div>EMPTY user answer!!!</div>
            )
        }
    }

    const displayUserAnswer1 = (): ReactNode => {
     
        //console.log("TEST=", test)
        if (props.user_answer) {
            if (format === 1) {
                const replacements: DynamicObject = {};
                const answer_parts = answerKey.split('/')
                const user_answer_parts = props.user_answer.split('/')
                answer_parts.forEach( (part, index) => {
                    console.log("mmmmm", part)
                    //replacements[part] = part
                    replacements[part] = user_answer_parts[index]
                })
                const newStr = content.replace(/\[(.*?)\]/g, (match, p1) =>
                    replacements[p1] || match // Replace if found in object, otherwise keep original
                );
                return (
                    <div>{newStr}</div>
                )
        }
        else if (format === 6) {  //word scramble
                const user_answer_parts: string[] = props.user_answer.split('/')
                return (
                    <div>
                        {user_answer_parts.map((part, index) => (
                            <span key={index}>{part} </span>
                        ))
                        }
                    </div>
                )
        }
        else if (format === 4) {
                const radio_index = parseInt(props.user_answer.charAt(answerKey.length - 1))
                //console.log("xxxxxx radio index", radio_index)
                if (radio_index) {
                    const content_parts = content.split('/')
                    return (
                        <div>{content_parts[radio_index - 1]}</div>
                    )
                }
         
        }
        else {
            return (
                <div className='mx-5 text-amber-700'>{props.user_answer}</div>
            )
        }
        }
        else {
            return <div>Empty user answer</div>
        }
    }

    const displayAnswerKey1 = (): ReactNode => {
        //console.log(" question format", question.format)
        if (format === 1) {
            //let newStr = content.replace(/\[|\]/g, ""); //
            return (
                <div>{content.replace(/\[|\]/g, "")}</div>
            )
        }
        else if (format === 6) {  //word scramble
            if (answerKey) {
                const answer_parts: string[] = answerKey.split('/')
                return (
                    <div>
                        {answer_parts.map((part, index) => (
                            <span key={index}>{part} </span>
                        ))
                        }
                    </div>
                )
            }
        }
        else if (format === 4) {
            if (answerKey) {
                const radio_index = parseInt(answerKey.charAt(answerKey.length - 1))
                //console.log("xxxxxx radio index", radio_index)
                if (radio_index) {
                    const content_parts = content.split('/')
                    return (
                        <div>{content_parts[radio_index - 1]}</div>
                    )
                }
            }
        }
        else {
            return (
                <div>{answerKey}</div>
            )
        }
    }

    return (
        <>
        { props.response.question?.instruction &&
            <div dangerouslySetInnerHTML={{ __html: props.response.question.instruction }}></div>
        }
        { props.response.question?.prompt &&
            <div className='m-2'>{props.response.question.prompt}</div>
        }
        { props.response.question &&
            <div className='m-2'>{displayContentOrRadioChoices()}</div>
        }
     
        {props.response.results.error_flag ?
            <>
            <div className='text-lg text-orange-600 mx-2'> 
                <FaFrown />
            </div>
            <div className='m-2'>Your answer is:</div>
            <div>
            {displayUserAnswer()}
            </div>
            
            <div className='m-2'>The correct answer is:
                <div className='text-lg text-amber-800 my-2'>{displayAnswerKey()}</div>
            </div>
            </>
        :
            <div className='text-lg text-green-700 mx-2'> 
                <FaSmile />
            </div>
        }
        </>
    )
}
