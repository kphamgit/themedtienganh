import React, { useEffect, useState } from 'react'
import { FaSmile } from 'react-icons/fa';
import { FaFrown } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import {QuestionAttemptResponseProps} from '../services/list'

/*
type QuestionAttemptResponse =
{
    message: string,
    question_attempt_results: {
        answer: string,
        score: number,
        error_flag: boolean,
        completed: boolean,
        correct_answer: string
    },
    question_id: number,
    question_format: number,
    words_scramble_direction: string,
    question_number: number,
    accumulated_score: number,
    questions_exhausted: boolean
}
*/

export function QuestionAttemptResults(props:{live_flag: boolean, response: QuestionAttemptResponseProps}) {
    //console.log("XXXXQQQQQQQQ", props.response.question_attempt_results)
    const [videoUrl, setVideoUrl] = useState<string>('')
    const [playing, setPlaying] = useState(false);
    const displayFormattedAnswer = (ans_str: string) => {
        //console.log("MMMMM ans_str", ans_str)
        //console.log("MMMMM format", props.response.question_format)
        if (props.response.question_format === 6) {
            //const correct_answer_str = props.response.question_attempt_results.correct_answer.replaceAll('/',' ')
            const formatted_answer_str =ans_str.replaceAll('/',' ')
            return (
                <div className='mx-3'>{formatted_answer_str}</div>
            )
        }
        else {
            return (
                <div>{ans_str}</div>
            )
        }
    }
    const handlePlay = () => {
        //console.log("in handle play")
        setPlaying(true);
    
        //if (playerRef.current && currentVideoPage?.startTime) {
          //  playerRef.current.seekTo(currentVideoPage.startTime);
       // }
    };

    useEffect(() => {
        //setTimeout(() => setVideoUrl('https://www.youtube.com/shorts/ZAtHW_BubzM'),2000)
    },[])

    return (
        <>
          { videoUrl &&
            <div>
                <div className='w-3/4 h-full'>
                    <div className="player-wrapper">
                        <div className="player-overlay"></div>
                        <ReactPlayer
                            playing={playing}
                            url={videoUrl}
                            onPlay={handlePlay}
                    
                            controls={false}
                        />
                    </div>
                </div>

       
            </div>
            }
            {props.response.question_attempt_results.error_flag &&
                <div className='flex flex-row gap-1'>
                    <div className='text-blue-600 text-xl m-2'>
                        <FaFrown />
                    </div>
                    <div>
                        <div className='m-1 mx-2 text-red-600 text-lg'>Sorry!</div>
                      
                       
                    </div>
                    
                </div>
            }

            <div className='m-2'>Your answer is (Bạn trả lời là): {displayFormattedAnswer(props.response.question_attempt_results.answer)}</div>
            <div>{props.response.question_attempt_results.error_flag ?
                <div className='m-2'>The correct answer is (Câu trả lời đúng là):
                    {displayFormattedAnswer(props.response.question_attempt_results.correct_answer)}
                    <div className='text-lg text-amber-800 my-2'>{props.response.question_help1}</div>
                </div>
                :
                <div className='text-lg text-orange-600 mx-2'> 
                <FaSmile />
              </div>
            }
            </div>
            { !props.live_flag && 
            <div className='m-2'>Your score: {props.response.accumulated_score}</div>
            }
        </>
    )
}
