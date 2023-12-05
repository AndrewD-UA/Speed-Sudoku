import React, { Component } from 'react';

export class PencilButton extends Component{
    constructor(props){
        super();

        this.parentBoard = props.board;
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.parentBoard.togglePencilMode();
    }

    render(){
        return (
            <input  className={this.parentBoard.state.pencilMode ? "toggledOptionButton" : "optionButton"} 
                    type="button" value="Pencil"
                    onClick={this.handleClick}/>
        )
    }
}