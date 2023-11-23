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
        if (this.state.currentlySelected === false){
            this.setState({
                currentlySelected: true
            });
        } else {
            this.setState({
                currentlySelected: false
            });
        }
    }

    handleClick(){
        this.parentBoard.storeInputValue(this.inputValue);
        this.toggleUsageMode();
    }

    render(){
        return (
            <input  className= {this.state.currentlySelected ? "toggledInputButton" : "inputButton"}
                    type="button" value={this.inputValue} onClick={this.handleClick}></input>
        )
    }
}