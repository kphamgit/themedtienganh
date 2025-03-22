import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../shared/Card';
import { useParams } from 'react-router-dom';
import { Counter } from '../shared/Counter';
import { CounterRef } from '../shared/Counter';

export interface CardProps {
  id: number;
  text: string;
  matched: boolean;
  flipped: boolean;
  match_index: number;
  bgcolor: string;
  handle_choice?: (card: CardProps) => void;
}

type AppProps = {
  data: any;
}; 
/*
{
    "id": 1,
    "name": "The earth",
    "game_number": 1,
    "level": "beginner, basic",
    "continuous": false,
    "base": "the earth/the stream/the river/the sea/the hill/the mountain/the flower/the snow",
    "target": "earth.jpeg/stream.jpeg/river.jpeg/sea.jpeg/hill.jpeg/mountain.jpeg/plant.jpeg/snow.jpeg",
    "source_language": "",
    "target_language": "n/a",
    "video_url": "https://www.youtube.com/watch?v=t6PKcnTGVX4",
    "video_duration": 51000,
    "unitId": null
}
*/

interface ElapsedTime {
  minutes: number, seconds: number
}

//const App: React.FC<AppProps> = ({ message })//
const ShortMemoryGame: React.FC<AppProps> = ({data}) => {
  const [cards, setCards] = useState<CardProps[]>([]);
  const [name, setName] = useState<string>('')
  const [choiceOne, setChoiceOne] = useState<CardProps>()
  const [choiceTwo, setChoiceTwo] = useState<CardProps>()
  const [numMatches, setNumMatches] = useState(0)
  const [gameover, setGameOver] = useState(false)
  const [clickCount, setClickCount] = useState<number>(0)
  const [elapsedTime, setElapsedTime] = useState<ElapsedTime>()

  const counterRef = useRef<CounterRef>(null)
  //purple, cyan, slate, yellow, lime, emerald, teal, sky, indigo, violet, fuchsia, rose

  const params = useParams<{ game_id: string, backcolor: string }>();

  const handleChoice = (card: CardProps) => {
    setClickCount(prev => prev + 1)
    if (choiceOne === undefined) {
      //console.log("choice ONe is undefined. Set card to choice ONE")
      setChoiceOne(card)
    }
    else {
      //console.log("choice ONe is NON NULL. Set card to choice TWO")
      setChoiceTwo(card)
    }
  };
 
  useEffect(() => {
        //console.log("XXXXXYYYYYY", data)
        setName(data.name)
        let myArray1 = data.base.split('/').map((str: string, index: number) => {
          return (
            { text: str.trim(), matched: false, flipped: false, match_index: index }
          )
        });
        //console.log("myArray1 = ", myArray1)
        // setCardGroup1(myArray1)
        let myArray2 = data.target.split('/').map((str: string, index: number) => {
          return (
            { text: str.trim(), matched: false, flipped: false, match_index: index }
          )
        });
        const shuffledCards = [...myArray1, ...myArray2].sort(() => Math.random() - 0.5).map((card, index) => ({
          id: index,
          text: card.text,
          flipped: false,
          matched: false,
          bgcolor: 'bg-green-200',
          match_index: card.match_index,
          //handleChoice: void, //note: handleChoice is made optional in CardProps so it's not required in here
        }));
        // console.log("BBBBB", shuffledCards)
        setCards(shuffledCards);
        //console.log(" set GameStarted to true")
        setGameOver(false)
      
  }, [data])

  useEffect(() => {
    if (numMatches === 8) {
      //console.log(" num matdhes = 1")
        setClickCount(0)
        setNumMatches(0)
        //const elapsed_time: ElapsedTime | undefined = counterRef.current?.stopCount()
        setElapsedTime(counterRef.current?.stopCount())
        setTimeout(() => setGameOver(true), 1300)
        
    }
},[numMatches])

useEffect(() => {
  if (clickCount === 1) {
    //console.log("startttttt...")
    counterRef.current?.startCount()
  }
},[clickCount])

  useEffect(() => {
    //console.log("in useEffect...choice1", choiceOne)
    //console.log("in useEffect...choice2", choiceTwo)
    if (choiceOne && choiceTwo) {
      //console.log(" choice1 and choice2")
      if (choiceOne.match_index === choiceTwo.match_index) {
        //console.log(" choice1 === choice2")
        setCards(prevState => {
          return prevState.map(card => {
            if (card.match_index === choiceOne.match_index) {
              //console.log("matched.... match index", card.match_index)
              return { ...card, matched: true }
            }
            else {
              return card
            }
          }
          );
        })
        setNumMatches(prevNumMatches => prevNumMatches + 1)
        resetTurn()
      }
      else {
        //resetTurn()
        setTimeout(() => resetTurn(), 700)
      }
    }

  }, [choiceOne, choiceTwo])

  const resetTurn = () => {
    setChoiceOne(undefined)
    setChoiceTwo(undefined)
  }

  return (
    <>    
      <div className='flex flex-row justify-center mx-7 mt-3 mb-3 text-xl font-bold text-green-700'>{name}</div>
      { gameover ? 
      <div className='flex flex-col text-xl mt-10 ml-20'>Game Over!
        <div>
        { elapsedTime?.minutes === 0 ?
        <div>&nbsp;</div>
        :
            <div><span className='text-orange-700 p-1'>{elapsedTime?.minutes}</span><span>minutes.</span></div>
        }
        <div>Time elapsed: <span className='text-orange-700'>{elapsedTime?.seconds}</span> seconds.</div>
        </div>
      </div>
      :
      <>
      <div className='ml-20'><Counter initialSeconds={0} ref={counterRef} /></div>
      <div className='flex justify-center mt-8'>
        <div className='grid grid-cols-4 gap-1'>
          {cards.map((card: CardProps, index) => (
            <Card key={index}
              id={card.id} text={card.text}
              matched={card.matched}
              bgcolor={params.backcolor!}
              flipped={card.id === choiceOne?.id || card.id === choiceTwo?.id || card.matched}
              match_index={card.match_index}
              handle_choice={handleChoice}
            />
          )
          )}
        </div>
      </div>
      </>
      }
    </>
  );
};

export default ShortMemoryGame;

