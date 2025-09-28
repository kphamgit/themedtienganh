import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useLocation } from 'react-router-dom';

import './MyReactPlayer.css';
import exp from 'constants';

export type YouTubePlayerRef = {
  playSegment: (start_time: string, end_time: string) => void;
}

type YouTubePlayerProps = {
    video_url: string;
    //video_segments: { startTime: string; endTime: string }[];
    parentCallback?: (segmentIndex: number) => void;
    startTime?: string; // '0:05' or '1:05' in seconds
    endTime?: string; // in seconds
    
    //videoDuration: number; // in milliseconds
};


//const YoutubeVideoPlayerNew = React.memo(function YoutubeVideoPlayerNew(props: YouTubePlayerProps) {


//export default function YoutubeVideoPlayerNew(props: YouTubePlayerProps) {
    //const [videoUrl, setVideoUrl] = useState('')
    const YoutubeVideoPlayer = React.memo(
      React.forwardRef<YouTubePlayerRef, YouTubePlayerProps>(function YoutubeVideoPlayerNew(props, ref) {
    const [playing, setPlaying] = useState(true);

    const stopCount = useRef(0);
   // const videoSegments = useRef(props.video_segments);

    //const endTimes = useRef<string[]>(["1:05", "2:30", "3:00"]); // MM:SS
    const videoSegmentIndex = useRef(0);

    const segmentStartTime = useRef(props.startTime ? props.startTime : "0:00");
    const segmentEndTime = useRef(props.endTime ? props.endTime : undefined);

    /*
[
    {
        "startTime": "0:00",
        "endTime": "0:35"
    },
    {
        "startTime": "0:35",
        "endTime": "1:00"
    },
    {
        "startTime": "1:00",
        "endTime": "1:30"
    }
]

    const videoSegments = useRef([
      { startTime: "0:00", endTime: "0:35" },
      { startTime: "0:35", endTime: "1:00" },
      { startTime: "1:00", endTime: "1:30" }
    ])
  */

    //const endTimesInMiliseconds = useRef<number[]>([]); // MM:SS
    //const location = useLocation()

    const playerRef = useRef<ReactPlayer>(null);

    
    useEffect(() => {
       //console.log("YoutubeVideoPlayer props=", props)
       // seek to start time if provided
       if (props.startTime) {
        seekToTime(convertToSeconds(props.startTime) ); 
        segmentEndTime.current = props.endTime ? props.endTime : undefined;
        // set playing to true
        setPlaying(true);
       }
    }, [props]);

   // useEffect(() => {
       // setVideoUrl(props.video_url);
   // }, [props.video_url]);


    const convertToMiliSeconds = (time: string): number => {
      const [minutes, seconds] = time.split(":").map(Number); // Split and convert to numbers
      return (minutes * 60 + seconds) * 1000; // Calculate total seconds
    };

    const convertToSeconds = (time: string): number => {
      const [minutes, seconds] = time.split(":").map(Number); // Split and convert to numbers
      return (minutes * 60 + seconds); // Calculate total seconds
    };
    
   // useEffect(() => {
      // Convert all end times to milliseconds
     // endTimesInMiliseconds.current = endTimes.current.map(convertToMiliSeconds);
    //  console.log("Converted end times in milliseconds:", endTimesInMiliseconds.current);
   // }, []);

  //const arg = {video_url: videoUrl, video_duration: videoDuration}
  /*
    const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
          console.log("in handleProgress, playedSeconds=", state.playedSeconds)
          console.log("in handleProgress, props.endTime=", props.endTime)
          console.log("in handleProgress,end time in seconds=", props.endTime ? convertToMiliSeconds(props.endTime) : "undefined endTime")
        //if (currentVideoPage?.endTime && state.playedSeconds >= currentVideoPage?.endTime) {
           // console.log(" in handleProgress HERE. Stop playing because playedSeconds > video page endtime")
           //console.log(Math.floor(state.playedSeconds*1000))
           //const endTimesInMiliseconds = props.endTime * 100
           const millisecondsPlayed = Math.floor(state.playedSeconds*1000)
           if (props.endTime && convertToMiliSeconds(props.endTime) && millisecondsPlayed >= convertToMiliSeconds(props.endTime)) {
            // stop playing
             setPlaying(false);
            if (props.parentCallback) {
              console.log("calling parentCallback with segment index=", videoSegmentIndex.current)
              //props.parentCallback(videoSegmentIndex.current);
            }
            // seek to end time
            //seekToTime(convertToSeconds(props.endTime));
           }
        
      };    
*/

/*
      const handleProgress = useCallback(
        (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
       
          const millisecondsPlayed = Math.floor(state.playedSeconds * 1000);
          if (props.endTime && convertToMiliSeconds(props.endTime) && millisecondsPlayed >= convertToMiliSeconds(props.endTime)) {
            // Stop playing
            console.log("HERE millisecondsPlayed:", millisecondsPlayed);
            console.log("HERE props.endTime in milliseconds:", convertToMiliSeconds(props.endTime));
            console.log(" HERE in handleProgress HERE. Stop playing because playedSeconds > video segment endtime");
            setPlaying(false);
            stopCount.current += 1;
            console.log("stopCount.current:", stopCount.current);
            if (stopCount.current === 2) { // Call parentCallback only the first time
              if (props.parentCallback) {
                console.log("calling parentCallback with segment index=", videoSegmentIndex.current);
                props.parentCallback(videoSegmentIndex.current);
              }
            }
            //if (props.parentCallback) {
            //  console.log("calling parentCallback with segment index=", videoSegmentIndex.current);
              //props.parentCallback(videoSegmentIndex.current);
             
           // }
          }
        },
        [props.endTime, props.parentCallback, convertToMiliSeconds, setPlaying]
      );
*/
const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
  const millisecondsPlayed = Math.floor(state.playedSeconds * 1000);
  //console.log("in handleProgress, playedSeconds=", state.playedSeconds);
  //console.log("in handleProgress, segmentEndTime=", segmentEndTime.current);
  if (props.endTime && convertToMiliSeconds(segmentEndTime.current ?? "0:00") && millisecondsPlayed >= convertToMiliSeconds(segmentEndTime.current ?? "0:00")) {
    // Stop playing
    //console.log("HERE millisecondsPlayed:", millisecondsPlayed);
    //console.log("HERE props.endTime in milliseconds:", convertToMiliSeconds(props.endTime));
    //console.log(" HERE in handleProgress HERE. Stop playing because playedSeconds > video segment endtime");
    setPlaying(false);
    stopCount.current += 1;
    //console.log("stopCount.current:", stopCount.current);
    if (stopCount.current === 2) { // Call parentCallback only the first time
      if (props.parentCallback) {
        //console.log("calling parentCallback with segment index=", videoSegmentIndex.current);
        props.parentCallback(videoSegmentIndex.current);
      }
    }
  }
};

     
     useImperativeHandle(ref, () => ({
        playSegment(start_time: string, end_time: string) {
          console.log("playSegment called with start_time=", start_time, " end_time=", end_time);
          segmentStartTime.current = start_time;
          segmentEndTime.current = end_time;
          seekToTime(convertToSeconds(start_time));
          setPlaying(true);
          stopCount.current = 0; // reset stop count for new segment
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
    );
  })
);

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