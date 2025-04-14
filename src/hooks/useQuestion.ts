import { useQuery } from '@tanstack/react-query';
import { fetchQuestion } from '../components/api/fetchQuestion';
//import { QuestionProps } from '../quiz_attempts/types';

export const useQuestion = (quiz_id: string | undefined, question_number: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ['question', quiz_id, question_number],
    queryFn: () => fetchQuestion(quiz_id, question_number),
    enabled: enabled, // prevents the query from running if quiz_id is falsy
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

