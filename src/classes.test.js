import { Ship } from "./classes";

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
