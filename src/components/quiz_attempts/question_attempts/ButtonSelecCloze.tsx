import { useState, useEffect, forwardRef, useImperativeHandle, useRef, EventHandler} from 'react';
import { AzureAnimatedButton } from  '../../shared/AzureAnimatedButton'


interface InputFieldProps {
  id: string;
  type: string;
  value: string;
}

export interface DropBoxProps {
  id: string;
  value: string;
  available: boolean;
  rect: {top: number; left: number; width: number; height: number};
}

interface Props {
    content: string | undefined;
    choices: string | undefined;
  }
 // export interface ButtonSelectClozeChildRef {
  //  getAnswer: () => string[] | undefined;
 // }
 export interface ChildRef {
  getAnswer: () => string | undefined;
}

  //const labels = ['one', 'two']

  export const ButtonSelectCloze = forwardRef<ChildRef, Props>((props, ref) => {
 
  const [inputFields, setInputFields] = useState<InputFieldProps[] | undefined >([])

  const dropBoxRefs = useRef<HTMLDivElement[]>([]);

  const [buttonLabels, setButtonLabels] = useState<string[] | undefined>([])

  const [dropBoxes, setDropBoxes] = useState<DropBoxProps[]>([]);

  const charRef = useRef<HTMLDivElement>(null);
  const minLengthRef = useRef<number>(0);
  
  useEffect(() => {
     if (!props.choices) {
      console.error("No choices provided in props");
      return;
    }
    //console.log("ButtonSelectCloze...props.choices=", props.choices)
    setButtonLabels(props.choices?.split('/').map((item) => item.trim()) || []);
  }, [props.choices]);

useEffect(() => {
  const regExp = /\[.*?\]/g
  const  matches = props.content?.match(regExp);
  //console.log("aaaa matches =", matches)
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
    //console.log(" longest",length_of_longest_word)
    //setMinLength(length_of_longest_word)
    minLengthRef.current = length_of_longest_word;
    //console.log("minLengthRef.current=", minLengthRef.current)
  }
}
  //

  //remove the square brackets from matches
  const matches_no_brackets =  matches?.map((item) => {
      return item.replace('[', '').replace(']', '')
  })
  //console.log("MMMMMMMMMMMMM matches no brackets=", matches_no_brackets)
  // ["are", "thank"]
  /*
  if (matches_no_brackets) {
    //console.log("matches_no_brackets=", matches_no_brackets)
    setLabels(matches_no_brackets)
  }
*/
  //[ "are","<br />","thank"]

  // Use a regular expression to split the sentence
  // use regular expression to split the content by square brackets and by whitespace
  // and also by new line tags
  //const test_array = props.content?.split(/\[.*?\]/);
 // console.log("test_array=", test_array)

  //const array = props.content?.split(/\[|\]/);
  //const array = props.content?.split(/[\[\]\s]+/);
  // split content by square brackets and by 
  const array = props.content?.split(/(\[.*?\])|(\s+)|(#)/).filter(Boolean);
  //console.log("XXXXXXX array=", array)
  /*
[
    "In",
    " ",
    "Vietnam,",
    " ",
    "students",
    " ",
    "[usually wear]",
    " ",
    "uniforms",
    " ",
    "to",
    " ",
    "[go to school]",
    " ",
    "on",
    " ",
    "Monday."
]
  */
 
  /*
    if (part.includes('#')) {
        //console.log(" found new line tag =", part)
        return { id: index.toString(),  type: 'newline_tag', value: part,}
      }
  */

  let num_dropboxes = 0;
  let num_words = 0;
  const cloze_content_array = array?.map((part, index) => {
    const found = matches_no_brackets?.find((match) => 
      {
        //console.log("part=", part, " match=", match)
        return part.replace('[','').replace(']','') === match

    });
    //console.log( "part=", part, " found=", found)
    if (found) {
      const dropbox = { id: "dropbox_" + num_dropboxes.toString(), type: 'dropbox', value: "  " };
      num_dropboxes++; // Increment num_dropboxes after it is used
      return dropbox;
    
    }
    else {
      //console.log(" found static text part =", part)
      const word_obj = {id : "word_" + num_words.toString(), type: 'static_text', value: part};
      num_words++;
      return word_obj;
     
    }
  })
  //console.log("XXXX cloze_content_array=", cloze_content_array)
  /*
{id: '0', type: 'static_text', value: 'How '}
{id: '1', type: 'dropbox', value: '  '}
{id: '2', type: 'static_text', value: " you? # I'm fine, "}
{id: '3', type: 'dropbox', value: '  '}
  */
 //console.log("^^^^^  cloze_content_array=", cloze_content_array)

  setInputFields(cloze_content_array)
  
},[props.content])

  const getAnswer = () => {
    // iterate through dropboxes and get the values of the inputs
    //console.log(" getAnswer...dropboxes=", dropBoxes)
    const answers = dropBoxes.map((dropBox, index) => {
     
      if (dropBox) {  
        //console.log(`Input at index ${index} value:`, inputElement.textContent);
        return dropBox.value || '';
      } else {
        console.error(`No input element found at index ${index}`);
        return '';
      }
    });
    //console.log(" getAnswer...answers=", answers.join('/'))
    // clear the dropBoxes 
    setDropBoxes([]);
    return answers.join('/'); // Join the answers with a separator, e.g., ' / '
  }

  /**
   * Expose the `test` function to the parent component.
   */
  useImperativeHandle(ref, () => ({
    getAnswer,
  }));
 
  const getDropBoxBoundingRect = (index: number) => {
    const dropBox = dropBoxRefs.current[index];
    if (dropBox) {
      const rect = dropBox.getBoundingClientRect();
     // console.log(`................. Bounding rectangle for input at index ${index}:`, rect);
      return rect;
    } else {
      console.error(`No input element found at index ${index}`);
      return null;
    }
  };

    useEffect(() => {
      if (dropBoxRefs.current.length > 0) {
       //console.log('Setting up drop boxes for input elements...inputRefs.current=', dropBoxRefs.current);
        dropBoxRefs.current.forEach((input, index) => {
          const rect = getDropBoxBoundingRect(index);
          if (rect) {
            //console.log('****** ****** Input Bounding Rect for index ', index, ': Top:', rect.top, 'Left:', rect.left, 'Width:', rect.width, 'Height:', rect.height);
            // save rect in dropBoxes array
            const dropBox: DropBoxProps = {
              id: `dropBox-${index}`,
              value: '',
              // Initially, the value is empty, it will be filled when a button is clicked and dropped on it
              available: true,
              rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
            };
            setDropBoxes(prev => [...prev, dropBox]);
          }
          else {
            console.error('Could not get bounding rectangle for input element.');
          }
        })
      } else {
        console.error('No input elements are available yet.');
      }
      return () => {
        // Cleanup function to reset the drop boxes when the component unmounts
        setDropBoxes([]);
      }
    }, [inputFields]);

    function renderContent(type: string, value: string, id: string, index: number) {
     //console.log(" in renderContent...xxxxxxxxx..type=", type, "value=", value, "id=", id, "index=", index)
      if (type === 'dropbox') {
        //console.log(" in renderContent...yyyyyyyyyy..type=input .. id=", id, " index=", index)
        const char_width = charRef.current?.getBoundingClientRect().width || 0;
        //console.log("****** renderContent minw=", char_width)
        const min_width = char_width * minLengthRef.current;
        if (min_width === 0) {
          console.error("min_width is not set yet!");
          return null; // Prevent rendering if minWidth is not set
        }
        // render dropbox as a div with blue background
        return (<div
          className='bg-blue-300 rounded-md cloze_answer p-1 m-1 text-center'
          style={{ minWidth: min_width, width: min_width, height: 25, lineHeight: 1.5 }}
          id={id}
          ref={(el) => {
            if (el) {
              //inputCountRef.current += 1;
              const dropbox_index = id.split('_')[1];
              dropBoxRefs.current[parseInt(dropbox_index)] = el; // Add the reference to the array
            }
          }}
        >
        </div>
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
      else {  // type = 'static_text'
        return (<span style={{ color: 'black',  marginLeft: 2, lineHeight : 2, padding: 3 }}>{value}</span>)
      }
    }

    const handleClick = (selected_text: string, droppedIndex: number | undefined, available: boolean) => {
      //console.log("ButtonSeleceCloze: handleClick.. selectedText = ", selected_text, " droppedIndex=", droppedIndex)
      //console.log("targetInput=", targetInput)
      //const audioUrl =`https://kphamazureblobstore.blob.core.windows.net/tts-audio/${word}.mp3`; // Replace with your audio file URL
      //`https://kphamazureblobstore.blob.core.windows.net/tts-audio/${word}.mp3`
      /*
      const audioUrl =`https://kphamazureblobstore.blob.core.windows.net/tts-audio/one.mp3`;
      const audio = new Audio(audioUrl);
      audio.play().catch((error) => {
          console.error("Error playing audio:", error);
      });
      */
     
      // update the available state corresponding to droppedIndex in the dropBoxes array
      const updatedDropBoxes = dropBoxes.map((dropBox, index) => {
        if (index === droppedIndex) {
          return { ...dropBox, value: selected_text, available: available }; // Mark the dropbox as unavailable
        }
        return dropBox;
      });
      //console.log(" ButtonSeleceCloze, handleClick,  updatedDropBoxes=", updatedDropBoxes)
      setDropBoxes(updatedDropBoxes);
   
  }

  
  useEffect(() => {
    const handleResize = () => {
     dropBoxes.forEach((input, index) => {
      const rect = getDropBoxBoundingRect(index);
      if (rect) {
       //console.log('****** ****** Input Bounding Rect for index ', index, ': Top:', rect.top, 'Left:', rect.left, 'Width:', rect.width, 'Height:', rect.height);
        // save rect in dropBoxes array
        // get the dropBox at index
        const current_dropBox = dropBoxes[index];
        // replace rect property of current dropBox with the new rect
        //console.log(" current_dropBox=", current_dropBox)
        if (!current_dropBox) {
          console.error(`No dropBox found at index ${index}`);
          return;
        }
        const dropBox: DropBoxProps = {
          id: current_dropBox.id,
          value: current_dropBox.value,
          available: current_dropBox.available,
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
        };
        // update the dropBoxes array with the new dropBox
        setDropBoxes(prev => {
          const newDropBoxes = [...prev];
          newDropBoxes[index] = dropBox; // Update the specific index
          return newDropBoxes;
        });
      }
      else {
        console.error('Could not get bounding rectangle for input element.');
      }
    })
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Cleanup function to remove the event listener when the component unmounts
    };
  }, [dropBoxes]); // Empty dependency array means this effect runs once on mount and cleans up on unmount


    return (
      <>
        <div style={{
          position: 'absolute', left: 0, fontFamily: 'monospace', color: "white", // Use a monospaced font for consistent character width
          fontSize: 14,
        }}
          ref={charRef}
        >
          c
        </div>
        {charRef.current &&
          <div className='bg-cyan-300 p-2 flex flex-col justify-center items-center flex-wrap m-3'>
            <div className='flex flex-row justify-start bg-blue-200 flex-wrap'>
              {inputFields?.map((field, index) => {
                return (
                  <div key={index}>
                    {renderContent(field.type, field.value, field.id, index)}
                  </div>
                );
              })}
            </div>
            <div className='flex flex-row justify-center items-center bg-orange-200 m-10'>
              <ul className='flex flex-row gap-5 m-3'>
                {buttonLabels && buttonLabels.map((label, index) => (
                  <li key={label}>
                    <AzureAnimatedButton
                      id={`azure-button-${index}`}
                      voice_text={label}
                      button_text={label}
                      dropBoxes={dropBoxes}
                      parentFunc={handleClick} />
                  </li>
                )
                )}
              </ul>
            </div>
          
          </div>
          // make a test button to test the getAnswer function
          
        }
    
      </>
    );

});