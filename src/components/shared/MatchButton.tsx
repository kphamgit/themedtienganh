import { forwardRef, MouseEventHandler, useContext, useEffect, useImperativeHandle, useState } from "react";
import { TtSpeechContext } from '../../contexts/azure';
import { WordPair } from "../live/WordMatchingGame";


   interface MatchButtonRefProps {
    //toggleDisabled: () => void;
    enableButton: () => void;
    disableButton: () => void;
  }

interface MatchButtonProps {  
    side: string;
    word_pair: WordPair;
    handleSelection: (pair: WordPair | undefined, side: string) => void
    disable_all_btns: () => void
  }
  //props.handleAudioEnded(props.word_pair, props.side)
  const MatchButton = forwardRef<MatchButtonRefProps, MatchButtonProps>(
    (props, ref) => {

        //const { ttSpeechConfig } = useContext(TtSpeechContext)
        const [isDisabled, setIsDisabled] = useState(false);
        const [label, setLabel] = useState<string>("")
  
        useImperativeHandle(ref, () => ({
            //toggleDisabled,
            enableButton: () => setIsDisabled(false),
            disableButton: () => setIsDisabled(true)
        }));
  
        const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
            //setIsDisabled(true)
            //console.log("in AzureButton handleClick")
            const all_left_buttons = document.querySelectorAll('.left')
            all_left_buttons.forEach((button) => {
              button.setAttribute('disabled', 'true')
            })
            const all_right_buttons = document.querySelectorAll('.right')
            all_right_buttons.forEach((button) => {
              button.setAttribute('disabled', 'true')
            })
            props.handleSelection(props.word_pair, props.side)
            //props.disable_all_btns() // call parent function 1 immediately to disable all other buttons (both left and right side)
            //const el = event.target as HTMLButtonElement
            //console.log("in AzureButton handleClick", el.textContent)      
            //playAudio(el.textContent!)
            //el.disabled = true
        }

        useEffect(() => {
            if (props.side === "left") {
                setLabel(props.word_pair.word)
            } else {
                setLabel(props.word_pair.match)
            }
        }, [props.side, props.word_pair.word, props.word_pair.match])

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
  
  export default MatchButton;