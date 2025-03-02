import React, { forwardRef, useEffect, useImperativeHandle, useState} from "react";
//import { Radio, Label} from "flowbite-react";
import { QuestionProps } from "../types";
import { ChildRef } from '../types';


interface Props {
    //content: string | undefined;
    question: QuestionProps
  }

 

  interface OptionProps {
    options: { value: string; label: string }[];
  }
  
/*
forwardRef is a React feature that allows a parent component to access the DOM node of a child component. 
It is used when a parent component needs to interact with a child component's DOM element, 
for example, to set focus or get its size and position.
*/

export const RadioQuestion = forwardRef<ChildRef, Props>((props, ref) => {
  
  const [selectedValue, setSelectedValue] = useState('');
  const [myOptions, setMyOptions] = useState<OptionProps>()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  
  useEffect(() => {
     let temp = []
     temp.push({value: 'choice1', label: props.question.radio.choice_1_text})
     temp.push({value: 'choice2', label: props.question.radio.choice_2_text})
     temp.push({value: 'choice3', label: props.question.radio.choice_3_text})
     temp.push({value: 'choice4', label: props.question.radio.choice_4_text})
     setMyOptions({options: temp})
  },[props.question.radio])

  const getAnswer = () => {
    return selectedValue
  }

  useImperativeHandle(ref, () => ({
    getAnswer,
  }));

  return (
    <>
    
    <div>{props.question.content}</div>
    <div className="flex flex-col">
      {myOptions?.options.map((option) => (
        <label key={option.value}>
          <input className="m-2"
            type="radio"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={handleChange}
          />
          {option.label}
        </label>
      ))}
    </div>
    </>
  );
});

/*
 <div>{props.question.content}</div>
    <br />
    <fieldset>
      {['radio'].map((type) => (
        <div key={`${type}`} className="mb-3">
          <div className="flex items-center gap-2">
          <Radio
            name="radio"
            value="choice1"
            type={type}
            id={`${type}_choice_1`}
            onChange={onOptionChange}
          />
           <Label htmlFor="united-state">{props.question.radio.choice_1_text}</Label>
          </div>

          <div className="flex items-center gap-2 mt-2">
          <Radio
            label={'  ' + props.question.radio.choice_2_text}
            name="radio"
            value="choice2"
            type={type}
            id={`${type}_choice_2`}
            onChange={onOptionChange}
          />
           <Label htmlFor="united-state">{props.question.radio.choice_2_text}</Label>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Radio
            label={'  ' + props.question.radio.choice_3_text}
            name="radio"
            value="choice3"
            type={type}
            id={`${type}_choice_3`}
            onChange={onOptionChange}
          />
          <Label htmlFor="united-state">{props.question.radio.choice_3_text}</Label>
          </div>
          
          {props.question.radio.choice_4_text && (
            <div className="flex items-center gap-2 mt-2">
          <Radio
            label={'  ' + question.radio.choice_4_text}
            name="radio"
            value="choice4"
            type={type}
            id={`${type}_choice_4`}
            onChange={onOptionChange}
          />
          <Label htmlFor="united-state">{props.question.radio.choice_4_text}</Label>
          </div>
          )}
        </div>
      ))}
    </fieldset>
    <div>&nbsp;</div>
   
*/