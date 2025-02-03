interface DynamicObject {
    [key: string]: any;
  }

class QuestionHelper {
   //(question, props.user_answer)
    format_user_answer = (answer: string | undefined, answer_key: string, format: number | undefined, content: string): string | undefined => {
        //console.log(" questionHelper format_answer,  format", format)
        if (answer) {
            if (format === 1 || format === 10 ) {
                const replacements: DynamicObject = {};
                const answer_key_parts = answer_key.split('/')
                const user_answer_parts = answer.split('/')
                answer_key_parts.forEach( (answer_key_part, index) => {
                    //console.log("mmmmm", answer_key_part)
                    //replacements[part] = part
                    if (answer_key_part.includes('*')) {    //blank has multiple correct answers
                        const first_answer = answer_key_part.split('*')[0]  // only use the first answer
                        replacements[first_answer] = user_answer_parts[index]
                    }
                    else {
                        replacements[answer_key_part] = user_answer_parts[index]
                    }
                })
                const newStr = content.replace(/\[(.*?)\]/g, (match, p1) =>
                    replacements[p1] || match // Replace if found in object, otherwise keep original
                );
                const newStr1 = newStr.replace(/\[(.*?)\]/g, '');
                //console.log("xxxxx newStr1=", newStr1)
                return (
                    newStr1
                )
                //return content.replace(/\[|\]/g, "")
            }
            else if (format === 6) {  //word scramble
                const answer_parts: string[] = answer.split('/')
                const result = answer_parts.map((part, index) => (
                    part
                ))
                return result.join('/').replaceAll('/', ' ')
            }

            else {
                return answer
            }
        }
        else {
            return 'EMPTY user answer'
        }
    }

    format_answer_key = (answer_key: string, format: number | undefined, content: string): string | undefined => {
        //console.log(" questionHelper format_answer,  format", format)
        if (answer_key) {
            if (format === 1 || format === 10 ) {
                const replacements: DynamicObject = {};
                const answer_parts = answer_key.split('/')
                answer_parts.forEach( (part, index) => {
                  //replacements[part] = '_______'
                  if (part.includes('*')) {    //blank has multiple correct answers
                   
                    const first_answer = part.split('*')[0]  // only use the first answer
                    
                    replacements[first_answer] = answer_parts[index].replace('*','/')
                }
                else {
                    replacements[part] = answer_parts[index]
                }


                })
                //console.log("replacement = ", replacements)
              const newStr = content.replace(/\[(.*?)\]/g, (match, p1) => 
                  replacements[p1] || match // Replace if found in object, otherwise keep original
              );
              //console.log("newStr =", newStr)
              const newStr1 = newStr.replace(/\[(.*?)\]/g, '');
              //console.log("xxxxx newStr1=", newStr1)
              return newStr1
              
                //return content.replace(/\[|\]/g, "")
            }
            else if (format === 6) {  //word scramble
                const answer_parts: string[] = answer_key.split('/')
                const result = answer_parts.map((part, index) => (
                    part
                ))
                return result.join('/').replaceAll('/', ' ')
            }

            else {
                return answer_key
            }
        }
        else {
            return 'EMPTY answer key'
        }
    }
}
export default new QuestionHelper();

