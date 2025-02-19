import { useState } from "react";
import { useAppDispatch } from "../redux/store";
import { login } from "./services/list";
import { setCurrentUser } from "../redux/current_user";
//import { ThemeContext } from "../../../contexts/theme_context";
//import { ThemeContextInterface } from "../../../types";

/*
const navigate = useNavigate()
    //const socket = useSocket()
    const {socket} = useContext(SocketContext).SocketState;

    useEffect(() => {
        socket?.disconnect()
        
        props.onLogout()
        navigate('/')
*/

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
                        <div className="rounded-md p-8 text-gray-500">
                            <h1 className="text-2xl mb-2 text-gray-500">Login</h1>
                            <form className="bg-bgColor text-textColor2">
                                <label>
                                    <p>Username</p>
                                    <input className="bg-amber-400 text-amber-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5"
                                        type="text" onChange={e => setUserName(e.target.value)} />
                                </label>
                                <label>
                                    <p>Password</p>
                                    <input className="bg-amber-400 text-amber-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5"
                                        type="text" onChange={e => setPassword(e.target.value)} />
                                </label>
                                <button className='bg-green-300 text-amber-900 m-2 p-2 hover:bg-green-400 rounded-md' onClick={handleSubmit}>Submit</button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        
        </>
    )

}
