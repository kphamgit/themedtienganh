import {useState, useContext, useEffect} from 'react'
import { TtSpeechContext } from '../../contexts/azure';
import {
    SpeechSynthesizer, AudioConfig,
    SpeakerAudioDestination,
  } from 'microsoft-cognitiveservices-speech-sdk';
import { TextCardComponentProps } from './types'

const TextCardAzure: React.FC<TextCardComponentProps> = ({ card, handleChoice }) => {

    const [disabled, setDisabled] = useState(false)
    const { ttSpeechConfig } = useContext(TtSpeechContext)
 
    useEffect(() => {
        // disable card if matched_index is - 1 (set when a match is found and there are no more cards in card banks)
        if (card.match_index === -1) {
            setDisabled(true)
            const card_el = document.getElementById(card.id.toString()) 
            if (card_el) {
             //console.log("in TextCardAzure set_bgColorxxxxxx card_el", card_el)
             card_el.style.backgroundColor = "#b5b59f"
             card_el.style.color = "#e6e6a1"
             }
        }
    }, [card.match_index])

    const handleClick = (target: HTMLButtonElement) => {
            target.style.border = "2px solid red"
            playAudio(card.src)
            handleChoice(card )
    }

    const playAudio = (text_to_speak: string) => {
        ttSpeechConfig.config.speechSynthesisVoiceName = "en-US-JasonNeural"
   
        //setPlayer(new SpeakerAudioDestination()) // kpham: need to reset player every time a new audio is played
        const new_player = new SpeakerAudioDestination()
        const audioConfig = AudioConfig.fromSpeakerOutput(new_player);

        const synthesizer = new SpeechSynthesizer(ttSpeechConfig.config, audioConfig);
        synthesizer.speakTextAsync(text_to_speak)
        
    }

    if (!card.matched ) {
        return (
            <>
            { card &&
            <button id={card.id} disabled={disabled} 
            className={`${card.side} rounded-md p-2 m-0 bg-amber-200 hover:bg-amber-300
            `}
                onClick={(e) => handleClick(e.currentTarget)}>
                {card.src}
            </button>
        }
            </>
        )
    }
}
    
  export default TextCardAzure

  /*
    return (
            <>
            { card ?
            <button id={card.id} className={`${card.side} rounded-md p-2 m-1 bg-amber-200 hover:bg-amber-300
            ${clicked ? "border-amber-600 border-4" : "border-transparent"}
            `}
                onClick={() => handleClick()}>
                {card.src}
            </button>
            : null

        }
            </>
        )
  */


