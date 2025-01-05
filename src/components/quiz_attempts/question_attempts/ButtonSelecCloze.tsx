import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { AzureButton } from '../../shared/AzureButton'

interface Props {
    content: string | undefined;
  }

  export interface ChildRef {
    getAnswer: () => string | undefined;
  }

  export const ButtonSelectCloze = forwardRef<ChildRef, Props>((props, ref) => {
    const [left, setLeft] = useState<string | undefined>()
    const [right, setRight] = useState<string | undefined>()

    const [labels, setLabels] = useState<string[]>([])
    const [answer, setAnswer] = useState<string>()

    useEffect(() => {
        var regExp = /\[.*?\]/g
        var matches = props.content?.match(regExp);
        //there should be only one match for ButtonSelectClozeQuestion
        let words = matches![0].replace('[','').replace(']','')

        //console.log("UUUUUQQQQQQQQQQQQQQQQQQQQQQ",content)
        // this is [a/an/many] book.
        let temp_sentence_with_star =  props.content?.replace(/ *\[[^\]]*]/g, ' * ');
        // this is * book.
       // console.log("MMM", temp_sentence_with_star)
        let left_and_right_parts: string[] | undefined = temp_sentence_with_star?.split('*')
        //console.log("NNN",left_and_right_parts?[0])
        const left_part:string|undefined = left_and_right_parts?.[0]
        const right_part:string|undefined = left_and_right_parts?.[1]
        console.log("QQQ",words)
        //const temp = {left: left_and_right_parts?[0], 
        //    right: left_and_right_parts?[1],
        //    words: words
        // }
        setLeft(left_part)
        setRight(right_part)
        //setWords(words)
        setLabels(words.split('/'))

    },[props.content])

    const getAnswer = () => {
        return answer
    }

    useImperativeHandle(ref, () => ({
        getAnswer,
    }));

    const handleClick = (selected_text: string) => {
        setAnswer(selected_text)
        let fill_el: HTMLElement = document.getElementById("fill")!
        fill_el.innerHTML = selected_text!
    }
    
    return (
          <>
          
              <div className='flex flex-row justify-center mb-4'>
                  <div className='mx-2 bg-bgColor3 text-textColor2'>{left && left}</div>
                  <div className='bg-bgColor3 text-textColor2' id='fill'>_______</div>
                  <div className='mx-2 bg-bgColor3 text-textColor2'>{right && right}</div>
              </div>

              <div>
                  <ul className='flex flex-1 gap-3'>
                      {labels.map(label => (
                          <li key={label}>
                             <AzureButton voice_text={left + ' ' + label + ' ' + right} button_text={label} parentFunc={handleClick}/>
                          </li>
                      )
                      )}
                  </ul>

              </div>
          </>
    )
 
})

// <button className='bg-amber-500' onClick={handleClick}>{label}</button>
