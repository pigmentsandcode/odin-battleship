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
    this.nonDeployedFleet = new Map();
    this.fleetPositions = new Map();
    this.sunkFleet = new Map();
    this.deployedFleet = new Map();
  }

  getGameboard() {
    return this.board;
  }

  getSunkFleetObj() {
    return [...this.sunkFleet.values()];
  }

  getDeployedFleetObjs() {
    return [...this.deployedFleet.values()];
  }
  getNonDeployedFleetObjs() {
    return [...this.nonDeployedFleet.values()];
  }

  hasDeployedShip(name) {
    return this.deployedFleet.has(name);
  }

  hasNonDeployedShip(name) {
    return this.nonDeployedFleet.has(name);
  }

  hasSunkShip(name) {
    return this.sunkFleet.has(name);
  }

  hasShip(name) {
    return (
      this.hasNonDeployedShip(name) ||
      this.hasDeployedShip(name) ||
      this.hasSunkShip(name)
    );
  }

  getShipPosition(name) {
    return this.fleetPositions.get(name);
  }

  getSunkFleet() {
    return this.sunkFleet;
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

  addShip(name, length) {
    if (this.hasShip(name)) {
      throw new Error("The ship has already been added");
    }
    const ship = new Ship(length, name);
    this.nonDeployedFleet.set(name, ship);
    this.fleetPositions.set(name, null);
  }

  placeShip(name, coordinates, direction) {
    const [startX, startY] = coordinates;
    const newShip = this.nonDeployedFleet.get(name);
    const shipSize = newShip.length;

    if (this.checkValidPlace(startX, startY, direction, shipSize)) {
      const cellCoords = [];
      if (direction === "horizontal") {
        for (let i = startX; i < shipSize + startX; i++) {
          this.board[i][startY] = { ship: newShip, hit: false };
          cellCoords.push([i, startY]);
        }
      } else {
        for (let i = startY; i < shipSize + startY; i++) {
          this.board[startX][i] = { ship: newShip, hit: false };
          cellCoords.push([startX, i]);
        }
      }
      this.fleetPositions.set(name, [cellCoords, direction]);
      this.deployedFleet.set(name, newShip);
      this.nonDeployedFleet.delete(name);
      return true;
    } else {
      return false;
    }
  }

  receiveAttack(attackX, attackY) {
    if (attackX < 0 || attackY < 0 || attackX > 9 || attackY > 9) {
      return "invalid";
    }

    let targetSpot = this.board[attackX][attackY];
    if (targetSpot === "empty") {
      this.board[attackX][attackY] = "miss";
      return "miss";
    } else if (targetSpot === "miss") {
      return "repeat miss";
    } else {
      const targetShip = targetSpot.ship;
      if (targetSpot.hit) {
        return "repeat hit";
      }
      targetShip.hit();
      targetSpot.hit = true;
      if (targetShip.isSunk()) {
        this.sunkFleet.set(targetShip.name, targetShip);
        this.deployedFleet.delete(targetShip.name);
        return "sink";
      }
      return "hit";
    }
  }
}
