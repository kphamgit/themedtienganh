//import { QuestionAttemptAttributes, QuestionAttemptProps } from "../quiz_attempts/types";
import { store } from "../../redux/store";
//import { RootState } from "../../../../redux/store";

/*
type FetchQuestionProps = {
    end_of_quiz: boolean,
    question: QuestionProps,

}
*/

/*
export const fetchQuestionAttempt = async (quiz_id: string | undefined, question_number: string | undefined):
    Promise<FetchQuestionProps> => {
    //const response = await fetch(`/api/users/${userId}`);
    const response = await fetch(`http://localhost:5001/api/quizzes/${quiz_id}/get_question/${question_number}`);
    if (!response.ok) throw new Error("Failed to fetch live question");
    return response.json();
  };
*/
 
 //export const fetchQuestionAttempt = async (quiz_id: string | undefined, question_number: string | undefined):
 interface QuestionAttemptResultsAttributes {
  user_answer: string;
  score: number;
  question_number: number | undefined;
  questionId: string | undefined;
  error_flag: boolean;
  audio_src: string;
  completed: boolean;
  //quizAttemptId: string;
}

export const updateQuestionAttempt = async (
    id: string,   //question attempt id
    user_answer: string,
    score: string,
    error_flag: boolean
): Promise<void> => {
    // server will decide the next question to fetch
    console.log("XXXXXX IN updateQuestionAttempt question attempt id = ", id, "user answer", user_answer)
    const rootpath = store.getState().rootpath.value
    
    const url = `${rootpath}/api/question_attempts/${id}/update`;
    //console.log("updateQuestionAttempt url", url)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score, error_flag, user_answer }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("data", data)
    return data;
  }

