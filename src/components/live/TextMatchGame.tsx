import React, {useEffect, useRef, useState} from 'react'
//import { MatchCard } from './MatchCard.js';
import { TextCard, TextCardProps } from '../shared/TextCard.js';
import { Link, useParams } from 'react-router-dom';
import { getAGameNew } from '../../services/list.js';
import { TextCardAzure } from '../shared/TextCardAzure.js';
import { CardProps } from './MemoryGame.js';
import Popup from 'reactjs-popup';
//mport  Counter  from './Counter.js'

//kpham: make cards outside of component so that it won't get recreated
//everytime component is refreshed.

/*
  src: string;
    matched: boolean;
    match_index: number;    
*/


//className={completed ? 'text-strike' : null}
//export function TextMatchGame(props: {theLeftCards1: TextCardProps, theRightCards1: TextCardProps}) {
    export function TextMatchGame(props: {id: string}) {
        const [leftCards , setLeftCards] = useState<TextCardProps[]>([])
        const [rightCards , setRightCards] = useState<TextCardProps[]>([])
        
    const [leftCards1 , setLeftCards1] = useState<TextCardProps[]>([{
        src: 'apple', matched: false, match_index: 0, language: 'en'},
        {src: 'banana', matched: false, match_index: 1, language: 'en'},
        {src: 'date', matched: false, match_index: 2, language: 'en'}
    ])


    const [rightCards1 , setRightCards1] = useState<TextCardProps[]>([
         {src: 'red', matched: false, match_index: 0, language: 'en' },
         {src: 'yellow', matched: false, match_index: 1, language: 'en'}
        ,{src: 'purple', matched: false, match_index: 2, language: 'en'}
    ])

    const [leftCardsBank , setLeftCardsBank] = useState<TextCardProps[]>([])
    const [rightCardsBank , setRightCardsBank] = useState<TextCardProps[]>([])
   

    //const [rightCards , setRightCards] = useState([])
    const [turns, setTurns] = useState(0)
    const [nummatches, setNumMatches] = useState(0)
    const [gameover, setGameOver] = useState(false)

    const childRef = useRef();
    const myTimeout = useRef(null)

    const [choiceLeft, setChoiceLeft] = useState<TextCardProps | undefined>(undefined)
    const [choiceRight, setChoiceRight] = useState<TextCardProps | undefined>(undefined)

    //const params = useParams<{ game_id: string}>();
    const numCardsToDisplay = 6

    /*
        src: string;
        matched: boolean;
        match_index: number;    
    */

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
              //console.log("left_array = ", left_array)

              const right_array = response.target.split('/').map((str:string, index:number) => {
                return (
                  {src: str, matched: false, match_index: index, language: response.target_language }
                )
              });
              //console.log("right_array = ", right_array)

               // Combine both arrays into an array of pairs
            let combined = left_array.map((item:any, index:number) => [item, right_array[index]]);

            // Shuffle using Fisher-Yates algorithm
            for (let i = combined.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [combined[i], combined[j]] = [combined[j], combined[i]]; // Swap elements
            }

             // Separate the shuffled pairs back into individual arrays
             let left= combined.map((pair: [TextCardProps, TextCardProps]) => pair[0]);
             let right = combined.map((pair: [TextCardProps, TextCardProps]) => pair[1]);
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
        })
        
    },[props.id])

    useEffect(() => {
        //return () => {
         //   clearTimeout(myTimeout.current)
         // }  
    },[gameover])

    useEffect (() => {
            if (choiceLeft && choiceRight ) {
                if (choiceLeft.match_index === choiceRight.match_index) {

                    const matched_left_card_index = leftCards.findIndex((w => w.match_index === choiceRight.match_index));
                    //console.log("matched_card_index = ", matched_left_card_index)

                    const matched_right_card_index = rightCards.findIndex((w => w.match_index === choiceRight.match_index));
                    //console.log("matched_card_index = ", matched_right_card_index)

                    const tempArray1 = leftCards.slice(); //get a shallow copy of leftCards
                    tempArray1.splice(matched_left_card_index, 1, {...leftCardsBank[0], match_index: choiceLeft.match_index}); // remove the selected word 
                      // and simultaneously insert the first word of words_bank at the same index
                    setLeftCards(tempArray1)

                    const tempArray2 = rightCards.slice(); // get a shallow copy of rightCards
                    tempArray2.splice(matched_right_card_index, 1, {...rightCardsBank[0], match_index: choiceRight.match_index}); // remove the selected word 
                      // and simultaneously insert the first word of words_bank at the same index
                    setRightCards(tempArray2)

                    // remove the first element from leftCardsBank
                    leftCardsBank.splice(0, 1)
                    // remove the first element from rightCardsBank
                    rightCardsBank.splice(0, 1)      
             
                    setNumMatches(prevNumMatches => prevNumMatches + 1)
                    resetTurn()
                }
                else {
                    resetTurn()
                }
            }
    }, [choiceLeft, choiceRight])

    const resetTurn = () => {
        setChoiceLeft(undefined)
        setChoiceRight(undefined)
        setTurns(prevTurns => prevTurns + 1)
    }
   
    useEffect(() => {
        if (nummatches === 8) {
            setGameOver(true)
            //childRef.current.clearCount()
        }
    },[nummatches])

    const handleChoiceLeft = (card: TextCardProps) => {
        setChoiceLeft(card)
    }

    const handleChoiceRight = (card: TextCardProps) => {
       setChoiceRight(card)
    }

        return (
            <>
                <div>
                    {(gameover) ?
                        <h3 className='mx-10 my-0 text-xl'>Game Over</h3>
                        :
                        <div className='flex flex-row'>
                            <div className="flex justify-center items-center w-full bg-gray-400">
                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div className="bg-blue-500  items-center justify-start rounded-lg shadow-lg">
                                        {leftCards && leftCards.map(card => (
                                            <div key={card.match_index} className='m-2 w-900px'>
                                                {card.language === 'vn' ?
                                                <div className='flex flex-col gap-1'>
                                                    <TextCard card={card} handleChoice={handleChoiceLeft} card_side='left' />
                                                    </div>
                                                    :
                                                <div className='flex flex-col gap-1'>
                                                    <TextCardAzure card={card} handleChoice={handleChoiceLeft} card_side='left' />
                                                    </div>
                                                }
                                            </div>
                                        ))
                                        }
                                    </div>
                                    <div className="bg-blue-500  items-center justify-start rounded-lg shadow-lg">
                                        {rightCards && rightCards.map(card => (
                                            <div key={card.match_index} className='m-2 w-900px'>
                                                {card.language === 'vn' ?
                                                <div className='flex flex-col gap-1'>
                                                    <TextCard card={card} handleChoice={handleChoiceRight} card_side='right' />
                                                    </div>
                                                    :
                                                <div className='flex flex-col gap-1'>
                                                    <TextCardAzure card={card} handleChoice={handleChoiceRight} card_side='right' />
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

/*
                                    <div className="bg-blue-500 text-white  items-center justify-start rounded-lg shadow-lg">
                                        {rightCards && rightCards.map(card => (
                                            <div key={card.match_index} className='m-2 w-900px'>
                                                {card.language === 'vn' ?
                                                <div className='flex flex-col gap-1'>
                                                    <TextCard card={card} handleChoice={handleChoiceRight} card_side='right' />
                                                    </div>
                                                    :
                                                <div>
                                                    <TextCardAzure card={card} handleChoice={handleChoiceRight} card_side='right' />
                                                    </div>
                                                }
                                            </div>
                                        ))
                                        }
                                    </div>
*/

/*
 return (
        <>

            <div className='flex flex-row justify-center'>
                { (gameover) ?
                    <h3 className='mx-10 my-0 text-xl'>Game Over</h3>
                    :
                    <div className='mx-44 my-10 grid grid-cols-2 gap-3 bg-red-400'>
                        <div className='flex flex-col gap-2 justify-center bg-yellow-300 m-2' >
                        { leftCards && leftCards.map (card => (
                                <div key={card.match_index} className='m-2'>
                                {card.src === 'vn' ?
                                <TextCard card={card} handleChoice={handleChoiceLeft} card_side='left'/>
                                :
                                <TextCardAzure card={card} handleChoice={handleChoiceLeft} card_side='left'/>
                                }
                                </div>
                            ))
                        }
                        </div>
                        
                        <div className='flex flex-col gap-2 justify-center bg-green-300 m-2'>
                        { rightCards && rightCards.map (card => (
                                <div key={card.match_index} className='m-2' >
                                 {card.src === 'vn' ?
                                  <TextCard card={card} handleChoice={handleChoiceLeft} card_side='right'/>
                                  :
                                <TextCardAzure card={card} handleChoice={handleChoiceRight} card_side='right'/>
                                 }
                                </div>
                            ))
                        }
                        
                        </div>
                    </div>
                }
            </div>
        
        </>
    )
*/
