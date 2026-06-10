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

describe("addShips", () => {
  let board;
  beforeEach(() => {
    board = new Gameboard();
  });

  test("add length 3 ship", () => {
    board.addShip("length3", 3);
    expect(board.hasNonDeployedShip("length3")).toBe(true);
  });

  test("error if add ship of same name", () => {
    board.addShip("length3", 3);
    expect(() => board.addShip("length3", 3)).toThrow(
      "The ship has already been added",
    );
  });
});

describe("place ships", () => {
  describe("valid placements", () => {
    let board;
    const shipName3 = "shipLength3";
    const shipName5 = "shipLength5";
    const shipName4 = "shipLength4";

    beforeEach(() => {
      board = new Gameboard();
    });

    test("valid size 3 vertical", () => {
      board.addShip(shipName3, 3);
      expect(board.placeShip(shipName3, [1, 3], "vertical")).toBe(true);
      expect(board.hasDeployedShip(shipName3)).toBe(true);
      expect(board.hasNonDeployedShip(shipName3)).toBeFalsy();
      const coordsResult = board.getShipPosition(shipName3)[0];
      expect(coordsResult[0][0]).toBe(1);
      expect(coordsResult[0][1]).toBe(3);
    });

    test("valid size 3 horizontal", () => {
      board.addShip(shipName3, 3);
      expect(board.placeShip(shipName3, [7, 3], "horizontal")).toBe(true);
      expect(board.hasDeployedShip(shipName3)).toBe(true);
      expect(board.hasNonDeployedShip(shipName3)).toBeFalsy();
      const coordsResult = board.getShipPosition(shipName3)[0];
      expect(coordsResult[0][0]).toBe(7);
      expect(coordsResult[0][1]).toBe(3);
    });

    test("valid size 5 vertical", () => {
      board.addShip(shipName5, 5);
      expect(board.placeShip(shipName5, [1, 4], "vertical")).toBe(true);
      expect(board.hasDeployedShip(shipName5)).toBe(true);
      expect(board.hasNonDeployedShip(shipName5)).toBeFalsy();
      const coordsResult = board.getShipPosition(shipName5)[0];
      expect(coordsResult[0][0]).toBe(1);
      expect(coordsResult[0][1]).toBe(4);
    });

    test("place 2 ships", () => {
      board.addShip(shipName3, 3);
      board.addShip(shipName4, 4);
      const firstShip = board.placeShip(shipName3, [2, 2], "vertical");
      const secondShip = board.placeShip(shipName4, [3, 2], "horizontal");
      expect(firstShip).toBe(true);
      expect(secondShip).toBe(true);
      expect(board.hasDeployedShip(shipName3)).toBe(true);
      expect(board.hasDeployedShip(shipName4)).toBe(true);
    });
  });

  describe("invalid placements", () => {
    let board;
    const shipName3 = "shipLength3";
    const shipName4 = "shipLength4";

    beforeEach(() => {
      board = new Gameboard();
    });
    test("off grid", () => {
      board.addShip(shipName3, 3);
      const invalid = board.placeShip(shipName3, [2, 9], "vertical");
      expect(invalid).toBe(false);
      expect(board.hasDeployedShip(shipName3)).toBeFalsy();
    });

    describe("overlapping", () => {
      let firstShip;
      beforeEach(() => {
        board.addShip(shipName3, 3);
        firstShip = board.placeShip(shipName3, [2, 2], "horizontal");

        board.addShip(shipName4, 4);
      });
      test("overlap vertical", () => {
        const secondShip = board.placeShip(shipName4, [2, 0], "vertical");
        expect(secondShip).toBe(false);
        expect(board.hasDeployedShip(shipName4)).toBeFalsy();
      });
      test("overlap horizontal", () => {
        const secondShip = board.placeShip(shipName4, [3, 2], "horizontal");
        expect(secondShip).toBe(false);
        expect(board.hasDeployedShip(shipName4)).toBeFalsy();
      });
    });
  });
});

describe("receiveAttack", () => {
  describe("valid attacks", () => {
    let testBoard;
    let shipName3 = "shipLength3";

    beforeEach(() => {
      testBoard = new Gameboard();
      testBoard.addShip(shipName3, 3);
      testBoard.placeShip(shipName3, [2, 2], "horizontal");
    });

    test("valid miss", () => {
      let result = testBoard.receiveAttack(7, 3);
      expect(result).toBe("miss");

      const resultBoard = testBoard.getGameboard();
      expect(resultBoard[7][3]).toBe("miss");
    });
    test("valid hit", () => {
      const result = testBoard.receiveAttack(3, 2);
      expect(result).toBe("hit");
      const resultBoard = testBoard.getGameboard();
      expect(resultBoard[3][2].hit).toBe(true);
      expect(testBoard.hasDeployedShip(shipName3)).toBe(true);
      expect(testBoard.hasSunkShip(shipName3)).toBeFalsy();
    });
    test("valid sink", () => {
      testBoard.receiveAttack(2, 2);
      testBoard.receiveAttack(3, 2);
      const isSunk = testBoard.receiveAttack(4, 2);
      expect(isSunk).toBe("sink");

      const resultBoard = testBoard.getGameboard();
      expect(resultBoard[2][2].ship.isSunk()).toBe(true);
      expect(testBoard.hasDeployedShip(shipName3)).toBeFalsy();
      expect(testBoard.hasSunkShip(shipName3)).toBe(true);
    });
  });
  describe("invalid attacks", () => {
    let testBoard;
    let shipName3 = "shipLength3";

    beforeEach(() => {
      testBoard = new Gameboard();
      testBoard.addShip(shipName3, 3);
      testBoard.placeShip(shipName3, [2, 2], "horizontal");
    });
    test("invalid repeat miss", () => {
      testBoard.receiveAttack(2, 1);
      const result = testBoard.receiveAttack(2, 1);
      expect(result).toBe("repeat miss");
    });
    test("invalid repeat hit", () => {
      testBoard.receiveAttack(2, 2);
      const result = testBoard.receiveAttack(2, 2);
      expect(result).toBe("repeat hit");
    });
    test("invalid off grid", () => {
      const result = testBoard.receiveAttack(9, 10);
      expect(result).toBe("invalid");
    });
  });
});

describe("numSunk values", () => {
  let testBoard;
  let shipName3 = "shipLength3";

  beforeEach(() => {
    testBoard = new Gameboard();
    testBoard.addShip(shipName3, 3);
    testBoard.placeShip(shipName3, [2, 2], "horizontal");
  });

  test("initial is zero", () => {
    const sunkShips = testBoard.getSunkFleet();
    expect(sunkShips.size).toBe(0);
  });

  test("after miss is still zero", () => {
    testBoard.receiveAttack(7, 3);
    const sunkShips = testBoard.getSunkFleet();
    expect(sunkShips.size).toBe(0);
  });

  test("hit once is still zero", () => {
    testBoard.receiveAttack(3, 2);
    const sunkShips = testBoard.getSunkFleet();
    expect(sunkShips.size).toBe(0);
  });

  test("ship is sunk - value is one", () => {
    testBoard.receiveAttack(2, 2);
    testBoard.receiveAttack(3, 2);
    testBoard.receiveAttack(4, 2);
    const sunkShips = testBoard.getSunkFleet();
    expect(sunkShips.size).toBe(1);
  });
});
