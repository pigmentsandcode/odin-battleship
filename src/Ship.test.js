import { Ship } from "./Ship.js";

let ship;

describe("Ship methods", () => {
  beforeEach(() => {
    ship = new Ship(2);
  });

  test("hits increase", () => {
    ship.hit();
    expect(ship.numHits).toBe(1);
  });

  test("is not sunk after 1 hit", () => {
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test("is sunk after 2 hits", () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
