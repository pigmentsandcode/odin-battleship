export class Ship {
  constructor(length) {
    this.length = length;
    this.numHits = 0;
    this.sunk = false;
  }

  hit() {
    if (!this.sunk) {
      this.numHits++;
      if (this.numHits === this.length) {
        this.sunk = true;
      }
    }
  }

  isSunk() {
    return this.sunk;
  }
}
