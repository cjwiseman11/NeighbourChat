var env = process.env.NODE_ENV || 'development';
console.log(env);
var config = require('../config')[env];

var mysql      = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 4,
  host     : config.database.host,
  user     : config.database.user,
  password : config.database.pass,
  dateStrings:true,
  database : config.database.db
});

var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

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
        connection.query(sql, function (error, results, fields) {
          connection.release();
          if(error){
            throw error;
          }
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

var port = process.env.port || 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

