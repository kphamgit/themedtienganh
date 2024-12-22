import { MouseEventHandler, useContext } from 'react'
import { TtSpeechContext } from '../../contexts/azure';

import {
  SpeechSynthesizer, AudioConfig,
  SpeechSynthesisOutputFormat,
  SpeakerAudioDestination,
} from 'microsoft-cognitiveservices-speech-sdk';

interface MyProps {
    text: string | undefined;
    parentFunc: (selected_text: string) => void
  }
  
export const AzureButton = (props: MyProps) => {

    const { ttSpeechConfig } = useContext(TtSpeechContext)
    //console.log("MMMMpppp", props.text)
    //const handleClick: MouseEventHandler<HTMLSpanElement> = (event) => {

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
       
        const el = event.target as HTMLButtonElement
        //console.log(el.textContent)
        playAudio()
        props.parentFunc(el.textContent!)
    }

    const playAudio = () => {
        //console.log("in playAudio ", props.text)
        let player = new SpeakerAudioDestination()
        const audioConfig = AudioConfig.fromSpeakerOutput(player);

        //ttSpeechConfig.config.speechSynthesisVoiceName = "en-US-JaneNeural"
        ttSpeechConfig.config.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3

        const synthesizer = new SpeechSynthesizer(ttSpeechConfig.config, audioConfig);
        synthesizer.speakTextAsync(props.text!)
       
    }


    return (
        <>
            <button className='bg-amber-700 p-1 text-white rounded-md hover:bg-amber-900' onClick={handleClick}>{props.text}</button>
        </>
    )
}
