import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { CardProps } from "../matching_games/MemoryGame";
import { TtSpeechContext } from "../../contexts/azure";
import {
  SpeechSynthesizer, AudioConfig,
  SpeechSynthesisOutputFormat,
  SpeakerAudioDestination,
} from 'microsoft-cognitiveservices-speech-sdk';
import classNames from 'classnames';

/*
export interface CardProps {
  id: number;
  text: string;
  matched: boolean;
  flipped: boolean;
  match_index: number;
  bgcolor: string;
  handle_choice?: (card: CardProps) => void;
}
*/

export const Card: React.FC<CardProps> = (props: CardProps) => {

    const { ttSpeechConfig } = useContext(TtSpeechContext)
    const [backColor, setBackColor] = useState<string>('')

    useEffect(() => {
        setBackColor(props.bgcolor)
        console.log("Card useEffect props.bgcolor=", props.bgcolor)
    },[props.bgcolor])
    
    const handleClick: MouseEventHandler<HTMLSpanElement> = (event) => {
      const { handle_choice, ...rest } = props;
  
      let player = new SpeakerAudioDestination()
      const audioConfig = AudioConfig.fromSpeakerOutput(player);
  
      //ttSpeechConfig.config.speechSynthesisVoiceName = "en-US-JaneNeural"
      ttSpeechConfig.config.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
    
      const synthesizer = new SpeechSynthesizer(ttSpeechConfig.config, audioConfig);
      /*
      if (!props.text.includes('jpeg'))
        synthesizer.speakTextAsync(rest.text)
      */

        
        if (!props.text.includes('jpeg')) {
 const t = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="en-US-JaneNeural">
          <prosody rate="-10.00%">
              ${rest.text}
          </prosody>
      </voice>
  </speak>`
  
  synthesizer.speakSsmlAsync(t)
        }

      props.handle_choice?.(rest)
    };
  /*
    className={classNames(
                      'text-white',
                      !buttonDisabled && 'bg-green-600',
                      buttonDisabled && 'bg-red-700',
                      'rounded-t-md'
                  )}
  className={classNames(
                      'w-24 h-24 p-1 m-1',
                      'bg-red-400'
                      'rounded-t-md'
                  )}
                  
  */
  
    if (!props.flipped) {
      return (
        <div className='bg-blue-400 flex justify-center p-1 m-0 w-26 h-26 rounded-md'>
          <span 
          className={classNames(
            'w-24 h-24 p-1 m-1',
            backColor,
            'rounded-t-md'
        )}
          onClick={handleClick}>
            &nbsp;
          </span>
        </div>
      )
    }
    if (props.text.includes('jpeg')) {
      let initial = props.text[0]
      let img_src = "https://kevinphambucket.s3.amazonaws.com/images/" + initial + '/' + props.text
      return (
        <span className='rounded-md'>
        <img style={{width:"110px", height:"110px"}} src = {img_src} alt="card" />
       </span>
      )
    }
    return (
      <div className='bg-blue-400 flex justify-items-center p-1 m-0 w-26 h-26 rounded-md'>
        <span className='bg-amber-300 w-24 h-24 p-1  align-middle border-spacing-3 m-1 rounded-md'>
          {props.text}
        </span>
      </div>
    );
  };

  
 /*
      const t = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="en-US-JaneNeural">
      Did you know <prosody pitch="high">dolphins are not fish?</prosody>
      </voice>
      </speak>`
      
      //synthesizer.speakSsmlAsync(t)
      */
     /*
      const t = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="en-US-JaneNeural">
          Communicate
      </voice>
      <voice name="en-US-AndrewMultilingualNeural">
          Communicate
      </voice>
  </speak>`
  */
  /*
  const t = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="en-US-JaneNeural">
          <prosody rate="-50.00%">
              excellent
          </prosody>
      </voice>
  </speak>`
  
  synthesizer.speakSsmlAsync(t)
  */
  