var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
/*
io.connection(function(socket) {
  socket.on('play or pause', function() {

  });
});
*/
var port = process.env.PORT || 8080;
http.listen(port, function() {
  console.log('listening on port ' + port);
});


