// Andrew Dennison, Christopher Reid, Scott Cober -  CSC377
// This Javascript file is the client side code for the header of the app.
//

import React, { Component } from 'react';
import './css/style.css';

export class AppHeader extends Component{
    constructor(props){
        super();
    }

    render(){
        return (
            <header className="App-header">
                <div>
                <div className="Title">Speed Sudoku</div>
                <h2 className="subTitle">A competitive Sudoku website!</h2>
                </div>
                <input  type="button"
                        value="Help!"
                        onClick = {() => window.location.href = "/help" }
                        className = "help"/>     
            </header>
        )
    }
}