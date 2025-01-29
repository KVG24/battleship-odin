import "./style.css";
import { newGame } from "./logic";

// // Basic initialization

// playerOne.gameboard.placeShip(new Ship("Corvette", 2), 6, 5, "vertical");
// playerOne.gameboard.placeShip(new Ship("Submarine", 3), 1, 2, "horizontal");
// playerOne.gameboard.placeShip(new Ship("Cruiser", 3), 3, 1, "horizontal");
// playerOne.gameboard.placeShip(new Ship("Frigate", 4), 1, 7, "vertical");
// playerOne.gameboard.placeShip(new Ship("Carrier", 5), 9, 2, "horizontal");

// placeShipRandomly(playerTwo, new Ship("Corvette", 2));
// placeShipRandomly(playerTwo, new Ship("Submarine", 3));
// placeShipRandomly(playerTwo, new Ship("Cruiser", 3));
// placeShipRandomly(playerTwo, new Ship("Frigate", 4));
// placeShipRandomly(playerTwo, new Ship("Carrier", 5));

// // Display names
// document.getElementById("player-one-name").textContent = playerOne.name;
// document.getElementById("player-two-name").textContent = playerTwo.name;

newGame();

// To Do:
// - add starting screen:
// 	    - first modal - enter name
//      - second modal - player gameboard preview with drag and drop system
// - add smart computer moves
// - clean up all js code, add separate DOM handling module
// - add styling
