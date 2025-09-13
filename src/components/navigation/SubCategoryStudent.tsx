
import { useNavigate, useParams } from 'react-router-dom';
import { useAxiosFetch } from '../../hooks';
import { TakeQuizButton } from '../shared/TakeQuizButton';
//import { useEffect } from 'react';

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
            //const api_url = `/sub_categories/${sub_category.name}/quizzes/${quiz_id}`
            //"sub_categories/:sub_category_name/take_quiz/:quizId" element={<TakeQuiz />} />
            const api_url = `/sub_categories/${sub_category.name}/take_quiz/${quiz_id}`
            navigate(api_url, {state: {video_url: url }})
        }
    }

    // <Route path="sub_categories/:sub_category_name/quizzes/:quizId" element={<QuizPageVideo />} />
    //    <Route path="sub_categories/:sub_category_name/take_quiz/:quizId" element={<TakeQuiz />} />
    return (
        <>
        <div className= "flex flex-col flex-wrap h-[1100px] w-full/3 border mx-12 mr-5">
            {sub_category && sub_category.units.map(unit => (
               
                    <div key={unit.id} className='bg-bgColor1 text-textColor2 flex items-center justify-start m-1 border"'>
                        <div className='flex flex-col gap-1 rounded-lg'>
                            <div className='mt-3 text-lg mx-1 text-textColorHeader1'>Unit {unit.unit_number} - {unit.name}</div>
                            <div className='flex flex-col gap-1 mt-2'>
                                {unit.quizzes.map(quiz =>
                                    <div key={quiz.id} className='flex flex-row gap-1 wrap mx-2'>
                                        <div className='text-sm my-1'>{quiz.quiz_number}</div>
                                        <div>
                                            <TakeQuizButton quiz_id={quiz.id} quiz_name={quiz.name} video_url={quiz.video_url} parentFunct={take_quiz} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

              
            ))}
        </div>
      
       </>
    );

   /*
    return (
        <div className="flex flex-col flex-wrap h-[300px] w-[400px] border">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="w-[120px] h-[50px] bg-blue-500 text-white flex items-center justify-center m-1 border">
              {i + 1}
            </div>
          ))}
        </div>
      );
      */
}

//  <Link className='underline text-sm' to={`/categories/${sub_category.categoryId}/sub_categories/${sub_category.name}/quizzes/${quiz.id}`}>{quiz.name}</Link>
