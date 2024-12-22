import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useLocation } from 'react-router-dom';

import './MyReactPlayer.css';

export default function YoutubeVideoPlayer(props: any) {
    const [videoUrl, setVideoUrl] = useState('')
    const [videoDuration, setVideoDuration] = useState<number>() // in miliseconds
    const [playing, setPlaying] = useState(false);

    const location = useLocation()

    const playerRef = useRef<ReactPlayer>(null);

    useEffect(() => {
        if (location.state) {
          setVideoUrl(location.state.video_url);
          setVideoDuration(location.state.video_duration)
        }
    }, [location.state]);

  //const arg = {video_url: videoUrl, video_duration: videoDuration}
    const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
        //if (currentVideoPage?.endTime && state.playedSeconds >= currentVideoPage?.endTime) {
           // console.log(" in handleProgress HERE. Stop playing because playedSeconds > video page endtime")
           //console.log(Math.floor(state.playedSeconds*1000))
           const whole_milis = Math.floor(state.playedSeconds*1000)
        if (videoDuration) {
          if (whole_milis >= videoDuration) {
            setPlaying(false);
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
    <div className='grid grid-rows-2'>
      <div className='w-3/4 h-full'>
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
      <div className='flex flex-row justify-start gap-2 mt-3 mb-1'>
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
  )
}
