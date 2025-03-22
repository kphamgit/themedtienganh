import React, { useState, useEffect, useRef } from 'react';

import ShortMemoryGame from './ShortMemoryGame';
import { useAxiosFetch } from '../../hooks';
import ContinuousMemoryGame from './ContinuousMemoryGame';


export interface CardProps {
  id: number;
  text: string;
  matched: boolean;
  flipped: boolean;
  match_index: number;
  bgcolor: string;
  handle_choice?: (card: CardProps) => void;
}

interface ElapsedTime {
  minutes: number, seconds: number
}

type AppProps = {
  id: string;
}; 

/*
 const url = `${rootpath}/api/match_games/${id}` 
    const response = await axios.get(url)
*/
//const ShortMemoryGame: React.FC<AppProps> = ({data}) => {

const MemoryGame: React.FC<AppProps> = ({id}) => {
  
  const url = `match_games/${id}` 
  const { data: game_data, loading, error } =
      useAxiosFetch<any>({ url: url, method: 'get' })

  return (
    <>    
    { game_data && !game_data.continuous &&
      <ShortMemoryGame data={game_data} />
    }
    { game_data && game_data.continuous &&
      <ContinuousMemoryGame data={game_data} />
    }
    </>
  );
};

export default MemoryGame;