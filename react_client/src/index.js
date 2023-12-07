// Andrew Dennison, Christopher Reid, Scott Cober -  CSC377
// This Javascript file is the main file for the client side code.
// It connects to the server and renders the board and login pages.
//

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './css/index.css';
import { BoardParams } from './Board.js';
import { Login } from './LogIn.js';
import { Account } from './Account.js';
import { Help } from './Help.js';
//import reportWebVitals from './reportWebVitals';

//react-scripts --openssl-legacy-provider start
const root = ReactDOM.createRoot(document.getElementById('root'));

let practiceData = "   4   6 \n5 4 3    \n7     1  \n  6 4 217\n         \n   5 24  \n  9  8   \n 2  1  56\n  63 7  1";
let practiceSudoku = processData(practiceData);

let solutionData = "831492765\n564137982\n729685134\n586943217\n241678395\n973512468\n159628374\n723419856\n846357291"
let practiceSolution = processData(solutionData);

setTimeout(checkAuth(), 60000);

function processData(inputData){
  let rawData = inputData.split("\n");
  let gridData = [];
  for (let i = 0; i < 9; i++){
    let gridSquare = [];
    for (let j = 0; j < 9; j++){
      gridSquare.push(rawData[i].substring(j, j+1));
    }

    gridData.push({id: i, data: gridSquare});
  }
  return gridData;
}

const router = createBrowserRouter([  
  {
    path: "/",
    element: <Login />
  },

  {
    path: "/play/:id",
    element:  <BoardParams />
                    
  },

  {
    path: "/account",
    element:  <Account />
  },

  {
    path: "/help",
    element: <Help />
  }
]);

function checkAuth(token){
  /*console.log(token);

  fetch(`http://localhost:3000/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(token)
  }).then(response => {
    return response.text();
  }).then(text => {
    console.log(text);
  })*/
}

root.render(
    <RouterProvider router = { router } />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
