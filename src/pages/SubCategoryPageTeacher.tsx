
import { Link, useParams } from 'react-router-dom';
import { useAxiosFetch } from '../hooks';

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
        }[]
    }[]
}

export function SubCategoryPageTeacher(props:any) {
   
    const params = useParams<{ sub_categoryId: string }>();
    const { data: sub_category, loading: sub_loading, error: sub_error } = useAxiosFetch<SubCategory>({ url: `/sub_categories/${params.sub_categoryId}`, method: 'get' });
  
    return (
        <>
        
            <div className='flex flex-row bg-bgColor1 justify-center m-1 text-lg'>{sub_category?.name} </div>
            <div className='grid grid-cols-10'>
                <div className='col-span-3 grid grid-rows bg-gray-100 rounded-lg'>
                    {sub_category?.units.map(unit => (
                        <div key={unit.id}>
                        <div className='m-2 text-md'>{unit.name}</div>
                        <div className='flex flex-col m-2 bg-gray-200 gap-1 rounded-lg p-2'>{unit.quizzes.map(quiz =>
                             <div key={quiz.id}>
                                <span className='p-2 text-sm'>{quiz.id}</span>
                                <span className='text-sm text-red-800'>Quiz {quiz.quiz_number}: </span>
                                <Link className='underline text-sm' to={`/categories/${sub_category.categoryId}/sub_categories/${sub_category.name}/list_questions/${quiz.id}`}>{quiz.name}</Link>
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