import React from 'react'
import MainStudent from './MainStudent'
import './MyHorizontalGrid.css'
export function MyHorizontalGrid(props: any) {
    

    return (

        <div className="grid-container">
          <div className="grid-item" style={{ backgroundColor: 'blue' }}>
          <div className="subgrid">
        <div className="subgrid-item" style={{ backgroundColor: 'red' }}></div>
        <div className="subgrid-item" style={{ backgroundColor: 'green' }}></div>
        <div className="subgrid-item" style={{ backgroundColor: 'yellow' }}></div>
        <div className="subgrid-item" style={{ backgroundColor: 'red' }}></div>
        <div className="subgrid-item" style={{ backgroundColor: 'blue' }}></div>
        <div className="subgrid-item" style={{ backgroundColor: 'red' }}></div>
        <div className="subgrid-item" style={{ backgroundColor: 'yellow' }}></div>
        <div className="subgrid-item" style={{ backgroundColor: 'green' }}></div>
        <div className="subgrid-item" style={{ backgroundColor: 'red' }}></div>
        <div className="subgrid-item" style={{ backgroundColor: 'blue' }}></div>
      </div>
          </div>
          <div className="grid-item" style={{ backgroundColor: 'red' }}>Item 2</div>
          <div className="grid-item" style={{ backgroundColor: 'yellow' }}>Item 3</div>
          <div className="grid-item" style={{ backgroundColor: 'green' }}>Item 4</div>
          <div className="grid-item" style={{ backgroundColor: 'blue' }}>Item 5</div>
          <div className="grid-item" style={{ backgroundColor: 'red' }}>Item 6</div>
          <div className="grid-item" style={{ backgroundColor: 'green' }}>Item 7</div>
          <div className="grid-item" style={{ backgroundColor: 'yellow' }}>Item 8</div>
          <div className="grid-item" style={{ backgroundColor: 'blue' }}>Item 9</div>
          <div className="grid-item" style={{ backgroundColor: 'pink' }}>Item 10</div>
          {/* ... more grid items */}
        </div>
      );
}
