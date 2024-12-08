import { useEffect, useState } from 'react'
import { SimpleEditor } from './tiptap_editor/SimpleEditor'

import { useNavigate, useParams } from 'react-router-dom';
import { useAxiosFetch } from '../../hooks';
import { QuestionProps } from '../question_attempts';
import { updateQuestion } from './services/list';


export function QuestionEditor(props: any) {

      const [format, setFormat] = useState<number>()
      const [questionNumber, setQuestionNumber] = useState<number>()
      const [prompt, setPrompt] = useState<string>('null')
      const [audioSrc, setAudioSrc] = useState('')
      const [audioStr, setAudioStr] = useState('')
      const [questionContent, setQuestionContent] = useState('')
      const [answerKey, setAnswerKey] = useState('')
      const [score, setScore] = useState<number>()
      const [instruction, setInstruction] = useState<string>('')
      const [help1, setHelp1] = useState(null)
      const [help2, setHelp2] = useState(null)
      const [radioContent, setRadioContent] = useState({})
      const [direction, setDirection] = useState<string>('')

      const navigate = useNavigate();
      const params = useParams<{categoryId: string, sub_category_name: string, quiz_id: string, question_id: string}>();
      //console.log("MMMMNNNNNNN  params", params)
   
      const url = `/questions/${params.question_id}`
      //console.log("url ", url)
      const { data: question, loading, error } =
          useAxiosFetch<QuestionProps>({ url: url, method: 'get' })
          //  const url = `${rootpath}/api/questions/${id}`

    useEffect(() => {
        if (question) {
        //console.log("HEEEHWWWHWWWW.......... question:", question)
        setFormat(question.format)
        setQuestionNumber(question.question_number)
        //console.log("here question instrcution", question.instruction)
        //console.log("here question instrcution LENGTH=", question.instruction.length)
        if (question.instruction.length > 0) {
            //console.log("HHHHH setting instruction", question.instruction)
            setInstruction(question.instruction)
        }
        else
            setInstruction(' ')     // there has to be at least a space. Otherwise SimpleEditor won't show

        setPrompt(question.prompt)
        setAudioSrc(question.audio_src)
        setAudioStr(question.audio_str)
        setQuestionContent(question.content)
        setAnswerKey(question.answer_key)
        setScore(question.score)
        if (question.radio != null) {
            setRadioContent(question.radio)
        }
        if (question.format === 6) {
            //console.log("SCRAMMMMMMMMM direction =", response.data.direction)
            setDirection(question.words_scramble_direction)
        }
       }
    },[question, question?.instruction])

    const update_instruction = (editor_content: string) => {
        //console.log("UUUUUUUyyyyyyyUUUUUUU ")
        //console.log("XXXX", editor_content)
        setInstruction(editor_content)
    }

    const update_question = () => {
        let question_params = {
            format: format,
            instruction: instruction,
            prompt: prompt,
            audio_src: audioSrc,
            audio_str: audioStr,
            content: questionContent,
            answer_key: answerKey,
            score: score,
            help1: help1
        }
        updateQuestion(params.question_id, question_params )
        .then(response => {
            //console.log("SUCCESS update")
            //navigate("/live_quiz", { state: arg })
            navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_category_name}/list_questions/${params.quiz_id}`)
         })
        
    }
    
    const handleCancel = () => {
        navigate(`/categories/${params.categoryId}/sub_categories/${params.sub_category_name}/list_questions/${params.quiz_id}`)
    }

    
        return (
            <>
                <div className='mt-2'>Question: {question?.question_number}</div>
                 { instruction &&
                    <SimpleEditor initialContent={instruction} parentFunc={update_instruction} />
                 }
           
                <div className='flex flex-row justify-start gap-2'>
                    <button className='bg-green-400 m-3 p-1' onClick={update_question}>Save question</button>
                    <button className='bg-red-400 m-3 p-1 text-white' onClick={handleCancel}>Cancel</button>
                </div>
                {instruction &&
                    <div dangerouslySetInnerHTML={{ __html: instruction }}></div>
                }
            </>
            )
    
   

}

/*
 return (
        <>
          
            { question?.instruction ?
            <SimpleEditor initialContent={question?.instruction} parentFunc={update_instruction}/>
            :
            <SimpleEditor initialContent='' parentFunc={update_instruction}/>
            }
            <div className='flex flex-row justify-start gap-2'>
            <button className='bg-green-400 m-3 p-1' onClick={update_question}>Save question</button>
            <button className='bg-red-400 m-3 p-1 text-white' onClick={handleCancel}>Cancel</button>
            </div>
            { instruction &&
               <div dangerouslySetInnerHTML={{ __html: instruction }}></div>
            }
        </>
    )
*/

