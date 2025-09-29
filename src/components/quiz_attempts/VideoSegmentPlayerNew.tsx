import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { VideoSegmentProps } from '../quiz_attempts/types';

interface QuestionStatusProps 
    {
        question_number: number,
        status: 'not_taken' | 'taken'
    }

interface VideoSegmentPlayerRefProps {
    getNextQuestionNumber: () => number;
}

interface VideoSegmentPlayerProps {
  segment: VideoSegmentProps;
  parentCallback: (segment_index: number) => void;
}

export const VideoSegmentPlayerNew = forwardRef<VideoSegmentPlayerRefProps, VideoSegmentPlayerProps>(
    ({ segment, parentCallback }, ref) => {
      // Internal state or logic
      const questionIds = useRef<number[]>([1, 2, 3]); // Example question IDs
      const [questionsTakenStatus, setQuestionsTakenStatus] = useState<QuestionStatusProps[]>(
        segment.question_numbers.split(',').map(num => ({
          question_number: parseInt(num.trim(), 10),
          status: 'not_taken' as 'not_taken' | 'taken'
        }))
      )
  
      useEffect(() => {
        console.log("@@@@@@ eeee", questionsTakenStatus)
      }, [questionsTakenStatus])

      // Expose methods to the parent via the ref
      useImperativeHandle(ref, () => ({
        getNextQuestionNumber: () => {
          return 1;
        },
      }));
  

    return (
        <div>
            Video Segment Placeholder
            {segment.segment_number} - {segment.start_time} - {segment.end_time}
            <div>
                <button onClick={() => parentCallback && parentCallback(segment.segment_number)}>Notify Parent</button>
            </div>
        </div>
    )
})
