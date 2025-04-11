import { useQuery } from '@tanstack/react-query';
import { fetchLiveQuestion } from '../components/api/fetchLiveQuestion';
//import { QuestionProps } from '../quiz_attempts/types';

export const useLiveQuestion = (quiz_id: string | undefined, question_number: string | undefined, enabled: boolean) => {
  console.log("useLiveQuestion quiz_id = ", quiz_id)
  console.log("useLiveQuestion question_number = ", question_number)
  console.log("useLiveQuestion enabled = ", enabled)
  return useQuery({
    queryKey: ['live_question', quiz_id, question_number],
    queryFn: () => fetchLiveQuestion(quiz_id, question_number),
    enabled: enabled, // prevents the query from running if not enabled
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

