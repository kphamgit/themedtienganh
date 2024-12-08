import { useAppSelector} from '../../redux/store'
import { HomeTeacher } from './HomeTeacher'
import { HomeStudent } from './HomeStudent'
import SocketContext from '../../contexts/socket_context/Context'
import { useContext, useEffect, useState } from 'react'
import { NavigationBar } from './NavigationBar'
import { Outlet, useNavigate } from 'react-router-dom'

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

export function Home() {
    const user = useAppSelector(state => state.user.value)
    //const [auth, setAuth] = useState(getAuthFromSessionStorage());
    const {socket, uid, users, user_uuids} = useContext(SocketContext).SocketState;
    const [loggedInUsers, setLoggedInUsers] = useState<SocketInfo[] | undefined>([])
   
    const navigate = useNavigate();


useEffect(() => {
  if (socket) {
    socket.on('enable_simple_peer', (arg: {}) => {
      navigate(`/simple_peer`, { state: loggedInUsers})
    })
    return () => {
      socket?.off("enable_simple_peer")
    }
  }
}, [socket, navigate, loggedInUsers])

  return (
    <div className='m-14'>
      <NavigationBar />
      <Outlet />
      {user.role === 'teacher' ?
        <HomeTeacher logged_in_users={users} />
        :
        <HomeStudent logged_in_users={users} />
      }
 
 
    </div>

  )
}

