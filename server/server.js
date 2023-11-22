const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
const hostname = 'localhost';
const port = process.env.port || 3000;
const mongoUrl = 'mongodb://localhost/myappdb';

app.listen(port, hostname, () => console.log(`Server running on http://${hostname}:${port}`));
app.use(express.static("build"));

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

// mongo schemas
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    friends: [{ type: Schema.Types.ObjectId }],
});
var User = mongoose.model('User', userSchema);

// change to fit how to hold the puzzle
var puzzleSchema = new Schema({
    puzzle: [{ type: Schema.Types.ObjectId }],
});
var Puzzle = mongoose.model('Puzzle', puzzleSchema);

var competitiveSchema = new Schema({
    wins: Number,
    timestamp: String,
});
var Competitive = mongoose.model('Competitive', puzzleSchema);


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
