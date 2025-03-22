//import WordMatchGame from "../live/WordMatchingGame";
import { useEffect, useState } from "react";
import { getAllGames } from "../../services/list";
import ContinuousMemoryGame  from "../matching_games/ContinuousMemoryGame";
//import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import MemoryGame from "../matching_games/MemoryGame";
//import WordMatchingGame from "../live/WordMatchingGame";
//import WordMatchingGame from "../live/WordMatchingGame";

interface GameProps {
    id: number;
    name: string;
    game_number: number;
    level: string;
    continuous: boolean;
    base: string;
    target: string;
    source_language: string;
    target_language: string;
    video_url: string;
    video_duration: number;
    unitId: number;
}

export default function Games() {
    const [games, setGames] = useState<GameProps[]>([])
    //const [isPopupOpen1, setIsPopupOpen1] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [gameId, setGameId] = useState<string>('')

    useEffect(() => {
        getAllGames()
            .then((data) => {
                //console.log("..xxxxxxx.", data)
                if (data) {
                   //console.log("data = ", data)
                    setGames(data)
                }
                //setGames(data)
                }
            )
            .catch(error =>
                console.log(error)
            )
    }, [])
// setIsPopupOpen(true);
    const handleClicked = (gameId: string) => {
        //console.log("in handleClicked")     
        setGameId(gameId)
        setIsPopupOpen(true)
    }

    
 
    return (
        <div className="mx-10">
            <div>
                <Popup open={isPopupOpen} closeOnDocumentClick onClose={() => setIsPopupOpen(false)} modal>
                    <div className="fixed min-w-min inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-cyan-400 p-6 w-3/12 rounded-lg shadow-lg">
                       
                            <div>
                                <MemoryGame id={gameId}></MemoryGame>
                            </div>
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Popup>
            </div>
            {games && games.map((game: GameProps) => {
                return (
                    <div key={game.id}>
                        <div className="underline p-1">
                            <div className="flex flex-row justify-start gap-2">
                            <div>
                            <button className="bg-amber-300 p-1 rounded-md " onClick={() => handleClicked(game.id.toString())}>{game.name}</button>
                            </div>
                            </div>
                        </div>
                    </div>
                )
            }
            )}
        </div>
    )
}

// <Link to={`/play_game/${game.id}`}>{game.name}</Link>
//  <button className="bg-amber-300 p-1 rounded-md " onClick={() => setIsPopupOpen(true)}>{game.name}</button>
/*

     <div>{game.base}</div>
                    <div>{game.target}</div>
                    <div>{game.source_language}</div>
                    <div>{game.target_language}</div>
                    <div>{game.video_url}</div>
                    <div>{game.video_duration}</div>
 return (
        <div>
        <div className="flex flex-row justify-center text-4xl">Games</div>
        <WordMatchingGame />
        </div>
    )
*/

/*
   return (
        <div>
         
        <div className="flex flex-row justify-center text-4xl">Games</div>
        <TextMatchGame />
        </div>
    )
*/