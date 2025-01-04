
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAxiosFetch } from '../../hooks';
import { TakeQuizButton } from '../shared/TakeQuizButton';
import { useEffect } from 'react';

type SubCategory = {
    categoryId: number,
    id: number,
    name: string
    sub_category_number: number
    level: string
    units:
    {
        id: number
        name: string
        unit_number: number
        level: string
        content: string
        subCategoryId: string
        quizzes: {
            id: number
            name: string
            quiz_number: number
            disabled: boolean
            video_url: string
            unitId: number
        }[]
    }[]
}

export default function SubCategoryPageStudent(props:any) {
   
    const params = useParams<{ sub_categoryId: string }>();
    const { data: sub_category, loading: sub_loading, error: sub_error } = useAxiosFetch<SubCategory>({ url: `/sub_categories/${params.sub_categoryId}`, method: 'get' });
    const navigate = useNavigate()

    //useEffect(() => {
      //  console.log("HERE sub cat", sub_category)
   // }, [sub_category])

//https://www.tienganhtuyhoa.com/categories/4/sub_categories_student/9
    const take_quiz = (quiz_id: number | undefined, url: string | undefined) => {
        if (sub_category) {
            const api_url = `/categories/${sub_category.categoryId}/sub_categories/${sub_category.name}/quizzes/${quiz_id}`
            navigate(api_url, {state: {video_url: url }})
        }
    }

    return (
        <>
            <div className='flex flex-row justify-center m-1 bg-bgColor1 text-textColor1 text-xl'>{sub_category?.name} </div>
            <div className='grid grid-cols-10 bg-bgColor1'>
                <div className='col-span-3 grid grid-rows rounded-lg'>
                    {sub_category && sub_category.units.map(unit => (
                        <div key={unit.id}>
                        <div className='m-2 text-md text-textColor1'>Unit {unit.unit_number} - {unit.name}</div>
                        <div className='flex flex-col m-2 gap-1 rounded-lg p-2'>{unit.quizzes.map(quiz =>
                             <div key={quiz.id}>
                                <div className='flex flex-row gap-2'>
                                <div className='text-sm text-questionAttemptText my-1'>Quiz {quiz.quiz_number}: </div>
                                <TakeQuizButton quiz_id={quiz.id} quiz_name={quiz.name} video_url={quiz.video_url} parentFunct={take_quiz} />
                                </div>
                           </div>
                        )}</div>
                        </div>
                    ))}
                 
                </div>
                <div className='col-span-7'>
               
                  
                </div>
            </div>
        </>
    )
}

//  <Link className='underline text-sm' to={`/categories/${sub_category.categoryId}/sub_categories/${sub_category.name}/quizzes/${quiz.id}`}>{quiz.name}</Link>
