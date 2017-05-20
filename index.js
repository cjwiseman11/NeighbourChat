var env = process.env.NODE_ENV || 'development';
console.log(env);
var config = require('../config')[env];

var mysql      = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 1,
  waitForConnections: true,
  queueLimit: 0,
  host     : config.database.host,
  user     : config.database.user,
  password : config.database.pass,
  dateStrings:true,
  database : config.database.db,
  insecureAuth: true
});

var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var firebase = require("firebase");

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
  apiKey: "AIzaSyB_01UHfTmGIJftmO2SegfBL65oslofiaY",
  authDomain: "naybur-1494156012972.firebaseapp.com",
  databaseURL: "https://naybur-1494156012972.firebaseio.com",
  //projectId: "naybur-1494156012972",
  storageBucket: "naybur-1494156012972.appspot.com"
  //messagingSenderId: "739083803931"
};
firebase.initializeApp(config);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg, postcode){
    if(msg && postcode){
      socket.join(postcode);
      io.sockets.in(postcode).emit('chat message', msg, postcode);
      pool.getConnection(function(err, connection) {
          var sql = mysql.format("INSERT INTO `messages`(`postcode`, `message`) VALUES (?, ?)", [postcode, msg]);
          pool.query(sql, function (error, results, fields) {
          if (err) return done(err);
        });
        console.log('Added');
      });
    } else {
      console.log("Postcode or Message Empty");
    }
  });
});

app.get('/checkmessages', function(req, res){
    var data = {
        postcode: req.query.postcode
    };

    pool.getConnection(function(err, connection) {
        if (err) throw err;
        var sql = mysql.format("SELECT * FROM nayburdb.messages WHERE postcode = ?", [data.postcode]);
        connection.query(sql, function (error, results, fields) {
          connection.release();
          if(error){
            res.send("fail");
            throw error;
          } else if(results.length > 0) {
            res.send(results);
          } else {
            res.send("none");
          }
        });
    });
});

app.get('/getthreadbyid', function(req, res){
    var data = {
        id: req.query.id
    };

    pool.getConnection(function(err, connection) {
        if (err) throw err;
        var sql = mysql.format("SELECT * FROM nayburdb.threads WHERE id = ?", [data.id]);
        connection.query(sql, function (error, results, fields) {
          connection.release();
          if(error){
            res.send("fail");
            throw error;
          } else if(results.length > 0) {
            res.send(results);
          } else {
            res.send("none");
          }
        });
    });
});

app.get('/checkthreads', function(req, res){
    var data = {
        postcode: req.query.postcode
    };

    pool.getConnection(function(err, connection) {
        var sql = mysql.format("SELECT * FROM nayburdb.threads WHERE postcode = ?", [data.postcode]);
        connection.query(sql, function (error, results, fields) {
          connection.release();
          if(error){
            res.send("fail");
            throw error;
          } else if(results.length > 0) {
            res.send(results);
          } else {
            res.send("none");
          }
        });
    });
});

app.get('/getthreadmessages', function(req, res){
    var data = {
        threadid: req.query.threadid
    };

    pool.getConnection(function(err, connection) {
        if (err) throw err;
        var sql = mysql.format("SELECT * FROM nayburdb.threadmessages WHERE threadid = ? ORDER BY timeposted DESC", [data.threadid]);
        connection.query(sql, function (error, results, fields) {
          connection.release();
          if(error){
            res.send("fail");
            throw error;
          } else if(results.length > 0) {
            res.send(results);
          } else {
            res.send("none");
          }
        });
    });
});

app.get('/:postcode', function(req, res){
    var postcode = req.params;
    res.sendFile(__dirname + '/index.html');
});

app.post('/sendthread', function(req, res){
    console.log("Thread Submission");
    pool.getConnection(function(err, connection) {
      var sql = mysql.format("INSERT INTO nayburdb.threads (title, message, markerlat, markerlng, markercolour, postcode) VALUES (?, ?, ?, ?, ?, ?)", [req.body.title, req.body.message, req.body.mlat, req.body.mlng, req.body.mcolour, req.body.threadpostcode]);
      connection.query(sql, function (error, results, fields) {
        connection.release();
        if(error){
          throw error;
        }
      });
    });
    res.end();
});

app.post('/sendthreadmessage', function(req, res){
    console.log("Thread Message Submission");
    pool.getConnection(function(err, connection) {
      var sql = mysql.format("INSERT INTO nayburdb.threadmessages (message, threadid) VALUES (?, ?)", [req.body.message, req.body.threadid]);
      connection.query(sql, function (error, results, fields) {
        connection.release();
        if(error){
          throw error;
        }
      });
    });
    res.end();
});

app.post('/send', function(req, res){
    console.log("Thread Submission");
    pool.getConnection(function(err, connection) {
      var sql = mysql.format("INSERT INTO nayburdb.threads (title, message, markerlat, markerlng, markercolour, postcode) VALUES (?, ?, ?, ?, ?, ?)", [req.body.title, req.body.message, req.body.mlat, req.body.mlng, req.body.mcolour, req.body.threadpostcode]);
      connection.query(sql, function (error, results, fields) {
        connection.release();
        if(error){
          throw error;
        }
      });
    });
    res.end();
});

const settings = {
    gcm: {
        id: null,
    }
};
const PushNotifications = new require('node-pushnotifications');
const push = new PushNotifications(settings);

var port = process.env.port || 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

