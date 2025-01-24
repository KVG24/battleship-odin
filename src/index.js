import "./style.css";
import { renderGameboard } from "./logic";
import { Ship, Player } from "./classes";

const playerOneGameboardDiv = document.getElementById("player-one-gameboard");
const playerTwoGameboardDiv = document.getElementById("player-two-gameboard");

// Basic initialization
const playerOne = new Player("Human", "real");
const playerTwo = new Player("Computer", "computer");

const corvette = new Ship("Corvette", 2);
const submarine = new Ship("Submarine", 3);
const cruiser = new Ship("Cruiser", 3);
const frigate = new Ship("Frigate", 4);
const carrier = new Ship("Carrier", 5);

playerOne.gameboard.placeShip(corvette, 6, 5, "vertical");
playerOne.gameboard.placeShip(submarine, 1, 2, "horizontal");
playerOne.gameboard.placeShip(cruiser, 3, 1, "horizontal");
playerOne.gameboard.placeShip(frigate, 1, 7, "vertical");
playerOne.gameboard.placeShip(carrier, 9, 2, "horizontal");

playerTwo.gameboard.placeShip(corvette, 4, 5, "vertical");
playerTwo.gameboard.placeShip(submarine, 2, 4, "horizontal");
playerTwo.gameboard.placeShip(cruiser, 1, 9, "vertical");
playerTwo.gameboard.placeShip(frigate, 5, 1, "vertical");
playerTwo.gameboard.placeShip(carrier, 8, 4, "horizontal");

// Display names
document.getElementById("player-one-name").textContent = playerOne.name;
document.getElementById("player-two-name").textContent = playerTwo.name;

function newGame() {
    renderGameboard(
        playerOne,
        playerOneGameboardDiv,
        playerTwo,
        playerTwoGameboardDiv
    );
}

newGame();
