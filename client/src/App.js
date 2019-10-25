import React from 'react';
import LobbyComponent from './lobby/lobbyComponent';
import socketIOClient from 'socket.io-client';
function App() {
  const user = "Anon" + Math.floor(Math.random() * 100000);
  
  const socketUrl = (process.env.NODE_ENV === "development") ? "http://localhost:3001" : "/" 
  console.log(socketUrl);
  const socket = socketIOClient.connect(socketUrl);
  return (
    <div className="App" style={{height: "100vh", padding: 0, margin: 0}}>
      <LobbyComponent user={user} socket={socket}/>
    </div>
  );
}

export default App;
