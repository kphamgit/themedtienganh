import { forwardRef, MouseEventHandler, useContext, useEffect, useImperativeHandle, useState } from "react";
import { TtSpeechContext } from '../../contexts/azure';

import {
  SpeechSynthesizer, AudioConfig,
  SpeechSynthesisOutputFormat,
  SpeakerAudioDestination,
} from 'microsoft-cognitiveservices-speech-sdk';

  export interface WordPair {
    id: number;
    word: string;
    match: string;
    language: string;
  }
  
  export interface AzureMatchButtonRefProps {
    //toggleDisabled: () => void;
    enableButton: () => void;
    disableButton: () => void;
  }

interface AzureMatchButtonProps {  
    side: string;
    word_pair: WordPair;
    handleAudioEnded: (pair: WordPair | undefined, side: string) => void
    disable_all_btns: () => void
  }
  
  const AzureMatchButton = forwardRef<AzureMatchButtonRefProps, AzureMatchButtonProps>(
    (props, ref) => {

        const { ttSpeechConfig } = useContext(TtSpeechContext)
        const [isDisabled, setIsDisabled] = useState(false);
        const [label, setLabel] = useState<string>("")
  
        useImperativeHandle(ref, () => ({
            //toggleDisabled,
            enableButton: () => setIsDisabled(false),
            disableButton: () => setIsDisabled(true)
        }));
  
        const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
            //setIsDisabled(true)
            console.log("in AzureButton handleClick")
            props.disable_all_btns() // call parent function 1 immediately to disable all other buttons (both left and right side)
            const el = event.target as HTMLButtonElement
            //console.log("in AzureButton handleClick", el.textContent)      
            playAudio(el.textContent!)
            //el.disabled = true
        }

        useEffect(() => {
            if (props.side === "left") {
                setLabel(props.word_pair.word)
            } else {
                setLabel(props.word_pair.match)
            }
        }, [props.side, props.word_pair.word, props.word_pair.match])

  const playAudio = (text_to_speak: string) => {
      // call parent function 1 immediately to disable all the right buttons
        //props.parentFunc1()
        //console.log("in DISABLE RIGHT BUTTONS");
        
        ttSpeechConfig.config.speechSynthesisVoiceName = "en-US-JasonNeural"
        ttSpeechConfig.config.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3 

        let player = new SpeakerAudioDestination()
        const audioConfig = AudioConfig.fromSpeakerOutput(player);

        //ttSpeechConfig.config.speechSynthesisVoiceName = "en-US-JaneNeural"
        ttSpeechConfig.config.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
        player.onAudioEnd = function() {
      
          props.handleAudioEnded(props.word_pair, props.side)
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

        return (
              <>
                <div>{isDisabled.toString()}</div>
                  <button
                    
                      className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                        isDisabled
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                      disabled={isDisabled}
                      onClick={e => handleClick(e)}
                  >
                      {label}
                  </button>
              </>
        );
      }
    );
  
  export default AzureMatchButton;