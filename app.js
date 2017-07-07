var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  socket.on('buffering', function(time) {
    socket.broadcast.emit('buffering', time);
  });
  socket.on('playing', function() {
    socket.broadcast.emit('playing');
  });
  socket.on('paused', function() {
    socket.broadcast.emit('paused');
  });
});

var port = process.env.PORT || 8080;
http.listen(port, function() {
  console.log('listening on port ' + port);
});


