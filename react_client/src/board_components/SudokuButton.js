import React, { Component } from 'react';

export class SudokuButton extends Component{

    constructor(props){
        super();

        this.state = {value: props.value,
                      default: props.isDefault};
        this.handleClick = this.handleClick.bind(this);
        this.parentBoard = props.board;
        this.boardLocation = props.id;
    }

    handleClick(){
        let currentCopy = this.parentBoard.getStoredInput();
        if (currentCopy !== -1){
            if (this.parentBoard.checkIfValid(this.boardLocation)){
                this.parentBoard.moves.push({button: this, oldValue: this.state.value});
                this.updateValue(currentCopy);
            } else {
                
            }
        }
    }

    updateValue(newValue){
        this.setState({value: newValue});
    }

    render(){
        return (
            <input className="gameButton" type="button" value={this.state.value} 
                   onClick={this.handleClick} id = {this.boardLocation}></input>
        )
    }
}