import { useQuery } from '@tanstack/react-query';
import { fetchQuestionAttempt } from '../components/api/fetchQuestionAttempt';
import { fetchVideoQuestionAttempt } from '../components/api/fetchVideoQuestionAttempt';

export const useVideoQuestionAttempt = (quiz_attempt_id: string, quiz_id: string, question_number: number, enabled: boolean) => {
  //send only quiz_attempt_id to server. Server will decide which question to fetch
  console.log('***** useVideoQuestionAttempt quiz_attempt_id=', quiz_attempt_id, 'enabled=', enabled);
  return useQuery({
    queryKey: ['video_question_attempt', quiz_attempt_id],
    queryFn: () => fetchVideoQuestionAttempt(quiz_attempt_id, quiz_id, question_number),
    enabled: enabled, // prevents the query from running if enabled is falsy
    staleTime: 2000, // 5 minutes  5 * 60 * 1000,
  });
};

// fetchQuizAttempt = async (quiz_id: string | undefined, user_id: string | undefined):
// const url = `${rootpath}/api/quiz_attempts/${quiz_attempt_id}/create_next_question_attempt`;

/*
   quizAttempt?.quiz_attempt.id.toString()!,
        quiz?.id?.toString() ?? "",
        currren_question_number.current,
        nextQuestionEnabled)

*/