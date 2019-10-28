import React from 'react';

// visual component for when a player is creating or joining a game
function WaitingRoomComponent({users, state, getGames, selectGame, createNewGameClicked, joinGame, start}){
  return (
    <React.Fragment>
      <div className="lobby-banner room-banner">
        <p className="room-banner-left">ACTIVE GAMES ({getGames().length})</p>
        <p className="room-banner-right">PLAYERS({users.length})</p>
      </div>
      <div className="room-info-wrapper">
        <div className="room-info">
          <div className="room-info-header">
            <p className="list-item-fix">Players</p>
            <p className="list-item-fix">User</p>
            <p className="list-item-fix">Room Name</p>
          </div>
          <div className="room-info-list custom-scroll-bar">
            {getGames().map((game, index) => (
              state.clickedGameElement === game.name+index? 
              <div className="list-selected-item" key={game.name+index}>
              <div className="room-info-item-select">
                <p className="list-item-fix">{game.users.length} / 2</p>
                <p className="list-item-fix">{game.creator}</p>
                <p className="list-item-fix">{game.name}</p>
              </div>
              <button className="list-join-button" onClick={()=>joinGame(game.name)}>JOIN</button>
              </div>
              :
              <div className="room-info-item" onClick={()=>selectGame(game.name+index)} key={game.name+index}>
                <p className="list-item-fix">{game.users.length} / 2</p>
                <p className="list-item-fix">{game.creator}</p>
                <p className="list-item-fix">{game.name}</p>
              </div>
            ))}
          </div>
          <div className="room-info-buttons">
            <button className="room-info-button" onClick={start}>PLAY SINGLE PLAYER</button>
            <button className="room-info-button" onClick={createNewGameClicked}>CREATE A GAME</button>
          </div>
        </div>
        <div className="room-users">
          <div className="user-list custom-scroll-bar">
            {users.map((user) => <p key={user} className="user-list-item">{user}</p>)}
          </div>
        </div>
      </div>
      </React.Fragment>
  )
}


export default WaitingRoomComponent;

// todo

/*
  add a popup if room is full when trying to join? new popup? maybe use a popup to confirm joining the room?

  create the created room component



*/
