'use strict';
// ================================================================
// get all the tools we need
// ================================================================
var express = require('express');
var routes = require('./routes/index.js');
var port = process.env.PORT || 3000;
var app = express();


var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var firebase = require("firebase");
// ================================================================
// setup our express application
// ================================================================
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.static('public'));
app.set('view engine', 'ejs');
// ================================================================
// setup routes
// ================================================================
routes(app);
// ================================================================
// start our server
// ================================================================
var env = process.env.NODE_ENV || 'development';
console.log(env);
var config = require('../config')[env];

var mysql      = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 25,
  waitForConnections: true,
  queueLimit: 0,
  host     : config.database.host,
  port: config.server.port,
  user     : config.database.user,
  password : config.database.pass,
  dateStrings:true,
  database : config.database.db,
  insecureAuth: true
});


app.listen(port, function() {
 console.log('Server listening on port ' + port + '…');
});