import React, { useState } from 'react';

export const Login = () => {
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

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'applications/json'
      },
      body: JSON.stringify(userCredentials)
    })
      .then(response => {
        if (response.ok) {
          window.location.href = "/play";
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

    fetch('/account/create', {
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
          console.log('Account creation failed');
        }
      })
      .catch(error => {
        console.error('Error creating account:', error);
      });
  };

  return (
    <div>
      <style>{`
        body {
          background-color: #aee9f5;
        }
      `}</style>
      <div className="login" id="loginClass">
        <h1>Log In</h1>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
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
          />
        </div>
        <button type="button" id="login" onClick={loggingIn} value="Log In">
          Login
        </button>
      </div>
      <div className="create" id="create">
        <h1>Create Account</h1>
        <div>
          <label htmlFor="createUsername">Username</label>
          <input
            type="text"
            id="createUsername"
            name="createUsername"
            value={createUsername}
            onChange={(e) => setCreateUsername(e.target.value)}
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
  );
};