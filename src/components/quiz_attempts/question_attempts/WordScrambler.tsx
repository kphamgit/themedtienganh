import { Reorder } from "framer-motion"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
//import { ChildRef } from '../types';

interface Props {
    content: string | undefined;
  }

  type MyProps = {
    text: string, id: string
  }

  export interface ChildRef {
    getAnswer: () => string | undefined;
  }
  
export const WordScrambler = forwardRef<ChildRef, Props>((props, ref) => {
    const [items, setItems] = useState<MyProps[]>([]);
    const [unSortedItems, setUnSortedItems] = useState<MyProps[]>([])
    //const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        //console.log("in WordScrambler")
        function shuffle(array: any) {
          for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
            [array[i], array[j]] = [array[j], array[i]];
          }
        }  
          
          let myArray1 = props.content?.split('/').map((str, index) => ({ text: str, id: index.toString() }));
          //console.log(" myArray1 : ", myArray1)
          setUnSortedItems([...myArray1!])
          var listItems: MyProps[] = []
          shuffle(myArray1)
          myArray1?.forEach( (element, index) => {
            listItems.push({text: element.text, id: element.id})
        });
        
         setItems(listItems)        
      },[props.content, setUnSortedItems])

      const getAnswer = () => {
        const uanswer = document.getElementsByClassName('word_scrambler_items')
        var temp_arr: MyProps[] = []
        for (let i = 0; i < uanswer.length; i++) {
          var word = uanswer[i].innerHTML
          temp_arr.push({id: uanswer[i].id, text: word})
        }
        const answer_str = temp_arr.map(item => (
            item.text
        )
        )
        console.log(answer_str)
        return answer_str.join('/')
      }

      useImperativeHandle(ref, () => ({
        getAnswer,
      }));

    return (
        <>
            <Reorder.Group axis = 'x' 
          values={items} 
          onReorder={setItems} 
          style={{display:"flex", flexDirection:"row"}}
          >
          {items.map((item) => (
            // Change the li to Reorder.Item and add value prop
             <Reorder.Item className="bg-amber-400 p-2 m-1 rounded-md word_scrambler_items"
             key={item.id} 
             id={item.id}
             value={item}
             >{item.text}
             </Reorder.Item>
          ))}
        </Reorder.Group>
               
        </>
    );
})

// setRef(element, item.text)} />