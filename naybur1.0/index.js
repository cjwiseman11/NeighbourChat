var env = process.env.NODE_ENV || 'development';
console.log(env);
var config = require('../../config')[env];

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

var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

var port = process.env.port || 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

