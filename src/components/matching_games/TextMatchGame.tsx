import {useEffect, useRef, useState} from 'react'
//import { MatchCard } from './MatchCard.js';
import  TextCard from './TextCard.js';
import { TextCardRefProps } from './types'
import { CardProps } from './types';
//import { Link, useParams } from 'react-router-dom';
import { getAGameNew } from '../../services/list.js';
import TextCardAzure from './TextCardAzure.js';
import { Counter, CounterRef } from '../shared/Counter.js';

//import { CardProps } from './MemoryGame.js';
//import Popup from 'reactjs-popup';
//mport  Counter  from './Counter.js'

//kpham: make cards outside of component so that it won't get recreated
//everytime component is refreshed.

/*
export interface CounterRef {
    getCount: () => number | undefined;
    startCount: () => void
    stopCount: () => ElapsedTime
  }
*/
//className={completed ? 'text-strike' : null}
//export function TextMatchGame(props: {theLeftCards1: CardProps, theRightCards1: CardProps}) {
    export function TextMatchGame(props: {id: string}) {
        const [leftCards , setLeftCards] = useState<CardProps[]>([])
        const [rightCards , setRightCards] = useState<CardProps[]>([])

        const counterRef = useRef<CounterRef>(null)
     /* 
    const [leftCards1 , setLeftCards1] = useState<CardProps[]>([{
        src: 'apple', matched: false, match_index: 0, language: 'en'},
        {src: 'banana', matched: false, match_index: 1, language: 'en'},
        {src: 'date', matched: false, match_index: 2, language: 'en'}
    ])


    const [rightCards1 , setRightCards1] = useState<CardProps[]>([
         {src: 'red', matched: false, match_index: 0, language: 'en' },
         {src: 'yellow', matched: false, match_index: 1, language: 'en'}
        ,{src: 'purple', matched: false, match_index: 2, language: 'en'}
    ])
*/
    const [leftCardsBank , setLeftCardsBank] = useState<CardProps[]>([])
    const [rightCardsBank , setRightCardsBank] = useState<CardProps[]>([])
   
    const [turns, setTurns] = useState(0)
    const [nummatches, setNumMatches] = useState(0)
    const [gameover, setGameOver] = useState(false)

    const [choiceLeft, setChoiceLeft] = useState<CardProps | undefined>(undefined)
    const [choiceRight, setChoiceRight] = useState<CardProps | undefined>(undefined)

    const refsToPairsClicked = useRef<(TextCardRefProps | null)[]>([]);
  
    const leftCardRefs = useRef<(TextCardRefProps | null)[]>([]);
    const rightCardRefs = useRef<(TextCardRefProps | null)[]>([]);

    const [elapsedTime, setElapsedTime] = useState<string | undefined>(undefined)
    const numCardsToDisplay = 6
    const [numRows, setNumRows] = useState(null)

    const [foundMatch, setFoundMatch] = useState<boolean | null>(null)
    const [matchedIndex, setMatchedIndex] = useState(-1)

    const [cardRefsDict, setCardRefsDict] = useState(new Map())

    const  clearBordersClickedPair = () => {
        refsToPairsClicked.current.forEach((ref) => {    
            ref?.set_clicked(false)
        })
    }

    useEffect(() => {
    //console.log("in TextMatchGame leftCardRefs length = ", leftCardRefs.current.length)
   // console.log("in TextMatchGame rightCardRefs length = ", rightCardRefs.current.length)
     if (rightCardRefs.current.length > 0) {
        const temp_dictionary = new Map()
        rightCardRefs.current.forEach((ref) => {
            if (ref) {
               //console.log("in TextMatchGame rightCardRefs current ref text = ", ref.getText())
               temp_dictionary.set(ref.getText(), ref)
            }
        })
        leftCardRefs.current.forEach((ref) => {
            if (ref) {
               //console.log("in TextMatchGame rightCardRefs current ref text = ", ref.getText())
               temp_dictionary.set(ref.getText(), ref)
            }
        })
        //console.log("in TextMatchGame myDictionary  = ", myDictionary)
        setCardRefsDict(temp_dictionary)
     }
    },[rightCards, leftCards])

    useEffect(() => {
        //console.log("in useEffect props.id = ", props.id)
        getAGameNew(props.id)
        .then ((response) => {
            //console.log("response = ", response)
            //setLeftLanguage(response.source_language)
            //setRightLanguage(response.target_language)

              const left_array = response.base.split('/').map((str:string, index:number) => {
                return (
                    {id: index+1, src: str, matched: false, match_index: index, language: response.source_language, side: 'left' }
                )
              });
              console.log("left_array  = ", left_array)
              setNumRows(left_array.length)

              const right_array = response.target.split('/').map((str:string, index:number) => {
                return (
                  {id: index + left_array.length + 1, src: str, matched: false, match_index: index, language: response.target_language, side: 'right' }
                )
              });
              console.log("right_array = ", right_array)

               // Combine both arrays into an array of arrays of pairs
            let combined = left_array.map((item:any, index:number) => [item, right_array[index]]);
            //combined is an array of (two-member) arrays
            /*
     combined =  [[   {
        "src": "fade",
        "matched": false,
        "match_index": 6,
        "language": "en"
        "side": "left"
    },
    {
        "src": "Mờ dần",
        "matched": false,
        "match_index": 6,
        "language": "vn",
        "side": "right"
    }
]
    ...
            ]
            */

              //console.log("combined = ", combined)
            // Shuffle using Fisher-Yates algorithm
            for (let i = combined.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [combined[i], combined[j]] = [combined[j], combined[i]]; // Swap elements
            }

             // Separate the shuffled pairs back into individual arrays
             let left= combined.map((pair: [CardProps, CardProps]) => pair[0]);
             let right = combined.map((pair: [CardProps, CardProps]) => pair[1]);

             setLeftCards(left.slice(0, numCardsToDisplay));
             setLeftCardsBank(left.slice(numCardsToDisplay));
             setRightCardsBank(right.slice(numCardsToDisplay));

             // get the first numCardsToDisplay from right pile
             const temp = right.slice(0, numCardsToDisplay)
             // shuffle these cards. (kpham) Have to do this because the left first numCardsToDisplay and the right first numCardsToDisplay cards are in order
            let shuffled_temp = temp.slice(); // Create a copy to avoid mutating the original array
            for (let i = shuffled_temp.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1)); // Get a random index
                [shuffled_temp[i], shuffled_temp[j]] = [shuffled_temp[j], shuffled_temp[i]]; // Swap elements
            }
            //console.log("shuffled_temp = ", shuffled_temp)
            setRightCards(shuffled_temp);
            counterRef.current?.startCount()
        })
        
    },[props.id])

    useEffect(() => {
        console.log("in useEffect choiceLeft = ", choiceLeft)
        console.log("in useEffect choiceRight = ", choiceRight)
        if (choiceLeft && choiceRight) {
            if (choiceLeft?.match_index === choiceRight?.match_index) {
               // console.log("MATCHED ", choiceLeft.src, choiceRight.src)
                if (choiceLeft?.match_index !== undefined) {
                    setMatchedIndex(choiceLeft.match_index);
                }
                setFoundMatch(true)
            }
            else {
                //console.log("no match")
                setFoundMatch(false)
            }
        }
        else {
            console.log("choiceLeft or choiceRight is null or BOTH are null. Set foundMatch to null")
            setFoundMatch(null)
        }
    },[choiceLeft, choiceRight])

    useEffect(() => {
        let timeoutId_correct_answer: NodeJS.Timeout | null = null;
        let timeoutId_wrong_answer: NodeJS.Timeout | null = null;
        console.log("ENTRY useEffect foundMatch = ", foundMatch)
        if (foundMatch === true) {
            //console.log("MATCHED, calling  set time out")
            //refsToPairsClicked.current[0]?.set_bgColor("#66fa7d")
            //refsToPairsClicked.current[1]?.set_bgColor("#66fa7d")

          timeoutId_correct_answer = setTimeout(() => {
            console.log("ENTRY set time out callback, ")
            
            const matched_left_card_index = leftCards.findIndex((w => w.match_index === matchedIndex));
            const matched_right_card_index = rightCards.findIndex((w => w.match_index === matchedIndex));
            const tempArray1 = leftCards.slice(); //get a shallow copy of leftCards
            tempArray1.splice(matched_left_card_index, 1, { ...leftCardsBank[0], match_index: matchedIndex }); // remove the selected word 
            // and simultaneously insert the first word of words_bank at the same index
            
            setLeftCards(tempArray1)
            const tempArray2 = rightCards.slice(); // get a shallow copy of rightCards
            tempArray2.splice(matched_right_card_index, 1, { ...rightCardsBank[0], match_index: matchedIndex }); // remove the selected word 
            // and simultaneously insert the first word of words_bank at the same index
            setRightCards(tempArray2)
            
            //console.log("after replacing, Length of leftCardsBank = ", leftCardsBank.length)
            //clearBordersClickedPair()
            leftCardsBank.splice(0, 1)
            // remove the first element from rightCardsBank
            rightCardsBank.splice(0, 1)
            //setChoiceLeft(undefined)
            //setChoiceRight(undefined)
            refsToPairsClicked.current = []
            setChoiceLeft(undefined)
            setChoiceRight(undefined)
            //setFoundMatch(null);
            /*
            //console.log("end of set time out callback, clear ChoiceLeft and ChoiceRight")
            setChoiceLeft(undefined)
            setChoiceRight(undefined)
            setFoundMatch(null);
            //refsToPairsClicked.current[0]?.set_bgColor("#e0ed68")
            //refsToPairsClicked.current[1]?.set_bgColor("#e0ed68")
            refsToPairsClicked.current = []
            */
            console.log("EXIT set time out callback, ")
          }, 1000);
        }
        else if (foundMatch === false) {
            console.log("NOT MATCHED, a pair was clicked but wrong answer")
            //refsToPairsClicked.current[0]?.set_bgColor("#fa5765")
            //refsToPairsClicked.current[1]?.set_bgColor("#fa5765")
            //setChoiceLeft(undefined)
            //setChoiceRight(undefined)
            timeoutId_wrong_answer = setTimeout(() => {
                //console.log("in set time out callback, clear borders and reset back to original color")
                clearBordersClickedPair()
                setChoiceLeft(undefined)
                setChoiceRight(undefined)
                setFoundMatch(null);
                //console.log("in set time out callback, size of refsToPairsClicked.current = ", refsToPairsClicked.current.length)
                refsToPairsClicked.current[0]?.set_bgColor("#f5ee73")
                refsToPairsClicked.current[1]?.set_bgColor("#f5ee73")
                refsToPairsClicked.current = []
            }, 800)   
        }
        else {
            console.log("foundMatch is null. ")
        }
    
        //console.log("RIGHT IN useEffect")
        return () => {
          if (timeoutId_correct_answer) {
            clearTimeout(timeoutId_correct_answer);
          }
          if (timeoutId_wrong_answer) {
            clearTimeout(timeoutId_wrong_answer);
          }
        };
      }, [foundMatch]);

    const resetTurn = () => {
        setChoiceLeft(undefined)
        setChoiceRight(undefined)
        setTurns(prevTurns => prevTurns + 1)
    }
   
    useEffect(() => {
        if (numRows) {
            if (nummatches === numRows) {
                setGameOver(true)
                const elapsedTime_str = counterRef.current?.stopCount()
                console.log("elapsedTime = ", elapsedTime_str)
                setElapsedTime(elapsedTime_str)
                //childRef.current.clearCount()
            }
        }
    }, [nummatches, numRows])

    /*
    id: string;
    src: string;
    matched: boolean;
    match_index: number;
    language: string;
    */

    
    const handleCardClick = (card: CardProps) => {
        //console.log("in handleCardClick  card clicked, card src", card.src)
        //console.log("in handleCardClick  dictionary  = ", myDict)
        //console.log("in handleCardClick ref from dictionary entry for card = ", myDict.get(card.src))
        //console.log("in handleCardTextClick  card clicked, card side = *** ", card.side)
        //console.log("in handleCardTextClick  card clicked, refs pair length = ", refsToPairsClicked.current.length)
        if (refsToPairsClicked.current.length === 1) {  // if one card has been clicked, remove the border of the card
            //console.log("in handleCardTextClick there's already one card in pair clicked. Card =", refsToPairsClicked.current[0]?.getText())
            refsToPairsClicked.current[0]?.set_clicked(false)
        }
        //console.log("in handleCardTextClick add card to pair clicked car src = ", card.src)
        //AddClickedCardRefToPair(card)
        if (card.side === 'left') {
            console.log("LEFT card clicked. SetChoiceLeft card = ", card)
            setChoiceLeft(card)
        }
        else {
            console.log("RIGHT card clicked. SetChoiceRight card = ", card)
            setChoiceRight(card)
        }
    }

    const AddClickedCardRefToPair = (card: CardProps) => {
        const cardRef = cardRefsDict.get(card.src)
        //console.log("in AddClickedCardRefToPair card = ", card)
        //console.log("ENTRY AddClickedCardRefToPair refsToPairsClicked.current = ", refsToPairsClicked.current)
        if (refsToPairsClicked.current === null || refsToPairsClicked.current.length  === 0) {
            //console.log("NULL Pair or No cards in pair clicked. Add clicked card to pair")
            //refsToPairsClicked.current.push(getCardRef(card))
            refsToPairsClicked.current.push(cardRef)
        }
        else if (refsToPairsClicked.current.length === 1) { // if ONE cards have been clicked, 
            //check if the card clicked is the same side as the current card in refsToPairsClicked
            //console.log(" There is Only one card in pair clicked = ", refsToPairsClicked.current[0]?.getText())
            if (refsToPairsClicked.current[0]?.getSide() === card.side) { // if the same side,
            // replace the ref of current card with the ref of the new card
            //console.log(" same side card clicked. Clear pair and add clicked card to pair") 
                refsToPairsClicked.current = []
                //refsToPairsClicked.current.push(getCardRef(card))
                refsToPairsClicked.current.push(cardRef)
            }
            else { // add the new card to the refsToPairsClicked
                //console.log(" Different side card clicked. Added to pair")
                //refsToPairsClicked.current.push(getCardRef(card))
                refsToPairsClicked.current.push(cardRef)
            }
        }
        //console.log("EXIT of AddClickedCardRefToPair pair NOW is refsToPairsClicked.current = ", refsToPairsClicked.current)
    }

   
        return (
            <>
                <div>
                    {(gameover) ? 
                        <>
                        <h3 className='mx-10 my-0 text-xl'>Game Over</h3>
                        <div>Elapsed Time: {elapsedTime}</div>
                        </>
                        :
                        <div className='flex flex-col mx-2'>
                            <div>{choiceLeft?.src} ** {choiceRight?.src}  </div>
                            <div> Found Match:
                            { foundMatch === true ? <div>Matched</div> : null}
                            { foundMatch === false ? <div>Not Matched</div> : null}
                            </div>
                            <div className='flex flex-row justify-center'>
                             <div className='bg-red-400 flex justify-center mt-0 my-2 w-1/12'><Counter initialSeconds={0} ref={counterRef} /></div>
                            </div>
                            <div className="flex justify-center items-center w-full bg-gray-400">
                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div className="bg-blue-500  items-center justify-start rounded-lg shadow-lg">
                                        {leftCards && leftCards.map( (card, index) => (
                                            <div key={card.match_index} className='m-2 w-900px'>
                                                {card.language === 'vn' ?
                                                <div className='flex flex-col gap-1'>
                                                    <TextCard card={card} handleChoice={handleCardClick}
                                                     ref={(el) => (leftCardRefs.current[index] = el)}
                                                    />
                                                    </div>
                                                    :
                                                <div className='flex flex-col gap-1'>
                                                    <TextCardAzure card={card} handleChoice={handleCardClick} 
                                                     ref={(el) => (leftCardRefs.current[index] = el)}
                                                    />
                                                    </div>
                                                }
                                            </div>
                                        ))
                                        }
                                    </div>
                                    <div className="bg-blue-500  items-center justify-start rounded-lg shadow-lg">
                                        {rightCards && rightCards.map( (card, index) => (
                                            <div key={card.match_index} className='m-2 w-900px'>
                                                {card.language === 'vn' ?
                                                <div className='flex flex-col gap-1'>
                                                    <TextCard card={card} handleChoice={handleCardClick}
                                                     ref={(el) => (rightCardRefs.current[index] = el)}
                                                    />
                                                    </div>
                                                    :
                                                    <TextCardAzure card={card} handleChoice={handleCardClick}
                                                     ref={(el) => {
                                                        return rightCardRefs.current[index] = el
                                                     }
                                                     }
                                                    />
                                                }
                                            </div>
                                        ))
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                    }
                </div>
            </>
        )
}

