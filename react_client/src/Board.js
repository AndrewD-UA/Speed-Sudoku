/* By: Andrew Dennison and [ADD NAME IF MODIFIED]
 * Last modified: 17 NOV 23
*/

import './App.css';

export let gridData = [];
createDefaultSquare();

// This function generates a 2D array to form the board, with sequential numbering to show
// the layout of the board.  The first dimension of the board is the Grid number:
// [1] [2] [3]
// [4] [5] [6]
// [7] [8] [9]
// The second dimension of the 2D array is the 3x3 grid contained within each grid Section.
// For example, Grid [1] above can be represented as such:
// [ 0, 1, 2
//   3, 4, 5 
//   6, 7, 8 ]

// The numbering scheme for the first dimension of the Array was chosen as 1-9 because these numbers
// are also used to generate the input buttons at the bottom.  Meanwhile, the second dimension is 0-8
// to facilitate indexing.
function createDefaultSquare() {
    for (let i = 1; i < 10; i++){
      let gridSquare = [];
      for (let j = 0; j < 9; j++){
        gridSquare.push({id: j});
      }
        gridData.push({id: i, data: gridSquare});
    }
}

// Setter function to modify the gridData from another class
export function setData(data){
    this.gridData = data;
}

// This function returns a Board object, built using the gridData 2D array to be used as <Board />
// This Board object should probably be re-written with a button sub-component built custom in React
// However, we may be able to get away with simply storing values in the value field

// Currently, this acts as a nested for loop to generate a gridSquare div that contains all 9 buttons inside
function Board() {  
    return (
      <div id="Board">
            {
              gridData.map(gridSquare => (
                <div class="gridSquare">{
                  gridSquare.data.map(button => {
                    return <input class="gameButton" type="button" value={button.id}></input>
                  })
                }</div>
              ))
            }
      </div>
    );
}

// By default, when externally importing this class, Board will be used.  This allows tag usage.
export default Board;

