import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import AzureMatchButton from "../shared/AzureMatchButton";
import { AzureMatchButtonRefProps } from "../shared/AzureMatchButton";
import { getAGameNew } from "../../services/list";
import WordPair  from "../shared/AzureMatchButton";

  
interface WordPair {
  id: number;
  word: string;
  match: string;
  language: string;
}

const shuffleArray = (array: WordPair[]): WordPair[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const WordMatchingGame: React.FC = () => {
  const leftButtonRefs = useRef<(AzureMatchButtonRefProps | null)[]>([]);
  const rightButtonRefs = useRef<(AzureMatchButtonRefProps | null)[]>([]);

  const buttons = ["Button 1", "Button 2", "Button 3"];

const [words, setWords] = useState<WordPair[]>([]);
  const [wordsBank, setWordsBank] = useState<WordPair[]>([]);
  const [leftPairs, setLeftPairs] = useState<WordPair[]>([]);
  const [rightPairs, setRightPairs] = useState<WordPair[]>([]);
  const [selectedPair, setSelectedPair] = useState<WordPair[]>([]);
  const [score, setScore] = useState<number>(0);
  const [numMatches, setNumMatches] = useState<number>(0);
  const [targetLanguage, setTargetLanguage] = useState<string>("");
  const [sourceLanguage, setSourceLanguage] = useState<string>("");


  const disable_all_buttons = () => {
    disable_left_buttons();
    disable_right_buttons();
  }

  const disable_left_buttons = () => {
    leftButtonRefs.current.forEach((button) => {
      button?.disableButton();
    });
  }
  
  const disable_right_buttons = () => {
    rightButtonRefs.current.forEach((button) => {
      button?.disableButton();
    });
  }

  const enable_all_buttons = () => {
    enable_left_buttons();
    enable_right_buttons();
  }

  const enable_left_buttons = () => {
    leftButtonRefs.current.forEach((button) => {
      button?.enableButton();
    });
  }
  
  const enable_right_buttons = () => {
    rightButtonRefs.current.forEach((button) => {
      button?.enableButton();
    });
  }

useEffect(() => {
  getAGameNew("33")
      .then((data: any) => {
        console.log("after getAGameNew...data = ", data)
        setSourceLanguage(data?.source_language);
        setTargetLanguage(data?.target_language);
        const words_arr = data?.base.split('/')
        const matches_arr = data?.target.split('/')
        const combinedArray: WordPair[] | undefined = words_arr?.map((word:string, index:number) => ({
          id: index+1,
          word,
          match: matches_arr![index] || "",
          language: data?.source_language
        }));

        const shuffled = combinedArray ? [...combinedArray].sort(() => Math.random() - 0.5) : [];
        const shuffled1 = shuffled.map((item, index) => ({ ...item, id: index + 1 }));
        setLeftPairs(shuffled1.slice(0, 5));
        setRightPairs(shuffleArray(shuffled1.slice(0, 5)));

        const mywords_bank = shuffled1.slice(5);
        //console.log("mywords_bank length", mywords_bank.length);
        setWordsBank(mywords_bank);
        setSelectedPair([]);
      })
  }, [])

  const handleSelection = (pair: WordPair | undefined, side: string) => {
      if (side === "left") {
        enable_right_buttons();
      }
      else {
        enable_left_buttons();
      }
        
      if (selectedPair.length === 1 && selectedPair[0].id === pair?.id) {
        const left_word_index = leftPairs.findIndex((w => w.id === pair.id));
        //console.log("in HANDLE SELECTION TWO BUTTONS CLICKED, FOUND A MATCH Selected word:", pair);
        enable_all_buttons();
        setScore(score + 1);
        setNumMatches(numMatches + 1);
        const tempArray = leftPairs.slice();  //make a shallow copy of leftWords
        if (wordsBank.length > 0) {
            tempArray.splice(left_word_index, 1, {...wordsBank[0], id: pair.id}); // remove the selected word and simultaneously
            //  insert the first word of words_bank at the same index
        
        } else {
          tempArray.splice(left_word_index, 1); // only remove the selected word}
        }
       // console.log("tempArray length:", tempArray);
        setLeftPairs(tempArray);
        const right_word_index = rightPairs.findIndex((w => w.id === pair.id));
        const tempArray1 = rightPairs.slice();  //make a shallow copy of leftWords
        if (wordsBank.length > 0) {
          tempArray1.splice(right_word_index, 1, {...wordsBank[0], id: pair.id}); // remove the selected word and at simultaneously insert the first word of words_bank at the same index
      
        } else {
          tempArray1.splice(right_word_index, 1); // only remove the selected word}
        }
        setRightPairs(tempArray1);
        wordsBank.splice(0, 1);  // remove the first element from words_bank
        setSelectedPair([]);
      }
      else if (selectedPair.length === 0) {
        if (pair) {
          setSelectedPair([pair]);
        }
      }
      else {
        if (side === "left") {
          enable_left_buttons();
     
        }
        else {
          enable_right_buttons();
        }
        setSelectedPair([]);
      }
    
        
  } // end of handleSelection

  /*
   disable_all_btns={() => {
              console.log("Parent function 1 left called");
              disable_all_buttons();
            }}
  */
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col justify-start gap-2">
        {leftPairs.map((pair, index) => (
          <AzureMatchButton
            key={pair.id}
            side="left"
            word_pair={pair}
            handleAudioEnded={handleSelection}
            disable_all_btns={disable_all_buttons}
            ref={(el) => (leftButtonRefs.current[index] = el)}
          />
        ))}
      </div>
      <div className="flex flex-col justify-start gap-2">
        {rightPairs.map((pair, index) => (
          <AzureMatchButton
            key={pair.id}
            side="right"
            word_pair={pair}
            handleAudioEnded={handleSelection}
            disable_all_btns={disable_all_buttons}
            ref={(el) => (rightButtonRefs.current[index] = el)}
          />
        ))}
      </div>
      </div>
      <button
        onClick={disable_all_buttons}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        Disable...
      </button>
    </div>
  );
};

export default WordMatchingGame;

