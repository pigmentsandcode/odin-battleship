import { Gameboard } from "./Gameboard";

export class Player {
  constructor(playerType, playerID) {
    this.playerType = playerType;
    this.playerBoard = new Gameboard();
    this.playerID = playerID;
  }

  getPlayerType() {
    return this.playerType;
  }

  getPlayerBoard() {
    return this.playerBoard;
  }

  getPlayerID() {
    return this.playerID;
  }
}
