import React, { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { useSocket } from '../../hooks';
import { defaultSocketContextState, SocketContextProvider, SocketReducer } from './Context';
import { useAppSelector } from '../../redux/store';

export interface ISocketContextComponentProps extends PropsWithChildren {}

interface SocketInfo {
    socket_id: string;
    user_name: string;
 
}
//Youtube: https://www.youtube.com/watch?v=-aTWWl4klYE

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
    const { children } = props;
    const user = useAppSelector(state => state.user.value)

    const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5001';
        
    const socket = useSocket(URL!, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false,
        auth: {name: user.user_name}
    });

    const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
    const [loading, setLoading] = useState(true);

    //if (loading) return <p>Loading socket IO...</p>

    useEffect(() => {
        socket.connect();
        console.log("CONNECTING...")
        SocketDispatch({ type: 'update_socket', payload: socket });
        StartListeners();
        SendHandshake();
        // eslint-disable-next-line
    }, []);
    
    const StartListeners = () => {
        /** Messages */
        socket.on('user_connected', (users: SocketInfo[]) => {
            console.info('User connected message received');
            SocketDispatch({ type: 'update_users', payload: users });
        });

        /** Messages */
        socket.on('user_disconnected', (user_name: string) => {
            console.info('In socket Component.ts User disconnected message received user name=', user_name);
            SocketDispatch({ type: 'remove_user', payload: user_name });
        });

        /** Connection / reconnection listeners */
        socket.io.on('reconnect', (attempt) => {
            console.info('Reconnected on attempt: ' + attempt);
            SendHandshake();
        });

        socket.io.on('reconnect_attempt', (attempt) => {
            console.info('Reconnection Attempt: ' + attempt);
        });

        socket.io.on('reconnect_error', (error) => {
            console.info('Reconnection error: ' + error);
        });

        socket.io.on('reconnect_failed', () => {
            console.info('Reconnection failure.');
            alert('We are unable to connect you to the chat service.  Please make sure your internet connection is stable or try again later.');
        });
    };

    const SendHandshake = async () => {
        console.info('Sending handshake to server ...');

        socket.emit('handshake', async (user_name: string, users: SocketInfo[]) => {
            console.info('User handshake callback message received user_name =', user_name, " users = ", users);
            SocketDispatch({ type: 'update_users', payload: users });
            SocketDispatch({ type: 'update_user_name', payload: user_name });
        });

        setLoading(false);
    };

    if (loading) return <p>... loading Socket IO ....</p>;

    return <SocketContextProvider value={{ SocketState, SocketDispatch }}>{children}</SocketContextProvider>;
};

export default SocketContextComponent;