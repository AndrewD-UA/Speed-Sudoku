import React, { Component } from 'react';

export class SudokuButton extends Component{

    constructor(props){
        super();

        this.isDefault = false;
        if (props.value !== " "){
            this.isDefault = true;
        }

        this.id = props.id;              
        this.handleClick = this.handleClick.bind(this);
        this.parentBoard = props.board;
        this.boardLocation = props.id;
    }

    handleClick(){
        if (this.isDefault){
            return;
        }

        this.parentBoard.updateBoard(this.id);
    }

    render(){
        return (
            <input  className= { this.isDefault ? "defaultButton" : "gameButton" } 
                    type="button" 
                    value={this.props.value}
                    onClick={this.handleClick} 
                    id = {this.boardLocation}>
            </input>
        )
    }
}