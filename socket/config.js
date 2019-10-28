const socketIO = require("socket.io");
const chatEvents = require("./chatEvents");
const gameEvents = require("./gameEvents");
const gameTracker = require("./gameObject");


// setup file for socketIO, sets up listeners
function config(server) {
  const io = socketIO(server);
  
  io.on('connection', (socket) => { 
    // set socket userName so that we know what it is
    socket.userName = "Anon";

    socket.on("change_username", (data) => {
      // set the socket username = to the username from the front end
      socket.userName = data.userName;
      // add the user to the game object
      gameTracker.users.push(data.userName);
      // tell all connected sockets we added the users
      io.emit("usersUpdated", gameTracker.users);
      // tell all connected sockets we changed the rooms
      io.emit("roomsUpdated", {updatedRooms: gameTracker.games});
    });

    // handle events related to chat functionality
    chatEvents(socket, io);

    // handle events related to game functionality
    // gameEvents(socket, io);

    // handle when a window is refreshed or when a browser is closed
    socket.on('disconnect', ()=> {
      // remove user from all games and remove user created games
      let {gameToRemove} = gameTracker.removeUser(socket.userName);
      // if the user that left was a creator of a game all users have to be transferred back to the waiting room
      if(gameToRemove){
        // tell the front end their user is going to be kicked
        socket.to(gameToRemove).emit("kicked");
      }else{
        // tell all connected sockets a room changed
        io.emit("roomsUpdated", {updatedRooms: gameTracker.games});
      }
      // a user left so tell all connected sockets the user is no longer connected
      io.emit("usersUpdated", gameTracker.users);
    })
  })

  
}
 module.exports = config;