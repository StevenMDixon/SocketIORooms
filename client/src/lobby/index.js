import React, { Component } from "react";
import ChatComponent from "./components/chat";
import RoomComponent from "./components/room";
import "./lobbyC.css";

class LobbyComponent extends Component {
  constructor() {
    super();
    this.state = {
      // array of users from socket.io
      users: [],
      // array of all games available from socket.io
      games: [],
      // current room the user is in
      currentRoom: "waitingRoom",
      // current screen for the lobby room lobby -> UserCreatedGame -> UserJoinedGame
      screen: "lobby"
    };
  }

  componentDidMount() {
    // starts the connection by setting the username on the back end as the user that is logged in
    this.props.socket.emit("change_username", { userName: this.props.user });

    // set event listener for when the screens data will change
    this.props.socket.on("screenChange", data => {
      this.setState(data);
    });

    // roomsUpdated is a big event it is called when:
    /*
      - Rooms are created
      - Rooms are removed
      - Users leave rooms
      - Users move to another room
      - Any time a room is changed at all
    */
    this.props.socket.on("roomsUpdated", data => {
      // check to see if a user moved to another room if so update state so user get correct messages
      let currentRoom = data.newRoom || this.state.currentRoom;

      // if updated room is available more than one room has changed, so we update games
      if (data.updatedRooms) {
        return this.setState({ games: data.updatedRooms, currentRoom });
      } else if (data.remove) {  // if remove is available a room has been specified to be removed
        return this.setState({
          // remove the room by filtering it out
          games: this.state.games.filter(game => game.name !== data.name),
          currentRoom
        });
      } else {

        let matched = false;
        // map rooms to check and see if the room already exists
        let t = this.state.games.map(game => {
          if (game.name === data.name) {
            game = data;
            matched = true;
          }
          return game;
        });
        // if not add the new room to the the games
        if (!matched) {
          t.push(data);
        }
        // update new state with new games
        this.setState({ games: t, currentRoom });
      }
    });

    this.props.socket.on("usersUpdated", data => {
      // signal sent from server tell client to update number of users
      this.setState({ users: data });
    });

    this.props.socket.on("kicked", data => {
      // signal sent from server tell client to update number of users
      this.props.socket.emit("userThatGotKicked", this.state.currentRoom);
    });
  }

  // gets the data for the current game from state
  getCurrentRoomData = () => {
    let t = this.state.games.filter(
      game => game.name === this.state.currentRoom
    );
    if (t.length > 0) {
      return t[0];
    }
    return [];
  };

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
          gameData={this.getCurrentRoomData()}
        />
      </div>
    );
  }
}

export default LobbyComponent;
