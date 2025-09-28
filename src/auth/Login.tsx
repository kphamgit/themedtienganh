import { useState } from "react";
import { useAppDispatch } from "../redux/store";
import { login } from "./services/list";
import { setCurrentUser } from "../redux/current_user";
//import { ThemeContext } from "../../../contexts/theme_context";
//import { ThemeContextInterface } from "../../../types";
import { AssignmentProps, setAssignments } from "../redux/assignments";

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
   
    /*
    Log in response:
    {
    "token": "1234567",
    "user": {
        "id": 15,
        "user_name": "basic2",
        "role": "student/admin",
        "level": "basic, intermediate, advanced",
        "class_id": 2,
        "message": "test"
    },
    "assignments": [
        {
            "id": 7,
            "assignment_number": 1,
            "content": "Assign url = /sub_categories/6/take_quiz/63",
            "completed": false,
            "createdAt": "2025-09-27T00:32:15.000Z",
            "updatedAt": "2025-09-27T00:32:15.000Z",
            "userId": 15
        }
    ]
}
    */

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      login({username: userName, password: password} )
      .then (response => {
        console.log("**************** Login response",response)
        props.onLoginSuccess(response.token)
        //setUser({user_name: 'test', level: 'basic', role: 'student'})
        // reduce the assignments data to only what is needed in the redux store
        console.log("Login handleSubmit, response.assignments=", response.assignments)
        /*
{
    "id": 82,
    "assignment_number": 1,
    "message": "Home work",
    "quiz_link": "/sub_categories/6/take_quiz/50",
    "quiz_name": "Các thì trong tiếng Việt và tiếng Anh 1",
    "completed": false,
    "createdAt": "2025-09-27T13:58:25.000Z",
    "updatedAt": "2025-09-27T13:58:25.000Z",
    "userId": 15
}
        */

        const assignments_params = response.assignments.map( (assignment: AssignmentProps) => ({
          assignment_number: assignment.assignment_number,
          message: assignment.message,
          quiz_link: assignment.quiz_link,
          quiz_name: assignment.quiz_name,
        }))
        console.log("Login success, assignments=", assignments_params)
        dispatch(setAssignments(assignments_params))
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
