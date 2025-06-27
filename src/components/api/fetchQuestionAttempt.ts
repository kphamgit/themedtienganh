import { QuestionAttemptProps } from "../quiz_attempts/types";
import { store } from "../../redux/store";
//import { RootState } from "../../../../redux/store";

  export const fetchQuestionAttempt = async (quiz_attempt_id: string): Promise<QuestionAttemptProps> => {
    console.log("fetchQuestionAttempt ENTRY quiz_attempt_id=", quiz_attempt_id);
      const rootpath = store.getState().rootpath.value
      
      const url = `${rootpath}/api/quiz_attempts/${quiz_attempt_id}/create_next_question_attempt`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch  question attempt");
      //console.log("fetchLiveQuestion response json", response.json())
      return response.json();
    };
  

  
  