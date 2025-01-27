import "./style.css";
import { renderGameboard, placeShipRandomly } from "./logic";
import { Ship, Player } from "./classes";

const playerOneGameboardDiv = document.getElementById("player-one-gameboard");
const playerTwoGameboardDiv = document.getElementById("player-two-gameboard");

// Basic initialization
const playerOne = new Player("Human", "real");
const playerTwo = new Player("Computer", "computer");

playerOne.gameboard.placeShip(new Ship("Corvette", 2), 6, 5, "vertical");
playerOne.gameboard.placeShip(new Ship("Submarine", 3), 1, 2, "horizontal");
playerOne.gameboard.placeShip(new Ship("Cruiser", 3), 3, 1, "horizontal");
playerOne.gameboard.placeShip(new Ship("Frigate", 4), 1, 7, "vertical");
playerOne.gameboard.placeShip(new Ship("Carrier", 5), 9, 2, "horizontal");

placeShipRandomly(playerTwo, new Ship("Corvette", 2));
placeShipRandomly(playerTwo, new Ship("Submarine", 3));
placeShipRandomly(playerTwo, new Ship("Cruiser", 3));
placeShipRandomly(playerTwo, new Ship("Frigate", 4));
placeShipRandomly(playerTwo, new Ship("Carrier", 5));

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
