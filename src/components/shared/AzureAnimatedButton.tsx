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
    parentFunc: (selected_text: string, droppedIndex: number | undefined, available: boolean) => void
  }
  
export const AzureAnimatedButton = (props: AzureButtonProps) => {
    const { ttSpeechConfig } = useContext(TtSpeechContext)
    //console.log("in AzureButton", props)
      const buttonRef = useRef<HTMLButtonElement>(null);

      
      const [droppedIndex, setDroppedIndex] = useState<number | undefined>(); // >=0 means dropped
    
      const [myRect, setMyRect] = useState<DOMRect | null>(null);
     
 
      const [dynamicVerticalOffsets, setDynamicVerticalOffsets] = useState<number[]>([]);
      const [dynamicHorizontalOffsets, setDynamicHorizontalOffsets] = useState<number[]>([]);

      const [isClicked, setIsClicked] = useState<boolean>(false);

      useEffect(() => {
        setMyRect(buttonRef.current!.getBoundingClientRect());        
      }, []); // Run once on mount or when id changes
     
    
      useEffect(() => {
        if (props.dropBoxes) {
          //console.log(" in useEffect UUUUUUUU updateCount:", updateCount, " for AzureAnimatedButton id=", props.id);
          //console.log("in useEffect: props.dropBoxes size:", props.dropBoxes.length);
          if (!myRect || props.dropBoxes.length === 0) {
            //console.log("buttonRef.current is null or dropBoxes lenght is 0, cannot calculate offsets");
            return;
          }
          //console.log("in useEffect: props.dropBoxes size =", props.dropBoxes.length);
          props.dropBoxes.forEach((dropBox, index) => {
            //console.log(" ");
            //console.log("in useEffect: dropBox INDEX:", index);
            //console.log("in useEffect: dropBox ", index, " rect:", dropBox.rect);
            //const draggable_rect = buttonRef.current!.getBoundingClientRect();        
            //console.log("button myRect:", myRect);
            const buttonWidth = myRect.width;
            const dropboxWidth = dropBox.rect.width;
            const sideMarginHorizontal = (dropboxWidth - buttonWidth) / 2;
            const offsetX = dropBox.rect.left  - myRect.left;
            //console.log("in useEffect: offsetX (from ", props.id, " to dropbox", index, "):", offsetX);
            setDynamicHorizontalOffsets(prevOffsets => {
              const newOffsets = [...prevOffsets];
              newOffsets[index] = offsetX + sideMarginHorizontal;
              return newOffsets;
            });
            const buttonHeight = myRect.height;
            const dropboxHeight = dropBox.rect.height;
            const sideMarginVertical = (dropboxHeight - buttonHeight) / 2;
            const offsetY = dropBox.rect.top - myRect.top;
            //console.log("in useEffect: offsetY (from ", props.id, " to dropbox", index, "):", offsetY);
            setDynamicVerticalOffsets(prevOffsets => {
              const newOffsets = [...prevOffsets];
              newOffsets[index] = offsetY + sideMarginVertical;
              return newOffsets;
            });
          })
        }
      }, [props.dropBoxes, props.id, myRect]); // Run once on mount or when dropBoxes change


      useEffect(() => {
        if (dynamicHorizontalOffsets.length === 0 || dynamicVerticalOffsets.length === 0) {
          //console.log("in useEffect: horizontalOffsets or verticalOffsets are empty, cannot log offsets");
          return;
        }
        if (dynamicHorizontalOffsets.length !== dynamicVerticalOffsets.length) {
          //console.log("in useEffect: horizontalOffsets and verticalOffsets lengths do not match, cannot log offsets");
          return;
        }
          //console.log("in useEffect: my ID: ", props.id, " my button text: ", props.button_text,  "my horizontalOffsets", dynamicHorizontalOffsets);
          //console.log("in useEffect: my ID: ", props.id, " my button text: ", props.button_text, "my verticalOffsets", dynamicVerticalOffsets);
      }, [dynamicHorizontalOffsets, dynamicVerticalOffsets, props.id]);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
       // look in dropboxes to check for first available slot
       setIsClicked(true);
       if (droppedIndex !== undefined && droppedIndex >= 0) {
        //console.log("Button already dropped droppedIndex = ",droppedIndex," return to original position");
        if (buttonRef.current) {
         // Call the parent function with the button text and dropped index
          buttonRef.current.style.transform = `translate(0px, 0px)`;
          // so that it can update the available state of the dropbox
          setDroppedIndex(undefined);
          // release the corresponding dropbox
         // props.dropBoxes![droppedIndex].available = true;
          props.parentFunc(props.button_text!, droppedIndex, true)
        }
        else {
          console.log("buttonRef.current is null, cannot reset position");
          return;
        }
        return;
       }
       const availableDropBox = props.dropBoxes?.find(dropBox => dropBox.available);
        if (availableDropBox) {
          //console.log("available dropbox found")
          const droppedIndex = props.dropBoxes!.indexOf(availableDropBox);
          //console.log("dropped index", droppedIndex)
          if (buttonRef.current) {
            //props.dropBoxes?.forEach((dropBox, index) => {
              // calculate the offsets for the buttons from the dropboxes    
              //console.log(" HERE 1 horizontalOffsets", dynamicHorizontalOffsets)
              //console(" verticalOffsets", verticalOffsets)
              buttonRef.current.style.transform = `translate(${dynamicHorizontalOffsets[droppedIndex]}px, ${dynamicVerticalOffsets[droppedIndex]}px)`;
              setDroppedIndex(droppedIndex);
              props.parentFunc(props.button_text!, droppedIndex, false)
            //})

          }
        } else {
          console.log("No available dropbox found");
        }
        playAudio();
        //console.log('Button clicked:', props.button_text);
    }
    

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
          <prosody rate="-5.00%">
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
      <button
      ref={buttonRef}
      className={`bg-blue-300 px-2 text-black rounded-md ${
        isClicked ? "" : "hover:bg-blue-200"
      }`}
      onClick={(e) => {
        setIsClicked(true); // Set isClicked to true when the button is clicked
        handleClick(e); // Call the existing handleClick function
      }}
      style={{
        transition: "transform 0.3s ease-in-out", // Smooth animation
      }}
    >
      {props.button_text}
    </button> 
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
