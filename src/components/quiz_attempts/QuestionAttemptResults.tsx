import { ReactNode, useEffect, useState } from 'react'
import { FaSmile } from 'react-icons/fa';
import { FaFrown } from 'react-icons/fa';
//import ReactPlayer from 'react-player';
import { QuestionAttemptAttributes, QuestionProps } from './types';
import  QuestionHelper from './QuestionHelper';
import { useAxiosFetch } from '../../hooks';

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

  /*
    export function QuestionAttemptResults(props:
        { live_flag: boolean, 
            question: QuestionProps| undefined, 
            response: QuestionAttemptAttributes
        }) 
    */
        export function QuestionAttemptResults(props:
            { live_flag: boolean, 
                question_id: string| undefined, 
                response: QuestionAttemptAttributes
            }) 
           {
    //console.log("XXXXQQQQQQQQ", question_attempt_results)
    const [format, setFormat] = useState<number>()
    const [answerKey, setAnswerKey] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [radio, setRadio] = useState<RadioProps>()
    const [userAnswer, setUserAnswer] = useState('')
     
    const url = `/questions/${props.question_id}`
    const { data: question, loading, error } =
    useAxiosFetch<QuestionProps>({ url: url, method: 'get' })
    

    useEffect(() => {
        if (question?.content) {
            setContent(question.content)
        }
        if (question?.answer_key) {
            if (question?.format === 4) { //radio
                if (question.answer_key === 'choice1')
                    setAnswerKey(question.radio.choice_1_text)
                if (question.answer_key === 'choice2')
                    setAnswerKey(question.radio.choice_2_text)
                if (question.answer_key === 'choice3')
                    setAnswerKey(question.radio.choice_3_text)
                if (question.answer_key === 'choice4')
                    setAnswerKey(question.radio.choice_4_text)
            }
            else {
                //console.log("setAnswerKey props.answer_key", question.answer_key)
                setAnswerKey(question.answer_key)
            }
        }
        if (question?.format) {
            setFormat(question.format)
        }
        if (question?.radio) {
            setRadio(question.radio)
        }
        if (props.response.user_answer) {
            if (question?.format === 4) { //radio
                if (props.response.user_answer === 'choice1')
    
                    setUserAnswer(question.radio.choice_1_text)
    
                if (props.response.user_answer === 'choice2')
    
                    setUserAnswer(question.radio.choice_2_text)
    
                if (props.response.user_answer === 'choice3')
    
                    setUserAnswer(question.radio.choice_3_text)
    
                if (props.response.user_answer === 'choice4')
    
                    setUserAnswer(question.radio.choice_4_text)
    
            }
            else {
                //console.log("MMMMMM props.user_answer", props.user_answer)
                setUserAnswer(props.response.user_answer)
            }
        }
    }, [question, props.response.user_answer])


    const displayQuestion = (): ReactNode => {
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
        else if (format === 1) { // cloze
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
            const newStr1 = newStr.replace(/\[(.*?)\]/g, '');
              //console.log("xxxxx newStr1=", newStr1)
            return ( 
                <div>{newStr1}</div>
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

    //bg-gradient-to-b from-bgColorQuestionAttempt to-green-100
    return (
        <div>
            <div className='bg-bgColorQuestionContent text-black ml-3 mb-3'>
                {question?.instruction &&
                    <div dangerouslySetInnerHTML={{ __html: question.instruction }}></div>
                }
                {question?.prompt &&
                    <div>{question.prompt}</div>
                }
                {question &&
                    <div>{displayQuestion()}</div>
                }
            </div>
            <div className='bg-gradient-to-t from-bg-bgColorQuestionResults to-white text-textColor1 p-2 m-0 rounded-md'>
                {props.response.error_flag ?
                    <>
                        <div className=' text-textColor2 mx-2'>Your answer is:</div>
                        <div className='m-2 text-textColor2'>
                            {displayUserAnswer()}
                        </div>
                        <div className=' text-textColor2 mx-2'>
                            <FaFrown />
                        </div>
                        {userAnswer.length > 0 && userAnswer !== "TIMEOUT" &&
                            <div className='m-2 text-textColor2 mx-2'>The correct answer is:
                                <div className='text-textColor2 my-2'>{displayAnswerKey()}</div>
                            </div>
                        }
                    </>
                    :
                    <div className='text-lg text-textColor1 mx-2'>
                        <FaSmile />
                    </div>
                }
            </div>
        </div>
    )
}
