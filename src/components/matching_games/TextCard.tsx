import {useState, useEffect} from 'react'
import { TextCardComponentProps } from './types'

const TextCard: React.FC<TextCardComponentProps> = ({ card, handleChoice }) => {

    const [disabled, setDisabled] = useState(false)
  
    useEffect(() => {
        // disable card if matched_index is - 1 (set when a match is found and there are no more cards in card banks)
        if (card.match_index === -1) {
            setDisabled(true)
        }
    }, [card.match_index])

    const handleClick = (target: HTMLButtonElement) => {
        target.style.border = "2px solid red"
        handleChoice(card )
}

    if (!card.matched ) {
        return (
            <>
            <button id={card.id}
                 disabled={disabled} 
                 className={`${card.side} rounded-md p-2 m-0 bg-amber-200 hover:bg-amber-300
            `}
                onClick={(e) => handleClick(e.currentTarget)}>
                {card.src}
            </button>
           
            </>
        )
    }
}
    
  export default TextCard
