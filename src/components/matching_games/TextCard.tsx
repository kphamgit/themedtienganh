import {useState, forwardRef, useImperativeHandle} from 'react'
import { TextCardComponentProps } from './types'
import { TextCardRefProps } from './types'


/*
interface TextCardComponentProps {
    card: CardProps;
    handleChoice: (card: CardProps) => void;    
}
*/

const TextCard = forwardRef<TextCardRefProps, TextCardComponentProps>(
    (props, ref) => {

    const [clicked, setClicked] = useState(false);
    const [bgColor, setBgColor] = useState("bg-amber-100");   
   
        useImperativeHandle(ref, () => ({
            //toggleDisabled,
            set_clicked: (value: boolean) => {
                setClicked(value)
            },
            set_bgColor: (color: string) => {
                /*
                const card_el = document.getElementById(props.card.id.toString())
                if (card_el) {
                    card_el.style.backgroundColor = color
                }
                    */
                //setBgColor(color)
            },
            getText: () => {
                return props.card.src
            },
            getSide: () => {
                return props.card.side
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
            <div>{props.card.side}</div>
            <button className={`${props.card.side} rounded-md p-2 m-1 ${bgColor} hover:bg-amber-300
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
