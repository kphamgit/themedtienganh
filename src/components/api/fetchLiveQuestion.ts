import { QuestionProps } from "../quiz_attempts/types";
import { store} from "../../redux/store";

type FetchQuestionProps = {
    end_of_quiz: boolean,
    question: QuestionProps,

}

export const fetchLiveQuestion = async (quiz_id: string | undefined, question_number: string | undefined):
    
    Promise<FetchQuestionProps> => {
    const rootpath = store.getState().rootpath.value
    const response = await fetch(`${rootpath}/api/quizzes/${quiz_id}/get_question/${question_number}`);
    if (!response.ok) throw new Error("Failed to fetch live question");
    //console.log("fetchLiveQuestion response json", response.json())
    return response.json();
  };
