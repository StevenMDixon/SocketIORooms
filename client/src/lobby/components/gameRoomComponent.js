import React from 'react';

function GameRoomComponent({users, state}){
  return (
    <React.Fragment>
      <div className="lobby-banner room-banner">
        <p className="room-banner-left">{state.gameName}</p>
        <p className="room-banner-right">PLAYERS IN ROOM ({users.length})</p>
      </div>
      <div className="room-info-wrapper">
        <div className="room-info">

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

export default GameRoomComponent;