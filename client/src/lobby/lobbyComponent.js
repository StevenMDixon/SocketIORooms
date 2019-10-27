import React, {Component} from 'react';
import ChatComponent from './components/chatComponent';
import RoomComponent from './components/roomComponent';
import "./lobbyC.css";

class LobbyComponent extends Component {
  constructor(){
    super();
    this.state = {
      screen: "select",
      users: [],
      games: []
    }
  }

  addGame = () => {
    // should add a new game to the games list
  }

  componentDidMount(){
    // console.log(this.props)
    this.props.socket.emit("change_username", { userName: this.props.user });

    this.props.socket.on("roomsUpdated", (data) =>{
      //handle rooms changing
      console.log(data, "roomsUpdated");
      this.setState({games: data})
    })

    this.props.socket.on("usersUpdated", (data)=>{
      // signal sent from server tell client to update number of users
      console.log(data + " users");
      this.setState({users: data});
    })
  }

  render(){
    return (
      <div className="lobby-wrapper">
        <RoomComponent socket={this.props.socket} user={this.props.user} users={this.state.users} games={this.state.games}/>
        <ChatComponent socket={this.props.socket} user={this.props.user} />
      </div>
    )
  }
}

export default LobbyComponent;