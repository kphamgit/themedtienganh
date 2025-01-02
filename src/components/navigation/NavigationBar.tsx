
import { useAppSelector } from '../../redux/store';
import { useAxiosFetch } from '../../hooks/useAxiosFetch';
import { Link, NavLink } from 'react-router-dom';
import { ThemeContext } from '../../contexts/theme_context/ThemeContext';
import { ThemeContextInterface } from '../../types';
import { MdDarkMode } from "react-icons/md";
import { useContext } from 'react';

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

export function NavigationBar(props: any) {
    
    const user = useAppSelector(state => state.user.value)
    const { data: categories } = useAxiosFetch<Category[]>({ url: '/categories', method: 'get' });
    const { toggleTheme } = useContext(ThemeContext) as ThemeContextInterface;

    return (
        <>
         <div className='flex flex-row justify-left gap-2 bg-bgColor1 text-userNavText'>
          <div>Welcome: {user.user_name}</div>
          <div className= 'px-2 py-1 font-bold text-lg underline rounded-md mx-1 bg-bgColor1'><Link to="/">Home</Link></div>
            <div className='text-md'>
              <Link to="/logout">Log out</Link>
            </div>
            <div>
              <button
                onClick={toggleTheme}
                className="rounded-none bg-bgColor1 p-1 text-center text-2xl uppercase tracking-[3px] text-textColor transition-all duration-300 ease-in-out hover:rounded-lg"
            >
               <MdDarkMode />
            </button>
           </div>
          </div>
             <div className="flex flex-row p-0 gap-1 justify-center bg-bgColor1">
              {categories?.map((category:any) => (
                <div key={category.id} className='flex flex-row'>
                  <NavLink
                    to={`/categories/${category.id}`}
                    className={({ isActive }) => {
                      return isActive ? 'text-textColor1 bg-navCatButtonBgActive text-lg p-2 rounded-t-md' : 'rounded-md text-lg text-textColor1 bg-navCatButtonBgInActive p-2 hover:bg-navCatButtonBgInHover';
                    }}
                  >
                    {category.name}
                  </NavLink>
                </div>
              ))}
              
            </div>
        </>
    )
}
