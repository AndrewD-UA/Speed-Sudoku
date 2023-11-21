/* By: Andrew Dennison and [ADD NAME IF MODIFIED]
 * Last modified: 17 NOV 23
*/

import './App.css';
import { SudokuButton as SudokuButton } from './SudokuButton.js'
import { InputButton as InputButton} from './InputButton.js'
import React, { Component } from 'react';

export class Board extends Component{

  constructor(props){
    super();

    this.gridData = [];

    for (let i = 1; i < 10; i++){
      this.gridSquare = [];
      for (let j = 0; j < 9; j++){
        this.gridSquare.push({id: j});
      }
        this.gridData.push({id: i, data: this.gridSquare});
    }

    console.log(this.gridData)
    //this.handleClick = this.handleClick.bind(this);
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

  handleClick(){
      console.log(this.id);
  }


  // This function returns a Board object, built using the gridData 2D array to be used as <Board />
  // This Board object should probably be re-written with a button sub-component built custom in React
  // However, we may be able to get away with simply storing values in the value field

  // Currently, this acts as a nested for loop to generate a gridSquare div that contains all 9 buttons inside
  render(){
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
          <div id="Board">
          {
            this.gridData.map(gridSquare => (
            <div className="gridSquare" key={`gridSquare${gridSquare.id}`}>
            {
              gridSquare.data.map(button => {
                return <SudokuButton value={button.id} key={`button${button.id}`}/>
              })
            }</div>
            ))
          }
          </div>

          <div id="Inputs">
              {
                // gridData.map pulls each individual gridSquare from gridData.  These are the sub-grids
                // labelled 1-9.  Then, the id of each gridSquare is stored in a new inputButton at the bottom
                // This just avoids having to generate a new sequence of 1-9.
                this.gridData.map((gridSquare) => {
                  //let updateMethod = "" + onClick(gridSquare.id);
                  return <InputButton input={gridSquare.id} key={gridSquare.id} />
                  //return <input className="inputButton" type="button" value={gridSquare.id} key={gridSquare.id} onClick={updateMethod}></input>
                })
              }
          </div>

          <div id="Options">
            <input className="optionButton" type="button" value="Pencil"/>
            <input className="optionButton" type="button" value="Erase"/>
            <input className="optionButton" type="button" value="Hint"/>
          </div>
          </header>
      </div>
    );
  }
}