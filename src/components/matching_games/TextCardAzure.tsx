import {useState, forwardRef, useImperativeHandle, useContext} from 'react'
import { TtSpeechContext } from '../../contexts/azure';
import {
    SpeechSynthesizer, AudioConfig,
    SpeakerAudioDestination,
  } from 'microsoft-cognitiveservices-speech-sdk';
import { CardProps } from './types'

export interface TextCardAzureRefProps {
    //toggleDisabled: () => void;
    set_clicked: (value: boolean) => void;
    getText: () => string;
  }

interface TextCardAzureComponentProps {
    card: CardProps;
    handleChoice: (card: CardProps) => void;    
    card_side: string;
}

/*
export interface CardProps {
    src: string;
    matched: boolean;
    match_index: number;
    language: string;
}
*/

const TextCardAzure = forwardRef<TextCardAzureRefProps, TextCardAzureComponentProps>(
    (props, ref) => {

    const [clicked, setClicked] = useState(false);   
    const { ttSpeechConfig } = useContext(TtSpeechContext)
    const [player, setPlayer] = useState(new SpeakerAudioDestination())
   
        useImperativeHandle(ref, () => ({
            //toggleDisabled,
            set_clicked: (value: boolean) => {
                setClicked(value)
            },
            getText: () => {
                return props.card.src
            }
        }));


    const handleClick = () => {
            //console.log("in TextCard handleClick setClicked to true")
            setClicked(true)
            playAudio(props.card.src)
            props.handleChoice(props.card)
    }

    const playAudio = (text_to_speak: string) => {
        ttSpeechConfig.config.speechSynthesisVoiceName = "en-US-JasonNeural"
   
        setPlayer(new SpeakerAudioDestination()) // kpham: need to reset player every time a new audio is played
        const audioConfig = AudioConfig.fromSpeakerOutput(player);

        const synthesizer = new SpeechSynthesizer(ttSpeechConfig.config, audioConfig);
        synthesizer.speakTextAsync(text_to_speak)
        
    }

    if (!props.card.matched ) {
        return (
            <>
            { props.card ?
            <button className={`${props.card_side} rounded-md p-2 m-1 bg-amber-100 hover:bg-amber-300
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


