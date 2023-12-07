// Andrew Dennison, Christopher Reid, Scott Cober -  CSC377
// This Javascript file holds the client side code for creating and logging in users.
// It also holds the code for the landing page of the website.
//

import React, { useState } from 'react';
import { AppHeader } from './AppHeader.js';
import './css/style.css';
import './css/Board.css';

export function Login() {
  const setState = (jsonToken) => {
      window.localStorage.setItem("token", jsonToken);
  }

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [createUsername, setCreateUsername] = useState('');
  const [createPassword, setCreatePassword] = useState('');

  const [errSignIn, setErrSignIn] = useState(false);
  const [errCreate, setErrCreate] = useState(false);

  // Event handler for login button
  const loggingIn = () => {

    const userCredentials = {
      username: loginUsername,
      password: loginPassword
    };

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userCredentials)
    })
      .then(response => {
        if (response.status === 200) {
          response.json().then((json) => {
            setState(JSON.stringify(json.token));
            window.location.href = "/account";
          })
        } else {
          console.log('Login failed');
          setErrSignIn(true);
        }
      })
      .catch(error => {
        console.error('Error loggin in:', error);
        setErrSignIn(true);
      });
  };

  // Event handler for creating new user account
  const creatingAccount = () => {
    const newUserCredentials = {
      username: createUsername,
      password: createPassword
    };

    fetch('http://localhost:3000/account/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUserCredentials)
    })
      .then(response => {
        if (response.ok) {
          console.log('Account created successfully');
          setErrCreate(false);
        } else {
          console.log(response.statusText);
          setErrCreate(true);
        }
      })
      .catch(error => {
        console.error('Error creating account:', error);
        setErrCreate(true);
      });
  };

  /**
   * Filters a given event to conduct an action
   * Primarily used to create account/login with enter key.
   * @param {KeyboardEvent} event KeyEvent logged
   * @param {Callback} action     Action to perform if it is enter
   */
  function checkIfEnter(event, action){
    if (event.code === "Enter"){
      action();
    }
  }

  return (
    <div className= "App">
      <AppHeader logout={false}/>
      <div className="imgContainer">
        <img src={require("./img/banner.gif")} alt="Glitchy Sudoku Board"/>
      </div>
      <div className="landingOptions">
        <div className="inputField" id="loginClass">
          <h1>Log In</h1>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              onKeyDown={(e => checkIfEnter(e, loggingIn))}
              className="loginInput"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyDown={(e => checkIfEnter(e, loggingIn))}
              className="loginInput"
            />
          </div>
          <button type="button" id="login" onClick={loggingIn} value="Log In">
            Login
          </button>
          {
            errSignIn ? <div className="error">Error signing in</div> : <div></div>
          }
        </div>
        <div className="inputField" id="create">
          <h1>Create Account</h1>
          <div>
            <label htmlFor="createUsername">Username</label>
            <input
              type="text"
              id="createUsername"
              name="createUsername"
              value={createUsername}
              onChange={(e) => setCreateUsername(e.target.value)}
              onKeyDown={(e => checkIfEnter(e, creatingAccount))}
              className="loginInput"
            />
          </div>
          <div>
            <label htmlFor="createPassword">Password</label>
            <input
              type="password"
              id="createPassword"
              name="createPassword"
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
              onKeyDown={(e => checkIfEnter(e, creatingAccount))}
              className="loginInput"
            />
          </div>
          <button
            type="button"
            id="addUser"
            onClick={creatingAccount}
            value="Add User"
          >
            Create
          </button>
          {
            errCreate ? <div className="error">Username already taken!</div> : <div></div>
          }
        </div>
      </div>
      <h2> New to the site and need directions?  Click on the help button in the top left!</h2>
    </div>
  );
};