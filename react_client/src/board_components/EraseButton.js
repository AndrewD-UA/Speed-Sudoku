import React, { Component } from 'react';

export class EraseButton extends Component{
    constructor(props){
        super();

        this.state = {
            eraseMode : false
        };

        this.held = false;
        this.parentBoard = props.board;
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    toggleEraseMode(){
        if (this.state.eraseMode === false){
            this.parentBoard.storeInputValue(" ");
        }

        this.setState({
            eraseMode: !this.state.eraseMode
        })
    }

    handleMouseUp(){
        this.toggleEraseMode();
    }

    render(){
        return (
            <input  className={ this.state.eraseMode &&
                                this.parentBoard.state.currentlyCopied === " " ? 
                                    "toggledOptionButton" : "optionButton"} 
                    id="eraseButton" type="button" value="Erase" 
                    onClick={this.handleClick}
                    onMouseDown={this.handleMouseDown}
                    onMouseOut={this.handleMouseOut}
                    onMouseUp={this.handleMouseUp}/>
        )
    }
}