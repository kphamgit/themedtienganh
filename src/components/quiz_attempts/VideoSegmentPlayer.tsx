import  { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { VideoSegmentProps } from '../quiz_attempts/types';

interface QuestionStatusProps 
    {
        question_number: number,
        status: 'not_taken' | 'taken'
    }

export interface VideoSegmentPlayerRefProps {
    getNextQuestionNumber: () => number;
    updateQuestionsTakenStatus: (question_number: number, status: 'not_taken' | 'taken') => void;
    getQuestionsTakenStatus: () => QuestionStatusProps[] | undefined; // this function is here only for debugging. Will have to remove
}

interface VideoSegmentPlayerProps {
  segment: VideoSegmentProps;
  //parent_playSegment: (segment_number: number) => void;
  isActive: boolean; // Optional prop to indicate if this segment is active
  showQuestion: boolean;
}

export const VideoSegmentPlayer = forwardRef<VideoSegmentPlayerRefProps, VideoSegmentPlayerProps>(
    ({ segment, isActive, showQuestion }, ref) => {

      const [questionsTakenStatus, setQuestionsTakenStatus] = useState<QuestionStatusProps[]>()
      const [allQuestionsTaken, setAllQuestionsTaken] = useState(false)
     
     
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
/*
        const initialStatus = segment.question_numbers.split(',').map(num => ({
          question_number: parseInt(num.trim(), 10),
          status: 'not_taken' as 'not_taken' | 'taken'
        }));
        */
        //console.log("VideoSegmentPlayer: initialStatus =", initialStatus)
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
           // console.log("VideoSegmentPlayer: in getNextQuestionNumber, questionsTakenStatus = ", questionsTakenStatus)
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
        }

      }));
      // don't show replay button for now
      return (
        null
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
