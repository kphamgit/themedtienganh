import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { VideoSegmentProps } from '../quiz_attempts/types';

interface QuestionStatusProps 
    {
        question_number: number,
        status: 'not_taken' | 'taken'
    }

export interface VideoSegmentPlayerRefProps {
    getNextQuestionNumber: () => number;
    updateQuestionsTakenStatus: (question_number: number, status: 'not_taken' | 'taken') => void;
}

interface VideoSegmentPlayerProps {
  segment: VideoSegmentProps;
  parent_playSegment: (segment_number: number) => void;
  isActive: boolean; // Optional prop to indicate if this segment is active
}

export const VideoSegmentPlayer = forwardRef<VideoSegmentPlayerRefProps, VideoSegmentPlayerProps>(
    ({ segment, isActive, parent_playSegment }, ref) => {

      const [questionsTakenStatus, setQuestionsTakenStatus] = useState<QuestionStatusProps[]>()
      const [allQuestionsTaken, setAllQuestionsTaken] = useState(false)
     
     
      useEffect(() => {
        const initialStatus = segment.question_numbers.split(',').map(num => ({
          question_number: parseInt(num.trim(), 10),
          status: 'not_taken' as 'not_taken' | 'taken'
        }));
        console.log("@@@@@@ initialStatus", initialStatus)
        setQuestionsTakenStatus(initialStatus)
      }, [segment])

      useEffect(() => {
        if (questionsTakenStatus && questionsTakenStatus.every(q => q.status === 'taken')) {
          setAllQuestionsTaken(true);
        } else {
          setAllQuestionsTaken(false);  
        }
      }, [questionsTakenStatus])

      // Expose methods to the parent via the ref
      useImperativeHandle(ref, () => ({
        getNextQuestionNumber: () => {
            console.log("@@@@@@ getNextQuestionNumber called", questionsTakenStatus)
          // search for the first question with status 'not_taken'
          const nextQuestion = questionsTakenStatus?.find(q => q.status === 'not_taken');
          console.log("XXXXX FOUND nextQuestion", nextQuestion)
          return nextQuestion ? nextQuestion.question_number : -1; // return -1 if all questions are taken
        },

        updateQuestionsTakenStatus: (question_number: number, status: 'not_taken' | 'taken') => {
            console.log(" ****** updateQuestionsTakenStatus called question number =", question_number, " status=", status)
          setQuestionsTakenStatus(prevStatus => {
            if (!prevStatus) return prevStatus;
            return prevStatus.map(q => 
              q.question_number === question_number ? { ...q, status } : q
            );
          });
        }
      }));

      if (allQuestionsTaken || !isActive) {
        return (
               null
        )
      }

    return (
        <div>
            Video Segment 
            {allQuestionsTaken && <span className="text-green-500 font-bold"> (All Questions Taken)</span>}
            <br />
            Active: {isActive ? 'Yes' : 'No'}
            {segment.segment_number} - {segment.start_time} - {segment.end_time}
            {JSON.stringify(questionsTakenStatus)}
            <div>
                <button onClick={() => {
                    if (parent_playSegment) {
                        parent_playSegment(segment.segment_number); // zero-based number
                    }
                }
                }>
                    Replay
                </button>
            </div>
        </div>
    )
})
