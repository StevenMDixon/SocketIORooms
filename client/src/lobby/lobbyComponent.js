import React, { Component } from 'react';
import ChatComponent from './components/chatComponent';
import RoomComponent from './components/roomComponent';
import "./lobbyC.css";

class LobbyComponent extends Component {
  constructor() {
    super();
    this.state = {
      screen: "select",
      users: [],
      games: [],
      currentRoom: "waitingRoom",
    }
  }

  componentDidMount() {
    // console.log(this.props)
    this.props.socket.emit("change_username", { userName: this.props.user });

    this.props.socket.on("roomsUpdated", (data) => {
      console.log(data);
      //handle rooms 
      if (data instanceof Array) {
        return this.setState({ games: data });
      }

      let currentRoom = this.state.currentRoom;

      if(data.newRoom){
        currentRoom = data.newRoom;
      }

      let matched = false;

      let t = this.state.games.map(game => {
        if (game.name === data.name) {
          game = data;
          matched = true;
        }
        return game;
      });

      if(!matched){
        t.push(data);
      }

      this.setState({ games: t, currentRoom});
    })

    this.props.socket.on("usersUpdated", (data) => {
      // signal sent from server tell client to update number of users
      this.setState({ users: data });
    })
  }

  getCurrentRoomData = () => {
    console.log(this.state.currentRoom)
    let t = this.state.games.filter(game => game.name === this.state.currentRoom);
    console.log(t)
    if (t.length > 0) {
      return t[0];
    }
    return [];
  }

  render() {
    return (
      <div className="lobby-wrapper">
        <RoomComponent
          socket={this.props.socket}
          user={this.props.user}
          users={this.state.users}
          games={this.state.games} 
          gameData={this.getCurrentRoomData()}
          />
          
        <ChatComponent
          socket={this.props.socket}
          user={this.props.user}
          gameData={this.getCurrentRoomData()} />
      </div>
    )
  }
}

export default LobbyComponent;