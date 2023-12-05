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

    toggleUsageMode(){
        this.setState({
            currentlySelected: !this.state.currentlySelected
        });
    }

    handleClick(){
        this.parentBoard.storeInputValue(this.inputValue);
        this.toggleUsageMode();
    }

    render(){
        return (
            <input  className= {this.state.currentlySelected && 
                                this.parentBoard.state.currentlyCopied === this.inputValue ? 
                                    "toggledInputButton" : "inputButton"}
                    type="button" 
                    value={this.inputValue} 
                    onClick={this.handleClick}></input>
        )
    }
}