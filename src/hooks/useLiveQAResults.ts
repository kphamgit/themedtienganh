import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchLiveQuestionAttemptResults } from '../components/api/fetchLiveQAResults';

export const useLiveQuestionAttemptResults = (quiz_id: string, question_numnber: string, user_answer: string,  enabled: boolean) => {
  //kpham: note, id is the id of the quiz_attempt (see server side for details)
  //send only quiz_attempt_id to server. Server will decide which question to fetch
  /*
  return useQuery({
    queryKey: ['live_question_attempt_results', quiz_id, question_numnber, user_answer],
    queryFn: () => fetchLiveQuestionAttemptResults(quiz_id, question_numnber, user_answer),
    enabled: enabled, // prevents the query from running if enabled is falsy
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  */
  useMutation({
    mutationKey: ['live_question_attempt_results', quiz_id, question_numnber, user_answer],
    mutationFn: () => fetchLiveQuestionAttemptResults(quiz_id, question_numnber, user_answer),
    onSuccess: (data) => {
      console.log('useLiveQuestionAttemptResults data=', data);
      return data;
    },
    onError: (error) => {
      console.error('useLiveQuestionAttemptResults error=', error);
      return error;
    }
  });

};

// fetchQuizAttempt = async (quiz_id: string | undefined, user_id: string | undefined):