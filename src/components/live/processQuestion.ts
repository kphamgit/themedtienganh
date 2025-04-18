
//export const processLiveQuestion = (answer_key:string, user_answer: string) => {

export const processQuestion = (format: string | undefined, answer_key: string | undefined, user_answer: string | undefined) => {
  
    console.log("processQuestion format = ", format)
  const default_results = {
    user_answer: '', 
    score: 0, 
    error_flag: false, 
 
}
//process_button_select(question: any , user_answer:string): QuestionAttemptCreationAttributes{
    //console.log(" in process_button_select")
//const process_button_select = (answer_key:string, user_answer: string) => {
    const process_button_select = (answer_key: string, user_answer: string) => {
   
   let error = false;
   let score = 0
   if (answer_key != user_answer)  {
    //console.log("process_button_select error: ")
      error = true
   }
   else {
    //console.log("process_button_select NO error: ")
        score += 5;
   }      
    return { ...default_results,
        user_answer:  user_answer,
        score: score,
        error_flag: error,
      
        }
}

const process_cloze = (answer_key:string, user_answer: string ) => {
    
    let error = true;
    let score = 0
    //console.log("in process_cloze user answer :",user_answer);
    //console.log("in process_cloze answer key array = ", answer_keys_array);
    let user_answer_parts = user_answer.trim().split('/')
    //console.log("user_answer_parts = ", user_answer_parts)
    let answer_key_parts = answer_key.split('/')
    //console.log("answer_key_parts = ", answer_key_parts)

    user_answer_parts.forEach( (u_answer, index) => {
        //console.log("u answer = ", u_answer)
        //console.log("answer key = "+answer_key_parts[index])
        let a_key = answer_key_parts[index]
        //console.log("akey = ", a_key)
        if (a_key === undefined) {
            return undefined
        }

        if (a_key?.indexOf('*') >= 0 ) { //there are several possible answers
            //console.log(" multiple answers")
            let possible_answers = a_key.split('*')
            //console.log("possible_answers: ",possible_answers)
            possible_answers.forEach ( (possible_answer: string) => {
                 if (compare_cloze_answers(u_answer.toLowerCase(), possible_answer.toLowerCase())) {
                    error = false;
                 }
            })
         
        }
        else if (compare_cloze_answers(u_answer.toLowerCase(), answer_key_parts[index].toLowerCase())) {
            error = false;
        }
    })

    //console.log("process_cloze error = ", error)
    if (!error) {
        score = 5
    }        
    const rc =  { ...default_results,
        user_answer: user_answer,
        score: score,
        error_flag: error,

        }
     return rc
        //return results;
}

const compare_cloze_answers = (user_answer: string, answer_key: string) => {
  
    // remove all spaces from both user answer and answer key
    let match = true
    const u_answer_densed = user_answer.replace(/\s+/g, '');
    //const u_answer_densed =  user_answer.replace(/[\s\x00-\x1F\x7F]+/g, '');
    const answer_key_densed = answer_key.replace(/\s+/g, '');
    //const answer_key_densed = answer_key.replace(/[\s\x00-\x1F\x7F]+/g, '');
    //const noWhitespace = str.replace(/\s+/g, '');
    //console.log("answer_key_densed =", answer_key_densed, "**")
    if (u_answer_densed !== answer_key_densed) {
        //console.log("user answer and answer key do not match")
        match = false
    }
    //console.log("compare_cloze_answers match = ", match)
    return match
}

const process_radio = (question: any, user_answer: string) => {  // 4

    //console.log("process_radio user answer = ", user_answer)
    let error = false;
  let score = 0
  if (answer_key != user_answer)  {
     error = true
  }
  else {
       score += question.score;
  }
   
   return { ...default_results,
       user_answer: user_answer,
       score: score,
       error_flag: error,

       }
}

const process_words_scramble = (answer_key: string , user_answer:string) => {
    //console.log("process_words_scramble user answer = ", user_answer)
    let searchRegExp = /\//g;
    let replaceWith = '';
//kevin: programming notes: replaceAll doesn't work on the server,
//even though it works on the client side. See questions/cloze_question_edit.ejs
    var condensed_user_answer = user_answer.replace(searchRegExp, replaceWith) 
    var condensed_answer_key = answer_key.replace(searchRegExp, replaceWith) 
    //console.log(condensed_answer_str)
    let error = false;
    let score = 0
    if (condensed_user_answer === condensed_answer_key) {
        score += 5
    }
    else {
        error = true
    }
    return { ...default_results,
        user_answer: user_answer,
        score: score,
        error_flag: error,
  
        }
}

const process_words_select = (answer_key: string, user_answer: string) => {
    let error = false;
    let score = 0
    let answer_key_parts = answer_key.split('/')
    let user_answer_parts = user_answer.split('/')

    if (user_answer_parts.length != answer_key_parts.length) {
         error = true
    }
    else {
        user_answer_parts.forEach( (user_answer_part, index) => {
             //console.log("here index"+index) 
             let found = false
             answer_key_parts.forEach( (answer_key_part: string, answer_key_index: number) => {
                 //console.log("thhere index"+answer_key_index) 
                 if (user_answer_part == answer_key_part) {
                     //console.log("found")
                     found = true
                 }
              })
             if (!found) error = true
          })
    }
    if (!error) {
         score += 5;
    }
     //user_answer_str: user_answer,
     return { ...default_results,
         user_answer: user_answer,
         answer_key: answer_key,
         score: score,
         error_flag: error,

         }
}
//console.log("processLiveQuestion format = ", format)
switch (format) {
    case '1': // cloze
        return process_cloze(
            answer_key!,
            user_answer!
        );
    case '3': // button select
        return process_button_select(
            answer_key!,
            user_answer!
        );
    case '4': // radio
        return process_radio(
            answer_key,
            user_answer!
        );
    case '6': // word scramble
        return process_words_scramble(
            answer_key!,
            user_answer!
        );
    case '8': // words select
        return process_words_select(
            answer_key!,
            user_answer!
        );
    case '10': // 
        return process_cloze(
            answer_key!,
            user_answer!
        );
    case '11': // dropdown
        return process_cloze(
            answer_key!,
            user_answer!
        );
    default:
        // Handle other cases or do nothing
        break;
}

}

