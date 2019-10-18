const express = require('express');
const socket = require("socket.io");

const app = express();
const Port = 3001;

app.use(express.static('public'))

app.get("/", function(req, res){
  res.render("index.html");
});

const server = app.listen(Port);


const gameTracker = {
  games: [],
  addGame: function(gameName, creator){
    if(!gameName || this.games.some(x => x.name === gameName || x.creator === creator)){
      return false;
    } else {
      this.games.push({name: gameName, creator: creator, users: [creator]});
      return true;
    }
  },
  joinGame: function(gameName, user){
    let success = false;
    this.games.forEach(game => {
      if(game.name === gameName && game.users.length < 2 && user !== game.creator){
        game.users.push(user);
        success = true;
      }
    });
    return success;
  },
  leaveGame: function(gameName, user){
    let success = false;
    this.games.forEach(game => {
      if(game.name === gameName && game.users.includes(user)){
        if(game.creator === user && game.users.length === 1){
          this.games = this.games.filter(game => gameName !== game.name);
        }else{
          game.users = game.users.filter(name => name !== user );
        }
        success =  true;
      }
    });
    return success;
  },
  addMessage: function(message, room){
    this.games.forEach(game => {
      if(game.name === room) {
        if(game.messages) game.messages.push(message);
        else {
          game.messages = [message];
        }
      }
    })
  }
}


const io = socket(server);

io.on('connection', (socket) => { 
  // put everyone in the waiting room
  socket.join("waitingRoom");
  io.in('waitingRoom').emit('roomsUpdated', {rooms: gameTracker.games});
  socket.userName = "Anon";

  socket.on("change_username", (data) => {
    socket.userName = data.userName;
  });
  
  socket.on('createGame', function(data){
    if(gameTracker.addGame(data.roomName, socket.userName)){
      updateWaitingRoom();
      socket.join(data.roomName);
      socket.emit("enterRoom", getRoomData(data.roomName));
    } else {
      socket.emit('waitingRoom').emit('err', {message: 'Room exists or incorrect name format'});
    }
  });

  socket.on('joinGame', function(data){
    if(gameTracker.joinGame(data.room, data.name)){
      let roomData = getRoomData(data.room);
      updateWaitingRoom()
      socket.join(data.room);
      socket.emit("enterRoom", roomData);
      socket.to(data.room).emit('userJoined', roomData);
    }
    else {
      socket.emit('err', {message: 'Sorry, The room is full!'});
    }
  });

  socket.on('leaveGame', function(data){
    let t = gameTracker.leaveGame(data.room, data.name);
    if(t){
      socket.join('waitingRoom');
      updateWaitingRoom()
      socket.emit("leaveRoom", getRoomData(data.room));
    }
    else {
      socket.emit('err', {message: 'Sorry, The room is full!'});
    }
  });

  socket.on('sendMessage', function(data){
    //console.log(io.sockets.manager.roomClients[socket.id])
    gameTracker.addMessage(data.message, data.room);
    io.in(data.room).emit('messageReceived', getRoomData(data.room));
  })

  function getRoomData(roomName){
    return {roomData: gameTracker.games.filter(x => x.name === roomName)[0]}
  }

  function updateWaitingRoom() {
    io.in('waitingRoom').emit('roomsUpdated', {rooms: gameTracker.games});
  }
}); 