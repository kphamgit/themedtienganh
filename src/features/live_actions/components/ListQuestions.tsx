import { useAxiosFetch } from '../../../hooks';
import { QuestionProps } from '../../question_attempts/components/QuestionAttemptProps';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';

interface QuizProps {
    id: string;
    name: string;
    quiz_number: string;
    disabled: boolean;
    video_url: string | undefined;
    unitId: string;
    questions: QuestionProps[]
  }

export function ListQuestions(props:any) {
    

        const params = useParams<{ categoryId: string, sub_category_name: string, quiz_id: string}>();
        const url = `/quizzes/${[[params.quiz_id]]}/get_questions`
        const { data: quiz, loading, error } =
            useAxiosFetch<QuizProps>({ url: url, method: 'get' })

        useEffect(() => {
            //console.log(quiz)
        },[quiz])

    return (
        <>
            <div className='text-amber-800 text-xl m-2 flex flex-row justify-center'>{params.sub_category_name}</div>
            <div className='flex flex-col'>
                { quiz &&
                    <div className='m-2 text-orange-700 text-lg'>Quiz {quiz.quiz_number}: {quiz.name}, id = {quiz.id}</div>
                }
                { quiz &&
                    quiz.questions.map((question, index) => (
                        <div className='flex flex-row gap-2 mx-4 mt-2 bg-cyan-100' key={index}>
                        <div>Question {question.question_number} </div>
                        <div>format: {question.format} </div>
                        <div>Content: {question.content}</div>
                        <div>
                        <Link className='underline text-sm' to={`/categories/${params.categoryId}/sub_categories/${params.sub_category_name}/list_questions/${params.quiz_id}/edit_question/${question.id}`}>Edit</Link>
 
                        </div>
                        </div>
                    ) )
                }
            </div>
           
        </>
    )
}
/*
     const api_url = `/categories/${sub_category.categoryId}/sub_categories/${sub_category.name}/quizzes/${quiz_id}`
     */
