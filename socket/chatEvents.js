const gameTracker = require("./gameObject");

function chatEvents(socket, io) {
  // handle message sent from the front end
  socket.on('sendMessage', function (data) {
    // get the current rooms data
    let roomData = getRoomData(data.room);
    // use the game object to add a message to the correct room
    gameTracker.addMessage(`${data.user}: ${data.message}`, data.room);
    // tell the socked to update the messages for the user
    socket.emit('roomsUpdated', { ...roomData });
    // tell all sockets in the current room to update messages for this room
    socket.to(data.room).emit('roomsUpdated', { ...roomData });
  });

  socket.on('joinWaitingRoom', function (data) {
    // error check to make sure the socket username is set
    if (socket.userName == "Anon") {
      socket.userName = data.user;
    }
    // move current user into the waiting room via game object
    if (gameTracker.joinWaitingRoom(socket.userName)) {
      // get the current rooms data
      let roomData = getRoomData("waitingRoom");
      // move user into waitingRoom socket room
      socket.join("waitingRoom");
      // tell the connected socket the room has been updated
      socket.emit("roomsUpdated", { ...roomData });
      // tell connected sockets in waiting room that this room has updated
      socket.to("waitingRoom").emit('roomsUpdated', { ...roomData });
    }
    else {
      socket.emit('err', { message: 'Error Joining waiting room.' });
    }
  })

  socket.on('createGame', function (data) {
    // use game object to create a new game
    if (gameTracker.addGame(data.room, data.user)) {
      // move user out of waiting room socket
      socket.leave("waitingRoom");
      // move user into new room socket
      socket.join(data.room);
      // get the current rooms data
      let room = getRoomData(data.room);
      // tell socket the rooms have changed
      socket.emit("roomsUpdated", { ...room, newRoom: data.room });
      // tell the connected socked the screen needs to change
      socket.emit("screenChange", {screen: "UserCreatedGame"});
      // tell everyone in waiting room a new room has been added
      socket.to("waitingRoom").emit('roomsUpdated', {updatedRooms: gameTracker.games});
    } else {
      socket.emit('err', { message: 'Room exists or incorrect name format' });
    }
  });
  // handle joining a room
  socket.on('joinGame', function (data) {
    // check if a user can join a game
    if (gameTracker.joinGame(data.room, data.user)) {
      // get the current rooms data
      let roomData = getRoomData(data.room);
      // move user into new room
      socket.join(data.room);
      // remove user from waiting room
      socket.leave("waitingRoom");
      // tell socket the room was updated
      socket.emit("roomsUpdated", { ...roomData, newRoom: data.room });
      // tell the connected socked the screen needs to change
      socket.emit("screenChange", {screen: "UserJoinedGame"});
      // tell all users that the rooms where updated
      io.emit('roomsUpdated', {...roomData});
    }
    else {
      socket.emit('err', { message: 'Sorry, That room is full!' });
    }
  });

  socket.on('leaveGame', function (data) {
    // get the current rooms data
    let roomData = getRoomData(data.room);
    // get the type of user that left room
    let userLeft = gameTracker.leaveGame(data.room, data.user);
    // if not null
    if (userLeft) {
      // make user leave room
      socket.leave(data.room);
      // move user to waiting room
      socket.join('waitingRoom');
      // tell front end to change 
      socket.emit("screenChange", {screen: "lobby"});
      // 
      roomData.users = roomData.users.filter(user => user !== data.user);

      if(userLeft === "creator"){
        // if the creator leaves all users need to be kicked
        socket.emit("roomsUpdated", {...roomData, newRoom: "waitingRoom", remove: true});
        // if the creator leaves all users need to be kicked
        socket.to(data.room).emit("kicked");
      }
      if(userLeft === "user"){
        // tell the user the rooms changed
        socket.emit("roomsUpdated", {updatedRooms: gameTracker.games, newRoom: "waitingRoom"});
        // tell everyone in the room the user left
        socket.to(roomData.name).emit("roomsUpdated", {...roomData})
      }
      // tell everyone in the lobby the user left
      socket.to("waitingRoom").emit("roomsUpdated", {updatedRooms: gameTracker.games});
    }
    else {
      socket.emit('err', { message: 'Sorry, The room is full!' });
    }
  });

  // handle users getting kicked
  socket.on("userThatGotKicked", function(room){
    // leave the current room
    socket.leave(room);
    // move user to waiting room
    socket.join("waitingRoom");
    // tell front end to change screen
    socket.emit("screenChange", {screen: "lobby"});
    // tell socket that rooms are updated
    socket.emit("roomsUpdated", {updatedRooms: gameTracker.games, newRoom: "waitingRoom", kicked: true});
  }); 
}

module.exports = chatEvents;

function getRoomData(roomName) {
  let game = gameTracker.games.filter(x => x.name === roomName)[0];
  // throttle the number of messages that are sent to the client
  // send return the found game;
  return { ...game };
}