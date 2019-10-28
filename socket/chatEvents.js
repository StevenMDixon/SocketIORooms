const gameTracker = require("./gameObject");

function chatEvents(socket, io) {
  socket.on('sendMessage', function (data) {
    let roomData = getRoomData(data.room);
    gameTracker.addMessage(`${data.user}: ${data.message}`, data.room);
    socket.emit('roomsUpdated', { ...roomData });
    socket.to(data.room).emit('roomsUpdated', { ...roomData });
  });

  socket.on('joinWaitingRoom', function (data) {
    if (socket.userName == "Anon") {
      socket.userName = data.user;
    }
    if (gameTracker.joinWaitingRoom(socket.userName)) {
      let roomData = getRoomData("waitingRoom");
      socket.join("waitingRoom");
      socket.emit("roomsUpdated", { ...roomData });
      socket.to("waitingRoom").emit('roomsUpdated', { ...roomData });
    }
    else {
      socket.emit('err', { message: 'oh no' });
    }
  })

  socket.on('createGame', function (data) {
    if (gameTracker.addGame(data.room, data.user)) {
      socket.leave("waitingRoom");
      socket.join(data.room);
      let room = getRoomData(data.room);
      room.messages.push(`${socket.userName} created room ${data.room}!`);
      socket.emit("roomsUpdated", { ...room, newRoom: data.room });
      socket.emit("screenChange", {screen: "UserCreatedGame"});
      socket.to("waitingRoom").emit('roomsUpdated', {updatedRooms: gameTracker.games});
    } else {
      socket.emit('waitingRoom').emit('err', { message: 'Room exists or incorrect name format' });
    }
  });

  socket.on('joinGame', function (data) {
    if (gameTracker.joinGame(data.room, data.user)) {
      let roomData = getRoomData(data.room);
      roomData.messages.push(`${socket.userName} joined room ${data.room}!`);
      socket.join(data.room);
      socket.leave("waitingRoom");
      socket.emit("roomsUpdated", { ...roomData, newRoom: data.room });
      socket.emit("screenChange", {screen: "UserJoinedGame"});
      io.emit('roomsUpdated', {...roomData});
    }
    else {
      socket.emit('join_err', { message: 'Sorry, The room is full!' });
    }
  });

  socket.on('leaveGame', function (data) {
    let roomData = getRoomData(data.room);
    let userLeft = gameTracker.leaveGame(data.room, data.user);
    if (userLeft) {
      socket.leave(data.room);
      socket.join('waitingRoom');
      socket.emit("screenChange", {screen: "lobby"});
      roomData.users = roomData.users.filter(user => user !== data.user);

      if(userLeft === "creator"){
      // if the creator leaves all users need to be kicked
        socket.emit("roomsUpdated", {...roomData, newRoom: "waitingRoom", remove: true});
        // if the creator leaves all users need to be kicked
        socket.to(data.room).emit("kicked");
        //this.props.socket.emit("userThatGotKicked");
      }
      if(userLeft === "user"){
        socket.emit("roomsUpdated", {updatedRooms: gameTracker.games, newRoom: "waitingRoom"});
        socket.to(roomData.name).emit("roomsUpdated", {...roomData})
      }
      socket.to("waitingRoom").emit("roomsUpdated", {updatedRooms: gameTracker.games});
    }
    else {
      socket.emit('err', { message: 'Sorry, The room is full!' });
    }
  });

  socket.on("userThatGotKicked", function(room){
    socket.leave(room);
    socket.join("waitingRoom");
    socket.emit("screenChange", {screen: "lobby"});
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