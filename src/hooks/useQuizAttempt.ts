import { useQuery } from '@tanstack/react-query';
import { fetchQuizAttempt } from '../components/api/fetchQuizAttempt';

export const useQuizAttempt = (quiz_id: string, user_id: string) => {
  console.log('useQuizAttempt quiz id=', quiz_id);
  return useQuery({
    queryKey: ['quiz_attempt', quiz_id, user_id],
    queryFn: () => fetchQuizAttempt(quiz_id, user_id),
    enabled: !!quiz_id, // prevents the query from running if quiz_id is falsy
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// fetchQuizAttempt = async (quiz_id: string | undefined, user_id: string | undefined):