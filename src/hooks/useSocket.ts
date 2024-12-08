
import { useEffect, useRef } from 'react'
import io, { ManagerOptions, SocketOptions } from 'socket.io-client'

export const useSocket = (
    url: string,
    opts?: Partial<ManagerOptions & SocketOptions> | undefined
) => {
    const {current: socket} = useRef(io(url, opts));
    useEffect(() => {
        return () => {
            if (socket) socket.close()
        }
    },[socket])
    return socket;
}


/*
io(opts?: Partial<ManagerOptions & SocketOptions> | undefined): Socket<DefaultEventsMap, DefaultEventsMap> (+1 overload)
import io
Looks up an existing Manager for multiplexing. If the user summons:

io('http://localhost/a'); io('http://localhost/b');
*/