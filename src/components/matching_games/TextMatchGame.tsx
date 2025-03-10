import {useEffect, useRef, useState} from 'react'
//import { MatchCard } from './MatchCard.js';
import  TextCard from './TextCard.js';
import { TextCardRefProps } from './types'
import { CardProps } from './types';
//import { Link, useParams } from 'react-router-dom';
import { getAGameNew } from '../../services/list.js';
import TextCardAzure from './TextCardAzure.js';
import { Counter, CounterRef } from '../shared/Counter.js';

    export function TextMatchGame(props: {id: string}) {
        const [leftCards , setLeftCards] = useState<CardProps[]>([])
        const [rightCards , setRightCards] = useState<CardProps[]>([])

        const counterRef = useRef<CounterRef>(null)
   
    const [leftCardsBank , setLeftCardsBank] = useState<CardProps[]>([])
    const [rightCardsBank , setRightCardsBank] = useState<CardProps[]>([])
   
    const [turns, setTurns] = useState(0)
    const [nummatches, setNumMatches] = useState(0)
    const [gameover, setGameOver] = useState(false)

    const [choiceLeft, setChoiceLeft] = useState<CardProps | undefined>(undefined)
    const [choiceRight, setChoiceRight] = useState<CardProps | undefined>(undefined)

  
    const leftCardRefs = useRef<(TextCardRefProps | null)[]>([]);
    const rightCardRefs = useRef<(TextCardRefProps | null)[]>([]);

    const [elapsedTime, setElapsedTime] = useState<string | undefined>(undefined)
    const numCardsToDisplay = 6
    const [numRows, setNumRows] = useState(null)

    useEffect(() => {
        //console.log("in useEffect props.id = ", props.id)
        getAGameNew(props.id)
        .then ((response) => {
            //console.log("response = ", response)
            //setLeftLanguage(response.source_language)
            //setRightLanguage(response.target_language)

              const left_array = response.base.split('/').map((str:string, index:number) => {
                return (
                    {id: (index+1).toString(), src: str, matched: false, match_index: index, language: response.source_language, side: 'left' }
                )
              });
              //console.log("left_array  = ", left_array)
              setNumRows(left_array.length)

              const right_array = response.target.split('/').map((str:string, index:number) => {
                return (
                  {id: (index + left_array.length + 1).toString(), src: str, matched: false, match_index: index, language: response.target_language, side: 'right' }
                )
              });
              //console.log("right_array = ", right_array)

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
        //console.log("in useEffect choiceLeft = ", choiceLeft)
        //console.log("in useEffect choiceRight = ", choiceRight)
        let timeoutId_correct_answer: NodeJS.Timeout | null = null;
        let timeoutId_wrong_answer: NodeJS.Timeout | null = null;
        if (choiceLeft && choiceRight) {
            if (choiceLeft?.match_index === choiceRight?.match_index) {
                //setMatchedIndex(choiceLeft.match_index);
                timeoutId_correct_answer = setTimeout(() => {
                    //console.log("ENTRY set time out callback correct answer, ")
                    const left_card = document.getElementById(choiceLeft.id.toString()) 
                    if (left_card) {
                     left_card.style.border = "none"
                    }
                    const right_card = document.getElementById(choiceRight.id.toString()) 
                    if (right_card) {
                     right_card.style.border = "none"
                    }
                    //console.log("in set time out callback, searching for matched_index = ", choiceLeft.match_index)
                    //console.log("in set time out callback, leftCards = ", leftCards)
                    //console.log("in set time out callback, rightCards = ", rightCards)
                    const matched_left_card_index = leftCards.findIndex((w => (w.match_index >= 0 && w.match_index === choiceLeft.match_index)));
                    const matched_right_card_index = rightCards.findIndex((w => (w.match_index >= 0 && w.match_index === choiceLeft.match_index)));
                    const tempArray1 = leftCards.slice(); //get a shallow copy of leftCards

                    //console.log("tempArray1 = ", tempArray1)
                    //if there are more cards in the bank, then replace the matched card with the first card in the bank
                    if (leftCardsBank.length > 0) {
                        tempArray1.splice(matched_left_card_index, 1, { ...leftCardsBank[0], match_index: choiceLeft.match_index }); // remove the selected
                        leftCardsBank.splice(0, 1)
                    }
                    else {
                        tempArray1.splice(matched_left_card_index, 1, { ...choiceLeft, src: choiceLeft.src, match_index: -1 }); // remove the selected
                        // add a dummy card which is made unclickable by setting match_index to -1. (See useEffect in TextCard.tsx or TextCardAzure.tsx)
                    }
                    // word and simultaneously insert the first word of words_bank at the same index
                    setLeftCards(tempArray1)
                    const tempArray2 = rightCards.slice(); // get a shallow copy of rightCards
                    if (rightCardsBank.length > 0) {
                        tempArray2.splice(matched_right_card_index, 1, { ...rightCardsBank[0], match_index: choiceLeft.match_index }); // remove the selected word 
                        rightCardsBank.splice(0, 1)
                    // and simultaneously insert the first word of words_bank at the same index
                    }
                    else {
                        tempArray2.splice(matched_right_card_index, 1, { ...choiceRight, src: choiceRight.src, match_index: -1 }); // add a dummy card
                        // which is made unclickable by setting match_index to -1. (See useEffect in TextCard.tsx or TextCardAzure.tsx)
                    }  
                    setRightCards(tempArray2)
                    setNumMatches(nummatches + 1)
                    setChoiceLeft(undefined)
                    setChoiceRight(undefined)
                }, 500);
            }
            else {
                timeoutId_wrong_answer = setTimeout(() => {
                    //console.log("ENTRY set time out callback wrong answer, ")
                    const left_card = document.getElementById(choiceLeft.id.toString()) 
                    if (left_card) {
                     //console.log("in TextCardAzure set_bgColorxxxxxx card_el", card_el)
                     left_card.style.border = "none"
                    }
                    const right_card = document.getElementById(choiceRight.id.toString()) 
                    if (right_card) {
                     //console.log("in TextCardAzure set_bgColorxxxxxx card_el", card_el)
                     right_card.style.border = "none"
                    }
                    setChoiceLeft(undefined)
                    setChoiceRight(undefined)
                }, 500);
                //console.log("no match")
                //setFoundMatch(false)
            }
        }
        else {
            //console.log("choiceLeft or choiceRight is null or BOTH are null. Set foundMatch to null")
            //setFoundMatch(null)
        }
        return () => {
            if (timeoutId_correct_answer) {
              clearTimeout(timeoutId_correct_answer);
            }
            if (timeoutId_wrong_answer) {
              clearTimeout(timeoutId_wrong_answer);
            }
        };
    },[choiceLeft, choiceRight])

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
                //console.log("elapsedTime = ", elapsedTime_str)
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
        //AddClickedCardRefToPair(card)
        if (card.side === 'left') {
            //console.log("LEFT card clicked. SetChoiceLeft card = ", card)
            setChoiceLeft(card)
        }
        else {
            //console.log("RIGHT card clicked. SetChoiceRight card = ", card)
            setChoiceRight(card)
        }
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
                            <div className='flex flex-row justify-center'>
                             <div className='bg-red-400 flex justify-center mt-0 my-2 w-1/12'><Counter initialSeconds={0} ref={counterRef} /></div>
                            </div>
                            <div className="flex justify-center items-center w-full bg-gray-400">
                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div className="bg-blue-500  items-center justify-start rounded-lg shadow-lg">
                                        {leftCards.map( (card, index) => (
                                            <div key={index} className='m-2 w-900px'>
                                                {card.language === 'vn' ?
                                                    <div className='flex flex-col gap-1'>
                                                    <TextCard card={card} handleChoice={handleCardClick}/>
                                                    </div>
                                                    :
                                                    <div className='flex flex-col gap-1'>
                                                    <TextCardAzure card={card} handleChoice={handleCardClick} />
                                                    </div>
                                                }
                                            </div>
                                        ))
                                        }
                                    </div>
                                    <div className="bg-blue-500  items-center justify-start rounded-lg shadow-lg">
                                        {rightCards.map( (card, index) => (
                                         <div key={index} className='m-2 w-900px'>
                                         {card.language === 'vn' ?
                                             <div className='flex flex-col gap-1'>
                                                <TextCard card={card} handleChoice={handleCardClick}/>
                                             </div>
                                             :
                                             <div className='flex flex-col gap-1'>
                                                <TextCardAzure card={card} handleChoice={handleCardClick}/>
                                            </div>
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
