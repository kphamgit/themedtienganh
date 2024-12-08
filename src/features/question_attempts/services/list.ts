import axios from "axios";

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

export async function createQuestionAttempt(quiz_attempt_id: number): Promise<QuestionAttempt> {
    // server will decide the next question to fetch
    const url = `${rootpath}/api/quiz_attempts/${quiz_attempt_id}/creat_next_question_attempt`
    const response = await axios.post(url)
    return response.data
  }

//function add(x: number, y: number): number {
export async function processQuestionAttempt(quiz_attempt_id: number | undefined, user_answer: string):  Promise<QuestionAttemptResponseProps> {
    const url = `${rootpath}/api/question_attempts/${quiz_attempt_id}/process_attempt`
    const response = await axios.post(url,{user_answer: user_answer})
    return response.data
  }