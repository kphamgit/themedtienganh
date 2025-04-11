//import { QuestionAttemptAttributes, QuestionAttemptProps } from "../quiz_attempts/types";
import { store } from "../../redux/store";
//import { RootState } from "../../../../redux/store";

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

export const fetchLiveQuestionAttemptResults = async (
    quiz_id: string,
    question_number: string,
    user_answer: string
): Promise<QuestionAttemptResultsAttributes> => {
    // server will decide the next question to fetch
    //console.log("XXXXXX IN fetchLiveQuestionAttemptResults quiz_attempt_id", id, "user answer", user_answer)
    const rootpath = store.getState().rootpath.value
    
    //const url = `${rootpath}/api/quiz_attempts/${id}/process_question_attempt`;
    const url = `${rootpath}/api/question_attempts/process_live_attempt/${quiz_id}/${question_number}/`;
    console.log("fetchLiveQuestionAttemptResults url", url)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_answer }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

/*
/*
  export async function processLiveQuestionAttempt(
        quiz_id: string | undefined,
        question_number: string | undefined,
        user_answer: string
      ): Promise<QuestionAttemptAttributes> {
       // const url = `${rootpath}/api/question_attempts/process_live_attempt/${question_id}/`;
       
       const url = `${rootpath}/api/question_attempts/process_live_attempt/${quiz_id}/${question_number}/`;
       console.log(" processLiveQuestionAttempt url = ", url)
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_answer }),
        });
      
        if (!response.ok) {
          console.log("processLiveQuestionAttempt response not ok")
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const data = await response.json();
        console.log("processLiveQuestionAttempt data", data)
        return data;
      }

*/