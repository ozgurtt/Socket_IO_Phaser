# Socket_IO_Phaser
Beginnings of a Phaser multiplayer game using Socket.io. Built to minimize network traffic.

Using [Node.js](https://nodejs.org), [Express](http://expressjs.com/), [Socket.io](http://socket.io/), and [Phaser.js](http://phaser.io/) libraries to allow socket transfer of game data. To limit network traffic, player movement is limited to **Starting** and **Stopping** socket events so each movement will only be 2 messages sent over the network.

## Installation
```bash
git clone
cd Socket_IO_Phaser
npm install
node index.js
```
