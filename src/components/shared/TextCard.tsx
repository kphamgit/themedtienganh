import {useEffect, useRef, useContext, useState} from 'react'
//import { setAudioEnded } from "../redux/audio_ended";
import { useDispatch } from "react-redux";
//import AudioPlayer from './AudioPlayer.js';
//mport { PollyContext } from './App.js';

//  {src: str, matched: false, match_index: index}

export interface TextCardProps {
    src: string;
    matched: boolean;
    match_index: number;
    language: string;
}

//export function TextCard({card, handleChoice, card_side}) {
    export function TextCard(props: {card: TextCardProps, handleChoice: (card: TextCardProps) => void, card_side: string}) {
  
    const dispatch = useDispatch()
    const [audioFile, setAudioFile] = useState('')
    const [side, setSide] = useState('')
    //const [audioEnded, setAudioEnded] = useState(false)
    const audioRef = useRef()
    //const [audioEnded, setAudioEnded] = useState(false)
    //audioEnded flag is not being used now, but you may need it in the future. Kevin
    
    useEffect(() => {
        setSide(props.card_side)
    }, [props.card_side])

    const handleClick = (target:any) => {
            
           // target.style.borderColor = "red"
            //setTimeout(() => {
              //  target.style.borderColor = "#c9cca3"
            //}, [700])
       
            props.handleChoice(props.card)
    }

    if (!props.card.matched ) {
        return (
            <>
            <span className="rounded-md p-2 m-1 bg-amber-500" onClick={(e) => handleClick(e.target)}>
                {props.card.src}
            </span>
           
            </>
        )
    }
    return (
        <>
            <span className="rounded-md p-1 m-1" style={{backgroundColor: 'lightgray'}}>
               MATCHED
            </span>
        </>
    )
}
