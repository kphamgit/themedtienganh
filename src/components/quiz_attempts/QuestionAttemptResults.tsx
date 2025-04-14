import { ReactNode, useEffect, useState } from 'react'
import { FaSmile } from 'react-icons/fa';
import { FaFrown } from 'react-icons/fa';
//import ReactPlayer from 'react-player';
import { QuestionAttemptAttributes, QuestionProps } from './types';
import  QuestionHelper from './QuestionHelper';


  interface DynamicObject {
    [key: string]: any;
  }

 
    export function QuestionAttemptResults(props:
        { live_flag: boolean, 
                question: QuestionProps | undefined,
                response: QuestionAttemptAttributes
            }) 
           {
        //console.log("XXXXQQQQQQQQ", question_attempt_results)
        const [displayedUserAnswer, setDisplayedUserAnswer] = useState('')
        const [displayedAnswerKey, setDisplayedAnswerKey] = useState('')
     
    //console.log("QuestionAttemptResults ENTRY, props = ", props)
     //const { data, error, isLoading } = useLiveQuestion(props.quiz_id, props.question_number)
    
   
    useEffect(() => {  
        if (props.response.user_answer) {
            //console.log("HERE IN useEffect user_answer = ", props.response.user_answer)
            let displayed_user_answer = props.response.user_answer
            if (props?.question?.format === 4) { //radio
                switch (props.response.user_answer) {
                    case 'choice1':
                        displayed_user_answer = props?.question.radio.choice_1_text
                        break;
                    case 'choice2':
                        displayed_user_answer = props?.question.radio.choice_2_text
                        break;
                    case 'choice3':
                        displayed_user_answer = props?.question.radio.choice_3_text
                        break;
                    case 'choice4':
                        displayed_user_answer = props?.question.radio.choice_4_text
                        break;
                    default:
                        break;
                }
            }
            setDisplayedUserAnswer(displayed_user_answer)
        }

        if (props.question?.answer_key) {
            let displayed_answer_key = props.question?.answer_key
            if (props?.question?.format === 4) { //radio
                switch (props.question?.answer_key) {
                    case 'choice1':
                        displayed_answer_key = props?.question.radio.choice_1_text
                        break;
                    case 'choice2':
                        displayed_answer_key = props?.question.radio.choice_2_text
                        break;
                    case 'choice3':
                        displayed_answer_key = props?.question.radio.choice_3_text
                        break;
                    case 'choice4':
                        displayed_answer_key = props?.question.radio.choice_4_text
                        break;
                    default:
                        break;
                }
            }
            setDisplayedAnswerKey(displayed_answer_key)
        }

    }, [props.response.user_answer, props.question?.answer_key, props.question?.format])
    

    const displayQuestion = (): ReactNode => {
        if (props?.question?.format === 6) {  //word scramble
            if (props?.question?.answer_key) {
                return (
                    <div>
                     &nbsp;
                    </div>
                )
            }
        }
        else if (props?.question?.format === 4) { // radio
                return (
                    props?.question?.radio &&
                    <div>
                        <div>{props?.question?.radio.choice_1_text}</div>
                        <div>{props?.question?.radio.choice_2_text}</div>
                        <div>{props?.question?.radio.choice_3_text}</div>
                        { props?.question?.radio.choice_4_text && 
                        <div>{props?.question?.radio.choice_4_text}</div>
                        }
                    </div>
                   
                )
         
        }
        else if (props?.question?.format === 1) { // cloze
              const replacements: DynamicObject = {};
              const answer_parts = props?.question?.answer_key.split('/')
              answer_parts.forEach( (part, index) => {
                if (part.includes('*')) {
                    const first_answer = part.split('*')[0]  // only use the first answer
                    
                    replacements[first_answer] = '_______'
                }
                else {
                    replacements[part] = '_______'
                }

              })
            const newStr = props?.question?.content.replace(/\[(.*?)\]/g, (match, p1) => 
                replacements[p1] || match // Replace if found in object, otherwise keep original
            );
            const newStr1 = newStr.replace(/\[(.*?)\]/g, '');
              //console.log("xxxxx newStr1=", newStr1)
            return ( 
                <div>{newStr1}</div>
            )
        }
        else if (props?.question?.format === 10 || props?.question?.format === 2) {   //10: dropdown, 2: drop-down-select
            return (
                <div>{props?.question?.content.replace(/[\[\]^']+/g,'')}</div>
            )
        }
        else {
            return (
                <div>{props?.question?.content}</div>
            )
        }
    }


    // (answer: string | undefined, answer_key: string, format: number | undefined, content: string): string | undefined => {
    const displayAnswerKey = (): ReactNode => {
        const result = QuestionHelper.format_answer_key(displayedAnswerKey, props?.question?.format, props?.question?.content!)
        return (
            <div>{result}</div>
        )
    }

    const displayUserAnswer = (): ReactNode => {
       
        if (displayedUserAnswer.length > 0) {
            const result = QuestionHelper.format_user_answer(displayedUserAnswer, props?.question?.answer_key!, props?.question?.format, props?.question?.content!)
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
                {props?.question?.instruction &&
                    <div dangerouslySetInnerHTML={{ __html: props?.question.instruction }}></div>
                }
                {props?.question?.prompt &&
                    <div>{props?.question.prompt}</div>
                }
                {props?.question &&
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
                        <div className=' text-textColorFaFrown mx-2'>
                            <FaFrown />
                        </div>
                        {displayedUserAnswer.length > 0 && displayedUserAnswer !== "TIMEOUT" &&
                            <div className='m-2 text-textColor2 mx-2'>The correct answer is:
                                <div className='text-textColor2 my-2'>{displayAnswerKey()}</div>
                            </div>
                        }
                    </>
                    :
                    <div className='flex flex-row justify-center text-lg text-textColorFaSmile mx-2'>
                        <FaSmile />
                    </div>
                }
            </div>
        </div>
    )
}
