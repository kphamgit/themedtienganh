import { forwardRef, useImperativeHandle, useState } from 'react'
import { AzureButton} from '../../shared/AzureButton';
import { ChildRef } from '../types';

interface Props {
    content: string | undefined;
  }

export const ButtonSelect = forwardRef<ChildRef, Props>((props, ref) => {
  const [answer, setAnswer] = useState<string | undefined>()
  const labels = props.content?.split('/')

  const getAnswer = () => {
    return answer
  }

  /*
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      const el = event.target as HTMLButtonElement
      setAnswer(el.textContent!)
        
  }
*/
  const handleClick = (selected_text: string) => {
    setAnswer(selected_text)

  }
  useImperativeHandle(ref, () => ({
    getAnswer,
  }));

  return (
    <>
      <ul className='flex flex-row gap-3'>
        {labels?.map(label =>
          <AzureButton text={label} parentFunc={handleClick} />
        )}
      </ul>
    </>
  )
})
