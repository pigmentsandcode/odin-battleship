import { Gameboard } from "./Gameboard.js";

describe("get empty gameboard", () => {
  test("gameboard is empty", () => {
    const testBoard = new Gameboard();
    const board = testBoard.getGameboard();
    let isEmpty = true;
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (board[row][col] !== "empty") {
          isEmpty = false;
          break;
        }
      }
      if (!isEmpty) {
        break;
      }
    }
    expect(isEmpty).toBe(true);
  });
});

describe("place ships", () => {
  describe("valid placements", () => {
    let board;
    beforeEach(() => {
      board = new Gameboard();
    });

    test("valid size 3 vertical", () => {
      expect(board.placeShip(3, [1, 3], "vertical")).toBe(true);
    });

    test("valid size 3 horizontal", () => {
      expect(board.placeShip(3, [7, 3], "horizontal")).toBe(true);
    });

    test("valid size 5 vertical", () => {
      expect(board.placeShip(5, [1, 4], "vertical")).toBe(true);
    });

    test("place 2 ships", () => {
      const firstShip = board.placeShip(3, [2, 2], "vertical");
      const secondShip = board.placeShip(4, [3, 2], "horizontal");
      expect(firstShip).toBe(true);
      expect(secondShip).toBe(true);
    });
  });
  describe("invalid placements", () => {
    let board;
    beforeEach(() => {
      board = new Gameboard();
    });
    test("off grid", () => {
      const invalid = board.placeShip(3, [2, 9], "vertical");
      expect(invalid).toBe(false);
    });

    describe("overlapping", () => {
      let firstShip;
      beforeEach(() => {
        firstShip = board.placeShip(3, [2, 2], "horizontal");
      });
      test("overlap vertical", () => {
        const secondShip = board.placeShip(4, [2, 0], "vertical");
        expect(secondShip).toBe(false);
      });
      test("overlap horizontal", () => {
        const secondShip = board.placeShip(4, [3, 2], "horizontal");
        expect(secondShip).toBe(false);
      });
    });
  });
});
