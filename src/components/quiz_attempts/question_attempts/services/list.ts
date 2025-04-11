import { QuestionAttemptAttributes, QuestionAttemptProps } from "../../types";

import { store } from "../../../../redux/store";
//import { RootState } from "../../../../redux/store";
const rootpath = store.getState().rootpath.value
//kpham: this demonstrates how to get the rootpath from redux store from a non-react component file

  export async function createQuestionAttempt(quiz_attempt_id: string): Promise<QuestionAttemptProps> {
    // server will decide the next question to fetch
    const url = `${rootpath}/api/quiz_attempts/${quiz_attempt_id}/create_next_question_attempt`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }


    export async function processQuestionAttempt(
      id: string | undefined,
      user_answer: string
    ): Promise<QuestionAttemptAttributes> {
      const url = `${rootpath}/api/quiz_attempts/${id}/process_question_attempt`;
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

      /*
      export async function processLiveQuestionAttempt1(
        question_id: number | undefined,
        user_answer: string
      ): Promise<QuestionAttemptAttributes> {
        const url = `${rootpath}/api/question_attempts/process_live_attempt/${question_id}/`;
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
      */
      