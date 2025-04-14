//mport { QuestionProps } from "../quiz_attempts/types";
//import { QuestionAttemptProps } from "../quiz_attempts/types";
import { store } from "../../redux/store";
import { QuestionProps } from "../quiz_attempts/types";
//import { RootState } from "../../../../redux/store";

export interface NewQuestionAttemptProps {
  id: number,
  answer: string | null,
  score: number,
  question_number: number,
  questionId: number,
  error_flag: boolean,
  audio_src: string,
  completed: boolean,
  quizAttemptId: number
}

export type FetchQuizAttemptProps = {
  quiz_attempt: {
    id: number,
    completion_status: string,
    score: number,
    userId: number,
    questions_exhausted: boolean,
    errorneous_questions: string,
    quizId: number,
  },
  question: QuestionProps,
  question_attempt_id: string
  }

/*
export type FetchQuizAttemptProps = {
  quiz_attempt: {
    id: number,
    completion_status: string,
    score: number,
    userId: number,
    questions_exhausted: boolean,
    errorneous_questions: string,
    quizId: number,
  },
  question_attempt: {
    id: number,
    answer: string | null,
    score: number,
    question_number: number,
    questionId: number,
    error_flag: boolean,
    audio_src: string,
    completed: boolean,
    quizAttemptId: number
  }
}
*/

/*
 "id": 2513,
    "completion_status": "uncompleted",
    "score": 0,
    "userId": 15,
    "questions_exhausted": false,
    "errorneous_questions": "",
    "quizId": 77,
    "createdAt": "2025-03-31T22:35:48.000Z",
    "updatedAt": "2025-03-31T22:35:48.000Z",
   
*/


  export const fetchQuizAttempt = async (quiz_id: string | undefined, user_id: string | undefined):
      Promise<FetchQuizAttemptProps> => {
      const rootpath = store.getState().rootpath.value
      const url = `${rootpath}/api/quiz_attempts/find_create/${quiz_id}/${user_id}`;
      //console.log("in fetchQuizAttempt url", url)
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch quiz attempt");
      return response.json();
    };

  
  //    
  //  const url = `quiz_attempts/find_create/${params.quizId}/${user.id}`
  /*
{
    "id": 2513,
    "completion_status": "uncompleted",
    "score": 0,
    "userId": 15,
    "questions_exhausted": false,
    "errorneous_questions": "",
    "quizId": 77,
    "createdAt": "2025-03-31T22:35:48.000Z",
    "updatedAt": "2025-03-31T22:35:48.000Z",
    "question_attempts": [
        {
            "id": 32421,
            "answer": null,
            "score": 0,
            "question_number": 1,
            "questionId": 1339,
            "error_flag": false,
            "audio_src": "",
            "completed": false,
            "quizAttemptId": 2513
        }
    ]
}
  */