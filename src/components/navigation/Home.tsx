import { useAppSelector } from '../../redux/store'
import HomeTeacher  from './HomeTeacher'
import  HomeStudent  from './HomeStudent'

//const HomeTeacher = lazy(() => import("./HomeTeacher"))
//const HomeStudent = lazy(() => import("./HomeStudent"))

interface SocketInfo {
  socket_id: string | undefined;
  user_name: string;

}

/*
function getAuthFromSessionStorage() {
  const tokenString = sessionStorage.getItem('auth');
  if (tokenString !== null)
    return JSON.parse(tokenString)
  else {
    return null
  }
}
*/

export default function Home() {
    const user = useAppSelector(state => state.user.value)
    //const {socket, user_name, users} = useSocketContext()
    //const [roomID, setRoomID] = useState('')
    //const navigate = useNavigate();

  
  return (
  
    <div>
      {user.role === 'teacher' ?
        <HomeTeacher />
        : (
        <HomeStudent />
        )
      }
    </div>
   
  )
}

/*
 return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className='grid grid-cols-12 gap-2'>
      <div className='col-span-9'>
      {user.role === 'teacher' ?
        <HomeTeacher />
        : (
        <HomeStudent />
        )
      }
      </div>
      <div className='col-span-3'>
      {roomID.length > 0 &&
        <Room roomID={roomID} />
      }
      </div>
    </div>
    </Suspense>
  )
*/

//export default Home;
/*
return (
  <div className='m-14'>
    <NavigationBar />
    <Outlet />
    {user.role === 'teacher' ?
      <HomeTeacher />
      : (
      <HomeStudent />
      )
    }


  </div>

)
*/

