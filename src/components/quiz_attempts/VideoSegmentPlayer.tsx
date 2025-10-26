import  { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { VideoSegmentProps } from './types';
import { YouTubePlayerRef } from '../shared/YoutubeVideoPlayer';

interface QuestionStatusProps 
    {
        question_number: number,
        status: 'not_taken' | 'taken'
    }

export interface VideoSegmentPlayerRefProps {

    playSegment: () => void;
    getNextQuestionNumber: () => number;
    updateQuestionsTakenStatus: (question_number: number, status: 'not_taken' | 'taken') => void;
    getQuestionsTakenStatus: () => QuestionStatusProps[] | undefined; // this function is here only for debugging. Will have to remove
    enablePlayButton: () => void;
  }


interface VideoSegmentPlayerProps {
  youtubePlayerRef: React.RefObject<YouTubePlayerRef>; // Accept the YoutubeVideoPlayer ref
  segment: VideoSegmentProps;
  //parent_playSegment: (segment_number: number) => void;
  isActive: boolean; // Optional prop to indicate if this segment is active
  //showQuestion: boolean;
  parent_setShowQuestion: (show: boolean) => void;
}

export const VideoSegmentPlayer = forwardRef<VideoSegmentPlayerRefProps, VideoSegmentPlayerProps>(
    ({ segment, isActive , youtubePlayerRef, parent_setShowQuestion}, ref) => {

      const [playButtonDisabled, setPlayButtonDisabled] = useState<boolean>(false);
      const [questionsTakenStatus, setQuestionsTakenStatus] = useState<QuestionStatusProps[]>()
    
     
      useEffect(() => {
        //console.log("VideoSegmentPlayer: segment changed, segment=", segment)
        //console.log(" VideoSegmentPlayer: segment.questions for segment id: ", segment.id, " are: ", segment.questions)
        /*
[
    {
        "id": 6300,
        "question_number": 4
    },
    {
        "id": 6299,
        "question_number": 3
    }
]
        */

        const initialStatus = segment.questions.map(q => ({
          question_number: q.question_number,
          status: 'not_taken' as 'not_taken' | 'taken'
        }));

        //console.log("VideoSegmentPlayer: initialStatus =", initialStatus)
        setQuestionsTakenStatus(initialStatus)
      }, [segment])

      // Expose methods to the parent via the ref
      useImperativeHandle(ref, () => ({
        getNextQuestionNumber: () => {
           //console.log("VideoSegmentPlayer: in getNextQuestionNumber, questionsTakenStatus = ", questionsTakenStatus)
          // search for the first question with status 'not_taken'
          const nextQuestion = questionsTakenStatus?.find(q => q.status === 'not_taken');
          //console.log("XXXXX FOUND nextQuestion", nextQuestion)
          return nextQuestion ? nextQuestion.question_number : -1; // return -1 if all questions are taken
        },

        updateQuestionsTakenStatus: (question_number: number, status: 'not_taken' | 'taken') => {
          // console.log(" VideoSegmentPlayer: updateQuestionsTakenStatus called question number =", question_number, " status=", status)
          setQuestionsTakenStatus(prevStatus => {
            if (!prevStatus) return prevStatus;
            return prevStatus.map(q => 
              q.question_number === question_number ? { ...q, status } : q
            );
          });
        },
        getQuestionsTakenStatus: () => {
          return questionsTakenStatus;
        },
        playSegment: () => {
          // this function is called automatically (from the parent component) when the last question of a segment is answered
          // this is different from the even handler handlePlaySegment below. It is not redundant. 
          if (youtubePlayerRef.current) {
              youtubePlayerRef.current.playSegment(segment.start_time, segment.end_time); // Call playSegment on YoutubeVideoPlayer
              setPlayButtonDisabled(true);}
        },
        enablePlayButton: () => {  // to enable the Play button when video segment finishes playing
                                   // called from parent component when video ends
          setPlayButtonDisabled(false);
        }
      
    

      }));
     
      // this function is called when the Play button is clicked
      const handlePlaySegment = () => {
        parent_setShowQuestion(false);
        if (youtubePlayerRef.current) {
            youtubePlayerRef.current.playSegment(segment.start_time, segment.end_time); // Call playSegment on YoutubeVideoPlayer
            setPlayButtonDisabled(true);
          }
    };
// className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 my-2 rounded'
    return (
      <div>
        {isActive &&
       <button
       className={`${
         playButtonDisabled
           ? 'bg-blue-50 text-gray-400 cursor-not-allowed'
           : 'bg-blue-500 hover:bg-blue-700 text-white'
       } font-bold py-1 px-3 my-2 rounded`}
       disabled={playButtonDisabled}
       onClick={handlePlaySegment}
     >
       Play 
     </button>
        }
      </div>
    );
})

/*
  return (
       <div>IN VIDEO SEGMENT PLAYER
        <div>Segment number: {segment.segment_number} </div>
        <div>All questions Taken {allQuestionsTaken}</div>
        <div>Is Active: {isActive}</div>
        <div>Show Question: {showQuestion}</div>
        <div> QuestionsTakenStatus:
          {questionsTakenStatus?.map(q => (
            <div key={q.question_number}>
              Question {q.question_number}: {q.status}
            </div>
          ))}
        </div>
       </div>
    );
*/
