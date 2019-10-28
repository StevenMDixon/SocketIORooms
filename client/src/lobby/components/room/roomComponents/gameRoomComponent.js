import React from "react";
import "./gameRoomComponent.css"


// visual component for game room where 2 players are ready to start a game
function GameRoomComponent({ gameData, leaveGame, screen, start}) {
  return (
    <React.Fragment>
      <div className="lobby-banner room-banner">
        <p className="room-banner-left">{gameData.name}</p>
        <p className="room-banner-right">
          PLAYERS({gameData.users.length})
        </p>
      </div>
      <div className="room-info-wrapper">
        <div className="room-info">
          <div className="gameroom-info">
            <h4>Get Ready to Play</h4>
            {screen === "UserCreatedGame"?
            <p>Once another player connects click the go button to start!</p>  
            : ""
            }
            {screen === "UserJoinedGame" ? 
            <p>You are waiting on the game creator to start the game</p>
            : ""
           }
          </div>
          <div className="gameRoom-gobtn-wrapper">
          {screen === "UserCreatedGame" && gameData.users.length === 2 ? <button className="gameroom-go-button" onClick={start}>Start Game!</button>: ""}
          </div>
          <div className="gameroom-button-wrapper">
            <button className="gameroom-button-leave" onClick={() => leaveGame(gameData.name)}>Leave</button>
          </div>
        </div>
        <div className="room-users">
          <div className="user-list custom-scroll-bar">
            {gameData.users.map(user => (
              <p key={user} className="user-list-item">
                {user}
              </p>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default GameRoomComponent;

// need to handle the creator of the room leaving the room!
