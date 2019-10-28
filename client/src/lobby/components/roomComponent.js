import React, { Component } from 'react';
import "./roomComponent.css";
import WaitingRoomComponent from './waitingRoomComponent';
import GameRoomComponent from "./gameRoomComponent";

class RoomComponent extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      gameName: "",
      modalError: "",
      clickedGameElement: null,
      screen: "lobby"
    }
  }

  getGames = () => {
    // get the games but put the newer ones at the top
    //return this.props.games.reverse();
    return this.props.games.filter(game => game.name !== "waitingRoom");
  }

  getCurrentGame = () =>{

  }

  componentDidMount() {
    console.log(this.props)
  }

  selectGame = (gameID) => {
    this.setState({clickedGameElement: gameID});
  }

  changeGameNameText = (e) => {
    this.setState({ gameName: e.target.value });
  }

  createNewGameClicked = () => {
    // should open a modal
    this.setState({ modalOpen: !this.state.modalOpen});
  }

  submitNewGame = () => {
    if(this.state.gameName === ""){
      this.setState({modalError: "Error: Game name can not be blank"})
    }
    else if (this.props.games.filter(x => x.name === this.state.gameName).length > 0){
      this.setState({modalError: "Error: Game Name Already Taken"})
    }
    else if (/[^\w\d]/.test(this.state.gameName)){
      this.setState({modalError: "Error: Room cannot contain non alphanumeric characters"})
    }
    else {
      // handle sending new game to be made
      this.setState({modalOpen: false, modalError: "", screen: "gameCreated"});
      this.props.socket.emit("createGame", {user: this.props.user, room: this.state.gameName});
    }
  }

  closeModal = () => {
    this.setState({modalOpen: false, modalError: "", gameName: ""});
  }

  joinGame = (room) => {
    console.log(this.props.user)
    this.props.socket.emit("joinGame", {room, user: this.props.user});
    this.setState({screen: "joinedGame"});
  }


  render() {
    return (
      <div className="room-wrapper">
      {this.state.screen === "lobby" ?
        <WaitingRoomComponent 
        users = {this.props.users}
        state = {this.state}
        getGames ={this.getGames}
        createNewGameClicked = {this.createNewGameClicked}
        selectGame = {this.selectGame}
        joinGame = {this.joinGame}
        />
        :
        <GameRoomComponent 
          gameData={this.props.gameData}
        />
      }
        {this.state.modalOpen ?
          <div className="room-info-modal">
            <div className="room-info-modal-title">
              <p className="room-info-modal-title-text">CREATE A MULTIPLAYER GAME</p>
              <p className="room-info-close-modal" onClick={this.closeModal}>X</p>
            </div>
            <div className="room-info-modal-form">
              <label for="game-name"><h4>Give the game a name</h4></label>
              <input name="game-name" value={this.state.gameName} onChange={this.changeGameNameText}></input>
              <p className="room-info-modal-error-message">{this.state.modalError}</p>
              <button onClick={this.submitNewGame}>CREATE GAME</button>
            </div>
          </div> : ""}
      </div>
    )
  }
}

export default RoomComponent;

// todo

/*
  add a popup if room is full when trying to join? new popup? maybe use a popup to confirm joining the room?

  create the created room component



*/
