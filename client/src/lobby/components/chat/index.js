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

  componentDidUpdate(){
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messageList.scrollTop = this.messageList.scrollHeight;
  }

  sendMessage = () => {
    this.props.socket.emit("sendMessage", { room: this.props.gameData.name, message: this.state.messageBoxValue, user: this.props.user});
    this.setState({messageBoxValue: ""});
  }

  updateMessageBox = (e) => {
    this.setState({messageBoxValue: e.target.value});
  }

  checkForEnter = (e) => {
    if(e.keyCode === 13){
      this.sendMessage();
    }
  }

  componentDidMount(){
    this.props.socket.emit("joinWaitingRoom", {user: this.props.user});
  }

  getMessages = () => {
    // check to see if we have the data from the server if not display no messages
    if(!this.props.gameData.messages){
      return []
    }
    let t = this.props.gameData.messages.slice(Math.max(this.props.gameData.messages.length - 100, 0),this.props.gameData.messages.length);
    return t;
  }

  render() {
    return (
      <div className="chat-wrapper">
        <div className="lobby-banner chat-banner">
          <p className="chat-banner-title">CHAT</p>
        </div>
        <div className="message-output custom-scroll-bar" ref={el => this.messageList =el}>
          {this.getMessages().map((message, index) => <p key={"msg"+index} className="message-items">{message}</p>)}
        </div>
        <div className="message-inputs">
          <input className="messageBox" value={this.state.messageBoxValue} onChange={this.updateMessageBox} onKeyDown={this.checkForEnter}></input>
          <button onClick={this.sendMessage}>SEND</button>
        </div>
      </div> 
    )
  }
}

export default ChatComponent;