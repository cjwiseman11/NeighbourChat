var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'hedgehog123',
  dateStrings:true,
  database : 'gg'
});

connection.connect();

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
      io.emit('chat message', msg, postcode);
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
      if (error) throw error;
      res.send(results);
    });
  });

app.get('/:postcode', function(req, res){
    var postcode = req.params;
    res.send(postcode);
    //res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

