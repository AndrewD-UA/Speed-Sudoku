const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const path = require('path');
const bp = require('body-parser');

const app = express();

const cors = require('cors');
const crypto = require('crypto');

const hostname = '127.0.0.1';
const port = 3000;
const mongoUrl = 'mongodb://127.0.0.1:27017/Speed-Sudoku';

app.listen(port, hostname, () => console.log(`Server running on http://${hostname}:${port}`));
app.use(cors({
    exposedHeaders: ['Origin, X-Requested-With, Content-Type, Accept']
}));
app.use(bp.json());

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
  hash: String,
  salt: String,
  friends: [{ type: Schema.Types.ObjectId }],
});
var User = mongoose.model('User', userSchema);

// change to fit how to hold the puzzle
var puzzleSchema = new Schema({
  puzzle:   [{id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []}], 
  solution: [{id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []},
            {id: Number, data: []}],
  difficulty: String,
  name: String
});
var Puzzle = mongoose.model('Puzzle', puzzleSchema);

var leaderboardSchema = new Schema({
  username: String,
  timestamp: String,
  boardId: String
});
var Leaderboard = mongoose.model('Leaderboard', puzzleSchema);


//session management
let sessions = {};

/* Addes a new user session */
function addSession(username) {
  let now = Date.now();
  let sessID = Math.floor(Math.random() * 1000000000);
  sessions[username] = { id: sessID, time: now };
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
      delete sessions[usernames[i]];
    }
  }
}

/* Helper funciton to record active login sessions via console. */
function logSessions() {
  console.log(sessions);
  console.log()
}

/**
 * Loads all puzzles in board_storage, then stores it in the corresponding mongoDB schema
 */
function loadPuzzles(){
  const storePath = "./board_storage/";
  fs.readdir(storePath, (error, files) => {                       // Read the directory
    Puzzle.find({}).exec().then((puzzles) => {
      if (files.length === puzzles.length){
        console.log("we already loaded all files");
        return;
      }

      files.forEach(file => {                                       // Get the name of each file in the directory
        fs.readFile(storePath + file, 'utf8', (err, data) => {      // Open each file
          let splitData = data.split(",")
          let puzzle = splitData[0].trim().split("\n");
          let solution = splitData[1].trim().split("\n");
          let difficulty = splitData[2].trim();
          let name = splitData[3].trim();
  
          let currentPuzzleData = [];                               // This stores the initial state of the puzzle
          let currentPuzzleSolution = [];                           // This stores the solution of the puzzle
  
          let counter = 0;
          puzzle.forEach((line) => {                                // For each line in the initial state
            let puzzleData = {                                      // Keep this format per the processing of board.js
                id : counter,
                data: []
            }
  
            let chars = [...line.trim()]                            // Split this line into chars, then
            chars.forEach((char) => {                               // for each char,
              if (char === "0"){                                    // process it appropriately.
                puzzleData.data.push(" ");
              } else{
                puzzleData.data.push(parseInt(char));
              }
            });
  
            counter++;
            currentPuzzleData.push(puzzleData);                     // Add it to the initial state Array
          });
  
          counter = 0;
          solution.forEach((line) => {                              // Repeat this process for the solution
            let puzzleData = {
                id : counter,
                data: []
            }
  
            let chars = [...line.trim()]
            chars.forEach((char) => {
              puzzleData.data.push(parseInt(char));                  // There will be no empty spaces in the solution
            });
            
            counter++;
  
            currentPuzzleSolution.push(puzzleData);
          });
  
          let newPuzzle = new Puzzle({
            puzzle: currentPuzzleData,
            solution: currentPuzzleSolution,
            difficulty: difficulty,
            name: name
          });
  
          newPuzzle.save();
        });                                                          // End readfile
      });                                                            // End forEach file
    })
    
  });                                                              // End readdir
}

setInterval(removeSessions, 1000);
setInterval(logSessions, 15000);

function authenticate(req, res, next) {
  let c = req.cookies;
  console.log('auth request:');
  console.log(req.cookies.login);
  if (c !== undefined) {
    if (sessions[c.speedsudoku.username] != undefined &&
      sessions[c.speedsudoku.username].id == c.login.sessionID) {
      next();
    } else {
      res.redirect('/index.html');
    }
  } else {
    res.redirect('/index.html');
  }
}

//app.use('/app/*', authenticate);
app.get('/app/*', (req, res, next) => {
  console.log('another');
  next();
});

app.post('/authenticate', (req, res) => {
  console.log("Authenticate received");
  c = req.body;
  response = "false";

  console.log(c);
  if (c != undefined){
    console.log(c);
    if (sessions[c.username] != undefined &&
      sessions[c.username].id == c.sid) {
        response = "true";
        console.log("authenticated");
      }
  }

  res.end(response);
})

// Get all boards for account
app.get('/get/boards', (req, res) => {
   let allPuzzles = Puzzle.find({}).exec();

   allPuzzles.then((puzzles) => {
    console.log(puzzles);
    res.json(puzzles);
   })
});

app.post('/add/win', (req, res) => {
  let newLb = Leaderboard.create({
    username: req.body.username,
    timestamp: req.body.time,
    boardId: req.body.puzzle
  })

  newLb.save();
})

app.get('/get/wins/:id', (req, res) => {
  console.log("looking for IDs");
  let id = decodeURIComponent(req.params.id)
  let getWins = Leaderboard.find({boardId: {$regex: id}}).exec();

  getWins.then((wins) => {
    res.json(wins);
  })
})
// Login to account
app.post('/login', function (req, res) {
  const { username, password } = req.body;

  User.findOne({ username: username })
    .then(user => {
      if (user) {        
        let toHash = password + user.salt;
        let h = crypto.createHash('sha3-256');
        let data = h.update(toHash, 'utf-8');
        let result = data.digest('hex');
        
        if (result !== user.hash){
          console.log("Incorrect password");
          return;
        }

        console.log("Successful authentication");
        let sid = addSession(username);
        
        res.json({
          success: true,
          token: {
            app: "speed-sudoku",
            username: username,
            sid: sid
          }
        });
      } else {
        console.log("no user found");
        res.json({ success: false });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    });
});

/* Responds to new user creation requests.  */
app.post('/account/create', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Both username and password are required' });
  }

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ username }).exec();
    console.log(existingUser);
    if (existingUser) {
      return res.status(409).json({ error: 'Username is already taken' });
    }

    // The assumption now is the user can validly be added

    // Salt and Hash password
    let newSalt = '' + Math.floor(Math.random() * 10000000000);
    let toHash = password + newSalt;
    let h = crypto.createHash('sha3-256');
    let data = h.update(toHash, 'utf-8');
    let result = data.digest('hex');

    // If the username is not taken, create the new user
    const user = await User.create({ 
      username: username, 
      hash: result,
      salt: newSalt,
      friends: []
    });

    console.log('NEW USER SUCCESS');
    console.log();
    res.status(201).json(user);
  }

  catch (error) {
    console.log('Failed user creation.');
    console.log();
    res.status(500).json({ error: 'User creation failed' });
  }
});

loadPuzzles();