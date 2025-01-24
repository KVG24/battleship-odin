export class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
        this.hitNumber = 0;
    }

    hit() {
        if (this.hitNumber < this.length) {
            this.hitNumber++;
        } else return false;
    }

    isSunk() {
        return this.hitNumber >= this.length;
    }
}

export class Gameboard {
    constructor() {
        this.missedAttacks = [];
        this.ships = [];
        this.board = Array(10)
            .fill(null)
            .map(() => Array(10).fill(null));
    }

    placeShip(ship, startX, startY, direction) {
        if (!this.isPlacementValid(ship, startX, startY, direction)) {
            throw new Error("Invalid coordinates");
        }

        const coordinates = [];
        for (let i = 0; i < ship.length; i++) {
            if (direction === "horizontal") {
                this.board[startX][startY + i] = ship;
                coordinates.push([startX, startY + i]);
            } else if (direction === "vertical") {
                this.board[startX + i][startY] = ship;
                coordinates.push([startX + i, startY]);
            }
        }

        this.ships.push({ ship, coordinates });
    }

    isPlacementValid(ship, startX, startY, direction) {
        if (direction === "horizontal") {
            if (startY + ship.length > 10) {
                return false;
            }
        } else if (direction === "vertical") {
            if (startX + ship.length > 10) {
                return false;
            }
        } else {
            return false;
        }

        for (let i = 0; i < ship.length; i++) {
            let x, y;
            if (direction === "horizontal") {
                x = startX;
                y = startY + i;
            } else {
                x = startX + i;
                y = startY;
            }

            if (this.board[x][y] !== null) {
                return false;
            }
        }

        return true;
    }

    receiveAttack(x, y) {
        const target = this.board[x][y];

        if (target === null) {
            this.missedAttacks.push([x, y]);
            this.board[x][y] = "miss";
        } else if (typeof target === "object" && target instanceof Ship) {
            target.hit();
            this.board[x][y] = "hit";
        }
    }

    allShipsSunk() {
        return this.ships.every(({ ship }) => ship.isSunk());
    }
}

export class Player {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.gameboard = new Gameboard();
    }
}
