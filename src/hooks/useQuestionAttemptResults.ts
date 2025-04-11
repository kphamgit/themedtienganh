import { useQuery } from '@tanstack/react-query';
//import { fetchQuestionAttempt } from '../components/api/fetchQuestionAttempt';
import { updateQuestionAttempt } from '../components/api/fetchQuestionAttemptResults';

export const useQuestionAttemptResults = (id: string, user_answer: string,  enabled: boolean) => {
  //kpham: note, id is the id of the quiz_attempt (see server side for details)
  //send only quiz_attempt_id to server. Server will decide which question to fetch
  return useQuery({
    queryKey: ['question_attempt_results', id, user_answer],
    queryFn: () => updateQuestionAttempt(id, user_answer),
    enabled: enabled, // prevents the query from running if enabled is falsy
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// fetchQuizAttempt = async (quiz_id: string | undefined, user_id: string | undefined):