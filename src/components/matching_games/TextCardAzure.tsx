import {useState, forwardRef, useImperativeHandle, useContext} from 'react'
import { TtSpeechContext } from '../../contexts/azure';
import {
    SpeechSynthesizer, AudioConfig,
    SpeakerAudioDestination,
  } from 'microsoft-cognitiveservices-speech-sdk';
import { TextCardComponentProps, TextCardRefProps } from './types'

  
const TextCardAzure = forwardRef<TextCardRefProps, TextCardComponentProps>(
    (props, ref) => {

    const [clicked, setClicked] = useState(false);   
   // const [bgColor, setBgColor] = useState("bg-amber-100");   
    const { ttSpeechConfig } = useContext(TtSpeechContext)
    //const [player, setPlayer] = useState(new SpeakerAudioDestination())

    //const cardRef = useRef<(TextCardRefProps)>(null);
   
        useImperativeHandle(ref, () => ({
            //toggleDisabled,
            set_clicked: (value: boolean) => {
                setClicked(value)
            },
            set_bgColor: (color: string) => {
                //console.log("in TextCardAzure set_bgColor to color", color)
                /*
                const card_el = document.getElementById(props.card.id.toString()) 
                if (card_el) {
                    //console.log("in TextCardAzure set_bgColorxxxxxx card_el", card_el)
                    card_el.style.backgroundColor = color
                }
                    */
            },
            getText: () => {
                return props.card.src
            },
            getSide: () => {
                return props.card.side
            }
        }));


    const handleClick = () => {
            //console.log("in TextCard handleClick setClicked to true")
            setClicked(true)
            playAudio(props.card.src)
            props.handleChoice(props.card )
    }

    const playAudio = (text_to_speak: string) => {
        ttSpeechConfig.config.speechSynthesisVoiceName = "en-US-JasonNeural"
   
        //setPlayer(new SpeakerAudioDestination()) // kpham: need to reset player every time a new audio is played
        const new_player = new SpeakerAudioDestination()
        const audioConfig = AudioConfig.fromSpeakerOutput(new_player);

        const synthesizer = new SpeechSynthesizer(ttSpeechConfig.config, audioConfig);
        synthesizer.speakTextAsync(text_to_speak)
        
    }

    if (!props.card.matched ) {
        return (
            <>
            { props.card ?
            <button  className={`${props.card.side} rounded-md p-2 m-1 bg-amber-200 hover:bg-amber-300
            ${clicked ? "border-amber-700 border-2" : "border-transparent"}
            `}
                onClick={() => handleClick()}>
                {props.card.src}
            </button>
            : null

        }
            </>
        )
    }
})  
    
  export default TextCardAzure


