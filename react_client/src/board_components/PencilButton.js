import React, { Component } from 'react';

export class PencilButton extends Component{
    constructor(props){
        super();

        this.state = {
            eraseMode : false
        };

        this.parentBoard = props.board;
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        console.log("clicked");
    }

    render(){
        return (
            <input className="optionButton" type="button" value="Pencil"/>
        )
    }
}