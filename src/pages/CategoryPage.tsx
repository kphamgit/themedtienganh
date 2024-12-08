import { Link, Outlet, useParams } from 'react-router-dom';
import { useAxiosFetch } from '../hooks';
import { useAppSelector } from '../redux/store';
//import { VscTriangleDown } from "react-icons/vsc";

type Category = {
  id: number;
  name: string;
  sub_categories: SubCategory[]
}

interface SubCategory {
  id: number,
  name: string
  sub_category_number: number
  level: string
}

export default function CategoryPage() {
  const params = useParams<{ categoryId: string }>();
  const { data: category, loading, error } = useAxiosFetch<Category>({ url: `/categories/${params.categoryId}`, method: 'get' });
  const user = useAppSelector(state => state.user.value)

  return (
    <>
    
    <div className='bg-bgColor p-1.5 rounded-b-md m-6'>
      <div className='flex flex-row gap-1 text-md mx-0'>
        {category?.sub_categories ? category?.sub_categories.map(sub_cat => (
          <div className='bg-navCatButtonBgActive p-1 text-textColor1  rounded-md hover:bg-navCatButtonBgInHover' key={sub_cat.id} >
            { user.role?.includes('student') ?
            <Link to={`sub_categories_student/${sub_cat.id}`} >{sub_cat.name}</Link>
            :
            <Link to={`sub_categories_teacher/${sub_cat.id}`} >{sub_cat.name}</Link>
            }
          </div>
        )) : null
        }
      </div>
      </div>
      <Outlet />
    </>
  );
}

/*
 return (
    <>
    
    <div className='bg-bgColor p-1.5 rounded-b-md m-6'>
      <div className='flex flex-row gap-1 text-md mx-0'>
        {category?.sub_categories ? category?.sub_categories.map(sub_cat => (
          <div className='bg-navCatButtonBgActive p-1 text-textColor1  rounded-md hover:bg-navCatButtonBgInHover' key={sub_cat.id} >
            { user.role?.includes('student') ?
            <Link to={`sub_categories_student/${sub_cat.id}`} >{sub_cat.name}</Link>
            :
            <Link to={`sub_categories_teacher/${sub_cat.id}`} >{sub_cat.name}</Link>
            }
          </div>
        )) : null
        }
      </div>
      </div>
      <Outlet />
    </>
  );
*/