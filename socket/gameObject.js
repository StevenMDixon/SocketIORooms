const gameTracker = {
  games: [
    {name: "waitingRoom", messages: [], users: []}
  ],
  joinWaitingRoom: function(user){
    let success = false;
    this.games.forEach(game => {
      if(game.name === "waitingRoom"){
        game.users.push(user);
        success = true;
      }
    });
    return success;
  },

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

module.exports = gameTracker;