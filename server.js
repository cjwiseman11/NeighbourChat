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
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyA1T7ZFvQQlEDq1Tc6qhTBLy7ICAjrHUbw'
});

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

//--- Calls ---\\

app.get('/getNearbyPlaces', function(req, res) {
  // Geocode an address.
  googleMapsClient.geocode({
    address: 'RG415EE'
  }, function(err, response) {
    if (!err) {
      res.send(response.json.results);
    }
  });
});

app.get('/getNearbyPlaces', function(req, res) {
  // Geocode an address.
  googleMapsClient.geocode({
    address: 'RG415EE'
  }, function(err, response) {
    if (!err) {
      res.send(response.json.results);
    }
  });
});