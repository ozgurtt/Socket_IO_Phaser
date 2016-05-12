var game;
var players = {};

// Game vars
var cursors;

// Socket listeners and emitters
// drives game logic

var socket = io();

socket.on('connect', function() {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});;

  socket.emit('newPlayer', {
    id: socket.id,
    x: 400,
    y: 300
  });
});

// Initial event - emitted on successful connection
socket.on('newPlayer', function(data) {
  addPlayer(data.id, data.x, data.y);
});

// Receives list of connected clients - emitted after 'readyForPlayers'
socket.on('givePlayersList', function(playerList) {

  for(var i = 0; i < playerList.length; i++) {
    var id = playerList[i].substring(2, playerList[i].length);
    if(id !== socket.id) {
      addPlayer(id, 400, 300);
    }
  }
});

socket.on('movement', function(peerData) {
  var peer = players[peerData.id];
  peer.x = peerData.x;
  peer.y = peerData.y;
  peer.body.velocity.x = peerData.velocityX;
  peer.body.velocity.y = peerData.velocityY;
});

// Receives id of disconnected client - removes sprite
socket.on('removePlayer', function(data) {
  players[data.id].destroy();
  delete players[data.id];
});

// Game Logic
// functions called on socket events

function preload() {
  game.stage.disableVisibilityChange = true;
  game.load.spritesheet('player', '/slime.png', 96, 96);
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  addPlayer(socket.id, 400, 300);

  cursors = game.input.keyboard.createCursorKeys();

  handleMovement();

  socket.emit('readyForPlayers');
}

function handleMovement() {
  cursors.left.onDown.add(function() {

    players[socket.id].body.velocity.x = -100;

    socket.emit('movement', {
      id: socket.id,
      velocityX: players[socket.id].body.velocity.x,
      velocityY: players[socket.id].body.velocity.y,
      x: players[socket.id].x,
      y: players[socket.id].y
    })
  });

  cursors.left.onUp.add(function() {

    players[socket.id].body.velocity.x = 0;

    socket.emit('movement', {
      id: socket.id,
      velocityX: players[socket.id].body.velocity.x,
      velocityY: players[socket.id].body.velocity.y,
      x: players[socket.id].x,
      y: players[socket.id].y
    });
  });

  cursors.right.onDown.add(function() {

    players[socket.id].body.velocity.x = 100;

    socket.emit('movement', {
      id: socket.id,
      velocityX: players[socket.id].body.velocity.x,
      velocityY: players[socket.id].body.velocity.y,
      x: players[socket.id].x,
      y: players[socket.id].y
    })
  });

  cursors.right.onUp.add(function() {

    players[socket.id].body.velocity.x = 0;

    socket.emit('movement', {
      id: socket.id,
      velocityX: players[socket.id].body.velocity.x,
      velocityY: players[socket.id].body.velocity.y,
      x: players[socket.id].x,
      y: players[socket.id].y
    });
  });

  cursors.up.onDown.add(function() {

    players[socket.id].body.velocity.y = -100;

    socket.emit('movement', {
      id: socket.id,
      velocityX: players[socket.id].body.velocity.x,
      velocityY: players[socket.id].body.velocity.y,
      x: players[socket.id].x,
      y: players[socket.id].y
    })
  });

  cursors.up.onUp.add(function() {

    players[socket.id].body.velocity.y = 0;

    socket.emit('movement', {
      id: socket.id,
      velocityX: players[socket.id].body.velocity.x,
      velocityY: players[socket.id].body.velocity.y,
      x: players[socket.id].x,
      y: players[socket.id].y
    });
  });

  cursors.down.onDown.add(function() {

    players[socket.id].body.velocity.y = 100;

    socket.emit('movement', {
      id: socket.id,
      velocityX: players[socket.id].body.velocity.x,
      velocityY: players[socket.id].body.velocity.y,
      x: players[socket.id].x,
      y: players[socket.id].y
    })
  });

  cursors.down.onUp.add(function() {

    players[socket.id].body.velocity.y = 0;

    socket.emit('movement', {
      id: socket.id,
      velocityX: players[socket.id].body.velocity.x,
      velocityY: players[socket.id].body.velocity.y,
      x: players[socket.id].x,
      y: players[socket.id].y
    });
  });
}

function addPlayer(playerId, x, y) {
  players[playerId] = game.add.sprite(x, y, 'player');
  players[playerId].anchor.setTo(0.5);
  game.physics.enable(players[playerId], Phaser.Physics.ARCADE);
  players[playerId].body.collideWorldBounds = true;
  players[playerId].scale.setTo(0.5);
}

function update() {

}