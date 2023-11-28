import React, { Component } from 'react';

export class SudokuButton extends Component{

    constructor(props){
        super();

        this.state = {value: props.value,
                      default: props.isDefault};
        this.handleClick = this.handleClick.bind(this);
        this.parentBoard = props.board;
        this.boardLocation = props.id;

        this.valueRef = React.createRef();
        //setInterval(() => console.log(this.valueRef.current), 10000)
    }

    handleClick(){
        let currentCopy = this.parentBoard.getStoredInput();
        if (currentCopy !== -1){
            if (this.parentBoard.checkIfValid(this.boardLocation)){
                console.log("valid");
                this.parentBoard.moves.push({button: this, oldValue: this.state.value});
                this.updateValue(currentCopy);
            } else {
                console.log("Not valid");
            }
        }
    }

    updateValue(newValue){
        this.setState({value: newValue});
    }

    render(){
        return (
            <input className="gameButton" type="button" value={this.state.value} ref={this.valueRef}
                   onClick={this.handleClick} id = {this.boardLocation}></input>
        )
    }
}