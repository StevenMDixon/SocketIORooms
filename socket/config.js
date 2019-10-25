const socketIO = require("socket.io");
const chatEvents = require("./chatEvents");
const gameEvents = require("./gameEvents");
// const gameTracker = require("./gameObject");

function config(server) {
  const io = socketIO(server);
  
  io.on('connection', (socket) => { 
    
    //socket.join("waitingRoom");
    //io.in('waitingRoom').emit('roomsUpdated', {rooms: gameTracker.games});

    socket.userName = "Anon";
    
    socket.on("change_username", (data) => {
      socket.userName = data.userName;
    });

    chatEvents(socket, io);
    //gameEvents(socket, io);
  })

}
 module.exports = config;