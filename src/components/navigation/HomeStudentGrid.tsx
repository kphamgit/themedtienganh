import { DndContext, useDraggable } from '@dnd-kit/core';
import { useSocketContext } from '../../hooks/useSocketContext';
import MainStudent from './MainStudent'
import { useState } from 'react';
//import Accordion from '../shared/Accordion';
//const LiveAudioRecorder = lazy(() => import("../pages/LiveAudioRecorder"))

export default function HomeStudentGrid(props: any ) {

  const {socket} = useSocketContext()

  const [showGrid, setShowGrid] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'vertical-grid', // Unique identifier for the draggable element
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined, // Apply the drag transformation
  };
 
  const gridSize = 100; // Size of each grid square in pixels
  const numLines = 20; // Number of lines to draw (adjust as needed)

  const drawGrid = () => {
    const gridLines = [];
    const gridNumbers = [];
   
    for (let i = 0; i < numLines; i++) {
      const position = i * gridSize;
      // Vertical line
      gridLines.push(
        <div
          key={`v-${i}`}
          style={{
            position: 'absolute',
            top: 0,
            left: position,
            width: 1,
            height: '100%',
            backgroundColor: 'black',
          }}
        />
      );
      // Horizontal line
      gridLines.push(
        <div
          key={`h-${i}`}
          style={{
            position: 'absolute',
            top: position,
            left: 0,
            width: '100%',
            height: 1,
            backgroundColor: 'black',
          }}
        />
      );
      // Add column numbers (top side)
    gridNumbers.push(
      <div
        key={`col-num-${i}`}
        style={{
          position: 'absolute',
          top: -20, // Adjust to position above the grid
          left: position + gridSize / 2 - 10, // Center the number
          width: gridSize,
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          color: 'black',
        }}
      >
        {i}
      </div>
    );

    // Add row numbers (left side)
    gridNumbers.push(
      <div
        key={`row-num-${i}`}
        style={{
          position: 'absolute',
          top: position-16, // Align with the grid line
          left: 5, // Position to the left of the grid
          width: gridSize,
          textAlign: 'left', // Align text to the left
          fontSize: '12px',
          fontWeight: 'bold',
          color: 'black',
        }}
      >
        {i*100}
      </div>
    );
    }
    return (
      <>
        {gridLines}
        {gridNumbers}
      </>
    );
    //return gridLines; // Return the grid lines as ReactNode
  }

   return (
    <DndContext>
      <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        zIndex: 0,
      }}>
         <div
           style={{
             position: 'relative',
             width: `${gridSize * numLines}px`,
             height: `${gridSize * numLines}px`,
             border: '1px solid black',
           }}
         >
           { showGrid &&
              drawGrid()
           }
         </div>
         <div className='flex flex-row bg-bgColor1 opacity-60'
          style={{zIndex: 0, 
            position: 'absolute',
            top: 0, 
            left: 0,
            opacity: showGrid ? 0.6 : 1, // Change opacity based on showGrid state
            }}>
          <div className='col-span-11 flex flex-col justify-stretch bg-bgColor1 h-screen '>
              <div><MainStudent/></div>
              <div className='flex flex-row justify-end'></div>
              <button className='bg-blue-500 text-white rounded-md hover:bg-blue-600 p-2 m-4 absolute top-0 right-0 z-10'
                onClick={() => setShowGrid(!showGrid)}
                >
                 Grid
              </button>
          </div>
        </div>
      </div>
         </DndContext>
      )
  
 
}

/*
     <div className='flex flex-row bg-bgColor1 opacity-80'
          style={{zIndex: 0, position: 'absolute', top: 0, left: 0,}}>
          <div className='col-span-11 flex flex-col justify-stretch bg-bgColor1 h-screen '>
              <div><MainStudent/></div>
              <div className='flex flex-row justify-end'></div>
          </div>
        </div>
*/


/*
 return (
        <div className='m-20 bg-bgColor1'>
        
            <div><MainStudent /></div>
           
        </div>
  )
*/