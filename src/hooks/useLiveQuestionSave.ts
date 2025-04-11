import { useQuery } from '@tanstack/react-query';
import { fetchLiveQuestion } from '../components/api/fetchLiveQuestion';
//import { QuestionProps } from '../quiz_attempts/types';

export const useLiveQuestionSave = (quiz_id: string | undefined, question_number: string | undefined) => {
  return useQuery({
    queryKey: ['question', quiz_id, question_number],
    queryFn: () => fetchLiveQuestion(quiz_id, question_number),
    enabled: !!quiz_id, // prevents the query from running if quiz_id is falsy
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

