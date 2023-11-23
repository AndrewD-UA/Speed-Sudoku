import React, { Component } from 'react';

export class PencilButton extends Component{
    constructor(props){
        super();

        this.state = {
            pencilMode : false
        };

        this.parentBoard = props.board;
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    togglePencilMode(){
        if (this.state.pencilMode === false){
            this.setState({
                pencilMode: true
            });
        } else {
            this.setState({
                pencilMode: false
            });
        }
    }

    handleMouseDown(){
        this.held = true;
        this.togglePencilMode();
        console.log("clicked");
    }

    handleMouseOut(){
        if (this.state.pencilMode === true && this.held === true){
            this.togglePencilMode();
        }

        this.held = false;
    }

    handleMouseUp(){
        this.held = false;
    }

    render(){
        return (
            <input  className={this.state.pencilMode ? "toggledOptionButton" : "optionButton"} 
                    type="button" value="Pencil"
                    onClick={this.handleClick}
                    onMouseDown={this.handleMouseDown}
                    onMouseOut={this.handleMouseOut}
                    onMouseUp={this.handleMouseUp}/>
        )
    }
}