// Andrew Dennison, Christopher Reid, Scott Cober -  CSC377
// This Javascript file is the main file for the client side code.
// It connects to the server and renders the board and login pages.
//

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './css/index.css';
import { BoardParams } from './Board.js';
import { Login } from './Login.js';
import { Account } from './Account.js';
import { Help } from './Help.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Router contains pathing to each page
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

root.render(
    <RouterProvider router = { router } />
);
