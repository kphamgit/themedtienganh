import React, { useEffect, useState } from 'react'
import Room from '../shared/Room'
import { v1 as uuid } from "uuid";

export function Side(props: {room_id: string}) {
    
    const [roomID, setRoomID] = useState('')

    useEffect(() => {
        setRoomID(props.room_id)
    },[props.room_id])

    return (
        <>
            { roomID &&
                 <Room roomID = {roomID} />
            }
           
        </>
    )
}
