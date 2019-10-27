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
    //console.log(this.state.chatName)
    this.props.socket.emit("sendMessage", { room: this.state.chatName, message: this.state.messageBoxValue, user: this.props.user});
    this.setState({messages: [...this.state.messages, `${this.props.user}: ${this.state.messageBoxValue}`], messageBoxValue: ""});
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


    this.props.socket.on("enterRoom", (data) =>{
      this.setState({chatName: data.name, messages: data.messages});
    })

    this.props.socket.on("userJoined", (data) =>{
      this.setState({messages: data.messages});
    })

    this.props.socket.on("messageReceived", (data) => {
      console.log(data);
      this.setState({messages: data.messages});
    });

    this.props.socket.on("roomsUpdated", (data) => {
      console.log(typeof data)
      data.forEach(room => room.name === this.state.chatName? this.setState({messages: room.messages}): null);
    })
  }

  getMessages = () => {
    return this.state.messages.slice(Math.max(this.state.messages.length - 100, 0),this.state.messages.length);
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