import { useEffect , useContext} from 'react'
import { useNavigate } from 'react-router-dom';
//import { useSocket} from '../context/socketContext'


//import SocketContext from './context/Socket/Context'
import SocketContext from '../../../contexts/socket_context/Context';
import { useAppDispatch } from '../../../redux/store';

type LogoutProps = {
    onLogout: Function
}

export function Logout(props: LogoutProps) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    //const socket = useSocket()
    const {socket, uid, users} = useContext(SocketContext).SocketState;

    useEffect(() => {
        socket?.disconnect()
 
        props.onLogout()
        navigate('/')
        //eslint-disable-next-line
    },[dispatch, navigate, props])

    return (
       <></>
    )
}
