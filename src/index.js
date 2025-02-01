import "./style.css";
import { newGame } from "./logic";
import backgroundImg from "./images/battleships.jpeg";

document.body.style.backgroundImage = `url(${backgroundImg})`;

newGame();

// To Do:
// - add smart computer moves
