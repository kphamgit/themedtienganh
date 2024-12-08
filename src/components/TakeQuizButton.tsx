import React, { useEffect, useState } from 'react'

/*
  interface PageParamsProps {
   
        page_num: number
        numQuestions: number;
        startTime?: number;
        endTime?: number;
  
  }
*/

  interface TakeQuizButtonProps {
    quiz_id: number
    quiz_name: string
    video_url: string
    parentFunct: (quiz_id: number | undefined, url: string | undefined) => void
  }
//quiz_id: number, url: string | undefined, video_page_params: PageParamsProps[]) => {
export function TakeQuizButton(props: TakeQuizButtonProps ) {
    const [quizId, setQuizId] = useState<number>()
    //const [pagesParams, setPagesParams] = useState<PageParamsProps []>()
    const [videoUrl, setVideoUrl] = useState<string>()

    useEffect(() => {
        //console.log("BBBBBBBBB props: ", props)
        setVideoUrl(props.video_url)
        setQuizId(props.quiz_id)
        //if (props.video_params) {
           // console.log("OOOOO", props.video_params)
        //}
        //setVideoParams(props.video_params)
    },[props])

    const handleClick = () => {
        props.parentFunct(quizId, videoUrl)
    }

    return (
        <>
          <div><button className='bg-takeQuizButtonBg text-takeQuizButtonText px-2 rounded-md' onClick={handleClick}>{props.quiz_name}</button></div>
        </>
    )
}
/*
  <div>Pages Length: {pagesParams.length}</div>
  { videoParams &&
            <div><button onClick={handleClick}>Take Quiz Button {videoParams.url}</button></div>
            }
*/
//{video_params: VideoProps, parentFunct: (url: string, video_pages: VideoPageProps[]) => void} ) {
  /*
     {videoUrl &&
          <div>
            <div>{videoUrl}</div>
           
            </div>
          }
  */