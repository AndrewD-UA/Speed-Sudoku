// Andrew Dennison, Christopher Reid, Scott Cober -  CSC377
// This Javascript file is the client side code for creating the sudoku board with all its different
// functionalities.
// 

import './css/Board.css';
import { InputButton } from './board_components/InputButton.js'
import { EraseButton } from './board_components/EraseButton.js'
import { PencilButton } from './board_components/PencilButton.js'
import { SubBoard } from './board_components/SubBoard.js'
import { AppHeader } from './AppHeader.js'
import React, { Component, useState } from 'react';
import { useParams } from "react-router-dom";
import { ipAddress } from './index.js';

export function BoardParams(){
  return <Board params= {useParams()}/>
}

// The inital state of the Board component
const initialState = {
  0 :   [],
  1 :   [],
  2 :   [],
  3 :   [],
  4 :   [],
  5 :   [],
  6 :   [],
  7 :   [],
  8 :   [],
  pencil0: [[], [], [], [], [], [], [], [], []],
  pencil1: [[], [], [], [], [], [], [], [], []],
  pencil2: [[], [], [], [], [], [], [], [], []],
  pencil3: [[], [], [], [], [], [], [], [], []],
  pencil4: [[], [], [], [], [], [], [], [], []],
  pencil5: [[], [], [], [], [], [], [], [], []],
  pencil6: [[], [], [], [], [], [], [], [], []],
  pencil7: [[], [], [], [], [], [], [], [], []],
  pencil8: [[], [], [], [], [], [], [], [], []],
  currentlyCopied : -1,
  errors: 0,
  timer: 0,
  pencilMode: false,
  win: false,
  loaded: false,
  bestTimes: []
}

class Board extends Component{

  constructor(props){
    super(props);
    if (window.localStorage.getItem("token") === "undefined"){
      window.location.href = "/";
    }

    const { id } = props.params;
    this.id = id;
    this.state = JSON.parse(JSON.stringify((initialState)));

    this.loadBoard();
  }

  loadBoard(){
    fetch(`${ipAddress}/get/board/${this.id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }}).then((results) => {
        return results.json();
      }).then((result) => {
        if (window.localStorage.getItem("token") === null){
            window.location.href = "/";
        }

        this.gridData = result.puzzle;
        this.solution = result.solution;

        this.setState({
          0 :   this.gridData[0].data,
          1 :   this.gridData[1].data,
          2 :   this.gridData[2].data,
          3 :   this.gridData[3].data,
          4 :   this.gridData[4].data,
          5 :   this.gridData[5].data,
          6 :   this.gridData[6].data,
          7 :   this.gridData[7].data,
          8 :   this.gridData[8].data,
        })

        this.moves = [];
        let encodeId = encodeURIComponent(this.id)
        fetch(`${ipAddress}/get/wins/${encodeId}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          },
        }).then((results) => {
          return results.json();
        }).then((resultJson) => {
          this.setState({
            loaded: true,
            bestTimes: resultJson
          });

          this.timerID = setInterval(() =>{
            if (this.state.errors < 3 && !this.state.win){
              this.setState({
                timer: this.state.timer + 1
              })
            }
          }, 1000);
        })

        this.currentlyCopied = -1;
        document.addEventListener("keydown", this.handleKeyDown.bind(this))
      })
  }

  handleKeyDown(event){
    if (!isNaN(parseInt(event.key))){
      let keyPress = parseInt(event.key);
      if (keyPress > 0){
        this.storeInputValue(keyPress);
      }
    } else if (event.key === "p"){
      this.togglePencilMode();
    }
    else if (event.key === "e"){
      console.log(this.solution);
      this.setState({
        0: this.solution[0].data,
        1: this.solution[1].data,
        2: this.solution[2].data,
        3: this.solution[3].data,
        4: this.solution[4].data,
        5: this.solution[5].data,
        6: this.solution[6].data,
        7: this.solution[7].data
      })
    }

    else if (event.key === "Escape"){
      window.location.href = '/account';
    }
  }
  /**
   * Called when the game is lost, or during intialization
   * Reset the game board to all its defaults
   */
  setDefaultState(){
    clearInterval(this.timerID);
    this.setState(JSON.parse(JSON.stringify((initialState))));
    this.loadBoard();
  }

  /**
   * Shell function to inform the board to update with the currently copied value
   * @param {Number} subBoardId Number repr of which subBoard is being updated [0-8]
   * @param {Number} buttonId   Number repr of which button in the subBoard is being updated [0-8]
   * @param {Boolean} isUndo    Boolean repr of whethere this update is an undo operation
   */
  updateBoard(subBoardId, buttonId, isUndo){
    if (this.state.pencilMode){
      return this.pencilInBoard(subBoardId, buttonId, this.state.currentlyCopied);
    }
    return this.updateBoardAll(subBoardId, buttonId, this.state.currentlyCopied, isUndo);
  }

  /**
   * Toggle whether the board is in pencil mode and marks are not counted against erros
   */
  togglePencilMode(){
    this.setState({
      pencilMode: !this.state.pencilMode
    });
  }

  /**
   * [WIP] Apply the action of penciling in a value
   * @param {*} subBoardId 
   * @param {*} buttonId 
   * @param {*} newValue 
   * @returns 
   */
  pencilInBoard(subBoardId, buttonId, newValue){
    if (!this.state.pencilMode){
      return;
    }

    if (this.state[subBoardId][buttonId] !== " "){
      return;
    }

    if (isNaN(newValue) || newValue === " "){
      return;
    }

    let tempCopy = this.state[`pencil${subBoardId}`];
    if (tempCopy[buttonId].includes(newValue)){
      return;
    }

    tempCopy[buttonId].push(newValue);
    tempCopy[buttonId].sort();
    this.setState({
      [ `pencil${subBoardId}` ]: tempCopy
    });
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
    if (newValue < 1 && newValue !== " "){
      return;
    }

    if (!this.validatePlacement(subBoardId, buttonId, newValue)){
      return false;
    }

    // Make a copy of the current array of values
    let localCopy = JSON.parse(JSON.stringify(this.state[subBoardId]));

    // If it's not an undo operation, store our set of moves for future undo operations
    if (!isUndo){
      this.moves.push({
        subBoard: subBoardId,
        button: buttonId,
        oldValue: localCopy[buttonId]
      });
    }

    // Modify our copy of the values, then set the state with it
    localCopy[buttonId] = newValue;    

    this.setState({
      [ subBoardId ] : localCopy,
      [`pencil${subBoardId}`] : [[], [], [], [], [], [], [], [], []]
    });

    // Check for win conditions once the state has updated
    setTimeout(() => {
      let win = true;
        for (let i = 0; i < 9; i++){
          for (let j = 0; j < 9; j++){
            if (this.solution[i].data[j] !== this.state[i][j]){
              win = false;
              break;
            }
          }
        }
        if (win) {
          this.setState({
            win: true,
        })
        this.storeInputValue(this.state.currentlyCopied);
        }
    }, 100)
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
    if (newValue === " "){
      return true;
    }

    if (this.solution[subBoardId].data[buttonId] === newValue){
      return true;
    }

    this.setState({
      errors : this.state.errors + 1
    });
    
    return false;
  }

  /**
   * Update the currentlyCopied state to the selection, represented by value
   * If currentlyCopied is already set to value, set to -1.  This simulates "unclicking" a button.
   * Furthermore, a value of -1 is ignored 
   * @param {*} value Value can either be a Number, or " ", which indicates erasing
   */
  storeInputValue(value){
    if (this.state.currentlyCopied === value){
      this.setState({
        currentlyCopied : -1
      })
      return;
    }

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

  renderBoard() {
    if (this.state.win){
      return (
        <div className="loseBox">
          <h2>You won after { ~~(this.state.timer / 60) } minute(s) 
            and { this.state.timer % 60 } seconds!</h2>
          <MainMenu parent= { this }/>
        </div>
      )
    } 
    
    else if (this.state.errors >= 3){
      return (
        <div className="loseBox">
          <h2>You lost after just { ~~(this.state.timer / 60) } minute(s) 
          and { this.state.timer % 60 } seconds!</h2>
          <div className="lossOptions">
            <MainMenu parent={ this }/>
            <input  value="Reset Board"
                    type="button"
                    className="lossButton"
                    onClick={this.setDefaultState.bind(this)}/>
          </div>
        </div>
      )
    }

    return (  
      <div id="Board">
        {
          // Generates each 3x3 sub-board, which contains the actual buttons
          Object.keys(this.state).map(subBoard => {
            if (!isNaN(subBoard)){
              return <SubBoard  subBoardData = { this.state[subBoard] } 
                                parent = { this } 
                                key = { `SubBoard${subBoard}` }
                                id = { subBoard }
                                pencil = { this.state[`pencil${subBoard}`]} />
            }

            return "";
          })
        }
      </div>
    )
  }

  // Determine whether to render the input buttons
  renderInputs(){
    return(<div id="Inputs">
            {
              // gridData.map pulls each individual gridSquare from gridData.  These are the sub-grids
              // labelled 1-9.  Then, the id of each gridSquare is stored in a new inputButton at the bottom
              // This just avoids having to generate a new sequence of 1-9.
              this.gridData.map((gridSquare) => {
                return <InputButton input={gridSquare.id + 1} key={`InputButton${gridSquare.id + 1}`} board={this}/>
              })
            }
            </div>
    );
  }

  // This function returns a Board object, built using the gridData 2D array to be used as <Board />
  render(){
    if (!this.state.loaded){
      return <div>Loading!</div>
    }

    let inputs;
    let options;

    if (this.state.errors < 3 && !this.state.win){
      inputs = 
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

      options = 
        <div id="Options">
              <PencilButton board={this}/>
              <EraseButton board={this}/>
              <UndoButton board={this}/>
        </div>
    }

    return (
      <div className="App">
        <AppHeader />
        <div className="App-body">
          <div className="PrimaryDisplay">
            <BestTimes parent = {this}/>
            {
              this.renderBoard()
            }
            <ErrorTimer errors={ this.state.errors } timer={ this.state.timer }/>
          </div>          
          
            { inputs }
            { options }         
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

function organizeBestTimes(bestTimeList){
  let results = [];
  for (let i = 0; i < 5; i++){
    if (i < bestTimeList.length){
      let time = bestTimeList[i].timestamp
      results.push(`${i + 1}. (${bestTimeList[i].username}) ${~~(time / 60)} : ${time % 60}`)
    } else{
      results.push(`${i + 1}.`)
    }
  }
  return results
}

function BestTimes(props){
  if (props.parent.state.loaded){
    return <div id="BoardLeft">
              <h2>Best Times</h2>
              {
                organizeBestTimes(props.parent.state.bestTimes).map(result => {
                  return <div className="bestTime" key= {result}>{result}</div>
                })
              }
            </div>
  }

  return  <div id="BoardLeft">
            <h2> Best Times</h2>
            <div>Not loaded</div>
          </div>
}

function MainMenu(props){  
  return (
    <input  value="Main Menu"
                    type="button"
                    className="lossButton"
                    onClick = {() => {
                      let username = JSON.parse(window.localStorage.getItem("token")).username;
                      if (props.parent.state.win){
                        fetch(`${ipAddress}/add/win`, {
                          method: "POST",
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            user: username,
                            time: props.parent.state.timer,
                            puzzle: props.parent.id
                          })
                        }).then(() => {
                          window.location.href = "/account"
                        })
                      } else {
                        window.location.href = "/account"
                      }
                     }}/>
  )
}
