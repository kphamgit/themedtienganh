import { useQuery } from '@tanstack/react-query';
import { fetchQuizAttempt } from '../components/api/fetchQuizAttempt';

export const useQuizAttempt = (quiz_id: string, user_id: string, enabled: boolean) => {
  //console.log('useQuizAttempt quiz id=', quiz_id, "user id=", user_id, ' &&&&& enabled=', enabled);
  //const test_boolean = quiz_id !== '' && user_id !== ''
  //console.log("***** useQuizAttempt test_boolean=", test_boolean)
  return useQuery({
    queryKey: ['quiz_attempt', quiz_id, user_id],
    queryFn: () => fetchQuizAttempt(quiz_id, user_id),
    //enabled: !!quiz_id, // prevents the query from running if quiz_id is falsy
    //enabled: quiz_id !== '' && user_id !== '', // prevents the query from running if quiz_id or user_id is empty
    enabled: enabled,
    //staleTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000, //data is always fresh
  });
};

// fetchQuizAttempt = async (quiz_id: string | undefined, user_id: string | undefined):