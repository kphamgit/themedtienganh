
import { useEffect, useState } from "react";

import { IoIosArrowDown } from "react-icons/io";

import { FiMenu } from "react-icons/fi";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Link } from "react-router-dom";
//import { MdDarkMode } from "react-icons/md";
//import { ThemeContext } from "../../contexts/theme_context/ThemeContext"; 
//import { ThemeContextInterface } from "../../types";
import { useAxiosFetch } from "../../hooks";

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

type NavItem = {
  label: string;
  link?: string;
  children?: NavItem[];
};

export default function Navbar(props: {role: string}) {
  const [animationParent] = useAutoAnimate();
  const [isSideMenuOpen, setSideMenue] = useState(false);
  const { data: categories } = useAxiosFetch<Category[]>({ url: '/categories', method: 'get' });
  const [navItems, setNavItems] = useState<NavItem[]>([]); 

  function openSideMenu() {
    setSideMenue(true);
  }
  function closeSideMenu() {
    setSideMenue(false);
  }

  const handleItemClick = (e: any) => {
    //e.stopPropagation();
    //console.log("span clicked");
  }
  
//link: `/categories/${category.id}/sub_categories_student/${sub_category.id}`
  useEffect(() => {
    if (categories) {
      const nav_items = categories.map((category: Category) => {
        return {
          label: category.name,
          children: category.sub_categories.map((sub_category: SubCategory) => {
            return {
              label: sub_category.name,
              link: `/sub_categories_student/${sub_category.id}`
            }
          })
        }
      })
      //console.log("HERE nav_items", nav_items)
      setNavItems(nav_items)
    }
}, [categories])

//http://localhost:5173/categories/1/sub_categories_student/6
/*
<Link
              key={i}
              href={ch.link ?? "#"}
              className=" flex cursor-pointer items-center  py-1 pl-6 pr-8  text-neutral-400 hover:text-black  "
            >
*/
  return (
    <div className="flex  max-w-7xl justify-between px-4 py-0 text-sm">
      {/* left side  */}
      <section ref={animationParent} className="flex items-center gap-10">
        {/* logo */}
        <div className="hidden md:flex items-center gap-0.5 transition-all">
            <div className='text-md bg-bgColor2 text-textColor2  p-2'>
              <Link to={`/homepage/${props.role}`} >Home</Link>
            </div>
          {navItems.map((d, i) => (
            <div
              key={i}
              className="relative group py-3 transition-all "
            >
              <p className="bg-bgColorCategory text-textColor1 flex cursor-pointer p-2  items-center group-hover:text-textColor4 " >
                <span>{d.label}</span>
                {d.children && (
                  <IoIosArrowDown className=" rotate-180  transition-all group-hover:rotate-0" />
                )}
              </p>

              {/* dropdown */}
              {d.children && (
                <div className="absolute   left-0 mt-2  top-10 hidden w-auto  flex-col bg-bgColor1 py-3 shadow-md  transition-all group-hover:flex ">
                  {d.children.map((ch, i) => (
                    <Link to={ch.link ?? "#"}
                      key={i}
                      className=" flex cursor-pointer items-center  py-1 pl-4 pr-4 bg-bgColor1 text-textColor1 hover:text-textColorSubCategoryHover  "
                    >
                      {/* item */}
                      <span onClick={handleItemClick} className=" whitespace-nowrap ">
                        {ch.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
            <div className='text-md bg-bgColor2 text-textColor2  p-2'>
              <Link to="/games">Games</Link>
            </div>
        </div>
        {/* navitems */}
      </section>

      {/* right side data */}
      <section className=" hidden md:flex   items-center gap-8 ">
     
    
        <div className='text-md bg-bgColor2 text-textColor2  p-2'>
              <Link to="/logout">Log out</Link>
        </div>

        <button className="h-fit rounded-xl border-2 border-neutral-400 px-4 py-2 text-neutral-400 transition-all hover:border-black hover:text-black/90">
          Register
        </button>
      </section>

      <FiMenu
        onClick={openSideMenu}
        className="cursor-pointer text-4xl md:hidden"
      />
    </div>
  );
}

/*
   <button className="h-fit text-neutral-400 transition-all hover:text-black/90">
          Login
        </button>
*/