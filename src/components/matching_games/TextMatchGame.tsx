import {useEffect, useRef, useState} from 'react'
//import { MatchCard } from './MatchCard.js';
import  TextCard, { TextCardRefProps }  from './TextCard.js';
import { CardProps } from './types';
//import { Link, useParams } from 'react-router-dom';
import { getAGameNew } from '../../services/list.js';
import TextCardAzure, {TextCardAzureRefProps} from './TextCardAzure.js';
import { Counter, CounterRef } from '../shared/Counter.js';
import { time } from 'console';
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

    const [leftCardsBank , setLeftCardsBank] = useState<CardProps[]>([])
    const [rightCardsBank , setRightCardsBank] = useState<CardProps[]>([])
   

    //const [rightCards , setRightCards] = useState([])
    const [turns, setTurns] = useState(0)
    const [nummatches, setNumMatches] = useState(0)
    const [gameover, setGameOver] = useState(false)

    //const childRef = useRef();
    //const myTimeout = useRef(null)

    const [choiceLeft, setChoiceLeft] = useState<CardProps | undefined>(undefined)
    const [choiceRight, setChoiceRight] = useState<CardProps | undefined>(undefined)

    const leftCardRefs = useRef<(TextCardRefProps | null)[]>([]);
    const rightCardRefs = useRef<(TextCardRefProps | null)[]>([]);

    const leftCardAzureRefs = useRef<(TextCardAzureRefProps | null)[]>([]);
    const rightCardAzureRefs = useRef<(TextCardAzureRefProps | null)[]>([]);

    const [elapsedTime, setElapsedTime] = useState<string | undefined>(undefined)
    const numCardsToDisplay = 6
    const [numRows, setNumRows] = useState(null)

    const [foundMatch, setFoundMatch] = useState(false)
    const [matchedIndex, setMatchedIndex] = useState(-1)

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef1 = useRef<NodeJS.Timeout | null>(null);

    const  clearBordersAllButtons = () => {
            rightCardRefs.current.forEach((ref) => {    
                ref?.set_clicked(false)
            })
            leftCardRefs.current.forEach((ref) => {    
                ref?.set_clicked(false)
            })
            rightCardAzureRefs.current.forEach((ref) => {    
                ref?.set_clicked(false)
            })
            leftCardAzureRefs.current.forEach((ref) => {    
                ref?.set_clicked(false)
            })
    }

    

    useEffect(() => {
        //console.log("in useEffect props.id = ", props.id)
        getAGameNew(props.id)
        .then ((response) => {
            console.log("response = ", response)
/*
{
    "id": 33,
    "name": "Test Game",
    "game_number": 2,
    "level": null,
    "continuous": true,
    "base": "this is a building/I see a river/I climb a mountain with him/an apple is so very sweet/a boy/an old man/an airplane/a student",
    "target": "house/water/big/sweet/runs/sick/fly/studies",
    "source_language": "en",
    "target_language": "en",
    "video_url": "ww",
    "video_duration": 4,
    "unitId": null
}
*/
              const left_array = response.base.split('/').map((str:string, index:number) => {
                return (
                    {src: str, matched: false, match_index: index, language: response.source_language}
                )
              });
              console.log("left_array length = ", left_array.length)
              setNumRows(left_array.length)

              const right_array = response.target.split('/').map((str:string, index:number) => {
                return (
                  {src: str, matched: false, match_index: index, language: response.target_language }
                )
              });
              //console.log("right_array = ", right_array)

               // Combine both arrays into an array of pairs
            let combined = left_array.map((item:any, index:number) => [item, right_array[index]]);
            //combined is an array of (two-member) arrays
            /*
     combined =  [[   {
        "src": "fade",
        "matched": false,
        "match_index": 6,
        "language": "en"
    },
    {
        "src": "Mờ dần",
        "matched": false,
        "match_index": 6,
        "language": "vn"
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
        if (choiceLeft && choiceRight ) {
            setChoiceLeft(undefined)
            setChoiceRight(undefined)
            if (choiceLeft.match_index === choiceRight.match_index) {
                console.log("MATCHED ", choiceLeft.src, choiceRight.src)
                setMatchedIndex(choiceLeft.match_index)
                setFoundMatch(true)
            }
            else {
                //console.log("no match")
              
                setFoundMatch(false)
                /*
                timeoutRef1.current = setTimeout(() => {
                    clearBordersAllButtons()
                  
                }, 900)
                */
               
            }
        }
        /*
        return () => {
            if (timeoutRef1.current) {
                console.log("xxxx clear timeoutRef1.current...")
                clearTimeout(timeoutRef1.current);
            }
        };
        */
    },[choiceLeft, choiceRight])

    useEffect (() => {
        if (foundMatch) {
            console.log("in useEffect foundMatch")
            timeoutRef.current = setTimeout(() => {
                console.log(" ENTRY call back for setTimeout")
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
                //console.log("... time out")
                clearBordersAllButtons()
                leftCardsBank.splice(0, 1)
                // remove the first element from rightCardsBank
                rightCardsBank.splice(0, 1)
                console.log("end of set time out callback, clear ChoiceLeft and ChoiceRight")
                setChoiceLeft(undefined)
                setChoiceRight(undefined)
            }, 700)
        }
        
        return () => {
            if (timeoutRef.current) {
                console.log("...clear Timeout timeoutRef.current...")
                clearTimeout(timeoutRef.current);
            }
        };
    }, [foundMatch, matchedIndex])
    /*
    useEffect (() => {
        //console.log(" entry useEffect, handle Selection")
            if (choiceLeft && choiceRight ) {
            
                if (choiceLeft.match_index === choiceRight.match_index) {
                    const matched_left_card_index = leftCards.findIndex((w => w.match_index === choiceRight.match_index));
                    //console.log("matched_card_index = ", matched_left_card_index)
                    const matched_right_card_index = rightCards.findIndex((w => w.match_index === choiceRight.match_index));
                    //console.log("matched_card_index = ", matched_right_card_index)
                    //timeoutRef.current = setTimeout(() => {
                    console.log("MATCHED, calling  set time out")
                    timeoutId = setTimeout(() => {
                        console.log("inside call back for time out")
                        const tempArray1 = leftCards.slice(); //get a shallow copy of leftCards
                        tempArray1.splice(matched_left_card_index, 1, { ...leftCardsBank[0], match_index: choiceLeft.match_index }); // remove the selected word 
                        // and simultaneously insert the first word of words_bank at the same index
                        setLeftCards(tempArray1)

                        const tempArray2 = rightCards.slice(); // get a shallow copy of rightCards
                        tempArray2.splice(matched_right_card_index, 1, { ...rightCardsBank[0], match_index: choiceRight.match_index }); // remove the selected word 
                        // and simultaneously insert the first word of words_bank at the same index
                        setRightCards(tempArray2)
                        //console.log("... time out")
                        clearBordersAllButtons()
                        //leftCardRefs.current[matched_left_card_index]?.set_clicked(true)
                        //rightCardRefs.current[matched_right_card_index]?.set_clicked(true)
                        // remove the first element from leftCardsBank
                        leftCardsBank.splice(0, 1)
                        // remove the first element from rightCardsBank
                        rightCardsBank.splice(0, 1)
                        
                    }, 700)
                   // setTimeoutId1(id);
                    setNumMatches(prevNumMatches => prevNumMatches + 1)
                    resetTurn()
                }
                else {
                    //console.log("no match")
                    setTimeout(() => {
                        clearBordersAllButtons()
                        resetTurn()
                    }, 1100)
                   
                }
            }
            return () => {
                    if (timeoutId) {
                        console.log("..non null timeoutId...")
                        //if (choiceLeft?.match_index === choiceRight?.match_index) {
                        //clearTimeout(timeoutId); // Cleanup previous timeout
                        //}
                    }
            };
    }, [choiceLeft, choiceRight])
*/
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

    const handleLeftCardTextClick = (card: CardProps) => {
        //console.log("in handleLeftTextCardClick left card clicked *** ", card.src)
        leftCardRefs.current.forEach((ref) => {    
            //console.log("eeee ", ref?.getText())
            if (ref?.getText() !== card.src) {
                //console.log("in handleChoiceRight right card clicked *** ", card.src)
               // console.log("in handleChoiceRight not me, set clicked to false")
                ref?.set_clicked(false)
            }
            else {
                //console.log("in handleChoiceRight me, set clicked to true")
                ref?.set_clicked(true)
            }
        })
            
        setChoiceLeft(card)
    }

    const handleLeftCardAzureClick = (card: CardProps) => {
        //console.log("in handleLeftAzureCardClick left card clicked *** ", card.src)
        leftCardAzureRefs.current.forEach((ref) => {    
            //console.log("eeee ", ref?.getText())
            if (ref?.getText() !== card.src) {
                //console.log("in handleChoiceRight right card clicked *** ", card.src)
                //console.log("in handleChoiceRight not me, set clicked to false")
                ref?.set_clicked(false)
            }
            else {
                //console.log("in handleChoiceRight me, set clicked to true")
                ref?.set_clicked(true)
            }
        })
            
        setChoiceLeft(card)
    }

    const handleRightCardTextClick = (card: CardProps) => {
        //console.log("in handleChoiceRight right card clicked *** ", card.src)
        rightCardRefs.current.forEach((ref) => {    
            //console.log("eeee ", ref?.getText())
            if (ref?.getText() !== card.src) {
                //console.log("in handleChoiceRight right card clicked *** ", card.src)
                //console.log("in handleChoiceRight not me, set clicked to false")
                ref?.set_clicked(false)
            }
            else {
                //console.log("in handleChoiceRight me, set clicked to true")
                ref?.set_clicked(true)
            }
        })
       
       setChoiceRight(card)
    }

    const handleRightCardAzureClick = (card: CardProps) => {
        //console.log("in handleChoiceRight right card clicked *** ", card.src)
        rightCardAzureRefs.current.forEach((ref) => {    
           //console.log("eeee ", ref?.getText())
            if (ref?.getText() !== card.src) {
                //console.log("in handleChoiceRight right card clicked *** ", card.src)
                //console.log("in handleChoiceRight not me, set clicked to false")
                ref?.set_clicked(false)
            }
            else {
                //console.log("in handleChoiceRight me, set clicked to true")
                ref?.set_clicked(true)
            }
        })
       
       setChoiceRight(card)
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
                            <div>{choiceLeft?.src} ** {choiceRight?.src} </div>
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
                                                    <TextCard card={card} handleChoice={handleLeftCardTextClick} card_side='left'
                                                     ref={(el) => (leftCardRefs.current[index] = el)}
                                                    />
                                                    </div>
                                                    :
                                                <div className='flex flex-col gap-1'>
                                                    <TextCardAzure card={card} handleChoice={handleLeftCardAzureClick} card_side='left' 
                                                     ref={(el) => (leftCardAzureRefs.current[index] = el)}
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
                                                    <TextCard card={card} handleChoice={handleRightCardTextClick} card_side='right' 
                                                     ref={(el) => (rightCardRefs.current[index] = el)}
                                                    />
                                                    </div>
                                                    :
                                              
                                                    <TextCardAzure card={card} handleChoice={handleRightCardAzureClick} card_side='right' 
                                                     ref={(el) => (rightCardAzureRefs.current[index] = el)}
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

