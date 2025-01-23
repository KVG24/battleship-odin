import "./style.css";
import { Player, Ship } from "./classes";
import { renderGameboard } from "./dom";

const humanGameboardDiv = document.getElementById("human-gameboard");
const computerGameboardDiv = document.getElementById("computer-gameboard");

const humanPlayer = new Player("Human", "real");
const computerPlayer = new Player("Computer", "computer");

const corvette = new Ship("Corvette", 2);
const submarine = new Ship("Submarine", 3);
const cruiser = new Ship("Cruiser", 3);
const frigate = new Ship("Frigate", 4);
const carrier = new Ship("Carrier", 5);

humanPlayer.gameboard.placeShip(corvette, 6, 5, "vertical");
humanPlayer.gameboard.placeShip(submarine, 1, 2, "horizontal");
humanPlayer.gameboard.placeShip(cruiser, 3, 1, "horizontal");
humanPlayer.gameboard.placeShip(frigate, 1, 7, "vertical");
humanPlayer.gameboard.placeShip(carrier, 9, 2, "horizontal");

computerPlayer.gameboard.placeShip(corvette, 4, 5, "vertical");
computerPlayer.gameboard.placeShip(submarine, 2, 4, "horizontal");
computerPlayer.gameboard.placeShip(cruiser, 1, 9, "vertical");
computerPlayer.gameboard.placeShip(frigate, 5, 1, "vertical");
computerPlayer.gameboard.placeShip(carrier, 8, 4, "horizontal");

renderGameboard(humanPlayer, humanGameboardDiv);
renderGameboard(computerPlayer, computerGameboardDiv);

// Display names
document.getElementById("human-name").textContent = humanPlayer.name;
document.getElementById("computer-name").textContent = computerPlayer.name;
