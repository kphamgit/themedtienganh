import axios from "axios";
import { QuestionAttemptAttributes, QuestionAttemptProps, QuestionAttemptResponseProps } from "../../types";

let rootpath = ''
if (process.env.NODE_ENV === "production") {
    rootpath = 'https://kphamenglish-f26e8b4d6e4b.herokuapp.com'
    //rootpath = 'https://www.tienganhtuyhoa.com'
}
else if (process.env.NODE_ENV === "development"){
    rootpath = 'http://localhost:5001'
    
}
else {
    console.log("invalid NODE_ENV ")
}


  export async function createQuestionAttempt(quiz_attempt_id: string): Promise<QuestionAttemptProps> {
    // server will decide the next question to fetch
    const url = `${rootpath}/api/quiz_attempts/${quiz_attempt_id}/create_next_question_attempt`
    const response = await axios.post(url)
    return response.data
  }

//function add(x: number, y: number): number {
    export async function processQuestionAttempt( id: string | undefined, user_answer: string):  Promise<QuestionAttemptAttributes> {
        const url = `${rootpath}/api/quiz_attempts/${id}/process_question_attempt`
        const response = await axios.post(url,{user_answer: user_answer})
        //console.log("processQuestionAttempt response data =", response.data)
        return response.data
      }

      export async function processLiveQuestionAttempt(question_id: number | undefined, user_answer:string): Promise<QuestionAttemptAttributes> {
        const url = `${rootpath}/api/question_attempts/process_live_attempt/${question_id}/`
        const response = await axios.post(url,{user_answer: user_answer})
        console.log("processLiveQuestionAttempt response data =", response.data)
        return response.data
      }