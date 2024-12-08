import { useState } from "react";
import { useAppDispatch } from "../../../redux/store";
import { login } from "../services/list";
import { setCurrentUser } from "../../../redux/current_user";
//import { ThemeContext } from "../../../contexts/theme_context";
//import { ThemeContextInterface } from "../../../types";


export function Login(props:any) {
 
   // const { darkTheme, toggleTheme } = useContext(ThemeContext) as ThemeContextInterface;


    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
  
    const dispatch = useAppDispatch()
    
    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      login({username: userName, password: password} )
      .then (response => {
        props.onLoginSuccess(response.token)
        //setUser({user_name: 'test', level: 'basic', role: 'student'})
        dispatch(setCurrentUser({value: response.user}))
      })
      .catch(error => {
        console.log("Login error",error)
        //alert(error.response.data.error)
      })
    }
  
    return (
        <>

            <div className='flex flex-row justify-center'>
                <div className="flex flex-col m-10">
                    <div className={`flex h-screen w-screen items-center justify-center bg-bgColor text-textColor`}>
                        <div className="rounded-md bg-bgColor p-8 text-textColor">
                            <h1 className="text-2xl mb-2">Login</h1>
                            <form className="bg-bgColor">
                                <label>
                                    <p>Username</p>
                                    <input className="bg-gray-700 text-textColor text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5"
                                        type="text" onChange={e => setUserName(e.target.value)} />
                                </label>
                                <label>
                                    <p>Password</p>
                                    <input className="bg-gray-700 text-textColor text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5"
                                        type="text" onChange={e => setPassword(e.target.value)} />
                                </label>
                                <button className='bg-amber-800 m-2 p-2 hover:bg-amber-600 rounded-md' onClick={handleSubmit}>Submit</button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        
        </>
    )

}

/*
 return (
        <>

            <div className='flex flex-row justify-center'>
                <div className="flex flex-col m-10">

                    <div className={`flex h-screen w-screen items-center justify-center bg-bgColor text-textColor`}>
                        <div className="rounded-md bg-textColor p-8 text-bgColor">
                            <h1 className="text-3xl">Login {darkTheme ? "dark" : "light"}</h1>
                            <button
                                onClick={toggleTheme}
                                className="mt-2 w-full rounded-none bg-bgColor p-2 text-center text-2xl uppercase tracking-[3px] text-textColor transition-all duration-300 ease-in-out hover:rounded-lg"
                            >
                                Toggle
                            </button>
                            <form>
                                <label>
                                    <p>Username</p>
                                    <input className="bg-amber-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5"
                                        type="text" onChange={e => setUserName(e.target.value)} />
                                </label>
                                <label>
                                    <p>Password</p>
                                    <input className="bg-amber-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5"
                                        type="text" onChange={e => setPassword(e.target.value)} />
                                </label>
                                <button className='bg-amber-500 m-2 p-2 hover:bg-amber-600 rounded-md' onClick={handleSubmit}>Submit</button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
*/