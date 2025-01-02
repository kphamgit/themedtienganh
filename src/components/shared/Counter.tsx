import { useState, forwardRef, useImperativeHandle, useRef } from 'react';

interface Props {
    //content: string | undefined;
    initialSeconds: number
  }

  interface ElapsedTime {
    minutes: number, seconds: number
  }

  export interface CounterRef {
    getCount: () => number | undefined;
    startCount: () => void
    stopCount: () => ElapsedTime
  }

export const Counter = forwardRef<CounterRef, Props>((props, ref) => {
  const [count, setCount] = useState<number>();
  const [stop, setStop] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /*
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  },[]);
  */

  const getMinutes = () => {
    let minutes = 0
    if (count) {
      //console.log(" in getMinutess here", count)
      minutes = Math.floor(count / 60);
    }
    else
      return 0

      //console.log(" in getMinutess return ", minutes)
    return minutes
  }

  const getSeconds = (minutes: number) => {
      let m_seconds = 0
      if (count)
        m_seconds = count - minutes * 60;

      return m_seconds
  }

  useImperativeHandle(ref, () => ({
    startCount() {
      //console.log(" in startCount")
      setStop(false)
      setCount(1)
      intervalRef.current = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount)
            return (prevCount + 1)
        }
        );
      }, 1000);
    },

    stopCount() {
      //console.log(" in stopCount")
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      const minutes = getMinutes()
      const m_seconds = getSeconds(minutes)
      //console.log("m seconds", m_seconds)
      setCount(undefined)
      setStop(true)
      return {minutes: minutes, seconds: m_seconds}
    },
    getCount() {
      return count;
    }
  }));

  return (
    
    <div>
    {!stop && 
    <div className='bg-bgColor1 text-textColor1'>{count}</div>
    }
    </div>
  );
});

//export default Counter;