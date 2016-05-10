var game = null;
var players = {};
var myId;

// Game vars
var cursors;

// Socket listeners and emitters
// drives game logic

var socket = io();
console.log(socket);


// Initial event - emitted on successful connection
socket.on('newPlayer', function(data) {
  if(!game) {
    myData = data;
    game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});
  } else {
    addPlayer(data.id, data.x, data.y);
  }
});

// Receives list of connected clients - emitted after 'readyForPlayers'
socket.on('givePlayersList', function(playerList) {
  console.log(playerList);

  for(var i = 0; i < playerList.length; i++) {
    var id = playerList[i];
    if(id !== myData.id) {
      addPlayer(id);
    }
  }
});

socket.on('startMovement', function(peerData) {
  var peer = players[peerData.id];
  peer.x = peerData.x;
  peer.y = peerData.y;

  if(peerData.direction === 'left') {
    peer.body.velocity.x = -100;
  } else if(peerData.direction === 'right') {
    peer.body.velocity.x = 100;
  }

  if(peerData.direction === 'up') {
    peer.body.velocity.y = -100;
  } else if(peerData.direction === 'down') {
    peer.body.velocity.y = 100;
  }
});

socket.on('stopMovement', function(peerData) {
  var peer = players[peerData.id];
  peer.x = peerData.x;
  peer.y = peerData.y;
  peer.body.velocity.x = 0;
  peer.body.velocity.y = 0;
});

// Receives id of disconnected client - removes sprite
socket.on('removePlayer', function(data) {
  players[data.id].destroy();
  players[data.id] = null;
});

// Game Logic
// functions called on socket events

function preload() {
  game.stage.disableVisibilityChange = true;
  game.load.spritesheet('player', '/slime.png', 96, 96);
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  addPlayer(myData.id, myData.x, myData.y);

  cursors = game.input.keyboard.createCursorKeys();

  handleMovement();

  socket.emit('readyForPlayers');
}

function handleMovement() {
  cursors.left.onDown.add(function() {

    console.log('button is down');

    players[myData.id].body.velocity.x = -100;

    socket.emit('startMovement', {
      id: myData.id,
      direction: 'left',
      x: players[myData.id].x,
      y: players[myData.id].y
    })
  });

  cursors.left.onUp.add(function() {

    players[myData.id].body.velocity.x = 0;

    socket.emit('stopMovement', {
      id: myData.id,
      x: players[myData.id].x,
      y: players[myData.id].y
    });
  });

  cursors.right.onDown.add(function() {

    players[myData.id].body.velocity.x = 100;

    socket.emit('startMovement', {
      id: myData.id,
      direction: 'right',
      x: players[myData.id].x,
      y: players[myData.id].y
    })
  });

  cursors.right.onUp.add(function() {

    players[myData.id].body.velocity.x = 0;

    socket.emit('stopMovement', {
      id: myData.id,
      x: players[myData.id].x,
      y: players[myData.id].y
    });
  });

  cursors.up.onDown.add(function() {

    players[myData.id].body.velocity.y = -100;

    socket.emit('startMovement', {
      id: myData.id,
      direction: 'up',
      x: players[myData.id].x,
      y: players[myData.id].y
    })
  });

  cursors.up.onUp.add(function() {

    players[myData.id].body.velocity.y = 0;

    socket.emit('stopMovement', {
      id: myData.id,
      x: players[myData.id].x,
      y: players[myData.id].y
    });
  });

  cursors.down.onDown.add(function() {

    players[myData.id].body.velocity.y = 100;

    socket.emit('startMovement', {
      id: myData.id,
      direction: 'down',
      x: players[myData.id].x,
      y: players[myData.id].y
    })
  });

  cursors.down.onUp.add(function() {

    players[myData.id].body.velocity.y = 0;

    socket.emit('stopMovement', {
      id: myData.id,
      x: players[myData.id].x,
      y: players[myData.id].y
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