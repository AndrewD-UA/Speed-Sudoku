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

        this.maxIncrement = 9;

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

        if (this.state.counter === 1){
            return (
                <div className="helpHolder">
                    <img src={require("./img/help/2.jpg")} alt="A screenshot of the sudoku website"
                    width="50%" height="50%" className="helpPicture"/>
                    <div className="helpText">Once you're logged in, you'll see a screen like this.  This is your account page.</div>
                    <div className="helpText">You should see a list of puzzles in the center, which can be scrolled through.  Don't worry, there's more than one!</div>
                    <div className="helpText">Once you've picked out a puzzle, hit play now on it to start!</div>
                </div>
            )
        }

        if (this.state.counter === 2){
            return (
                <div className="helpHolder">
                    <img src={require("./img/help/3.jpg")} alt="A screenshot of the sudoku website"
                    width="50%" height="50%" className="helpPicture"/>
                    <div className="helpText">Also, notice the log out button in the top right.  You can hit this at any time to leave!</div>
                </div>
            )
        }

        if (this.state.counter === 3){
            return (
                <div className="helpHolder">
                    <img src={require("./img/help/4.jpg")} alt="A screenshot of the sudoku website"
                    width="50%" height="50%" className="helpPicture"/>
                    <div className="helpText">This is where the magic happens.  As soon as your webpage loads,
                    your timer starts, so move quick!</div>
                    <div className="helpText">To play the game, either click on an input button (1-9) at the bottom,
                    or select any number 1-9 on your keyboard.  Then, click on the square you'd like to place that
                    number in.</div>
                    <div className="helpText">Normal sudoku rules apply here.  You cannot place any one number more than once
                    in any row, column, or square.  Be careful, because errors count against you!</div>
                </div>
            )
        }

        if (this.state.counter === 4){
            return (
                <div className="helpHolder">
                    <img src={require("./img/help/5.jpg")} alt="A screenshot of the sudoku website"
                    width="50%" height="50%" className="helpPicture"/>
                    <div className="helpText">Don't forget, you can log out at any time and your progress will not be saved.</div>
                </div>
            )
        }

        if (this.state.counter === 5){
            return (
                <div className="helpHolder">
                    <img src={require("./img/help/6.jpg")} alt="A screenshot of the sudoku website"
                    width="50%" height="50%" className="helpPicture"/>
                    <div className="helpText">That previously mentioned timer, and the error counter, are on
                    the right side of the screen.</div>  
                    <div className="helpText">Your timer is in minute : second format, and stops as soon as you win.</div>             
                    <div className="helpText">If you get three errors, you'll be given the option to either quit or restart!</div>
                </div>
            )
        }

        if (this.state.counter === 6){
            return (
                <div className="helpHolder">
                    <img src={require("./img/help/7.jpg")} alt="A screenshot of the sudoku website"
                    width="50%" height="50%" className="helpPicture"/>
                    <div className="helpText">The aforementioned input buttons are at the bottom.</div>
                    <div className="helpText">Additionally, you have three modes: Pencil, erase, and undo modes.</div>
                    <div className="helpText">Pencil mode allows you to place up to 9 marks in any square without penalty.
                    These marks do not count towards your completion, but to assist with your strategy.</div>
                    <div className="helpText">Erase mode will remove whatever you've placed in a square.</div>
                    <div className="helpText">Lastly, undo will undo your last moves, all the way back to the beginning!</div>                
                </div>
            )
        }

        if (this.state.counter === 7){
            return (
                <div className="helpHolder">
                    <img src={require("./img/help/8.jpg")} alt="A screenshot of the sudoku website"
                    width="50%" height="50%" className="helpPicture"/>
                    <div className="helpText">Although it's a little lonely now, the leaderboards are on the left.
                    Once more people play, these leaderboards will fill up with players names and times!</div>                
                </div>
            )
        }

        if (this.state.counter === 8){
            return (
                <div className="helpHolder">
                    <img src={require("./img/help/9.jpg")} alt="A screenshot of the sudoku website"
                    width="50%" height="50%" className="helpPicture"/>
                    <div className="helpText">So you've won your first game!  Congrats!  Select
                    Main Menu to be taking back to your account page, and submit your time!</div>                
                </div>
            )
        }

        if (this.state.counter === 9){
            return (
                <div className="helpHolder">
                    <img src={require("./img/help/10.jpg")} alt="A screenshot of the sudoku website"
                    width="50%" height="50%" className="helpPicture"/>
                    <div className="helpText">Hopefully, you don't spend too much time here on the loss page.
                    This page will occur when you reach three errors.  Don't worry though, try again by hitting
                    reset board!  If you've picked too challenging a puzzle, go back to the main menu and pick another.</div>
                </div>
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
                <input type="button"
                        value="Main Menu"
                        className="helpMainMenu"
                        onClick={()=> window.location.href="/account"}/>
            </div>            
        )
    }
}