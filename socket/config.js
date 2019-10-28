const socketIO = require("socket.io");
const chatEvents = require("./chatEvents");
const gameEvents = require("./gameEvents");
const gameTracker = require("./gameObject");

function config(server) {
  const io = socketIO(server);
  
  io.on('connection', (socket) => { 
    socket.userName = "Anon";

    socket.on("change_username", (data) => {
      socket.userName = data.userName;
      gameTracker.users.push(data.userName);
      io.emit("usersUpdated", gameTracker.users);
      io.emit("roomsUpdated", {updatedRooms: gameTracker.games});
    });

    // handle events related to chat functionality
    chatEvents(socket, io);

    // handle events related to game functionality
    // gameEvents(socket, io);
    socket.on('disconnect', ()=> {
      // remove user from all games and remove user created games
      let {gameToRemove} = gameTracker.removeUser(socket.userName);
      if(gameToRemove){
        socket.to(gameToRemove).emit("kicked");
      }else{
        io.emit("roomsUpdated", {updatedRooms: gameTracker.games});
      }
      io.emit("usersUpdated", gameTracker.users);
    })
  })

  
}
 module.exports = config;