import React, { Component } from 'react';

export class SudokuButton extends Component{
    constructor(props){
        super();

        this.defaultValue = props.value;
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        console.log(this.id);
    }

    render(){
        return (
            <input className="gameButton" type="button" value={this.defaultValue} onClick={this.handleClick}></input>
        )
    }
}