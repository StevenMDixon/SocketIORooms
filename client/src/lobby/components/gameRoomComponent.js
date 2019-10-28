import React from 'react';

function GameRoomComponent({gameData}){
  console.log(gameData)
  return (
    <React.Fragment>
      <div className="lobby-banner room-banner">
        <p className="room-banner-left">{gameData.name}</p>
        <p className="room-banner-right">PLAYERS IN ROOM ({gameData.users.length})</p>
      </div>
      <div className="room-info-wrapper">
        <div className="room-info">

        </div>
        <div className="room-users">
          <div className="user-list custom-scroll-bar">
            {gameData.users.map((user) => <p key={user} className="user-list-item">{user}</p>)}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default GameRoomComponent;