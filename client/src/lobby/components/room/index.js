import React, { Component } from "react";
import "./roomComponent.css";
import WaitingRoomComponent from "./roomComponents/waitingRoomComponent";
import GameRoomComponent from "./roomComponents/gameRoomComponent";

class RoomComponent extends Component {
  constructor() {
    super();
    this.state = {
      // modal for game creation flag
      modalOpen: false,
      // controlled input for game creation
      gameName: "",
      // error messaged from user trying to create game
      modalError: "",
      // element from list of available rooms the user has clicked on
      clickedGameElement: null,
    };
  }

  getGames = () => {
    // get the games but put the newer ones at the top
    return this.props.games.filter(game => game.name !== "waitingRoom").reverse();
  };

  componentDidMount() {}

  selectGame = gameID => {
    // sets the clicked game room when a player clicks on an element shows the join room
    this.setState({ clickedGameElement: gameID });
  };

  changeGameNameText = e => {
    // matches the controlled elements value with state
    this.setState({ gameName: e.target.value });
  };

  createNewGameClicked = () => {
    // opens modal for creating a  game
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  submitNewGame = () => {
    // validation for creating a new game
    // check that game name is not empty
    // game name does not exist
    // and all characters are alphanumeric
    if (this.state.gameName === "") {
      this.setState({ modalError: "Error: Game name can not be blank" });
    } else if (
      this.props.games.filter(x => x.name === this.state.gameName).length > 0
    ) {
      this.setState({ modalError: "Error: Game Name Already Taken" });
    } else if (/[^\w\d]/.test(this.state.gameName)) {
      this.setState({
        modalError: "Error: Room cannot contain non alphanumeric characters"
      });
    } else {
      // closes the modal and removes all set items
      this.setState({ modalOpen: false, modalError: "", gameName: ""});
      // handle sending new game to be made on the backend
      this.props.socket.emit("createGame", {
        user: this.props.user,
        room: this.state.gameName,
      });
    }
  };

  closeModal = () => {
    // closes the game creation modal
    this.setState({ modalOpen: false, modalError: "", gameName: "" });
  };

  joinGame = room => {
    // send join room event to back end, this is handled in the lobby component
    this.props.socket.emit("joinGame", { room, user: this.props.user });
  };

  leaveGame = room => {
    // send leave room event to back end, this is handled in the lobby component
    this.props.socket.emit("leaveGame", { room, user: this.props.user });
  };

  start2PlayerGame = () => {
    //use a function to start the 2player game probably just route to the right page
  }

  start1PlayerGame = () => {
    // use function to change page to 1 player game
  }

  render() {
    return (
      <div className="room-wrapper">
        {this.props.screen === "lobby" ? (
          <WaitingRoomComponent
            users={this.props.users}
            state={this.state}
            getGames={this.getGames}
            createNewGameClicked={this.createNewGameClicked}
            selectGame={this.selectGame}
            joinGame={this.joinGame}
            leaveGame={this.leaveGame}
            start = {this.start1PlayerGame}
          />
        ) : (
          <GameRoomComponent
            gameData={this.props.gameData}
            leaveGame={this.leaveGame}
            user={this.props.user}
            start = {this.start2PlayerGame}
            screen = {this.props.screen}
          />
        )}
        {this.state.modalOpen ? (
          <div className="room-info-modal">
            <div className="room-info-modal-title">
              <p className="room-info-modal-title-text">
                CREATE A MULTIPLAYER GAME
              </p>
              <p className="room-info-close-modal" onClick={this.closeModal}>
                X
              </p>
            </div>
            <div className="room-info-modal-form">
              <label htmlFor="game-name">
                <h4>Give the game a name</h4>
              </label>
              <input
                name="game-name"
                value={this.state.gameName}
                onChange={this.changeGameNameText}
              ></input>
              <p className="room-info-modal-error-message">
                {this.state.modalError}
              </p>
              <button onClick={this.submitNewGame}>CREATE GAME</button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default RoomComponent;
