import React, { Component } from 'react';
import "./roomComponent.css";

class RoomComponent extends Component {
  constructor() {
    super();
    this.state = {
      gamesTest: [
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
        {creator: "jim", users: ["jim"], name: "horsecrap"},
      ]
    }
  }

  getGames = () => {
    // get the games but put the newer ones at the top
    return this.state.gamesTest.reverse();
  }

  componentDidMount() {

  }


  render() {
    return (
      <div className="room-wrapper">
        <div className="lobby-banner room-banner">
          <p className="room-banner-left">ACTIVE GAMES ({this.getGames().length})</p>
          <p className="room-banner-right">ACTIVE PLAYERS ({this.props.users.length})</p>
        </div>
        <div className="room-info-wrapper">
          <div className="room-info">
            <div className="room-info-header">
              <p className="list-item-fix">Players</p>
              <p className="list-item-fix">User</p>
              <p className="list-item-fix">Room Name</p>
            </div>
            <div className="room-info-list custom-scroll-bar">
              {this.getGames().map(game => (
              <div className="room-info-item">
                <p className="list-item-fix">{game.users.length} / 2</p>
                <p className="list-item-fix">{game.creator}</p>
                <p className="list-item-fix">{game.name}</p>
              </div>
              ))}
            </div>
            <div className="room-info-buttons">
                <button className="room-info-button" onClick={(e)=>e}>PLAY SINGLE PLAYER</button>
                <button className="room-info-button" onClick={(e)=>e}>CREATE A GAME</button>
            </div>
          </div>
          <div className="room-users">
            <div className="user-list custom-scroll-bar">
              {this.props.users.map(user => <p className="user-list-item">{user}</p>)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RoomComponent;