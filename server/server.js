const mongoose = require('mongoose');
const express = require('express')
//const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const app = express()
const hostname = 'localhost';
const port = 5000;
const mongoUrl = 'mongodb://localhost/myappdb';
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