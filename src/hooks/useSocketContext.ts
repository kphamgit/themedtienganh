import { useContext } from "react";
import SocketContextComponent from "../contexts/socket_context/Component";
import SocketContext from "../contexts/socket_context/Context";

export function useSocketContext() {
    const { socket, user_name, users } = useContext(SocketContext).SocketState;

    if (socket === undefined) {
        throw new Error('useUserContext must be used with a DashboardContext');
    }
    //console.log("XXXXX in userSocketContext")
    return { socket, user_name, users };
}