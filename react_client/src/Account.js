// Andrew Dennison, Christopher Reid, Scott Cober -  CSC377
// This Javascript file is the client side code for the account of the current user and its functionalities.
// 

import React, { Component } from 'react';
import { AppHeader } from './AppHeader.js';
import { ipAddress } from './index.js';
import './css/style.css'

export class Account extends Component{
    constructor(props){
        super();

        if (window.localStorage.getItem("token") === "undefined"){
            window.location.href = "/";
        }
        
        this.state = {
            loaded: false,
            data: [],
            bestTimes: []
        }
        //console.log(window.localStorage.getItem("token"));
    }

    componentDidMount(){
        fetch(ipAddress + "/get/boards", {
            method: "GET",
            "Content-Type" : "application/json"
        }).then((boards) => {
            return boards.json();
        }).then((json) => {
            this.setState({
                loaded: true,
                data: json
            })
        })
    }

    render(){
        if (!this.state.loaded){
            return (
                <div>Not loaded!</div>
            )
        }
        return (
            <div>
                <AppHeader />
                <div className = "App-body-help">
                    <div className="allBoards">
                    {
                        this.state.data.map((board) => {
                            return (
                                <div className="boardPreview" key={board._id}> 
                                    <h2>{`A ${board.name} board with a difficulty of ${board.difficulty}` } </h2>
                                    <input  type="button"
                                            value="Play Now!"
                                            onClick = {() => {window.location.href = `/play/${board._id}`}} 
                                            className = "boardButton"/>
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
            </div>
        )
    }
}