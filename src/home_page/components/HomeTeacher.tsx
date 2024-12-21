//import { useContext } from "react";
//import { ThemeContext } from "../contexts/theme_context";
//import { ThemeContextInterface } from "../types";
//import { SendLiveText } from "../features/live_actions/live_text";
import { NavigationBar } from "./NavigationBar";
import { Outlet } from "react-router-dom";
//import SimplePeer from "../components/SimplePeer";


export function HomeTeacher(props:any) {
    
    
    return (
        <div className="mx-10 p-5">
            <div className="bg-bgColor mx-3">
          
            <div className={`flex h-screen w-screen items-center justify-center bg-bgColor text-textColor`}>
        
            </div>
            </div>
        </div>
    )
}

/*
 return (
        <>
             <div className={`flex h-screen w-screen items-center justify-center bg-bgColor text-textColor`}>
          <div className="rounded-md bg-textColor p-8 text-bgColor">
              <h1 className="text-3xl">Theme {darkTheme ? "dark" : "light"}</h1>
              <button
                  onClick={toggleTheme}
                  className="mt-2 w-full rounded-none bg-bgColor p-2 text-center text-2xl uppercase tracking-[3px] text-textColor transition-all duration-300 ease-in-out hover:rounded-lg"
              >
                  Toggle
              </button>
          </div>
      </div>
        </>
    )
*/
