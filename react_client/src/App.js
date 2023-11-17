/* By: Andrew Dennison and [ADD NAME IF MODIFIED]
 * Last modified: 17 NOV 23
*/

import './App.css';
import Board from './Board.js';
import {gridData} from './Board.js'

// This allows us to build the <App /> tag used in the primary router in index.js
function App() {
  return (
    // The entire application is wrappted in a div and header.  Below the header:

    // There are four distinct divs organized vertically throughout the App.
    //     <Title>
    //     <Board>
    //     <Inputs>
    //     <Options>
    // Board contains the current representation of the board.
    // Inputs represents which number you are currently trying to emplace.  The idea is when you click
    // on an input, that number is retained and then deposited into the next square you click in the board.
    // Options contains the erase and hint functionality, as well as pencil
    // Pencil is intended to be used to emplace a mark on the sudoku board without it counting
    // Multiple numbers can be pencilled in the same square.
    <div className="App">
      <header className="App-header">
        <div id="Title">Sudoku</div>  
        <Board />    
        <div id="Inputs">
            {
              // gridData.map pulls each individual gridSquare from gridData.  These are the sub-grids
              // labelled 1-9.  Then, the id of each gridSquare is stored in a new inputButton at the bottom
              // This just avoids having to generate a new sequence of 1-9.
              gridData.map((gridSquare) => {
                return <input class="inputButton" type="button" value={gridSquare.id}></input>
              })
            }
        </div>

        <div id="Options">
          <input class="optionButton" type="button" value="Pencil"/>
          <input class="optionButton" type="button" value="Erase"/>
          <input class="optionButton" type="button" value="Hint"/>
        </div>
      </header>
    </div>
  );
}

export default App;
