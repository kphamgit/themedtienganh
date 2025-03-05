import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import AzureMatchButton from "../shared/AzureMatchButton";
import { AzureMatchButtonRefProps } from "../shared/AzureMatchButton";
import { getAGameNew } from "../../services/list";
//import WordPair  from "../shared/AzureMatchButton";
import MatchButton from "../shared/MatchButton";

  
export interface WordPair {
  id: number;
  word: string;
  word_language: string;
  match: string;
  match_language: string;
}

interface WordMatchingGameProps {
  id: string;
}

const shuffleArray = (array: WordPair[]): WordPair[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const WordMatchingGame: React.FC<WordMatchingGameProps> = ({id}) => {

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

  const numCardsToDisplay = 6

  const disable_all_buttons1 = () => {
    disable_left_buttons1();
    disable_right_buttons1();
  }

  const disable_left_buttons1 = () => {
    leftButtonRefs.current.forEach((button) => {
      button?.disableButton();
    });
  }
  
  const disable_right_buttons1 = () => {
    rightButtonRefs.current.forEach((button) => {
      button?.disableButton();
    });
  }

  const enable_all_buttons1 = () => {
    enable_left_buttons1();
    enable_right_buttons1();
  }

  const enable_left_buttons1 = () => {
    leftButtonRefs.current.forEach((button) => {
      button?.enableButton();
    });
  }
  
  const enable_right_buttons1 = () => {
    rightButtonRefs.current.forEach((button) => {
      button?.enableButton();
    });
  }

/* 
 const all_left_buttons = document.querySelectorAll('.left')
            all_left_buttons.forEach((button) => {
              button.setAttribute('disabled', 'true')
            })
            const all_right_buttons = document.querySelectorAll('.right')
            all_right_buttons.forEach((button) => {
              button.setAttribute('disabled', 'true')
            })
*/

  const disable_all_buttons = () => {
    disable_left_buttons();
    disable_right_buttons();
  }

  const disable_left_buttons = () => {
    document.querySelectorAll('.left').forEach((button) => {
      (button as HTMLButtonElement).disabled = true;
    });
  }
  
  const disable_right_buttons = () => {
    document.querySelectorAll('.right').forEach((button) => {
      (button as HTMLButtonElement).disabled = true;
    });
  }

  const enable_all_buttons = () => {
    enable_left_buttons();
    enable_right_buttons();
  }

  const enable_left_buttons = () => {
    document.querySelectorAll('.left').forEach((button) => {
      (button as HTMLButtonElement).disabled = false;
    });
  }
  
  const enable_right_buttons = () => {
    //console.log("in enable_right_buttons");
    document.querySelectorAll('.right').forEach((button) => {
      (button as HTMLButtonElement).disabled = false;
    });
  }


useEffect(() => {
  getAGameNew(id)
      .then((data: any) => {
        //console.log("after getAGameNew...data = ", data)
        setSourceLanguage(data?.source_language);
        setTargetLanguage(data?.target_language);
        const words_arr = data?.base.split('/')
        const matches_arr = data?.target.split('/')
        
        const combinedArray: WordPair[] | undefined = words_arr?.map((word:string, index:number) => ({
         id: index+1,
           word,
           word_language: data?.source_language,
           match: matches_arr![index] || "",
           match_language: data?.target_language,
        }));

        const shuffled = combinedArray ? [...combinedArray].sort(() => Math.random() - 0.5) : [];

        //reset indices for the shuffled array
        const shuffled1 = shuffled.map((item, index) => ({ ...item, id: index + 1 }));
        setLeftPairs(shuffled1.slice(0, numCardsToDisplay));
        setRightPairs(shuffleArray(shuffled1.slice(0, numCardsToDisplay)));

        const mywords_bank = shuffled1.slice(numCardsToDisplay);
        //console.log("mywords_bank length", mywords_bank.length);
        setWordsBank(mywords_bank);
        setSelectedPair([]);
      })
  }, [id])

  const handleSelection = (pair: WordPair | undefined, side: string) => {
      //console.log("in handleSelection, pair:", pair, "side:", side);
      if (side === "left") {
       // console.log("in handleSelection, side is LEFT calling enable_left_buttons");
        enable_right_buttons();
      }
      else {
        //console.log("in handleSelection, side is RIGHT calling enable_left_buttons");
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
        const tempArray1 = rightPairs.slice();  //make a shallow copy of rightWords
        if (wordsBank.length > 0) {
          tempArray1.splice(right_word_index, 1, {...wordsBank[0], id: pair.id}); // remove the selected word 
          // and simultaneously insert the first word of words_bank at the same index
      
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

  return (
    <div className="w-full bg-red-300 pr-4">
      <div className="w-full grid grid-cols-2 gap-2">
      <div className="bg-gray-200 rounded-lg m-2 w-full">
        {leftPairs.map((pair, index) => (
          <div className="flex justify-start m-1">

{ pair.word_language === "vn" ?
          <MatchButton
            key={pair.id}
            side="left"
            word_pair={pair}
            handleSelection={handleSelection}
            disable_all_btns={disable_all_buttons}
            ref={(el) => (leftButtonRefs.current[index] = el)}
          />
          :
          <AzureMatchButton
            key={pair.id}
            side="left"
            word_pair={pair}
            handleAudioEnded={handleSelection}
            disable_all_btns={disable_all_buttons}
            ref={(el) => (leftButtonRefs.current[index] = el)}
          />
            }

          </div>
        ))}
      </div>
      <div className="bg-gray-200 rounded-lg m-2 w-full">
        {rightPairs.map((pair, index) => (
          <div className="flex justify-start m-1">

{ pair.match_language === "vn" ?
          <MatchButton
            key={pair.id}
            side="right"
            word_pair={pair}
            handleSelection={handleSelection}
            disable_all_btns={disable_all_buttons}
            ref={(el) => (rightButtonRefs.current[index] = el)}
          />
          :
          <AzureMatchButton
            key={pair.id}
            side="right"
            word_pair={pair}
            handleAudioEnded={handleSelection}
            disable_all_btns={disable_all_buttons}
            ref={(el) => (rightButtonRefs.current[index] = el)}
          />
            }

          </div>
        ))}
      </div>
      </div>
   
    </div>
  );
};

export default WordMatchingGame;

/*
        <div className='flex flex-row'>
                            <div className="flex justify-center items-center w-full bg-gray-400">
                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div className="bg-blue-500  items-center justify-start rounded-lg shadow-lg">
                                        {leftCards && leftCards.map(card => (
                                            <div key={card.match_index} className='m-2 w-900px'>
                                                {card.language === 'vn' ?
                                                <div className='flex flex-col gap-1'>
                                                    <TextCard card={card} handleChoice={handleChoiceLeft} card_side='left' />
                                                    </div>
                                                    :
                                                <div className='flex flex-col gap-1'>
                                                    <TextCardAzure card={card} handleChoice={handleChoiceLeft} card_side='left' />
                                                    </div>
                                                }
                                            </div>
                                        ))
                                        }
                                    </div>
                                    <div className="bg-blue-500  items-center justify-start rounded-lg shadow-lg">
                                        {rightCards && rightCards.map(card => (
                                            <div key={card.match_index} className='m-2 w-900px'>
                                                {card.language === 'vn' ?
                                                <div className='flex flex-col gap-1'>
                                                    <TextCard card={card} handleChoice={handleChoiceRight} card_side='right' />
                                                    </div>
                                                    :
                                                <div className='flex flex-col gap-1'>
                                                    <TextCardAzure card={card} handleChoice={handleChoiceRight} card_side='right' />
                                                    </div>
                                                }
                                            </div>
                                        ))
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
*/

