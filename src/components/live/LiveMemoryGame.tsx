import React, { useState, useEffect, useRef } from 'react';

//import TtSpeechProvider from './context/AzureTtsContext';
import { useParams } from 'react-router-dom';

import ShortMemoryGame from '../matching_games/ShortMemoryGame';
import { useAxiosFetch } from '../../hooks';
import ContinuousMemoryGame from '../matching_games/ContinuousMemoryGame';


export interface CardProps {
  id: number;
  text: string;
  matched: boolean;
  flipped: boolean;
  match_index: number;
  bgcolor: string;
  handle_choice?: (card: CardProps) => void;
}



const LiveMemoryGame: React.FC = () => {

  const params = useParams<{ game_id: string, backcolor: string }>();

  const url = `match_games/${params.game_id}` 
 const { data: game_data, loading, error } =
    useAxiosFetch<any>({ url: url, method: 'get' })

  return (
    <>    
    { game_data && !game_data.continuous &&
      <ShortMemoryGame data={game_data} />
    }
    { game_data && game_data.continuous &&
    <div className="flex flex-col items-center justify-center mb-4">
      <ContinuousMemoryGame data={game_data} />
    </div>
    }
    </>
  );
};

export default LiveMemoryGame;
