const gameTracker = {
  users: [],
  games: [
    {name: "waitingRoom", messages: [], users: []}
  ],
  joinWaitingRoom: function(user){
    let success = false;
    this.games.forEach(game => {
      if(game.name === "waitingRoom"){
        game.users.push(user);
        game.messages.push(user+" joined room.")
        success = true;
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
  },
  addUsers: function(username){
    this.users.push(username);
  },
  removeUser: function(username){
    let gameToRemove = null;
    let usersAffected = [];
    this.games.forEach(game => {
      if(game.creator === username){
        gameToRemove = game.name;
        usersAffected = game.users.filter(user => user != username);
      }
      if(game.users.includes(username)){
        game.users = game.users.filter(user => user != username);
        game.messages.push(username + " has left the room");
      }
    });
    this.users = this.users.filter(user => user != username);
    this.games = this.games.filter(game => game.name != gameToRemove);
    return {usersAffected};
  },
  // NEED TO REWORK

  addGame: function(gameName, creator){
    if(!gameName || this.games.some(x => x.name === gameName || x.creator === creator)){
      return false;
    } else {
      this.games.push({name: gameName, creator: creator, users: [creator], messages: []});
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
          game.messages.push(`${user} has left the room.`)
        }
        success =  true;
      }
    });
    return success;
  },
  
}

module.exports = gameTracker;