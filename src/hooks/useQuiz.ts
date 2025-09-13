import { useQuery } from '@tanstack/react-query';
import { fetchQuiz } from '../components/api/fetchQuiz';

export const useQuiz = (quiz_id: string, enabled: boolean) => {
  //send only quiz_attempt_id to server. Server will decide which question to fetch
  //console.log('useQuiz quiz_id=', quiz_id, 'enabled=', enabled);
  return useQuery({
    queryKey: ['quiz', quiz_id],
    queryFn: () => fetchQuiz(quiz_id),
    enabled: enabled, // prevents the query from running if enabled is falsy
    staleTime: 1000, // 5 minutes
  });
};

// fetchQuizAttempt = async (quiz_id: string | undefined, user_id: string | undefined):