

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
}

 export interface ChildRef {
  getAnswer: () => string | undefined;
}


 export interface InputLetterRef {
  getFillContent: () => string | undefined;
}