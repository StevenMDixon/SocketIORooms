import React from 'react';
import LobbyComponent from './lobby';
import socketIOClient from 'socket.io-client';
import "./App.css";

function App() {

  const user = "Anon" + Math.floor(Math.random() * 100000);
  const socketUrl = (process.env.NODE_ENV === "development") ? "http://localhost:3001" : "/" 
  console.log(socketUrl);
  const socket = socketIOClient.connect(socketUrl);

  const banner = {
    height: "5%",
    backgroundColor: "black",
    width: "100%",
  };

  return (
    <div className="App" style={{height: "100%", padding: 0, margin: 0}}>
      <div style={banner}>

      </div>
      <LobbyComponent user={user} socket={socket}/>
    </div>
  );
}

export default App;
