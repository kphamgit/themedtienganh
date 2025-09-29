import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useLocation } from 'react-router-dom';

import './MyReactPlayer.css';

    export type YouTubePlayerRef = {
      playSegment: (start_time: string, end_time: string) => void;
    }

    type YouTubePlayerProps = {
        video_url: string;
        parent_playingEnds?: () => void;
      
    };

    //const [videoUrl, setVideoUrl] = useState('')
    const YoutubeVideoPlayer = React.memo(
      React.forwardRef<YouTubePlayerRef, YouTubePlayerProps>(function YoutubeVideoPlayer(props, ref) {
    const [playing, setPlaying] = useState(false);

    const stopCount = useRef(0);

    const playerRef = useRef<ReactPlayer>(null);

    const endTime = useRef<string | null>(null);

    const convertToMiliSeconds = (time: string): number => {
      const [minutes, seconds] = time.split(":").map(Number); // Split and convert to numbers
      return (minutes * 60 + seconds) * 1000; // Calculate total seconds
    };

    const convertToSeconds = (time: string): number => {
      const [minutes, seconds] = time.split(":").map(Number); // Split and convert to numbers
      return (minutes * 60 + seconds); // Calculate total seconds
    };
    
    const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
      const millisecondsPlayed = Math.floor(state.playedSeconds * 1000);
      if (endTime.current && millisecondsPlayed >= convertToMiliSeconds(endTime.current)) {
        setPlaying(false);
        stopCount.current += 1;
        console.log("Playing stopped,");
          props.parent_playingEnds && props.parent_playingEnds();
      }
    };

     
     useImperativeHandle(ref, () => ({
        playSegment(start_time: string, end_time: string) {
          endTime.current = end_time;
          seekToTime(convertToSeconds(start_time));
          setPlaying(true);
        }
      }));
    
      const handlePlayPause = () => {
        setPlaying(!playing);
      };

      const seekToTime = (time: number) => {    // time in seconds
        playerRef.current?.seekTo(time);
      };

      const seekForward = () => {
        playerRef.current?.seekTo(playerRef.current.getCurrentTime() + 10);
        //playerRef.current?.seekTo(31);
    };

    const seekBackward = () => {
      playerRef.current?.seekTo(playerRef.current.getCurrentTime() - 10);
  };


  return (
    <>
    
    <div className='flex justify-items-start bg-cyan-300'>
     
    <div className='flex flex-col'>
      <div className='w-3/4'>
        <div className="player-wrapper">
          <div className="player-overlay"></div>
          <ReactPlayer
            ref={playerRef}
            onProgress={handleProgress}
            playing={playing}
            url={props.video_url}
            muted={false}
            controls={true}
          />
        </div>
      </div>
    
    </div>
    </div>
    </>
    );
  })
);

/*
  <div className='flex flex-row justify-start gap-2 mt-3 mb-5'>
          <div className='text-textColor1'>
          <button className='bg-amber-500 p-1 rounded-md' onClick={handlePlayPause}>
          {playing ? 'Pause' : 'Play'}
        </button>
          </div>
          <div className='text-textColor1'>
          <button className='bg-green-400 p-1 rounded-md' onClick={seekForward}>Forward</button>
          </div>
          <div className='text-textColor1'>
          <button className='bg-cyan-400 p-1 rounded-md' onClick={seekBackward}>Backward</button>
          </div>
      </div>
*/

export default YoutubeVideoPlayer;
/*
{
    "id": 300,
    "name": "Video Quiz",
    "quiz_number": 2,
    "disabled": false,
    "video_url": "https://www.youtube.com/watch?v=zghYZJS02A4",
    "unitId": 71,
    "video_segments": [
        {
            "id": 1,
            "duration": 10000,
            "quizId": 300
        }
    ]
}
*/