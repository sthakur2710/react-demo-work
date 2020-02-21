const express = require('express');
const bodyParser = require('body-parser');
const passport = require("passport");
const Port = process.env.PORT || 5000;
const http = require("http");
var cors = require('cors')
const app = express();
  
// create express app
const dbConfig = require('./config/config')
const mongoose = require('mongoose');
app.use(bodyParser.json())
var jwt = require('jwt-simple');


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(passport.initialize());
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
 
    next();
 });
require('./routes/routes')(app)
app.use(passport.session());
app.set("jwtTokenSecret", "hiibro");

app.use(cors);
// app.use(express.static('../../redux-crud'))



// parse requests of content-type - application/json
mongoose.Promise = global.Promise;
  
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,    useUnifiedTopology: true,

}).then(() => {
    console.log("Successfully connected to the database now");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

// listen for requests
app.listen(Port, () => { 
    console.log("Server is listening on port 5000");
});