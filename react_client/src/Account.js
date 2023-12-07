import React, { Component } from 'react';
import { AppHeader } from './AppHeader.js';
import Cookies from 'universal-cookie';

export class Account extends Component{
    constructor(props){
        super();

        if (window.localStorage.getItem("token") === "undefined"){
            window.location.href = "/";
        }

        console.log(window.localStorage.getItem("token"));
    }

    render(){
        return (
            <AppHeader />
        )
    }
}