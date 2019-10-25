import React, { Component } from 'react';
import "./chatComponent.css";

class ChatComponent extends Component {
  constructor(){
    super();
    this.state = {
      messageBoxValue: "",
      chatName: "waitingRoom",
      messages: []
    }
  }

  sendMessage = () => {
    //console.log(this.state.chatName)
    this.props.socket.emit("sendMessage", { room: this.state.chatName, message: this.state.messageBoxValue, user: this.props.user});
    this.setState({messages: [...this.state.messages, `${this.props.user}: ${this.state.messageBoxValue}`]});
  }

  updateMessageBox = (e) => {
    this.setState({messageBoxValue: e.target.value});
  }

  componentDidMount(){
    this.props.socket.emit("joinWaitingRoom", {user: this.props.user});


    this.props.socket.on("enterRoom", (data) =>{
      console.log(data)
      this.setState({chatName: data.name, messages: data.messages});
    })

    this.props.socket.on("messageReceived", (data) => {
      console.log(data);
      this.setState({messages: data.messages});
    });
  }

  render() {
    return (
      <div className="chat-wrapper">
        <div>
          {this.state.messages.map(message => <p>{message}</p>)}
        </div>
        <div className="message-inputs">
          <input className="messageBox" value={this.state.messageBoxValue} onChange={this.updateMessageBox}></input>
          <button onClick={this.sendMessage}>Send Message</button>
        </div>
      </div>
    )
  }
}

export default ChatComponent;