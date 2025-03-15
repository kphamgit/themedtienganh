import { useState, useEffect, forwardRef, useImperativeHandle, useRef, EventHandler} from 'react';
import { AzureButton } from '../../shared/AzureButton';


interface InputFieldProps {
  id: string;
  type: string;
  value: string;
}

interface Props {
    content: string | undefined;
  }
  export interface ChildRef {
    getAnswer: () => string | undefined;
  }

  //const labels = ['one', 'two']

  export const ButtonSelectCloze = forwardRef<ChildRef, Props>((props, ref) => {
 
  const [inputFields, setInputFields] = useState<InputFieldProps[] | undefined >([])
  const [maxLength, setMaxLength] = useState<number>()
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [targetInput, setTargetInput] = useState('')
  const [labels, setLabels] = useState<string[] | undefined>([])



useEffect(() => {
  const regExp = /\[.*?\]/g
  const  matches = props.content?.match(regExp);
  console.log("aaaa matches =", matches)
  
  /* [
    "[you/he/I]"]
  */
  if (matches) {
  const match_parts = matches[0].split('/')
  let length_of_longest_word = 1;
  if (match_parts) {
    for (var i = 0; i < match_parts.length; i++) {
      if (match_parts[i].length > length_of_longest_word) {
        //console.log(" longest", (matches[i].length + 1))
        length_of_longest_word = match_parts[i].length + 1
        
      }
    }
    console.log(" longest",length_of_longest_word)
    setMaxLength(length_of_longest_word)
  }
}
  //

  //remove the square brackets from matches
  const matches_no_brackets =  matches?.map((item) => {
      return item.replace('[', '').replace(']', '')
  })
  //console.log("MMMM matches no brackets=", matches_no_brackets)
  // ["are", "thank"]
  if (matches_no_brackets) {
    setLabels(matches_no_brackets[0].split('/'))
  }
  //[ "are","<br />","thank"]

  // Use a regular expression to split the sentence
  const array = props.content?.split(/\[|\]/);
  //console.log("NNN array=", array)
  // ["How ", "are", " you? # I'm fine, ", "thank"," you." ]
  //[ "How ","are", " you? ", "<br />", " I'm fine, ","thank", " you." ]

  // Filter out empty strings that might result from consecutive brackets
  const filteredArray = array?.filter(item => item.trim() !== "");
  //console.log("OOO filteredArray=", filteredArray)
  //["How ", "are", " you? # I'm fine, ", "thank"," you." ]
  //[ "How ","are", " you? ", "<br />", " I'm fine, ","thank", " you." ]


  const cloze_content_array = filteredArray?.map((part, index) => {
    const found = matches_no_brackets?.find((match) => part === match);
    if (found) {
      if (part.includes('#')) {
        //console.log(" found new line tag =", part)
        return { id: index.toString(),  type: 'newline_tag', value: part,}
      }
      else {
        return { id: index.toString(),  type: 'input', value: "  ",}
      }
    }
    else {
      //console.log(" found static text part =", part)
      return { id: index.toString(), type: 'static_text', value: part}
    }
  })
  //console.log("XXXX cloze_content_array=", cloze_content_array)
  /*
{id: '0', type: 'static_text', value: 'How '}
{id: '1', type: 'input', value: '  '}
{id: '2', type: 'static_text', value: " you? # I'm fine, "}
{id: '3', type: 'input', value: '  '}
  */
  setInputFields(cloze_content_array)
  
},[props.content])

  const getAnswer = () => {
    const answer_array: string[]  = []
    inputRefs.current.forEach(myref => {
      if (myref) {
        //console.log(myref.getFillContent())
        answer_array.push(myref.value)
      }
    });
    return answer_array.join('/')
    
  }

  /**
   * Expose the `test` function to the parent component.
   */
  useImperativeHandle(ref, () => ({
    getAnswer,
  }));

  const handleInputChange = (id: string, value: string) => {
    setInputFields((prevFields) =>
      prevFields?.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

  const handleFocus = (id: string) => setTargetInput(id);

    function renderContent(type: string, value: string, id: string, index: number) {
      console.log("renderContent.....type=", type, "value=", value, "id=", id, "index=", index)
      if (type === 'input') {
        return (<input
          className='bg-bgColor2 rounded-md cloze_answer p-1 m-1 text-center'
          type="text"
          id={id}
          readOnly={true}
          size={maxLength}
          onChange={(e) => handleInputChange(id, e.target.value)}
          onFocus={() => handleFocus(id)}
          ref={(el: HTMLInputElement) => {
            inputRefs.current[index] = el;
          }}
        />
        )
      }
      else if (type === "newline_tag") {
        if (value === '#') {
          return (<span><br /></span>)
        }
        else {
          return (<span><br />&nbsp;&nbsp;&nbsp;&nbsp;</span>)
        }
      }
      else {
        return (<span style={{  marginLeft: 3, lineHeight : 2, padding: 3 }}>{value}</span>)
      }
    }

  const handleClick = (selected_text: string) => {
      console.log("handleClick.....selected text =", selected_text)
      console.log("targetInput=", targetInput)
      const target_el:HTMLInputElement = document.getElementById(targetInput) as HTMLInputElement
      console.log("target_el=", target_el)
      if (target_el) {
        console.log("target_el.textContent=", target_el.textContent)
        target_el.value = selected_text
      }
  }

  return (
    <>
    <div className=' text-textColor1'>
        {inputFields?.map((field, index) => (
          <span key={index}>
          {renderContent(field.type, field.value, field.id, index) }
          </span>
        ))
    }
        <div>
        <ul className='flex flex-1 gap-3'>
            {labels && labels.map(label => (
                <li key={label}>
                   <AzureButton voice_text={label} button_text={label} parentFunc={handleClick}/>
                </li>
            )
            )}
        </ul>
      </div>
    </div>
    </>
  );
});