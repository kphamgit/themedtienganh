import React, {MouseEventHandler, useEffect, useRef, useState} from 'react'
//import { useAppDispatch } from '../../redux/store';
import { MyProps } from './WordsSelect';
//import { setAnswerArray } from '../../redux/answerarray.js'
//import classNames from 'classnames';

interface WordSelectProps {
    pair: MyProps
    addWordToAnswer: (word: string) => void
    removeWordFromAnswer: (word: string) => void
}

function WordSelect(props: WordSelectProps ) {
   // function WordSelect({pair: , addWordToAnswer, removeWordFromAnswer} ) {
    const [clickCount, setClickCount] = useState(0)
    const [oddClickCount, setOddClickCount] = useState<boolean>(false)
    const [isHovered, setIsHovered] = useState<boolean>(false);
    //const [answerarray, setAnswerArray] = useState([])
    //const dispatch = useAppDispatch()
    
    //const answerarray = useSelector((state) => state.answerarray.value)

   const handleMouseEnter:MouseEventHandler<HTMLSpanElement> = () => {
      setIsHovered(true);
   };
   const handleMouseLeave:MouseEventHandler<HTMLSpanElement> = () => {
      setIsHovered(false);
   };
   const spanRef = useRef<HTMLSpanElement>(null);
   let btnClass = 'btn m-1';
	
	 if (isHovered) btnClass += ' underline';
     if (oddClickCount) btnClass += ' bg-orange-300';

     useEffect(() => {
        if (spanRef.current) {
            const rect = spanRef.current.getBoundingClientRect();
            console.log('Bounding rectangle:', rect);
        }
    }, []);
    //const handleClick = (word) => {
    const handleClick: MouseEventHandler<HTMLSpanElement> = (event) => {
        
        const clicked_el = event.target as HTMLSpanElement
        //console.log(clicked_el.textContent)
        let new_clickCount = clickCount + 1
        setClickCount(new_clickCount)
        
        if (clickCount%2 === 1) {
            setOddClickCount(false)
            props.removeWordFromAnswer(clicked_el.textContent!)
        }
        else {
            setOddClickCount(true)
            props.addWordToAnswer(clicked_el.textContent!)
            
        }
        
    }
    
    return (
        <>
           
            <span className={btnClass} 
                ref={spanRef}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
              {props.pair.word}
            </span> 
            { ((props.pair.next_word !== '.') && (props.pair.next_word !== ',') 
            && (props.pair.next_word !== '!')  
             && (props.pair.next_word !== '?') )  
                && <span>&nbsp;</span>} 
        </>
    )
    
   
}

export default WordSelect
/*
<span className='bg-blue-400 hover:underline p-1' onClick={handleClick}

className={classNames(
                    'text-white',
                    !buttonDisabled && 'bg-green-600',
                    buttonDisabled && 'bg-red-700',
                    'rounded-t-md'
                )}

return (
        <>

            <span onClick={() => handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {pair.word}
            </span>
            {((pair.next_word !== '.') && (pair.next_word !== ',')
                && (pair.next_word !== '!')
                && (pair.next_word !== '?'))
                && <span>&nbsp;</span>}
        </>
    )
*/