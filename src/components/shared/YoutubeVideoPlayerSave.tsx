import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useLocation } from 'react-router-dom';

import './MyReactPlayer.css';
import { VideoSegmentProps } from '../quiz_attempts/types';

export type YouTubePlayerRef = {
  playSegment: (current_segment_index: number) => void;
}

type YouTubePlayerProps = {
    video_url: string;
    //video_segments: { startTime: string; endTime: string }[];
    parentCallback?: () => void;
    videoSegments: VideoSegmentProps[];
    currentSegmentIndex: number;
};

    //const [videoUrl, setVideoUrl] = useState('')
    const YoutubeVideoPlayerSave = React.memo(
      React.forwardRef<YouTubePlayerRef, YouTubePlayerProps>(function YoutubeVideoPlayer(props, ref) {
    const [playing, setPlaying] = useState(false);

    const [videoSegments, setVideoSegments] = useState<VideoSegmentProps[]>(props.videoSegments || []);

    const stopCount = useRef(0);

    const playerRef = useRef<ReactPlayer>(null);

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
  //console.log("in handleProgress, playedSeconds=", state.playedSeconds);
  //console.log("in handleProgress, segmentEndTime=", props.videoSegment.end_time);
 // if (props.endTime && convertToMiliSeconds(segmentEndTime.current ?? "0:00") && millisecondsPlayed >= convertToMiliSeconds(segmentEndTime.current ?? "0:00")) {
  if (videoSegments[props.currentSegmentIndex].end_time && convertToMiliSeconds(videoSegments[props.currentSegmentIndex].end_time) && millisecondsPlayed >= convertToMiliSeconds(videoSegments[props.currentSegmentIndex].end_time)) {
    //console.log("HERE millisecondsPlayed:", millisecondsPlayed);
    //console.log("HERE props.endTime in milliseconds:", convertToMiliSeconds(props.endTime));
    //console.log(" HERE in handleProgress HERE. Stop  because playedSeconds > video segment endtime");
    setPlaying(false);
    stopCount.current += 1;
    //console.log("stopCount.current:", stopCount.current);
    if (stopCount.current === 2) { // Call parentCallback only the first time
      if (props.parentCallback) {
        //console.log("calling parentCallback with segment index=", videoSegmentIndex.current);
        props.parentCallback();
      }
    }
  }
};

     
     useImperativeHandle(ref, () => ({
        playSegment(current_segment_index: number) {
          //segmentStartTime.current = start_time;
          console.log("********************** in playSegment, segment  = ", videoSegments);
          console.log(
            "XXXXXXXXXXXXXXXXXXXX in playSegment, currentSegmentIndex  = ",
            props.currentSegmentIndex,
          )
          seekToTime(convertToSeconds(videoSegments[current_segment_index].start_time));
          //segmentEndTime.current = end_time;
          //console.log("********************** in playSegment, segment = ", props.videoSegment);
          setPlaying(true);
          stopCount.current = 0; // reset stop count for new segment
        }
     // }));
    }), [props.currentSegmentIndex]);

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
      <div className='bg-bgColor2 text-textColor2'>In YoutubePlayer, Segment number:     {videoSegments[props.currentSegmentIndex].segment_number}</div>
      <div className='bg-bgColor2 text-textColor2'>In YoutubePlayer, Segment start_time: {videoSegments[props.currentSegmentIndex].start_time}</div>
      <div className='bg-bgColor2 text-textColor2'>In YoutubePlayer, Segment end time:   {videoSegments[props.currentSegmentIndex].end_time}</div>
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
    </>
    );
  })
);

export default YoutubeVideoPlayerSave;
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