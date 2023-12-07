import React, { Component } from 'react';
import { AppHeader } from './AppHeader.js';

export class Account extends Component{
    constructor(props){
        super();

        if (window.localStorage.getItem("token") === "undefined"){
            window.location.href = "/";
        }

        console.log(window.localStorage.getItem("token"));
    }

    getBoards(){

    }

    render(){
        return (
            <div>
                <AppHeader />
                <div className = "App-body">


                </div>
            </div>
        )
    }
}