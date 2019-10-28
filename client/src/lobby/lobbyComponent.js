import React, { Component } from 'react';
import ChatComponent from './components/chat';
import RoomComponent from './components/room';
import "./lobbyC.css";

class LobbyComponent extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      games: [],
      currentRoom: "waitingRoom",
      screen: "lobby",
    }
  }

  componentDidMount() {
    this.props.socket.emit("change_username", { userName: this.props.user });

    this.props.socket.on("screenChange", (data)=>{
        this.setState(data);
    });

   

    this.props.socket.on("roomsUpdated", (data) => {
      console.log(this.state.currentRoom, "current room")
      console.log(data)

      let currentRoom = this.state.currentRoom;
      if(data.newRoom){
        currentRoom = data.newRoom;
      }

      if (data.updatedRooms) {
        return this.setState({ games: data.updatedRooms, currentRoom});
      }

      if(data.remove){
        return this.setState({
          games: this.state.games.filter(game => game.name !== data.name),
          currentRoom
        })
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

    this.props.socket.on("kicked", (data) => {
      // signal sent from server tell client to update number of users
      this.props.socket.emit("userThatGotKicked", this.state.currentRoom);
    })
  }

  getCurrentRoomData = () => {
    let t = this.state.games.filter(game => game.name === this.state.currentRoom);
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
          screen={this.state.screen}
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