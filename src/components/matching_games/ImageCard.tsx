import {useState, useEffect} from 'react'
import { TextCardComponentProps } from './types'

const ImageCard: React.FC<TextCardComponentProps> = ({ card, handleChoice }) => {

    const [disabled, setDisabled] = useState(false)
  
    useEffect(() => {
        // disable card if matched_index is - 1 (set in TextMatchGame when a match is found and there are no more cards in card banks)
        if (card.match_index === -1) {
            const card_el: HTMLImageElement = document.getElementById(card.id.toString()) as HTMLImageElement
            if (card_el) {
                //blur the card
                card_el.style.filter = "blur(5px)"
            }
            setDisabled(true)
        }
    }, [card.match_index])

    const handleClick = (target: HTMLImageElement) => {

        if (!disabled) {
            target.style.border = "2px solid red"
           // console.log("handleClick image clicked card = ", card)
        //console.log("handleClick card = ", card)
            handleChoice({...card, src: card.src.replace('.jgep', '') } )
        }
 
}

    if (!card.matched ) {
       // console.log("card not matched card = ", card)
        /*
{
    "id": "13",
    "src": "motorcycle.jpeg",
    "matched": false,
    "match_index": 4,
    "language": "vn",
    "side": "right"
}
        */

        let img_src = "https://kevinphambucket.s3.amazonaws.com/images/" + card.src[0] + '/' + card.src
        return (
            <span className='rounded-md'>
            <img id={card.id} style={{width:"110px", height:"110px"}} src = {img_src} alt={card.src.replace('.jpeg','')}
            onClick={(e) => handleClick(e.currentTarget)}
            />
            </span>
        )
    }
}
    
  export default ImageCard

  /*
 if (props.text.includes('jpeg')) {   // apple.jpeg
      let initial = props.text[0]
      let img_src = "https://kevinphambucket.s3.amazonaws.com/images/" + initial + '/' + props.text
      return (
        <span className='rounded-md'>
        <img style={{width:"110px", height:"110px"}} src = {img_src} alt="card" />
       </span>
      )
    }
  */