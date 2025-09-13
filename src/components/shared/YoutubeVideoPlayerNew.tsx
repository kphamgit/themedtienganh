import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useLocation } from 'react-router-dom';

import './MyReactPlayer.css';

type YouTubePlayerProps = {
    video_url: string;
    video_segments: { startTime: string; endTime: string }[];
    parentCallback?: (segmentIndex: number) => void;
    //videoDuration: number; // in milliseconds
};

export default function YoutubeVideoPlayerNew(props: YouTubePlayerProps) {
    const [videoUrl, setVideoUrl] = useState('')
    
    const [playing, setPlaying] = useState(false);

    const endTimes = useRef<string[]>(["1:05", "2:30", "3:00"]); // MM:SS
    const videoSegmentIndex = useRef(0);

    /*
    const videoSegments = useRef([
      { startTime: "0:00", endTime: "0:35" },
      { startTime: "0:35", endTime: "1:00" },
      { startTime: "1:00", endTime: "1:30" }
    ])
  */

    const endTimesInMiliseconds = useRef<number[]>([]); // MM:SS
    const location = useLocation()

    const playerRef = useRef<ReactPlayer>(null);

    /*
    useEffect(() => {
        if (location.state) {
          setVideoUrl(location.state.video_url);
          setVideoDuration(location.state.video_duration)
        }
    }, [location.state]);
*/
    useEffect(() => {
        setVideoUrl(props.video_url);
    }, [props.video_url]);


    const convertToMiliSeconds = (time: string): number => {
      const [minutes, seconds] = time.split(":").map(Number); // Split and convert to numbers
      return (minutes * 60 + seconds) * 1000; // Calculate total seconds
    };
    
    useEffect(() => {
      // Convert all end times to milliseconds
      endTimesInMiliseconds.current = endTimes.current.map(convertToMiliSeconds);
      console.log("Converted end times in milliseconds:", endTimesInMiliseconds.current);
    }, []);

  //const arg = {video_url: videoUrl, video_duration: videoDuration}
    const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
      //console.log("in handleProgress, playedSeconds=", state.playedSeconds)
        //if (currentVideoPage?.endTime && state.playedSeconds >= currentVideoPage?.endTime) {
           // console.log(" in handleProgress HERE. Stop playing because playedSeconds > video page endtime")
           //console.log(Math.floor(state.playedSeconds*1000))
           const whole_milis = Math.floor(state.playedSeconds*1000)
        if (endTimesInMiliseconds.current.length > 0) {
          if (whole_milis >= convertToMiliSeconds(props.video_segments[videoSegmentIndex.current].endTime)) {
            videoSegmentIndex.current += 1;
            setPlaying(false);
            if (props.parentCallback) {
              props.parentCallback(videoSegmentIndex.current);
            }
          }
          //if (playerRef.current && currentVideoPage?.startTime) {
          // playerRef.current.seekTo(currentVideoPage.startTime );
          //}
          // }
        }
      };    

      const handlePlayPause = () => {
        setPlaying(!playing);
      };

      const seekForward = () => {
        playerRef.current?.seekTo(playerRef.current.getCurrentTime() + 10);
        //playerRef.current?.seekTo(31);
    };

    const seekBackward = () => {
      playerRef.current?.seekTo(playerRef.current.getCurrentTime() - 10);
  };


  return (
    <div className='flex justify-items-start bg-cyan-300'>
    <div className='flex flex-col'>
      <div className='w-3/4'>
        <div className="player-wrapper">
          <div className="player-overlay"></div>
          <ReactPlayer
            ref={playerRef}
            onProgress={handleProgress}
            playing={playing}
            url={videoUrl}
            muted={false}
            controls={true}
          />
        </div>
      </div>
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
    </div>
    </div>
  )
}

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