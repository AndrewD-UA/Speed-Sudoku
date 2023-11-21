import React, { Component } from 'react';

export class SudokuButton extends Component{

    constructor(props){
        super();

        this.state = {value: props.value,
                      default: props.isDefault};
        this.handleClick = this.handleClick.bind(this);
        this.parentBoard = props.board;
    }

    handleClick(){
        let currentCopy = this.parentBoard.getStoredInput();
        if (currentCopy !== -1){
            this.setState({value: currentCopy});
        }
    }

    render(){
        return (
            <input className="gameButton" type="button" value={this.state.value} 
                   onClick={this.handleClick}></input>
        )
    }
}