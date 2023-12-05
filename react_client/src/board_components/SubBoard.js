import React, { Component } from 'react';
import { SudokuButton } from './SudokuButton.js'


export class SubBoard extends Component{
    constructor(props){
        super();
        this.id = props.id;

        this.parentBoard = props.parent;
        this.state = {
            0 : props.subBoardData[0],
            1 : props.subBoardData[1],
            2 : props.subBoardData[2],
            3 : props.subBoardData[3],
            4 : props.subBoardData[4],
            5 : props.subBoardData[5],
            6 : props.subBoardData[6],
            7 : props.subBoardData[7],
            8 : props.subBoardData[8]
        }
    }

    updateBoard(buttonId){
        this.parentBoard.updateBoard(this.id, buttonId, false);
    }

    render(){
        return (
            <div className="gridSquare" key={`gridSquare${this.id}`}>
              {
                Object.keys(this.state).map((buttonId) => {
                    return <SudokuButton    id={`${buttonId}`} 
                                            value = {this.props.subBoardData[buttonId]} 
                                            key = {`button${buttonId}`} 
                                            board = {this}
                                            pencils = {[]}/>
                })
              }
            </div>
        )
    }
}