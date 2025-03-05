import {useEffect, useRef, useContext, useState} from 'react'
//import { setAudioEnded } from "../redux/audio_ended";
import { useDispatch } from "react-redux";
import { TtSpeechContext } from '../../contexts/azure';
//import AudioPlayer from './AudioPlayer.js';
//mport { PollyContext } from './App.js';
import {
    SpeechSynthesizer, AudioConfig,
    SpeakerAudioDestination,
  } from 'microsoft-cognitiveservices-speech-sdk';

//  {src: str, matched: false, match_index: index}

export interface TextCardProps {
    src: string;
    matched: boolean;
    match_index: number;
    language: string;
}

//export function TextCard({card, handleChoice, card_side}) {
    export function TextCardAzure(props: {card: TextCardProps, handleChoice: (card: TextCardProps) => void, card_side: string}) {
  
    const dispatch = useDispatch()
    const [audioFile, setAudioFile] = useState('')
    const [side, setSide] = useState('')
    //const [audioEnded, setAudioEnded] = useState(false)
    const audioRef = useRef()
    //const [audioEnded, setAudioEnded] = useState(false)
    //audioEnded flag is not being used now, but you may need it in the future. Kevin
    
  const { ttSpeechConfig } = useContext(TtSpeechContext)

    useEffect(() => {
        setSide(props.card_side)
    }, [props.card_side])

    const handleClick = (target:any) => {
            
           // target.style.borderColor = "red"
            //setTimeout(() => {
              //  target.style.borderColor = "#c9cca3"
            //}, [700])
            playAudio(props.card.src)
            
    }

    const playAudio = (text_to_speak: string) => {
        // call parent function 1 immediately to disable all the right buttons
          //props.parentFunc1()
          //console.log("in DISABLE RIGHT BUTTONS");
          
          //ttSpeechConfig.config.speechSynthesisVoiceName = "en-US-JasonNeural"
          //ttSpeechConfig.config.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3 
  
          let player = new SpeakerAudioDestination()
          const audioConfig = AudioConfig.fromSpeakerOutput(player);
  
          player.onAudioEnd = function() {
            console.log("in onAudioEnd")
            props.handleChoice(props.card)
            //props.handleAudioEnded(props.word_pair, props.side)
            //setTimeout(function(){ $("svg path :first-child").each( function(i) {this.beginElement();}); }, 0.5);
          }
          const synthesizer = new SpeechSynthesizer(ttSpeechConfig.config, audioConfig);
          
          const complete_cb = function (result:any) {
            synthesizer.close();
            //synthesizer = undefined;
          };
          const err_cb = function (err:any) {
            //window.console.log(err);
            synthesizer.close();
            //synthesizer = undefined;
          };
          synthesizer.speakTextAsync(text_to_speak,
            complete_cb,
            err_cb);
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
