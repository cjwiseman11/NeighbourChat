var mysql      = require('mysql');

var env = process.env.NODE_ENV || 'development';
console.log(env);
var config = require('../config')[env];

var connection = mysql.createConnection({
  host     : config.database.host,
  user     : config.database.user,
  password : config.database.pass,
  dateStrings:true,
  database : config.database.db
});

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg, postcode){
    if(msg && postcode){
      socket.join(postcode);
      io.sockets.in(postcode).emit('chat message', msg, postcode);
      var sql = mysql.format("INSERT INTO `messages`(`postcode`, `message`) VALUES (?, ?)", [postcode, msg]);
      connection.query(sql, function (error, results, fields) {
        if (error) throw error;
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

    var sql = mysql.format("SELECT * FROM gg.messages WHERE postcode = ?", [data.postcode]);
    connection.query(sql, function (error, results, fields) {
      if(error){
        res.send("fail");
        console.log(error);
      } else if(results.length > 0) {
        res.send(results);
      } else {
        res.send("none");
      }
    });
    connection.release();
  });

app.get('/:postcode', function(req, res){
    var postcode = req.params;
    res.sendFile(__dirname + '/index.html');
});

var port = process.env.port || 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

