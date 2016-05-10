var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var random = require("random-js")();

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket) {
  console.log('User Connected', socket.client.id);

  socket.broadcast.emit('newPlayer', {
    id: socket.client.id.substring(2, socket.client.id.length),
    x: 400,
    y: 300
  });

  socket.on('readyForPlayers', function() {
    console.log('Ready for Players');
    io.of('/').clients(function(error, clients) {
      socket.emit('givePlayersList', clients);
    });
  });

  socket.on('startMovement', function(playerData) {
    console.log(playerData.id);
    socket.broadcast.emit('startMovement', playerData);
  });

  socket.on('stopMovement', function(playerData) {
    socket.broadcast.emit('stopMovement', playerData);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    socket.broadcast.emit('removePlayer', {id: socket.id});
  });
});

http.listen(3000, function() {
  console.log('Listening on port 3000');
});