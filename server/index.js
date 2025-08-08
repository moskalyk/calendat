const app = require('express')();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

const port = process.env.PORT || 8079;

let connectedUsers = {}

io.on('connection', (socket) => {

  connectedUsers[socket.id] = socket

  socket.emit('ack', {datum: socket.id})
  
  socket.on('init', (packet) => {
    connectedUsers[packet.id].email = packet.email
  })

  socket.on('sharing', (packet) => {
    Object.keys(connectedUsers).map((userId) => {
      if(packet.email == connectedUsers[userId].email && connectedUsers[userId]){
        connectedUsers[userId].emit('sharing', JSON.stringify({color: packet.color, isInitiator: packet.isInitiator, initiator: packet.initiator, geometry: packet.geometry, message: packet.message}))
      }
    })
  })

  socket.on('message', (msg) => {
    console.log(msg)
  })

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
})

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});