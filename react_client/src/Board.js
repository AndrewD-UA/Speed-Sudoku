/* By: Andrew Dennison and [ADD NAME IF MODIFIED]
 * Last modified: 04 DEC 23
*/

import './Board.css';
import { InputButton } from './board_components/InputButton.js'
import { EraseButton } from './board_components/EraseButton.js'
import { PencilButton } from './board_components/PencilButton.js'
import { SubBoard } from './board_components/SubBoard.js'
import React, { Component, useState } from 'react';

export class Board extends Component{

  constructor(props){
    super();

    this.gridData = props.data;
    this.solution = props.solution;
    this.initialData = props.data;

    this.moves = [];
    this.lastMove = "No last move";

    this.state = {
        0 :   this.gridData[0].data,
        1 :   this.gridData[1].data,
        2 :   this.gridData[2].data,
        3 :   this.gridData[3].data,
        4 :   this.gridData[4].data,
        5 :   this.gridData[5].data,
        6 :   this.gridData[6].data,
        7 :   this.gridData[7].data,
        8 :   this.gridData[8].data,
        currentlyCopied : -1,
        errors: 0,
        timer: 0
    }

    setInterval(() =>{
      this.setState({
        timer: this.state.timer + 1
      })
    }, 1000)

    this.currentlyCopied = -1;
  }
  /**
   * Shell function to inform the board to update with the currently copied value
   * @param {Number} subBoardId Number repr of which subBoard is being updated [0-8]
   * @param {Number} buttonId   Number repr of which button in the subBoard is being updated [0-8]
   * @param {Boolean} isUndo    Boolean repr of whethere this update is an undo operation
   */
  updateBoard(subBoardId, buttonId, isUndo){
    this.updateBoardAll(subBoardId, buttonId, this.state.currentlyCopied, isUndo);
  }

  /**
   * Update the board at a given location (subBoardId, buttonId) with newValue.  Store the update
   * in the list of moves, unless it is an undo operation.  This allows future undoing.
   * @param {Number} subBoardId  Number repr of which subBoard is being updated [0-8]
   * @param {Number} buttonId    Number repr of which button in the subBoard is being updated [0-8]
   * @param {*} newValue         Value to store at the given location
   * @param {Boolean} isUndo     Boolean repr of whethere this update is an undo operation
   * @returns 
   */
  updateBoardAll(subBoardId, buttonId, newValue, isUndo){
    // If the new value is less than 1, no input button is currently selected
    // Unless newValue is " ", which indicates it is the erase functionality
    if (newValue < 1 && newValue != " "){
      return;
    }

    if (!this.validatePlacement(subBoardId, buttonId, newValue)){
      return;
    }
    
    // Make a copy of the current array of values
    let localCopy = [...this.state[subBoardId]]

    // If it's not an undo operation, store our set of moves for future undo operations
    if (!isUndo){
      this.moves.push({
        subBoard: subBoardId,
        button: buttonId,
        oldValue: localCopy[buttonId]
      });
    }

    // Modify our copy of the values, then set the state with it
    localCopy[buttonId] = newValue.toString();    
    this.setState({
      [ subBoardId ] : localCopy
    });
  }

  /**
   * Check if newValue is the correct solution at (subBoardId, buttonId)
   * Erasure inputs are ignored
   * @param {Number} subBoardId Number repr of which subBoard is being updated [0-8]
   * @param {Number} buttonId   Number repr of which button in the subBoard is being updated [0-8]
   * @param {Any} newValue      Value which is being checked
   * @returns                   Boolean repr of whether this is a valid entry
   */
  validatePlacement(subBoardId, buttonId, newValue){
    if (newValue == " "){
      return true;
    }

    if (this.solution[subBoardId].data[buttonId] == newValue){
      return true;
    }

    this.setState({
      errors : this.state.errors + 1
    });
    return false;
  }

  /**
   * Update the currentlyCopied state to the selection, represented by value
   * @param {*} value Value can either be a Number, or " ", which indicates erasing
   */
  storeInputValue(value){
    this.setState({
      currentlyCopied : value
    })
  }

  /**
   * Calling Undo access this.moves to undo the last recorded move.  This could be a deletion/erase
   * or an insertion of a new number.
   */
  undo(){
    if (this.moves.length === 0){
      return;
    }

    let lastMove = this.moves.pop();
    this.updateBoardAll(lastMove.subBoard, lastMove.button, lastMove.oldValue, true)
  }

  // This function returns a Board object, built using the gridData 2D array to be used as <Board />

  render(){
    return (
      <div className="App">
        <AppHeader />
        <div className="App-body">
          <div className="PrimaryDisplay">
          <div id="BoardLeft">
            <h2>Instructions</h2>
            <div>
              Each square, row, and column have exactly one arrangement of the numbers 1-9.  Duplicate numbers are not
              allowed within the same square, row, or column.
            </div>
            <div>
              Squares which are filled in by default cannot be changed and are marked with a dark blue color.
            </div>
            <div>
              To input a number, select the appropriate input button below the board.  Then, click on the square you'd like to input it in.
            </div>
            <div>
              Incorrect entries will count against you.  Getting 3 errors will reset the board.
            </div>
          </div>
            <div id="Board">
              {
                // Generates each 3x3 sub-board, which contains the actual buttons
                Object.keys(this.state).map(subBoard => {
                  if (!isNaN(subBoard)){
                    return <SubBoard  subBoardData = { this.state[subBoard] } 
                                      parent = { this } 
                                      key = { `SubBoard${subBoard}` }
                                      id = { subBoard } />
                  }
                })
              }
            </div>
            <div id="BoardRight">
              <ErrorTimer errors={ this.state.errors } timer={ this.state.timer}/>
            </div>
          </div>          

          <div id="Inputs">
            {
              // gridData.map pulls each individual gridSquare from gridData.  These are the sub-grids
              // labelled 1-9.  Then, the id of each gridSquare is stored in a new inputButton at the bottom
              // This just avoids having to generate a new sequence of 1-9.
              this.gridData.map((gridSquare) => {
                return <InputButton input={gridSquare.id + 1} key={`InputButton${gridSquare.id + 1}`} board={this}/>
              })
            }
          </div>

          <div id="Options">
            <PencilButton board={this}/>
            <EraseButton board={this}/>
            <UndoButton board={this}/>
            <input className="optionButton" type="button" value="Hint"/>
          </div>

        </div>
      </div>
    );
  }
}

/**
 * React component for the Undo button.  This button did not need its own class.
 * @param {*} props   Props expects props.board to exist, which is the parent board
 * @returns           Typescript formatting of the undo button
 */
function UndoButton(props){
  const [pressed, setPressed] = useState(false);

  const handleMouseDown = () => {
    setPressed(true);
  };

  const handleMouseUp = () => {
    setPressed(false);
    props.board.undo();
  };

  const handleMouseOut = () => {
    setPressed(false);
  }

  return <input className={pressed ? "toggledOptionButton" : "optionButton"}
                type="button" value="Undo"
                onMouseDown = {handleMouseDown} 
                onMouseUp = {handleMouseUp}
                onMouseOut = {handleMouseOut}/>
}

/**
 * Header containing the speed sudoku header at the top of the application, used on every page.
 * @returns   Typescript formatting of the Header
 */
export function AppHeader(){
  return (
    <header className="App-header">
      <div id="Title">Speed Sudoku</div>
      <h2 className="subTitle">A competitive Sudoku website!</h2>    
    </header>
  )
}

function ErrorTimer(props){
  let minutes = ~~(props.timer / 60);
  let seconds = props.timer - (minutes * 60);

  return (
    <div id="BoardRight">
      <div>
        <h2>Timer</h2>
        <div> {minutes} : {seconds}</div>
      </div>

      <div>
        <h2>Errors</h2>
        <div> { props.errors } / 3</div>
      </div>
    </div>
  );
}
