var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var active = false;

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  socket.on('buffering', function(time) {
    active = true;
    socket.broadcast.emit('buffering', time);
  });
  socket.on('playing', function() {
    socket.broadcast.emit('playing');
  });
  socket.on('paused', function() {
    socket.broadcast.emit('paused');
  });
  socket.on('load', function(url) {
    socket.broadcast.emit('load', url);
  });
});

setInterval(function() {
  if (active) {
    http.get('http://younityjs.herokuapp.com');
    active = false;
  }
}, 1000 * 60 * 29);

var port = process.env.PORT || 8080;
server.listen(port, function() {
  console.log('listening on port ' + port);
});


