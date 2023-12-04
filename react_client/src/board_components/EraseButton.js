import React, { Component } from 'react';

export class EraseButton extends Component{
    constructor(props){
        super();

        this.state = {
            eraseMode : false
        };

        this.held = false;
        this.parentBoard = props.board;
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    toggleEraseMode(){
        if (this.state.eraseMode === false){
            this.parentBoard.storeInputValue(" ");
            this.setState({
                eraseMode: true
            });
        } else {
            this.setState({
                eraseMode: false
            });
        }
    }

    handleMouseDown(){
        this.held = true;
        this.toggleEraseMode();
    }

    handleMouseOut(){
        if (this.state.eraseMode === true && this.held === true){
            this.toggleEraseMode();
        }

        this.held = false;
    }

    handleMouseUp(){
        this.held = false;
    }

    render(){
        return (
            <input  className={this.state.eraseMode ? "toggledOptionButton" : "optionButton"} 
                    id="eraseButton" type="button" value="Erase" 
                    onClick={this.handleClick}
                    onMouseDown={this.handleMouseDown}
                    onMouseOut={this.handleMouseOut}
                    onMouseUp={this.handleMouseUp}/>
        )
    }
}