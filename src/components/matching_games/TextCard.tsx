import {useState, forwardRef, useImperativeHandle} from 'react'
import { CardProps } from './types'

export interface TextCardRefProps {
    //toggleDisabled: () => void;
    set_clicked: (value: boolean) => void;
    getText: () => string;
  }

interface TextCardComponentProps {
    card: CardProps;
    handleChoice: (card: CardProps) => void;    
    card_side: string;
}

const TextCard = forwardRef<TextCardRefProps, TextCardComponentProps>(
    (props, ref) => {

    const [clicked, setClicked] = useState(false);
   
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
            props.handleChoice(props.card)
    }

    if (!props.card.matched ) {
        return (
            <>
            <button className={`${props.card_side} rounded-md p-2 m-1 bg-amber-100 hover:bg-amber-300
            ${clicked ? "border-amber-700 border-2" : "border-transparent"}
            `}
                onClick={() => handleClick()}>
                {props.card.src}
            </button>
           
            </>
        )
    }
})  
    
  export default TextCard


/*
  return (
            <>
            <div>{clicked.toString()}</div>
            <button className={`${props.card_side} rounded-md p-2 m-1 bg-amber-100 hover:bg-amber-300
            ${clicked ? "border-green-300 border-4" : "border-transparent"}
            `}
                onClick={(e) => handleClick(e.target as HTMLButtonElement)}>
                {props.card.src}
            </button>
           
            </>
        )


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
*/

/*
     <button className={`rounded-md p-2 m-1 bg-amber-100 hover:bg-amber-300
            ${clicked ? "border-red-300 border-4" : "border-transparent"}
            `}
                onClick={(e) => handleClick(e.target)}>
                {props.card.src}
            </button>
*/
