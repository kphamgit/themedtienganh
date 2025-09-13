import { QuestionAttemptProps } from "../quiz_attempts/types";
import { store } from "../../redux/store";

type QuizProps = {
  id: number,
  name: string,
  quiz_number: number,
  unitId: number,
  disabled: boolean,
  video_url: string
}

/*
name        | varchar(255) | YES  |     | NULL    |                |
| quiz_number | int          | YES  |     | NULL    |                |
| unitId      | int          | YES  |     | NULL    |                |
| disabled    | tinyint(1)   | YES  |     | NULL    |                |
| video_url   | varchar(255) | YES  |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
*/

  export const fetchQuiz = async (quiz_id: string): Promise<QuizProps> => {
   //console.log("fetchQuestionAttempt ENTRY quiz_attempt_id=", quiz_attempt_id);
      const rootpath = store.getState().rootpath.value
      
      const url = `${rootpath}/api/quizzes/${quiz_id}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch  question attempt");
      //console.log("fetchLiveQuestion response json", response.json())
      return response.json();
    };
  

  
  