
import { useNavigate, useParams } from 'react-router-dom';
import { useAxiosFetch } from '../../hooks';
import { TakeQuizButton } from '../shared/TakeQuizButton';
import { QuizAttemptProps, QuizProps } from '../quiz_attempts/types';
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
        quizzes: QuizProps[]
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
    const take_quiz = (quiz: QuizProps) => {
        if (sub_category) {
            //const api_url = `/sub_categories/${sub_category.name}/quizzes/${quiz_id}`
            //"sub_categories/:sub_category_name/take_quiz/:quizId" element={<TakeQuiz />} />
            if (quiz.video_url === null) {
                const api_url = `/sub_categories/${sub_category.name}/take_quiz/${quiz.id}`
                navigate(api_url)
            }
            else {
                console.log("******* video quiz")
                const api_url = `/sub_categories/${sub_category.name}/take_video_quiz/${quiz.id}`
                navigate(api_url)
           
            }
           
        }
    }

    // <Route path="sub_categories/:sub_category_name/quizzes/:quizId" element={<QuizPageVideo />} />
    //    <Route path="sub_categories/:sub_category_name/take_quiz/:quizId" element={<TakeQuiz />} />
    return (
        <>
            <div className="flex flex-col flex-wrap h-[1100px] w-full/3 border mx-12 mr-5">
                {sub_category && sub_category.units.map(unit => (
                    <div key={unit.id} className='bg-bgColor1 text-textColor2 flex items-center justify-start m-1 border"'>
                        <div className='flex flex-col gap-1 rounded-lg'>
                            <div className='mt-3 text-lg mx-1 text-textColorHeader1'>Unit {unit.unit_number} - {unit.name}</div>
                            <div className='flex flex-col gap-1 mt-2'>
                                {unit.quizzes.map(quiz =>
                                    <div key={quiz.id} className='flex flex-row gap-1 wrap mx-2'>
                                        <div className='text-sm my-1'>{quiz.quiz_number}</div>
                                        <div>
                                            <button className=' px-2 rounded-md hover:underline bg-bgColor2 text-textColor2' onClick={() => take_quiz(quiz)}>{quiz.name}</button>
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
    <div>
        <TakeQuizButton quiz_id={quiz.id} quiz_name={quiz.name} video_url={quiz.video_url} parentFunct={take_quiz} />
    </div>
    */

   /*
   export function TakeQuizButton(props: TakeQuizButtonProps ) {
       const [quizId, setQuizId] = useState<number>()
       //const [pagesParams, setPagesParams] = useState<PageParamsProps []>()
       const [videoUrl, setVideoUrl] = useState<string>()
   
       useEffect(() => {
           //console.log("BBBBBBBBB props: ", props)
           setVideoUrl(props.video_url)
           setQuizId(props.quiz_id)
           //if (props.video_params) {
              // console.log("OOOOO", props.video_params)
           //}
           //setVideoParams(props.video_params)
       },[props])
   
       const handleClick = () => {
           props.parentFunct(quizId, videoUrl)
       }
   
       return (
           <>
             <div><button className=' px-2 rounded-md hover:underline' onClick={handleClick}>{props.quiz_name}</button></div>
           </>
       )
   }
      */
}

//  <Link className='underline text-sm' to={`/categories/${sub_category.categoryId}/sub_categories/${sub_category.name}/quizzes/${quiz.id}`}>{quiz.name}</Link>
