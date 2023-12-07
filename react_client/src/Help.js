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
                <div className="helpHolder">
                    <img src={require("./img/help/1.jpg")} alt="A screenshot of the sudoku website"
                    width="50%" height="50%" className="helpPicture"/>
                    <div className="helpText">We're here to help!  On this help page, use the arrows on
                    either side to navigate.  You can't scroll past the images, so don't worry!</div>
                    <div className="helpText">This is your login page.  As you can see, there are two functions,
                    logging in and creating an account.  To create an account, type in your desired username and password.
                    You'll be alerted if the username is already taken, so be creative!</div>
                    <div className="helpText">Once you've made your account, log into the account on the left and get started!</div>
                </div>
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