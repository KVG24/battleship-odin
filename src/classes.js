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
        return this.hitNumber == this.length;
    }
}
