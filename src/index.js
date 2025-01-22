import "./style.css";
import { Player, Ship, Gameboard } from "./classes";
import { renderGameboard } from "./dom";

const humanGameboardDiv = document.getElementById("human-gameboard");
const computerGameboardDiv = document.getElementById("computer-gameboard");
const humanNameDiv = document.getElementById("human-name");
const computerNameDiv = document.getElementById("computer-name");

const humanPlayer = new Player("Human", "real");
const computerPlayer = new Player("Computer", "computer");

const submarine = new Ship("Submarine", 3);
const cruiser = new Ship("Cruiser", 3);
const frigate = new Ship("Frigate", 4);
const carrier = new Ship("Carrier", 5);

humanPlayer.gameboard.placeShip(submarine, 1, 2, "horizontal");
humanPlayer.gameboard.placeShip(cruiser, 3, 1, "horizontal");
humanPlayer.gameboard.placeShip(frigate, 1, 7, "vertical");
humanPlayer.gameboard.placeShip(carrier, 9, 2, "horizontal");
humanPlayer.gameboard.receiveAttack(1, 3);
humanPlayer.gameboard.receiveAttack(9, 3);
humanPlayer.gameboard.receiveAttack(9, 4);
humanPlayer.gameboard.receiveAttack(8, 4);
humanPlayer.gameboard.receiveAttack(8, 3);

computerPlayer.gameboard.placeShip(submarine, 2, 4, "horizontal");
computerPlayer.gameboard.placeShip(cruiser, 1, 9, "vertical");
computerPlayer.gameboard.placeShip(frigate, 5, 1, "vertical");
computerPlayer.gameboard.placeShip(carrier, 8, 4, "horizontal");

renderGameboard(humanPlayer, humanGameboardDiv);
renderGameboard(computerPlayer, computerGameboardDiv);

humanNameDiv.textContent = humanPlayer.name;
computerNameDiv.textContent = computerPlayer.name;
