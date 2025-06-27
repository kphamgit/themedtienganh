//import React from 'react'
//import MainStudent from './MainStudent'
import './MyVerticalGrid.css'
//import { useDraggable, DndContext } from '@dnd-kit/core';
export function MyVerticalGrid(props: any) {
    
  /*
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'vertical-grid', // Unique identifier for the draggable element
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined, // Apply the drag transformation
  };
*/

    return (
     
        <div 
  
             className="grid-container"
        >
          <div className="grid-item" style={{ backgroundColor: 'blue' }}>1</div>
          <div className="grid-item" style={{ backgroundColor: 'red' }}>2</div>
          <div className="grid-item" style={{ backgroundColor: 'yellow' }}>3</div>
          <div className="grid-item" style={{ backgroundColor: 'green' }}>4</div>
          <div className="grid-item" style={{ backgroundColor: 'blue' }}>5</div>
          <div className="grid-item" style={{ backgroundColor: 'red' }}>6</div>
          <div className="grid-item" style={{ backgroundColor: 'green' }}>7</div>
          <div className="grid-item" style={{ backgroundColor: 'yellow' }}>8</div>
          <div className="grid-item" style={{ backgroundColor: 'blue' }}>9</div>
          <div className="grid-item" style={{ backgroundColor: 'pink' }}>0</div>
          {/* ... more grid items */}
        </div>

      );
}
