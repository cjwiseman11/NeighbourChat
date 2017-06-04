'use strict';

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index');
  })

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(express.static('public'));

  app.get('/checkmessages', function(req, res){
    var data = {
        postcode: req.query.postcode
    };

    pool.getConnection(function(err, connection) {
        if (err) throw err;
        var sql = mysql.format("SELECT * FROM pepperte_naybur.messages WHERE postcode = ?", [data.postcode]);
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
          var sql = mysql.format("SELECT * FROM pepperte_naybur.threads WHERE id = ?", [data.id]);
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
          var sql = mysql.format("SELECT * FROM pepperte_naybur.threads WHERE postcode = ?", [data.postcode]);
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
          var sql = mysql.format("SELECT * FROM pepperte_naybur.threadmessages WHERE threadid = ? ORDER BY timeposted ASC", [data.threadid]);
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
        var sql = mysql.format("INSERT INTO pepperte_naybur.threads (title, message, markerlat, markerlng, markercolour, postcode) VALUES (?, ?, ?, ?, ?, ?)", [req.body.title, req.body.message, req.body.mlat, req.body.mlng, req.body.mcolour, req.body.threadpostcode]);
        connection.query(sql, function (error, results, fields) {
          connection.release();
          if(error){
            throw error;
          }
        });
      });
      res.redirect('back');
  });

  app.post('/sendthreadmessage', function(req, res){
      console.log("Thread Message Submission");
      pool.getConnection(function(err, connection) {
        var sql = mysql.format("INSERT INTO pepperte_naybur.threadmessages (message, threadid) VALUES (?, ?)", [req.body.message, req.body.threadid]);
        connection.query(sql, function (error, results, fields) {
          connection.release();
          if(error){
            throw error;
          }
        });
      });
      res.redirect('back');
  });

  app.post('/send', function(req, res){
      console.log("Thread Submission");
      pool.getConnection(function(err, connection) {
        var sql = mysql.format("INSERT INTO pepperte_naybur.threads (title, message, markerlat, markerlng, markercolour, postcode) VALUES (?, ?, ?, ?, ?, ?)", [req.body.title, req.body.message, req.body.mlat, req.body.mlng, req.body.mcolour, req.body.threadpostcode]);
        connection.query(sql, function (error, results, fields) {
          connection.release();
          if(error){
            throw error;
          }
        });
      });
      res.end();
  });

};

/*module.exports = function(io) {
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
}*/

