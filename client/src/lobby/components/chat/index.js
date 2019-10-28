import React, { Component } from 'react';
import "./chatComponent.css";

class ChatComponent extends Component {
  constructor(){
    super();
    this.state = {
      // input box for messaging
      messageBoxValue: "",
    }
  }

  componentDidUpdate(){
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    // scrolls to the bottom of the messages div when the page is loaded or changed
    this.messageList.scrollTop = this.messageList.scrollHeight;
  }

  sendMessage = () => {
    // handles sending the data to the back end via socket io, this will be sent back in the lobby component and passed down
    this.props.socket.emit("sendMessage", { room: this.props.gameData.name, message: this.state.messageBoxValue, user: this.props.user});
    // empty the message input
    this.setState({messageBoxValue: ""});
  }

  updateMessageBox = (e) => {
    // handles matching messages input element and state
    this.setState({messageBoxValue: e.target.value});
  }

  checkForEnter = (e) => {
    // handle when user hits enter in the input box for messages
    if(e.keyCode === 13){
      this.sendMessage();
    }
  }

  componentDidMount(){
    // move connected user into the waiting room as a default
    this.props.socket.emit("joinWaitingRoom", {user: this.props.user});
  }

  getMessages = () => {
    // check to see if we have the data from the server if not display no messages
    if(!this.props.gameData.messages){
      return []
    }
    return this.props.gameData.messages.slice(Math.max(this.props.gameData.messages.length - 100, 0),this.props.gameData.messages.length);
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