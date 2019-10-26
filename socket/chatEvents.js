const gameTracker = require("./gameObject");

function chatEvents(socket, io){
  socket.on('sendMessage', function(data){
      let roomData = getRoomData(data.room);
      gameTracker.addMessage(`${data.user}: ${data.message}`, data.room);
      socket.emit('messageReceived', {...roomData})
      socket.to(data.room).emit('messageReceived', {...roomData});
  });

  socket.on('joinWaitingRoom', function(data){
    if(socket.userName == "Anon"){
      socket.userName = data.user;
    }
    if(gameTracker.joinWaitingRoom(socket.userName)){
      let roomData = getRoomData("waitingRoom");
      socket.join("waitingRoom");
      socket.emit("enterRoom", {...roomData});
      socket.to("waitingRoom").emit('userJoined', {...roomData});
    }
    else {
      socket.emit('err', {message: 'oh no'});
    }
  })

  // socket.on('createGame', function(data){
  //   if(gameTracker.addGame(data.roomName, socket.userName)){
  //     updateWaitingRoom(io);
  //     socket.join(data.roomName);
  //     socket.emit("enterRoom", getRoomData(data.roomName));
  //   } else {
  //     socket.emit('waitingRoom').emit('err', {message: 'Room exists or incorrect name format'});
  //   }
  // });
  
  // socket.on('joinGame', function(data){
  //   if(gameTracker.joinGame(data.room, data.name)){
  //     let roomData = getRoomData(data.room);
  //     updateWaitingRoom(io);
  //     socket.join(data.room);
  //     socket.emit("enterRoom", roomData);
  //     socket.to(data.room).emit('userJoined', roomData);
  //   }
  //   else {
  //     socket.emit('err', {message: 'Sorry, The room is full!'});
  //   }
  // });
  
  // socket.on('leaveGame', function(data){
  //   let t = gameTracker.leaveGame(data.room, data.name);
  //   if(t){
  //     socket.join('waitingRoom');
  //     updateWaitingRoom(io);
  //     socket.emit("leaveRoom", getRoomData(data.room));
  //   }
  //   else {
  //     socket.emit('err', {message: 'Sorry, The room is full!'});
  //   }
  // });
    
}

module.exports = chatEvents;

function getRoomData(roomName){
  let game = gameTracker.games.filter(x => x.name === roomName)[0];
  // throttle the number of messages that are sent to the client
  game.chat = game.messages.slice(Math.max(game.messages.length - 100,0), game.messages.length);
  // send return the found game;
  return {...game}
}

function updateRoom(io) {
  io.in('waitingRoom').emit('roomsUpdated', {rooms: gameTracker.games, });
}