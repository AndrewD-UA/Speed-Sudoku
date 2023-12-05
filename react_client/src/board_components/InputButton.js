import React, { Component } from 'react';

export class InputButton extends Component{
    constructor(props){
        super();
        this.inputValue = props.input;
        this.parentBoard = props.board;

        this.state = {
            currentlySelected: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.parentBoard.storeInputValue(this.inputValue);
    }

    render(){
        return (
            <input  className= {this.parentBoard.state.currentlyCopied === this.inputValue ? 
                                    "toggledInputButton" : "inputButton"}
                    type="button" 
                    value={this.inputValue} 
                    onClick={this.handleClick}></input>
        )
    }
}