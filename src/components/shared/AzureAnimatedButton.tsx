import { MouseEventHandler, useContext, useEffect, useRef, useState } from 'react'
import { TtSpeechContext } from '../../contexts/azure';

import {
  SpeechSynthesizer, AudioConfig,
  SpeechSynthesisOutputFormat,
  SpeakerAudioDestination,
} from 'microsoft-cognitiveservices-speech-sdk';
import { DOMRectPropsType } from '../quiz_attempts/question_attempts/ButtonSelecCloze';

export type DroppedBoxInfo = {
  droppedBoxId: string | undefined,
  rect: DOMRectPropsType | undefined
}
export interface AzureButtonProps {
    id: string;
    voice_text?: string;
    button_text: string | undefined;
    //dropBoxes?: DropBoxProps[] | undefined;
    parentFunc: (selectedAnimatedButtonId: string, selected_text: string) => DroppedBoxInfo
    parentFunc1: (width: number) => void  // called after components finished mounting to inform parent of my width
    parentFuncResetDropBox: (dropBoxId: string) => void
  }
  
export const AzureAnimatedButton = (props: AzureButtonProps) => {
    const { ttSpeechConfig } = useContext(TtSpeechContext)
    //console.log("in AzureButton", props)
      const buttonRef = useRef<HTMLButtonElement>(null);

      // the id of the drop box where this Animated Button is dropped onto
      const [droppedBoxId, setDroppedBoxId] = useState<string | undefined>(); // >=0 means dropped
    
      const [myRect, setMyRect] = useState<DOMRect | null>(null);
  
      const clickCount = useRef<number>(0);
 
      const [dynamicVerticalOffsets, setDynamicVerticalOffsets] = useState<number[]>([]);
      const [dynamicHorizontalOffsets, setDynamicHorizontalOffsets] = useState<number[]>([]);

      const [isClicked, setIsClicked] = useState<boolean>(false);

      useEffect(() => {
       // console.log("in AzureAnimatedButton useEffect button Bounding Rectangle =", buttonRef.current!.getBoundingClientRect());
        /*
 {
    "x": 475.296875,
    "y": 344.5,
    "width": 92.921875,
    "height": 24,
    "top": 344.5,
    "right": 568.21875,
    "bottom": 368.5,
    "left": 475.296875
}

{
    "x": 588.21875,
    "y": 344.5,
    "width": 85.4765625,
    "height": 24,
    "top": 344.5,
    "right": 673.6953125,
    "bottom": 368.5,
    "left": 588.21875
}
        */
        setMyRect(buttonRef.current!.getBoundingClientRect());        
      }, []); // Run once on mount 
     
      useEffect(() => {
        if (myRect) {
          props.parentFunc1(myRect.width);  //now that I got my reactangle, let inform parent of my width
        }
      }, [myRect, props]);
    
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
          // increment click count
          clickCount.current += 1;
          
          // click count is even means button is being reset to original position
          if (clickCount.current % 2 === 0) {
            // reset button position
            if (buttonRef.current) {
              buttonRef.current.style.transform = `translate(0px, 0px)`;
            }
            // call parent function to clear corresponding drop box for this animated button
            if (droppedBoxId) {
              console.log("in AzureAnimatedButton handleClick: resetting drop box id =", droppedBoxId);
              props.parentFuncResetDropBox(droppedBoxId);
            }
            else {
              console.warn("in AzureAnimatedButton handleClick: droppedBoxId is undefined during reset");
            }
            return;
          }
          
          //const dropBoxRect: DOMRectPropsType | undefined = props.parentFunc( props.id, props.button_text!);
          const droppedBoxInfo: DroppedBoxInfo = props.parentFunc( props.id, props.button_text!);
          //droppedBoxId: availableDropBox?.id, rect: availableDropBox?.rect };
          if (buttonRef.current && droppedBoxInfo.rect) {
            setDroppedBoxId(droppedBoxInfo.droppedBoxId ? droppedBoxInfo.droppedBoxId : undefined);
            //console.log("in **** AzureAnimatedButton handleClick NO Picture, received dropBoxRect =", droppedBoxInfo.rect);
            //console.log("in **** AzureAnimatedButton handleClick NO Picture, buttonRef rec =", buttonRef.current.getBoundingClientRect());
            const dropBoxRect = droppedBoxInfo.rect;
            // the assumption is that animated button's width is always smaller than dropbox width
            // get the difference and divide by 2 to establish the x margin to center the button in the dropbox
            const margin_x = (dropBoxRect.width - buttonRef.current.getBoundingClientRect().width) / 2;
          const x_diff = dropBoxRect.x - buttonRef.current.getBoundingClientRect().x;

          const margin_y = (dropBoxRect.height - buttonRef.current.getBoundingClientRect().height) / 2;
          
          const y_diff = dropBoxRect.y - buttonRef.current.getBoundingClientRect().y;
          buttonRef.current.style.transform = `translate(${x_diff + margin_x}px,  ${y_diff + margin_y}px)`;
          }
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
