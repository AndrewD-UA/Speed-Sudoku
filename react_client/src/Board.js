/* By: Andrew Dennison and [ADD NAME IF MODIFIED]
 * Last modified: 17 NOV 23
*/

import './Board.css';
import { SudokuButton } from './board_components/SudokuButton.js'
import { InputButton } from './board_components/InputButton.js'
import { EraseButton } from './board_components/EraseButton.js'
import { PencilButton } from './board_components/PencilButton.js'
import React, { Component, useState } from 'react';

export class Board extends Component{

  constructor(props){
    super();

    this.gridData = props.data;
    this.moves = [];
    this.lastMove = "No last move";

    this.currentlyCopied = -1;
  }

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

  erase(){
    console.log(this.state.eraseMode);
    if (this.state.eraseMode === false){
      this.setState({
        eraseMode: true
      });
    } else{
      this.setState({
        eraseMode: false
      })
    }

    console.log(this.state.eraseMode);
    this.currentlyCopied = "";
  }

  storeInputValue(value){
    this.currentlyCopied = value;
  }

  getStoredInput(){
    return this.currentlyCopied;
  }

  undo(){
    if (this.moves.length === 0){
      return "Cannot undo";
    }

    this.lastMove = this.moves.pop();
    this.lastMove.button.updateValue(this.lastMove.oldValue);
    return "Undo successful";
  }

  checkIfValid(coordinates){
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
  }

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
        <header className="App-header">
          <div id="Title">Sudoku</div> 
          <div id="Board">{

            // This double nested mapping generates the Sudoku board
            this.gridData.map(gridSquare => {
              return <div className="gridSquare" key={`gridSquare${gridSquare.id}`}>
              {
                gridSquare.data.map((button) => {
                  return <SudokuButton id={`${gridSquare.id}${button.id}`} value={button.value} key={`button${button.id}`} board = {this}/>
                })
              }</div>
            })
          }</div>

          <div id="Inputs">
              {
                // gridData.map pulls each individual gridSquare from gridData.  These are the sub-grids
                // labelled 1-9.  Then, the id of each gridSquare is stored in a new inputButton at the bottom
                // This just avoids having to generate a new sequence of 1-9.
                this.gridData.map((gridSquare) => {
                  return <InputButton input={gridSquare.id} key={gridSquare.id} board={this}/>
                })
              }
          </div>

          <div id="Options">
            <PencilButton board={this}/>
            <EraseButton board={this}/>
            <UndoButton board={this}/>
            <input className="optionButton" type="button" value="Hint"/>
          </div>
          </header>
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
