import axios from "axios";
import { QuestionAttemptAttributes, QuestionAttemptProps, QuestionAttemptResponseProps } from "../../types";

let rootpath = ''
if (process.env.NODE_ENV === "production") {
    rootpath = 'https://fullstack-kp-f6a689f4a15c.herokuapp.com'
    //rootpath = 'https://www.tienganhtuyhoa.com'
}
else if (process.env.NODE_ENV === "development"){
    rootpath = 'http://localhost:5001'
    
}
else {
    console.log("invalid NODE_ENV ")
}

/*
export async function createQuestionAttempt(quiz_attempt_id: number): Promise<QuestionAttemptProps> {
    // server will decide the next question to fetch
    const url = `${rootpath}/api/quiz_attempts/${quiz_attempt_id}/creat_next_question_attempt`
    const response = await axios.post(url)
    return response.data
  }
*/
  export async function createQuestionAttempt(quiz_attempt_id: number): Promise<QuestionAttemptProps> {
    // server will decide the next question to fetch
    const url = `${rootpath}/api/quiz_attempts/${quiz_attempt_id}/create_next_question_attempt`
    const response = await axios.post(url)
    return response.data
  }

//function add(x: number, y: number): number {
    export async function processQuestionAttempt( id: number | undefined, user_answer: string):  Promise<QuestionAttemptAttributes> {
        const url = `${rootpath}/api/quiz_attempts/${id}/process_question_attempt`
        const response = await axios.post(url,{user_answer: user_answer})
        return response.data
      }