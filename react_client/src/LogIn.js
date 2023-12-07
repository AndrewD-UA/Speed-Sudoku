import React, { useState } from 'react';
import { AppHeader } from './AppHeader.js';
import './css/style.css';
import './css/Board.css';

export function Login(props) {
  const setState = (jsonToken) => {
      window.localStorage.setItem("token", jsonToken);
  }
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [createUsername, setCreateUsername] = useState('');
  const [createPassword, setCreatePassword] = useState('');

  // Event handler for login button
  const loggingIn = () => {
    // admin login for testing
    if (loginUsername === "admin" && loginPassword === "admin") {
      window.location.href = "/play";
    }

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
        }
      })
      .catch(error => {
        console.error('Error loggin in:', error);
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
          // Additional handling if needed after account creation
        } else {
          console.log(response.statusText);
        }
      })
      .catch(error => {
        console.error('Error creating account:', error);
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
      <AppHeader />
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
        </div>
      </div>
      <h2> New to the site and need directions?  Click on the help button in the top left!</h2>
    </div>
  );
};