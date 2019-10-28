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
      io.emit("roomsUpdated", gameTracker.games);
    });

    // handle events related to chat functionality
    chatEvents(socket, io);

    // handle events related to game functionality
    // gameEvents(socket, io);


    socket.on('disconnect', ()=> {
      // remove user from all games and remove user created games
      let {usersAffected} = gameTracker.removeUser(socket.userName);
      usersAffected.forEach(user => {
        gameTracker.joinWaitingRoom(user);
      });
      io.emit("usersUpdated", gameTracker.users);
      io.emit("roomsUpdated", gameTracker.games);
    })
  })

  
}
 module.exports = config;