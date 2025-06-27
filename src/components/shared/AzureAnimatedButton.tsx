import { MouseEventHandler, useContext, useEffect, useRef, useState } from 'react'
import { TtSpeechContext } from '../../contexts/azure';

import {
  SpeechSynthesizer, AudioConfig,
  SpeechSynthesisOutputFormat,
  SpeakerAudioDestination,
} from 'microsoft-cognitiveservices-speech-sdk';
import { DropBoxProps } from '../quiz_attempts/question_attempts/ButtonSelecCloze';

export interface AzureButtonProps {
    id: string;
    voice_text?: string;
    button_text: string | undefined;
    dropBoxes?: DropBoxProps[] | undefined;
    parentFunc: (selected_text: string, droppedIndex: number) => void
  }
  
export const AzureAnimatedButton = (props: AzureButtonProps) => {
    const { ttSpeechConfig } = useContext(TtSpeechContext)
    //console.log("in AzureButton", props)
    //const handleClick: MouseEventHandler<HTMLSpanElement> = (event) => {
      const buttonRef = useRef<HTMLButtonElement>(null);

      const [verticalOffsets, setVerticalOffsets] = useState<number[]>([]);
      const [horizontalOffsets, setHorizontalOffsets] = useState<number[]>([]);
 
      useEffect(() => {
        // Log the dropBoxes prop whenever it changes  
        //console.log("******** AzureButton, props.dropBoxes changed:SIZE =", props.dropBoxes?.length);
        //console.log("******** AzureButton, props.dropBoxes changed: dropBo ", props.dropBoxes);
        // If you want to do something with the dropBoxes, you can add logic here
        if (props.dropBoxes) {
          if (props.dropBoxes.length > 0 && buttonRef.current) {
            //console.log("DropBoxes:", props.dropBoxes);
            //console.log(" dropBox y : ", props.dropBoxes[0].rect.top);
            props.dropBoxes.forEach((dropBox, index) => {
              const rect = buttonRef.current!.getBoundingClientRect();
              const buttonWidth = rect.width;
              //console.log('Button width:', buttonWidth);
              const dropboxWidth = dropBox.rect.width;
              //console.log('DropBox width:', dropboxWidth);
              const sideMarginHorizontal = (dropboxWidth - buttonWidth) / 2;
              //console.log('Side Margin:', sideMargin);
             
              const offsetX =dropBox.rect.left - rect.left;
              //setVerticalOffset(offsetY);
              setHorizontalOffsets(prevOffsets => {
                const newOffsets = [...prevOffsets];
                newOffsets[index] = offsetX + sideMarginHorizontal;
                return newOffsets;
              });

              const buttonHeight = rect.height;
              //console.log('Button width:', buttonWidth);
              const dropboxHeight = dropBox.rect.height;
              //console.log('DropBox width:', dropboxWidth);
              const sideMarginVertical = (dropboxHeight - buttonHeight) / 2;
              //console.log('Side Margin:', sideMargin);
              const offsetY = dropBox.rect.top - rect.top;
     
              setVerticalOffsets(prevOffsets => {
                const newOffsets = [...prevOffsets];
                newOffsets[index] = offsetY + sideMarginVertical;
                return newOffsets;
              });
            })
          }
        }
      }, [props.dropBoxes]);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
       // look in dropboxes to check for first available slot
       const availableDropBox = props.dropBoxes?.find(dropBox => dropBox.available);
        if (availableDropBox) {
          //console.log("available dropbox found", availableDropBox)
          const droppedIndex = props.dropBoxes!.indexOf(availableDropBox);
          console.log("dropped index", droppedIndex)
          
          
          if (buttonRef.current) {
            // Move the button to the first available dropbox position
            buttonRef.current.style.transform = `translate(${horizontalOffsets[droppedIndex]}px, ${verticalOffsets[droppedIndex]}px)`;
            // Call the parent function with the button text and dropped index
            // so that it can update the available state of the dropbox
            props.parentFunc(props.button_text!, droppedIndex)
          }
        } else {
          console.log("No available dropbox found");
        }
        playAudio();
        //console.log('Button clicked:', props.button_text);
    }
      /*
        const el = event.target as HTMLButtonElement
        //console.log('in handle click text content', el.textContent)
        const button_id = props.id
        console.log('in handle click button id', button_id)
        //azure-button-0
        playAudio()
        props.parentFunc(el.textContent!, 0 )
        if (buttonRef.current) {
            // Move the button to a new position
            const temp = verticalOffset;
            buttonRef.current.style.transform = `translate(${horizontalOffset}px, ${temp}px)`;
        }
        */
    

    const playAudio = () => {
        //console.log("in playAudio ", props.text)
        let player = new SpeakerAudioDestination()
        const audioConfig = AudioConfig.fromSpeakerOutput(player);

        //ttSpeechConfig.config.speechSynthesisVoiceName = "en-US-JaneNeural"
        ttSpeechConfig.config.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3

        const synthesizer = new SpeechSynthesizer(ttSpeechConfig.config, audioConfig);
        
        /*
        const t = 
        `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
             <voice name="en-US-Andrew2:DragonHDLatestNeural">
            <phoneme alphabet="ipa" ph="${props.button_text}"> ${props.button_text} </phoneme>
            </voice>
        </speak>`
        */
        const t = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="en-US-Andrew2:DragonHDLatestNeural">
          <prosody rate="-10.00%">
          ${props.button_text}
          </prosody>
        </voice>
        </speak>`
        /*
        pˈɪd͡ʒən
        if (props.voice_text) {
        synthesizer.speakTextAsync(props.voice_text)
        }
        else {
            synthesizer.speakTextAsync(props.button_text!)
        }
        */
        synthesizer.speakSsmlAsync(t)
       
    }

    return (
        <>
          <button ref={buttonRef} 
          className='bg-amber-700 text-white px-2 rounded-md hover:bg-amber-900'
             onClick={handleClick}
             style={{
              transition: 'transform 0.5s ease-in-out', // Smooth animation
            }}
            >
            {props.button_text}
          </button>
        </>
    )
}

/*
  let player = new SpeakerAudioDestination()
        const audioConfig = AudioConfig.fromSpeakerOutput(player);

        //ttSpeechConfig.config.speechSynthesisVoiceName = "en-US-JaneNeural"
        ttSpeechConfig.config.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3

        const synthesizer = new SpeechSynthesizer(ttSpeechConfig.config, audioConfig);
        //synthesizer.speakTextAsync(props.text!)
        const t = 
        `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
            <voice name="en-US-AvaNeural">
            <phoneme alphabet="ipa" ph="ə."> tomato </phoneme>
            </voice>
        </speak>`

        /*
        const t = 
        `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="en-US-JaneNeural">
          <prosody rate="-10.00%">
              ${props.text}
          </prosody>
        </voice>
        </speak>`
        */
        //synthesizer.speakSsmlAsync(t)
