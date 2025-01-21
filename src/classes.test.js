import { Ship, Gameboard } from "./classes";

describe("Ship class", () => {
    let ship;

    beforeEach(() => {
        ship = new Ship("Submarine", 3);
    });

    test("initialize with the correct name and length", () => {
        expect(ship.name).toBe("Submarine");
        expect(ship.length).toBe(3);
        expect(ship.hitNumber).toBe(0);
    });

    test("increase hitNumber when hit() is called", () => {
        ship.hit();
        expect(ship.hitNumber).toBe(1);
        ship.hit();
        expect(ship.hitNumber).toBe(2);
    });

    test("return false for isSunk() if hitNumber is less than length", () => {
        ship.hit();
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });

    test("return true for isSunk() if hitNumber equals", () => {
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });

    test("fail to hit() already sunk ship", () => {
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.hit()).toBe(false);
    });
});

describe("Gameboard class", () => {
    let gameboard;
    let ship;

    beforeEach(() => {
        gameboard = new Gameboard();
        ship = new Ship("Submarine", 3);
    });

    test("Placing ship on gameboard", () => {
        gameboard.placeShip(ship, 3, 4, "horizontal");
        expect(gameboard.board[3][4]).toBe(ship);
        expect(gameboard.board[3][5]).toBe(ship);
        expect(gameboard.board[3][6]).toBe(ship);
    });

    test("Receive attack and miss", () => {
        gameboard.placeShip(ship, 2, 2, "vertical");
        gameboard.receiveAttack(2, 3);
        expect(gameboard.board[2][3]).toBe("miss");
        expect(gameboard.missedAttacks).toContainEqual([2, 3]);
        expect(ship.hitNumber).toBe(0);
    });

    test("Receive attack on ship", () => {
        gameboard.placeShip(ship, 5, 1, "horizontal");
        gameboard.receiveAttack(5, 2);
        expect(ship.hitNumber).toBe(1);
    });

    test("Destroy ship", () => {
        gameboard.placeShip(ship, 2, 5, "vertical");
        gameboard.receiveAttack(2, 5);
        gameboard.receiveAttack(3, 5);
        gameboard.receiveAttack(4, 5);
        expect(ship.isSunk()).toBeTruthy();
    });

    test("All ships on the board is destroyed", () => {
        gameboard.placeShip(ship, 8, 5, "horizontal");
        gameboard.receiveAttack(8, 5);
        gameboard.receiveAttack(8, 6);
        gameboard.receiveAttack(8, 7);
        expect(gameboard.allShipsSunk()).toBeTruthy();
    });
});
