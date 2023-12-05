import React, { useState } from 'react';

export const Login = () => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [createUsername, setCreateUsername] = useState('');
  const [createPassword, setCreatePassword] = useState('');

  // Event handler for login button
  const loggingIn = () => {
    // connect to user/pass database
    if (loginUsername === "admin" && loginPassword === "admin") {
      window.location.href = "/play";
    }
    console.log('Logged in');
  };

  const creatingAccount = () => {
    console.log('Created account');
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