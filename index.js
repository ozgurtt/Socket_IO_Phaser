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

  socket.on('newPlayer', function(newPlayerData) {
    socket.broadcast.emit('newPlayer', {
      id: newPlayerData.id,
      x: newPlayerData.x,
      y: newPlayerData.y
    });
  });

  socket.on('readyForPlayers', function() {
    io.of('/').clients(function(error, clients) {
      socket.emit('givePlayersList', clients);
    });
  });

  socket.on('movement', function(playerData) {
    socket.broadcast.emit('movement', playerData);
  });

  socket.on('disconnect', function(){
    console.log('User Disconnected', socket.client.id);
    socket.broadcast.emit('removePlayer', {id: socket.client.id});
  });
});

// Alter port for heroku
var port = process.env.PORT || 3000;

http.listen(port, function() {
  console.log('Listening on port 3000');
});