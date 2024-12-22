import { useAppSelector } from '../../redux/store'
import HomeTeacher  from './HomeTeacher'
import  HomeStudent  from './HomeStudent'
import { lazy, useEffect, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocketContext } from '../../hooks/useSocketContext'

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
    const {socket, user_name, users} = useSocketContext()
    const navigate = useNavigate();

useEffect(() => {

    socket.on('enable_simple_peer', (arg:any) => {
      //console.log(" socket on enable_simple_peer arg =", arg)
      if (arg.to_user === user_name) {
        //console.log(" for me")
        navigate(`/simple_peer`, { state: users})
      }
     // 
    })
    return () => {
      socket?.off("enable_simple_peer")
    }
 
}, [socket, navigate, users])

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className=''>
      {user.role === 'teacher' ?
        <HomeTeacher />
        : (
        <HomeStudent />
        )
      }
 
 
    </div>
    </Suspense>
  )
}

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