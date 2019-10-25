import React, {Component} from 'react';
import ChatComponent from './components/chatComponent';
import "./lobbyC.css";

class LobbyComponent extends Component {
  constructor(){
    super();
    this.state = {
      screen: "select"
    }
  }

  componentDidMount(){
    console.log(this.props)
    this.props.socket.emit("change_username", { userName: this.props.user });

    this.props.socket.on("roomsUpdated", (data) =>{
      //handle rooms changing
    })
  }

  render(){
    return (
      <div className="lobby-wrapper">
        <div className="lobby-game-selector"></div>
        <ChatComponent socket={this.props.socket} user={this.props.user}/>
      </div>
    )
  }
}

export default LobbyComponent;