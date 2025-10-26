import React, {useContext, useEffect, useMemo, useRef, useState } from "react";
import {  useParams } from "react-router-dom";

import { useAppSelector } from "../../redux/store";
//import { ChildRef, DynamicWordInputs } from './question_attempts/DynamicWordInputs';
//import { ChildRef, QuestionAttemptAttributes, QuestionProps, QuizAttemptProps } from "./types";//
import { AzureAudioPlayer } from "../shared/AzureAudioPlayer";

//import { QuestionAttemptResults } from "./QuestionAttemptResults";
////import { processQuestion, ProcessQuestionResultsProps } from "../live/processQuestion";
//import { updateQuestionAttempt } from "../api/updateQuestionAttempt";
//import { useMutation } from "@tanstack/react-query";
import { useQuiz } from "../../hooks/useQuiz";
import { QueryClient } from '@tanstack/react-query'
import YoutubeVideoPlayer, { YouTubePlayerRef } from "../shared/YoutubeVideoPlayer";
import { VideoSegmentPlayerRefProps } from '../quiz_attempts/VideoSegmentPlayer';
import { VideoSegmentPlayer } from '../quiz_attempts/VideoSegmentPlayer';
import SocketContext from "../../contexts/socket_context/Context";
import LiveVideoQuestion from "./LiveVideoQuestion";
import { QuestionAttemptAttributes, QuestionProps } from "../quiz_attempts/types";
import { ScoreBoard, ScoreBoardRefProps } from "./ScoreBoard";
import { QuestionAttemptResults } from "../quiz_attempts/QuestionAttemptResults";
import LiveQuestion from "./LiveQuestion";
export default function LiveVideoQuiz() {
    
    const params = useParams<{ subCagegoryId: string, quizId: string,  }>();
    //console.log("params in TakeQuiz=", params)

    const {socket} = useContext(SocketContext).SocketState;



    const youTubeVideoRef  = useRef<YouTubePlayerRef>(null);

   // const [quizAttempt, setQuizAttempt] = useState<QuizAttemptProps | null>(null);
   // const quizAttempt = useRef<QuizAttemptProps | null>(null);
    const user = useAppSelector(state => state.user.value)
    const rootpath = useAppSelector(state => state.rootpath.value)
   // console.log("user in TakeQuiz=", user)
   //
   // create an array of refs of type VideoSegmentPlayerRefProps, one for each video segment
    const videoSegmentRefs = useRef<React.RefObject<VideoSegmentPlayerRefProps>[]>([]);
    
        //const [fetchQuizEnabled, setFetchQuizEnabled] = useState(true)  // only fetch quiz once
        //const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false)
        //const [questionAttemptResponse, setQuestionAttemptResponse] = useState< QuestionAttemptAttributes>()
        const [questionAttemptResponse, setQuestionAttemptResponse] = useState<QuestionAttemptAttributes | null>(null)
     
        const [endOfQuiz, setEndOfQuiz] = useState(false)
     
        //const childRef = useRef<ChildRef>(null);
        
            const [question, setQuestion] = useState<QuestionProps | undefined>(undefined)

        const [showQuestion, setShowQuestion] = useState<boolean>(false)

        const queryClient = new QueryClient()

        const scoreBoardRef = useRef<ScoreBoardRefProps>(null);
        
        //const myQuiz = useRef<PartialQuizProps | undefined>(undefined);

        const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | undefined>(0) // index in the videoSegments array, starts from 0
             
        const {data: quiz} = useQuiz(
            params.quizId ? params.quizId : ""
            , true
        )
        
        // Dynamically initialize refs based on the number of video segments
        videoSegmentRefs.current = useMemo(() => {
            if (!quiz || !quiz.video_segments) {
                return [];
            }
            return quiz.video_segments.map(() => React.createRef<VideoSegmentPlayerRefProps>());
        }, [quiz]);

 useEffect(() => {
      if (socket) {
        socket.on('live_question', (arg: { quiz_id: string, question_number: string, target_student: string }) => {
          //console.log("live question received...arg =", arg) 
          //console.log("... for target student=", arg.target_student, " current student=", user.user_name)
          //console.log("current live question number is", questionNumber === '' ? 'EMPTY' : questionNumber);
      
          if (arg.target_student.trim() !== 'everybody' && arg.target_student.trim() !== user.user_name) {
            //console.log("... live question not for this student, ignoring");
            return;
          }
          // use fetch to get the question data from the server
          const response = fetch(`${rootpath}/api/quizzes/${arg.quiz_id}/get_question/${arg.question_number}`);
          response.then(res => {
            if (!res.ok) throw new Error("Failed to fetch live question");
            const data = res.json();
            data.then((data) => {
              //console.log("LiveQuiz fetched question data = ", data)
             // console.log(" seeting showQuestion to true")
                setQuestion(data.question)
                setQuestionAttemptResponse(null)
                setShowQuestion(true)
            })
            //console.log(" call onLiveQuestionReceived in ScoreBoard from LiveQuiz for question_number=", arg.question_number)
          })
        })
  
        socket.on('play_video_segment', (arg: { segment_index: number }) => {
            //console.log("TakeVideoQuiz: play_video_segment received...arg =", arg) 
            const segmentIndex = arg.segment_index; // Convert to zero-based index
            //playVideoSegment(segmentIndex);
            if (videoSegmentRefs.current[segmentIndex] && videoSegmentRefs.current[segmentIndex].current) {
                //console.log("TakeVideoQuiz: Playing video segment at index ", segmentIndex);
                videoSegmentRefs.current[segmentIndex].current?.playSegment();
                //setActiveSegmentIndex(segmentIndex);
            } else {
                console.warn("TakeVideoQuiz: No ref found for video segment at index ", segmentIndex);
            }
        })

        return () => {
          socket?.off("live_question")
          socket?.off("play_video_segment")
        }
      }
    }, [socket, user.user_name, user.classId])


   
      
    const handleYoutubePlayingEnds = () => {
        console.log("TakeVideoQuiz: YouTube video segment ended.");
    }
   
    const set_question_attempt_results = (arg: QuestionAttemptAttributes) => {
        //console.log("LiveQuz: set_question_attempt_results: arg= ", arg)
        //setLiveQuizId(arg.quiz_id)
        setShowQuestion(false)
        setQuestionAttemptResponse(arg)
      }

    return (
        <div className='flex justify-center bg-blue-200 text-textColor2 w-screen mx-2 '>
            <div className='bg-yellow-100 col-span-10'>
                <div>
                    <YoutubeVideoPlayer
                        ref={youTubeVideoRef}
                        video_url={quiz?.video_url || ""}
                        parent_playingEnds={handleYoutubePlayingEnds}
                    />
                </div>
                <div>
                    {quiz && quiz?.video_segments && quiz?.video_segments.length > 0 && videoSegmentRefs.current &&
                        quiz.video_segments.map((segment, index) =>
                        (
                            <VideoSegmentPlayer
                                youtubePlayerRef={youTubeVideoRef}
                                key={index}
                                ref={videoSegmentRefs.current[index]} // Assign the ref
                                segment={segment}
                                isActive={index === activeSegmentIndex}
                                parent_setShowQuestion={setShowQuestion}
                            />
                        )
                        )
                    }

                </div>
                {showQuestion &&
                    <LiveQuestion 
                        question={question} 
                        set_question_attempt_result={set_question_attempt_results} 
                    />
                }
                { questionAttemptResponse &&
                                      <div className='bg-bgColor1'>
                                      <QuestionAttemptResults 
                                        live_flag={true} 
                                        question= {question}
                                        response={questionAttemptResponse }  />
                                     </div>
                }
                
            </div>
             <div className=' col-span-2 bg-bgColor1 text-textColor2 text-lg'>
                <ScoreBoard classId={user.classId?.toString()} ref={scoreBoardRef} />
            </div>
        </div>
    )

}

/*
   <div className='w-1/4'>
                { questionAttemptResponse &&
                <div className='flex flex-col justify-center items-center'><QuestionAttemptResults
                    live_flag={false}
                    question={question}
                    response={questionAttemptResponse} />
                    </div>
                }
            </div>
        </div>
*/

/*
  :
                questionAttemptResponse &&
                <div className='flex flex-col justify-center items-center'><QuestionAttemptResults
                    live_flag={false}
                    question={question}
                    response={questionAttemptResponse} />
                    </div>
*/
