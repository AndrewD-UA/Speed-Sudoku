import React, { Component } from 'react';
import { AppHeader } from './AppHeader.js'
import { Login } from './Login.js'

export class RequireAuth extends Component{
    constructor(props){
        super();

        this.state = {
            auth: false,
            token: {}
        }

        this.setAuth = this.setAuth.bind(this);
    }

    setAuth(token) {
        this.setState({
            auth: true,
            token: token
        })
    }

    render(){ 
        console.log(this.state.auth);
        if (!this.state.auth) {
            return <Login setAuth={ this.setAuth }/>
        }

        return this.props.intent;
        
    }
}