import { QuestionAttemptProps } from "../quiz_attempts/types";
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
/*
export const fetchQuestionAttemptOld = async (quiz_attempt_id: string): Promise<QuestionAttemptProps> => {
    // server will decide the next question to fetch
    console.log("fetchQuestionAttempt quiz_attempt_id", quiz_attempt_id)
    const rootpath = store.getState().rootpath.value
    const url = `${rootpath}/api/quiz_attempts/${quiz_attempt_id}/create_next_question_attempt`;
    console.log("fetchQuestionAttempt url", url)
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("data", data)
    return data;
  }
*/

  export const fetchQuestionAttempt = async (quiz_attempt_id: string): Promise<QuestionAttemptProps> => {
      const rootpath = store.getState().rootpath.value
      const url = `${rootpath}/api/quiz_attempts/${quiz_attempt_id}/create_next_question_attempt`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch  question attempt");
      //console.log("fetchLiveQuestion response json", response.json())
      return response.json();
    };
  

  
  