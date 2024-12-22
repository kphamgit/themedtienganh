import { useState, useEffect, forwardRef, useImperativeHandle, useRef} from 'react';


interface InputField {
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

  export const DynamicWordInputs = forwardRef<ChildRef, Props>((props, ref) => {
 
  const [inputFields, setInputFields] = useState<InputField[] | undefined >([])
  const [maxLength, setMaxLength] = useState<number>()
  const inputRefs = useRef<HTMLInputElement[]>([]);

useEffect(() => {
  const regExp = /\[.*?\]/g
  const  matches = props.content?.match(regExp);

  let length_of_longest_word = 1;
  if (matches) {
    for (var i = 0; i < matches.length; i++) {
      if (matches[i].length > length_of_longest_word) {
        //console.log(" longest", (matches[i].length + 1))
        length_of_longest_word = matches[i].length + 1
        
      }
    }
    //console.log(" longest",length_of_longest_word)
    setMaxLength(length_of_longest_word)
  }

  //matches = ["[sentence]","[square brackets]"]
  //remove the square brackets from matches
  const matches_no_brackets =  matches?.map((item) => {
      return item.replace('[', '').replace(']', '')
  })


  // Use a regular expression to split the sentence
  const array = props.content?.split(/\[|\]/);
  
  // Filter out empty strings that might result from consecutive brackets
  const filteredArray = array?.filter(item => item.trim() !== "");
  const cloze_content_array = filteredArray?.map((part, index) => {
    const found = matches_no_brackets?.find((match) => part === match);
    if (found)
      return { id: index.toString(),  type: 'input', value: "  ",}
    else
      return { id: index.toString(), type: 'static_text', value: part}
  })
  
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

    function renderContent(type: string, value: string, id: string, index: number) {
      if (type === 'input') {
        return (<input
          className='bg-red-200 rounded-md cloze_answer'
          type="text"
          value={value}
          size={maxLength}
          onChange={(e) => handleInputChange(id, e.target.value)}
          ref={(el: HTMLInputElement) => {
            inputRefs.current[index] = el;
          }}
        />
        )
      }
      else
        return (<span>{value}</span>)
    }

  return (
    <>
    <div className='flex flex-row flex-wrap gap-2'>
        {inputFields?.map((field, index) => (
          renderContent(field.type, field.value, field.id, index)
        ))
    }
    </div>
    </>
  );
});

