import { createContext } from 'react';
import { Socket } from 'socket.io-client';

interface SocketInfo {
    socket_id: string;
    user_name: string;
 
}

export interface ISocketContextState {
    socket: Socket | undefined;
    user_name: string;
    users: SocketInfo[];
}
//Youtube: https://www.youtube.com/watch?v=-aTWWl4klYE

export const defaultSocketContextState: ISocketContextState = {
    socket: undefined,
    user_name: '',
    users: [],
};

export type TSocketContextActions = 'update_socket' | 'update_user_name' | 'update_users' | 'remove_user';
export type TSocketContextPayload = string | SocketInfo[] | Socket;

export interface ISocketContextActions {
    type: TSocketContextActions;
    payload: TSocketContextPayload;
}

export const SocketReducer = (state: ISocketContextState, action: ISocketContextActions) => {
    console.log('in SocketReducer: message received - Action: ' + action.type + ' - Payload: ', action.payload);

    switch (action.type) {
        case 'update_socket':
            return { ...state, socket: action.payload as Socket };
        case 'update_user_name':
            return { ...state, user_name: action.payload as string };
        case 'update_users':
            return { ...state, users: action.payload as SocketInfo[] };
        case 'remove_user':
            return { ...state, users: state.users.filter((user) => user.socket_id !== (action.payload as string) ) };
        default:
            return state;
    }
};

export interface ISocketContextProps {
    SocketState: ISocketContextState;
    SocketDispatch: React.Dispatch<ISocketContextActions>;
}

const SocketContext = createContext<ISocketContextProps>({
    SocketState: defaultSocketContextState,
    SocketDispatch: () => {}
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;