import "./style.css";
import { renderGameboard } from "./logic";
import { Ship, Player } from "./classes";

const playerOneGameboardDiv = document.getElementById("player-one-gameboard");
const playerTwoGameboardDiv = document.getElementById("player-two-gameboard");

// Basic initialization
const playerOne = new Player("Human", "real");
const playerTwo = new Player("Computer", "computer");

playerOne.gameboard.placeShip(new Ship("Corvette", 2), 6, 5, "vertical");
playerOne.gameboard.placeShip(new Ship("Submarine", 3), 1, 2, "horizontal");
playerOne.gameboard.placeShip(new Ship("Cruiser", 3), 3, 1, "horizontal");
playerOne.gameboard.placeShip(new Ship("Cruiser", 4), 1, 7, "vertical");
playerOne.gameboard.placeShip(new Ship("Carrier", 5), 9, 2, "horizontal");

playerTwo.gameboard.placeShip(new Ship("Corvette", 2), 4, 5, "vertical");
playerTwo.gameboard.placeShip(new Ship("Submarine", 3), 2, 4, "horizontal");
playerTwo.gameboard.placeShip(new Ship("Cruiser", 3), 1, 9, "vertical");
playerTwo.gameboard.placeShip(new Ship("Cruiser", 4), 5, 1, "vertical");
playerTwo.gameboard.placeShip(new Ship("Carrier", 5), 8, 4, "horizontal");

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
