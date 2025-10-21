
export type QuizAttemptProps = {
  
    id: string,
    completion_status: string,
    question: QuestionProps,
    question_attempt_id: number
  
}

export type VideoSegmentProps = {
  id: number,
  segment_number: number,
  question_numbers: string,
  duration: number,
  start_time: string,
  end_time: string,
  quizId: number
  questions: any[]
}

export type QuestionAttemptResponseProps =
{
    message :  string ,
    question_attempt_results : {
        answer :  string ,
        score : number,
        error_flag : boolean,
        completed : boolean,
        correct_answer : string
     },
    question_id : number,
    question_format : number,
    words_scramble_direction : string ,
    question_number : number,
    question_help1: string,
    question_help2: string, 
    accumulated_score : number,
    questions_exhausted : boolean
}

export type RadioProps =
  {
    id: number
    choice_1_text: string
    choice_2_text: string
    choice_3_text: string
    choice_4_text: string
    selected: string
    questionId: number
  }
  
  export interface PartialQuizProps {
    id: string;
    name: string;
    quiz_number: number;
    disabled: boolean;
    video_url: string | undefined;
    unitId: number;
    video_segments? : VideoSegmentProps[]
    
  }

  export interface QuizProps {
    id: string;
    name: string;
    quiz_number: string;
    disabled: boolean;
    video_url: string | undefined;
    unitId: string;
    questions: QuestionProps[]
  }

 export type QuestionProps = {
    id: number
    question_number: number,
    format: number,
    audio_src: string,
    audio_str : string,
    video_src : string,
    instruction : string,
    prompt : string,
    content : string,
    words_scramble_direction : string,
    answer_key : string,
    score : number,
    show_help : boolean,
    help1 : string,
    help2 : string,
    coding : boolean,
    quizId : number,
    radio : RadioProps,
    speech_recognition : boolean
    button_cloze_options: string,
    timeout: number
}

 export interface ChildRef {
  getAnswer: () => string | undefined;
}

//  isErrorneous : false,
export type QuestionAttemptProps = {
  end_of_quiz: boolean,
  question : QuestionProps,

  question_attempt_id: number
}

/*
answer          | varchar(255) | YES  |     | NULL    |                |
| score           | int          | YES  |     | NULL    |                |
| question_number | int          | YES  |     | NULL    |                |
| questionId      | int          | YES  |     | NULL    |                |
| error_flag      | tinyint(1)   | YES  |     | NULL    |                |
| audio_src       | varchar(255) | YES  |     | NULL    |                |
| completed       | tinyint(1)   | YES  |     | 0       |                |
| quizAttemptId
*/

export interface QuestionAttemptAttributes {
  user_answer: string;
  score: number;
  error_flag: boolean;
  
}

 export interface InputLetterRef {
  getFillContent: () => string | undefined;
}

export interface DynamicObject {
  [key: string]: any;
}