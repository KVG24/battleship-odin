import { Player, Ship, Gameboard } from "./classes";
import { placeShipRandomly } from "./randomPlacement";
import {
    renderPreviewGameboard,
    flipPreviewShips,
    attachPreviewShipEventListeners,
    defineDraggedShip,
} from "./shipPlacementModal";
import gameOverImg from "./images/gameover.jpeg";

const playerOneName = document.getElementById("player-one-name");
const playerTwoName = document.getElementById("player-two-name");
const playerOneGameboardDiv = document.getElementById("player-one-gameboard");
const playerTwoGameboardDiv = document.getElementById("player-two-gameboard");
const infoMsg = document.getElementById("info-msg");
const names = document.querySelector(".name");

// New game modal
const enterNameModal = document.querySelector(".enter-name-modal");
const inputName = document.getElementById("name");
const enterNameButton = document.getElementById("enter-name-button");

// Ship placement modal
const gameBoardPreviewModal = document.querySelector(
    ".gameboard-preview-modal"
);
const playerGameboardPreview = document.querySelector(
    ".player-gameboard-preview"
);
const placementErrorMsg = document.getElementById("placement-error");
const flipButton = document.getElementById("flip-button");
const randomButton = document.getElementById("random-button");
const startButton = document.getElementById("start-button");
const everyShipInContainer = document.querySelectorAll(".ship");

let isPlayerTurn = true;

let playerOne = new Player(`Human`, "real");
let playerTwo = new Player("Computer", "computer");

export function newGame() {
    // Enter name modal
    names.style.display = "none";
    infoMsg.style.display = "none";
    enterNameModal.style.display = "flex";
    enterNameButton.addEventListener("click", () => {
        enterNameModal.style.display = "none";
        playerOne = new Player(`${inputName.value}`, "real");
        playerTwo = new Player("Computer", "computer");
        placeShipRandomly(playerTwo, new Ship("Corvette", 2));
        placeShipRandomly(playerTwo, new Ship("Submarine", 3));
        placeShipRandomly(playerTwo, new Ship("Cruiser", 3));
        placeShipRandomly(playerTwo, new Ship("Frigate", 4));
        placeShipRandomly(playerTwo, new Ship("Carrier", 5));

        // Ship placement modal
        gameBoardPreviewModal.style.display = "block";
        everyShipInContainer.forEach((ship) => {
            ship.addEventListener("dragstart", defineDraggedShip);
        });
        renderPreviewGameboard(playerOne, playerGameboardPreview);
        attachPreviewShipEventListeners(playerOne);
        flipButton.addEventListener("click", flipPreviewShips);
        randomButton.addEventListener("click", () => {
            playerOne.gameboard = new Gameboard();
            everyShipInContainer.forEach(
                (ship) => (ship.style.display = "none")
            );
            placeShipRandomly(playerOne, new Ship("Corvette", 2));
            placeShipRandomly(playerOne, new Ship("Submarine", 3));
            placeShipRandomly(playerOne, new Ship("Cruiser", 3));
            placeShipRandomly(playerOne, new Ship("Frigate", 4));
            placeShipRandomly(playerOne, new Ship("Carrier", 5));
            renderPreviewGameboard(playerOne, playerGameboardPreview);
        });
        startButton.addEventListener("click", () => {
            if (playerOne.gameboard.ships.length < 5) {
                startButton.style.border = "3px solid red";
                setTimeout(() => (startButton.style.border = ""), 300);
                placementErrorMsg.style.display = "block";
                placementErrorMsg.textContent = "Place ALL ships";
                return;
            }

            gameBoardPreviewModal.style.display = "none";
            playerOneName.textContent = playerOne.name;
            playerTwoName.textContent = playerTwo.name;
            names.style.display = "block";
            playerOneGameboardDiv.replaceChildren();
            playerTwoGameboardDiv.replaceChildren();
            renderGameboards(
                playerOne,
                playerOneGameboardDiv,
                playerTwo,
                playerTwoGameboardDiv
            );
        });
    });
}

function renderGameboards(
    playerOne,
    playerOneGameboard,
    playerTwo,
    playerTwoGameboard
) {
    const playerOneGameboardDivArray = playerOne.gameboard.board;
    const playerTwoGameboardDivArray = playerTwo.gameboard.board;

    // Player one / Human gameboard render
    playerOneGameboardDivArray.forEach((subarray, y) => {
        subarray.forEach((cell, x) => {
            const div = document.createElement("div");

            div.classList.add("cell");

            div.textContent =
                cell === "miss" ? "🫧" : cell === "hit" ? "🔥" : "";
            if (cell === "hit") div.style.backgroundColor = "gray";
            if (cell && typeof cell === "object")
                div.style.backgroundColor = "gray";

            div.dataset.x = x;
            div.dataset.y = y;

            playerOneGameboard.appendChild(div);
        });
    });

    // Player Two / Computer gameboard render
    playerTwoGameboardDivArray.forEach((subarray, y) => {
        subarray.forEach((cell, x) => {
            const div = document.createElement("div");

            div.classList.add("cell");
            div.classList.add("enemy-cell");

            div.textContent =
                cell === "miss" ? "🫧" : cell === "hit" ? "🔥" : "";
            if (cell === "hit") div.style.backgroundColor = "gray";

            div.dataset.x = x;
            div.dataset.y = y;

            div.addEventListener("click", () => {
                if (!isPlayerTurn || cell === "miss" || cell === "hit") return;

                playerOneGameboard.replaceChildren();
                playerTwoGameboard.replaceChildren();

                const prevArray = playerTwo.gameboard.missedAttacks.length;
                playerTwo.gameboard.receiveAttack(y, x);
                renderGameboards(
                    playerOne,
                    playerOneGameboard,
                    playerTwo,
                    playerTwoGameboard
                );

                // Highlight attacked cell
                const attackedCell = playerTwoGameboardDiv.querySelector(
                    `[data-x='${x}'][data-y='${y}']`
                );
                attackedCell.classList.add("hit");
                setTimeout(() => attackedCell.classList.remove("hit"), 500);

                infoMsg.style.display = "block";
                infoMsg.textContent = `${playerOne.name} hit ${playerTwo.name}'s ship. ${playerOne.name} aiming to fire again`;

                // Attack again if hit was successful (check if missed attacks array increased in size)
                const newArray = playerTwo.gameboard.missedAttacks.length;
                if (newArray > prevArray) {
                    isPlayerTurn = false;

                    infoMsg.textContent = `${playerOne.name} missed. ${playerTwo.name} aiming...`;

                    setTimeout(() => {
                        computerTurn(
                            playerOne,
                            playerOneGameboard,
                            playerTwo,
                            playerTwoGameboard
                        );
                    }, 1000);
                }
            });
            playerTwoGameboard.appendChild(div);
        });
    });

    // Highlight sunken ships
    const boards = [
        { player: playerOne, gameboardDiv: playerOneGameboard },
        { player: playerTwo, gameboardDiv: playerTwoGameboard },
    ];

    boards.forEach(({ player, gameboardDiv }) => {
        player.gameboard.ships.forEach((shipData) => {
            const ship = shipData.ship;
            if (ship.isSunk()) {
                shipData.coordinates.forEach((coord) => {
                    const y = coord[0];
                    const x = coord[1];
                    const sunkenShipCell = gameboardDiv.querySelector(
                        `.cell[data-x="${x}"][data-y="${y}"]`
                    );
                    if (sunkenShipCell) {
                        sunkenShipCell.style.backgroundColor = "darkred";
                    }
                });
            }
        });
    });

    checkGameOver(playerOne, playerTwo, gameOverModalContainer, winnerMsg);
}

// Computer's logic
function computerTurn(
    playerOne,
    playerOneGameboard,
    playerTwo,
    playerTwoGameboard
) {
    let x, y;

    // Attack random coordinates
    do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
    } while (
        playerOne.gameboard.board[y][x] === "miss" ||
        playerOne.gameboard.board[y][x] === "hit"
    );

    playerOneGameboard.replaceChildren();
    playerTwoGameboard.replaceChildren();

    const prevArray = playerOne.gameboard.missedAttacks.length;

    playerOne.gameboard.receiveAttack(y, x);
    renderGameboards(
        playerOne,
        playerOneGameboard,
        playerTwo,
        playerTwoGameboard
    );
    // Highlight attacked cell
    const attackedCell = playerOneGameboardDiv.querySelector(
        `[data-x='${x}'][data-y='${y}']`
    );
    attackedCell.classList.add("hit");
    setTimeout(() => attackedCell.classList.remove("hit"), 500);

    infoMsg.style.display = "block";
    infoMsg.textContent = `${playerTwo.name} missed. ${playerOne.name} aiming...`;

    const newArray = playerOne.gameboard.missedAttacks.length;

    // Attack again if hit was successful (check if missed attacks array increased in size)
    if (newArray == prevArray) {
        isPlayerTurn = false;
        infoMsg.textContent = `${playerTwo.name} hit ${playerOne.name}'s ship. ${playerTwo.name} aiming to fire again`;
        setTimeout(() => {
            computerTurn(
                playerOne,
                playerOneGameboard,
                playerTwo,
                playerTwoGameboard
            );
        }, 1000);
    }

    isPlayerTurn = true;
}

// Game over logic
function checkGameOver(playerOne, playerTwo, modalDiv, messageDiv) {
    if (playerTwo.gameboard.allShipsSunk()) {
        setTimeout(() => (infoMsg.textContent = ""), 0);
        setTimeout(() => (modalDiv.style.display = "flex"), 500);
        messageDiv.textContent = `${playerOne.name} won!`;
    } else if (playerOne.gameboard.allShipsSunk()) {
        setTimeout(() => (infoMsg.textContent = ""), 0);
        setTimeout(() => (modalDiv.style.display = "flex"), 500);
        messageDiv.textContent = `${playerTwo.name} won!`;
    }
}

// Game Over modal
const gameOverModalContainer = document.querySelector(
    ".game-over-modal-container"
);
const winnerMsg = document.getElementById("winner-message");
gameOverModalContainer.style.backgroundImage = `url(${gameOverImg})`;

const restartBtn = document.getElementById("restart");
restartBtn.addEventListener("click", restart);

function restart() {
    playerOneGameboardDiv.replaceChildren();
    playerTwoGameboardDiv.replaceChildren();
    gameOverModalContainer.style.display = "none";
    playerTwoName.textContent = "";
    isPlayerTurn = true;
    everyShipInContainer.forEach((ship) => (ship.style.display = "flex"));
    newGame();
}
