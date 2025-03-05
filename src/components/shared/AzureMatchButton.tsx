import { forwardRef, MouseEventHandler, useContext, useEffect, useImperativeHandle, useState } from "react";
import { TtSpeechContext } from '../../contexts/azure';
import { WordPair } from "../live/WordMatchingGame";

import {
  SpeechSynthesizer, AudioConfig,
  SpeakerAudioDestination,
} from 'microsoft-cognitiveservices-speech-sdk';
// SpeechSynthesisOutputFormat,

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
  
        const disableAllButtons = () =>{
            const all_left_buttons = document.querySelectorAll('.left')
            all_left_buttons.forEach((button) => {
              button.setAttribute('disabled', 'true')
            })
            const all_right_buttons = document.querySelectorAll('.right')
            all_right_buttons.forEach((button) => {
              button.setAttribute('disabled', 'true')
            })
        }

        const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
            //console.log("in AzureButton handleClick. Disable all buttons")
            disableAllButtons()
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
        
        //ttSpeechConfig.config.speechSynthesisVoiceName = "en-US-JasonNeural"
        //ttSpeechConfig.config.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3 

        let player = new SpeakerAudioDestination()
        const audioConfig = AudioConfig.fromSpeakerOutput(player);

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
    //disabled={isDisabled}
        return (
              <>
                  <button    
                      className={`px-4 py-2 rounded-lg text-white ${props.side} font-semibold transition ${
                        isDisabled
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                     
                      onClick={e => handleClick(e)}
                  >
                      {label}
                  </button>
              </>
        );
      }
    );
  
  export default AzureMatchButton;