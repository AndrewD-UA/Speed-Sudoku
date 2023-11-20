const mongoose = require('mongoose');
const express = require('express')
//const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const app = express()
const hostname = 'localhost';
const port = 5000;
const mongoUrl = 'mongodb://localhost/myappdb';
//app.use(express.static('public_html'));
app.use(bodyParser.json());

//mongodb setup
try {
    mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
}
const dbConnection = mongoose.connection;
dbConnection.once("open", (_) => {
    console.log(`Database connected: ${mongoUrl}`);
});
dbConnection.on("error", (err) => {
    console.error(`connection error: ${err}`);
});


//session management
let sessions = {};

/* Addes a new user session */
function addSession(username) {
  let now = Date.now();  
  let sessID  = Math.floor(Math.random() * 1000000000);
    sessions[username] = {id: sessID, time: now};
    return sessID;
}

/* Removes inactive cookie sessions */
function removeSessions() {
  let now = Date.now();
  let usernames = Object.keys(sessions);

  for (let i = 0; i < usernames.length; i++) {
    let last = sessions[usernames[i]].time;

    // 5 minutes
    const sessionTimeout = 5 * (60 * 1000);

    if (last + sessionTimeout < now) {
      delete session[usernames[i]];
    }
  }
}

/* Helper funciton to record active login sessions via console. */
function logSessions() {
  console.log(sessions);
  console.log()
}

setInterval(removeSessions, 1000);
setInterval(logSessions, 15000);

