import React, { MouseEventHandler, useContext } from 'react'
import SocketContext from '../../contexts/socket_context/Context';


export function NameList(props: {parentFunct: (name: string) => void}) {
    const {socket, user_name, users} = useContext(SocketContext).SocketState;

    //const handleNameClick = () => {
     //   props.parentFunct("name")
   // }

    const handleNameClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        const el = event.target as HTMLButtonElement
        props.parentFunct(el.textContent as string)
    }

    return (
        <div className='flex flex-row justify-end gap-2 mt-2'>
        {users &&
            users.map((student, index) => (
                <div key={index} >
                <button className='bg-bgColor2 text-textColor1 p-1 rounded-md' onClick={handleNameClick}>{student.user_name}</button>
                </div>
            ))
        }
        <button className='bg-blue-600 text-white p-1 rounded-md' onClick={handleNameClick}>everybody</button>
    </div>
    )
}
