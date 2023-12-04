/* By: Andrew Dennison and [ADD NAME IF MODIFIED]
 * Last modified: 17 NOV 23
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
        8 :   this.gridData[8].data
    }

    this.currentlyCopied = -1;
  }
  updateBoard(subBoardId, buttonId, isUndo){
    this.updateBoardAll(subBoardId, buttonId, this.currentlyCopied, isUndo);
  }

  updateBoardAll(subBoardId, buttonId, newValue, isUndo){
    if (newValue < 1 && newValue != " "){
      return;
    }

    let localCopy = [...this.state[subBoardId]]

    if (!isUndo){
      this.moves.push({
        subBoard: subBoardId,
        button: buttonId,
        oldValue: localCopy[buttonId]
      });
    }

    localCopy[buttonId] = newValue.toString();    
    this.setState({
      [subBoardId ] : localCopy
    })
  }

  storeInputValue(value){
    this.currentlyCopied = value;
  }

  undo(){
    if (this.moves.length === 0){
      return;
    }

    let lastMove = this.moves.pop();
    console.log(lastMove);
    this.updateBoardAll(lastMove.subBoard, lastMove.button, lastMove.oldValue, true)
  }

  /*checkIfValid(coordinates){
    let gridSquare = parseInt(coordinates.substring(0, 1));
    let subGrid = parseInt(coordinates.substring(1, 2));

    let checkSquare = subGrid;
    if (checkSquare % 3 === 0){
      checkSquare += 1;
    }

    if (checkSquare % 2 === 0){
      checkSquare -= 1;
    }

    // Horizontal checks
    for (let i = gridSquare - 1; i < gridSquare + 2; i++){
      if (i > 8){
        i -= 9;
      }

      for (let j = checkSquare - 1; j < checkSquare + 2; j++){
        if (j > 8){
          j -= 9;
        }

        let currentData = parseInt(this.gridData[i].data[j].value);
        if (currentData === this.currentlyCopied){
          return false;
        }
      }
    }

    // Same square checks
    for (let i = 0; i < 9; i++){
      let currentData = parseInt(this.gridData[gridSquare].data[i].value);
      if (currentData === this.currentlyCopied){
        return false;
      }
    }

    // Vertical checks
    for (let i = 1; i < 4; i++){
      for (let j = 0; j < 3; j++){
        let currentData = parseInt(this.gridData[gridSquare].data[subGrid].value);
        if (currentData === this.currentlyCopied){
          return false;
        }

        subGrid += 3;
        if (subGrid > 8){
          subGrid -= 9;
        }
      }

      gridSquare += 3;
      if (gridSquare > 9){
        gridSquare -= 9;
      }
    }

    return true;
  }*/

  // This function returns a Board object, built using the gridData 2D array to be used as <Board />
  // This Board object should probably be re-written with a button sub-component built custom in React
  // However, we may be able to get away with simply storing values in the value field

  // Currently, this acts as a nested for loop to generate a gridSquare div that contains all 9 buttons inside
  render(){
    return (
      // The entire application is wrapped in a div and header.  Below the header:

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
        <AppHeader />
        <div className="App-body">
          <div className="PrimaryDisplay">
            <div id="BoardSide">

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
          </div>
          

          <div id="Inputs">
            {
              // gridData.map pulls each individual gridSquare from gridData.  These are the sub-grids
              // labelled 1-9.  Then, the id of each gridSquare is stored in a new inputButton at the bottom
              // This just avoids having to generate a new sequence of 1-9.
              this.gridData.map((gridSquare) => {
                return <InputButton input={gridSquare.id} key={`InputButton${gridSquare.id}`} board={this}/>
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

export function AppHeader(){
  return (
    <header className="App-header">
      <div id="Title">Speed Sudoku</div>
      <h2 className="subTitle">A competitive Sudoku website!</h2>    
    </header>
  )
}
