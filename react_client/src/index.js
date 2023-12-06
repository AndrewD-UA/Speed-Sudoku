import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import { Board } from './Board.js';
import { Login } from './LogIn.js';
//import reportWebVitals from './reportWebVitals';

//react-scripts --openssl-legacy-provider start
const root = ReactDOM.createRoot(document.getElementById('root'));

let practiceData = "   4   6 \n5 4 3    \n7     1  \n  6 4 217\n         \n   5 24  \n  9  8   \n 2  1  56\n  63 7  1";
let practiceSudoku = processData(practiceData);

let solutionData = "831492765\n564137982\n729685134\n586943217\n241678395\n973512468\n159628374\n723419856\n846357291"
let practiceSolution = processData(solutionData);

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
    path: "/play",
    element: <Board data={ practiceSudoku } solution={ practiceSolution }/>,
  }
]);

root.render(
  <RouterProvider router = { router } />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
