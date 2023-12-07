// Andrew Dennison, Christopher Reid, Scott Cober -  CSC377
// This Javascript file creates the Help pahe for game information.
//

import React, { Component } from 'react';
import { AppHeader } from './AppHeader.js';
import './css/style.css';

export class Help extends Component{
    constructor(props){
        super();

        this.state = {
            counter : 0
        }

        this.maxIncrement = 10;

        this.incrementCounter = this.incrementCounter.bind(this);
        this.decrementCounter = this.decrementCounter.bind(this);
    }

    incrementCounter(){
        if (this.state.counter === this.maxIncrement){
            return;
        }

        this.setState({
            counter: this.state.counter + 1
        })        
    }

    decrementCounter(){
        if (this.state.counter === 0){
            return;
        }

        this.setState({
            counter: this.state.counter - 1
        })
    }

    getInstructionState(){
        if (this.state.counter === 0){
            return (
                <div>We're here to help!</div>
            )
        }

        if (this.state.counter === 10){
            return (
                <div>End state!</div>
            )
        }
    }

    render(){
        return (
            <div className = "App">
                <AppHeader />
                <div className= "App-body-help">
                    <input type="button"
                            value = "<"
                            onClick= { this.decrementCounter }
                            className = "helpIncrementButton" />
                    {
                        this.getInstructionState()
                    }

                    <input type="button"
                            value = ">"
                            onClick = { this.incrementCounter }
                            className = "helpIncrementButton" />
                </div>
            </div>            
        )
    }
}