const gameTracker = require("./gameObject");

function chatEvents(socket, io){
  socket.on('sendMessage', function(data){
      let roomData = getRoomData(data.room);
      gameTracker.addMessage(`${data.user}: ${data.message}`, data.room);
      socket.emit('roomsUpdated', {...roomData});
      socket.to(data.room).emit('roomsUpdated', {...roomData});
  });

  socket.on('joinWaitingRoom', function(data){
    if(socket.userName == "Anon"){
      socket.userName = data.user;
    }
    if(gameTracker.joinWaitingRoom(socket.userName)){
      let roomData = getRoomData("waitingRoom");
      socket.join("waitingRoom");
      socket.emit("roomsUpdated", {...roomData});
      socket.to("waitingRoom").emit('roomsUpdated', {...roomData});
    }
    else {
      socket.emit('err', {message: 'oh no'});
    }
  })

  socket.on('createGame', function(data){
    if(gameTracker.addGame(data.room, data.user)){
     socket.join(data.room);
     let room = getRoomData(data.room);
     room.messages.push(`${socket.userName} created room ${data.room}!`);
     socket.emit("roomsUpdated", {...room, newRoom: data.room});
     socket.to("waitingRoom").emit('roomsUpdated', {...room});
  } else {
    socket.emit('waitingRoom').emit('err', {message: 'Room exists or incorrect name format'});
  }
  });
  
  socket.on('joinGame', function(data){
    if(gameTracker.joinGame(data.room, data.user)){
      let roomData = getRoomData(data.room);
      roomData.messages.push(`${socket.userName} joined room ${data.room}!`);
      socket.join(data.room);
      socket.emit("roomsUpdated", {...roomData, newRoom: data.room});
      socket.to(data.room).emit('roomsUpdated', roomData);
    }
    else {
      socket.emit('join_err', {message: 'Sorry, The room is full!'});
    }
  });
  
  // socket.on('leaveGame', function(data){
  //   let t = gameTracker.leaveGame(data.room, data.name);
  //   if(t){
  //     socket.join('waitingRoom');
  // 
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
  // send return the found game;
  return {...game};
}