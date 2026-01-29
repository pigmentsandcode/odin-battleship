import { Ship } from "./Ship.js";

export class Gameboard {
  constructor() {
    this.board = [];
    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
      for (let j = 0; j < 10; j++) {
        this.board[i][j] = "empty";
      }
    }
    this.numSunk = 0;
  }

  getGameboard() {
    return this.board;
  }

  checkValidPlace(startX, startY, direction, shipSize) {
    if (startX < 0 || startY < 0 || startX > 9 || startY > 9) {
      return false;
    }
    if (direction === "horizontal") {
      if (shipSize + startX - 1 > 9) {
        return false;
      }
      for (let i = startX; i < shipSize + startX; i++) {
        if (this.board[i][startY] !== "empty") {
          return false;
        }
      }
      return true;
    }
    if (direction === "vertical") {
      if (shipSize + startY - 1 > 9) {
        return false;
      }
      for (let i = startY; i < shipSize + startY; i++) {
        if (this.board[startX][i] !== "empty") {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  placeShip(shipSize, coordinates, direction) {
    const [startX, startY] = coordinates;
    if (this.checkValidPlace(startX, startY, direction, shipSize)) {
      const newShip = new Ship(shipSize);
      if (direction === "horizontal") {
        for (let i = startX; i < shipSize + startX; i++) {
          this.board[i][startY] = { ship: newShip, hit: false };
        }
      } else {
        for (let i = startY; i < shipSize + startY; i++) {
          this.board[startX][i] = { ship: newShip, hit: false };
        }
      }
      return true;
    } else {
      return false;
    }
  }
}
