// Andrew Dennison, Christopher Reid, Scott Cober -  CSC377
// This Javascript file holds the server side code while authenticating and users and their data.
// It also holds the code for loading the puzzles from the board_storage folder into the mongoDB.
//

const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const path = require('path');
const bp = require('body-parser');

const app = express();

const cors = require('cors');
const crypto = require('crypto');

const hostname = 'localhost';
const port = 3000;
const mongoUrl = 'mongodb://localhost:27017/Speed-Sudoku';

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
  friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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
  boardId: String,
  solvingTime: Number
});
var Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);


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

/**
 * Loads all puzzles in board_storage, then stores it in the corresponding mongoDB schema
 */
function loadPuzzles(){
  const storePath = "./board_storage/";
  fs.readdir(storePath, (error, files) => {                       // Read the directory
    Puzzle.find({}).exec().then((puzzles) => {
      if (files.length === puzzles.length){
        console.log("We already loaded all files!");
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

// Get all boards for account
app.get('/get/boards', (req, res) => {
   let allPuzzles = Puzzle.find({}).exec();

   allPuzzles.then((puzzles) => {
    res.json(puzzles);
   })
});

// Add a new leaderboard record
app.post('/add/win', (req, res) => {
  let newLb = new Leaderboard({
    username: req.body.user,
    timestamp: req.body.time,
    boardId: req.body.puzzle
  })

  newLb.save();
  res.end();
})

// Get all leaderboard records for board with ID
app.get('/get/wins/:id', (req, res) => {
  let id = decodeURIComponent(req.params.id);
  let getWins = Leaderboard.find({boardId: {$regex: id}}).exec();

  getWins.then((wins) => {
    res.json(wins);
  })
})

// Retrieve a board with ID
app.get('/get/board/:id', (req, res) => {
  let getBoard = Puzzle.findOne({_id: req.params.id}).exec();

  getBoard.then((board) => {
    let result = {
      puzzle: board.puzzle,
      solution: board.solution
    }

    res.json(result);
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
          res.status(401).json({ success: false });
          return;
        }

        console.log("Successful authentication");
        let sid = addSession(username);
        
        res.status(401).json({
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

// Friend Search
app.get('/search/users/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const users = await User.find({ username: { $regex: username, $options: 'i' } }).select('username');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error searching for users' });
  }
});

// Send Friend Request
app.post('/send/friend/request', async (req, res) => {
  const { senderUsername, receiverUsername } = req.body;
  try {
    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'Sender or receiver not found' });
    }

    // Check if the receiver is already a friend
    if (sender.friends.includes(receiver._id)) {
      return res.status(400).json({ error: 'User is already your friend' });
    }

    // Check if a friend request is already sent
    if (sender.friendRequests.includes(receiver._id)) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    sender.friendRequests.push(receiver._id);
    await sender.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending friend request' });
  }
});

// Accept Friend Request
app.post('/accept/friend/request', async (req, res) => {
  const { username, friendUsername } = req.body;
  try {
    const user = await User.findOne({ username });
    const friend = await User.findOne({ username: friendUsername });

    if (!user || !friend) {
      return res.status(404).json({ error: 'User or friend not found' });
    }

    // Remove friend request from user's list
    user.friendRequests.pull(friend._id);
    // Add friend to user's friend list
    user.friends.push(friend._id);

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error accepting friend request' });
  }
});

// Retrieve Solving Times for Friends
app.get('/get/friend/solvingTimes/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).populate('friends');
    const friendIds = user.friends.map(friend => friend._id);

    const solvingTimes = await Leaderboard.find({ username: { $in: friendIds } })
      .select('username solvingTime')
      .sort('solvingTime')
      .exec();

    res.json(solvingTimes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving solving times for friends' });
  }
});

loadPuzzles();