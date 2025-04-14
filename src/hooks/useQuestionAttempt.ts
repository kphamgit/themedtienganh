import { useQuery } from '@tanstack/react-query';
import { fetchQuestionAttempt } from '../components/api/fetchQuestionAttempt';

export const useQuestionAttempt = (quiz_attempt_id: string, enabled: boolean) => {
  //send only quiz_attempt_id to server. Server will decide which question to fetch
  //console.log('useQuestionAttempt quiz_attempt_id=', quiz_attempt_id, 'enabled=', enabled);
  return useQuery({
    queryKey: ['question_attempt', quiz_attempt_id],
    queryFn: () => fetchQuestionAttempt(quiz_attempt_id),
    enabled: enabled, // prevents the query from running if enabled is falsy
    staleTime: 0, // 5 minutes
  });
};

// fetchQuizAttempt = async (quiz_id: string | undefined, user_id: string | undefined):