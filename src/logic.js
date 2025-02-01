import { Player, Ship, Gameboard } from "./classes";
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
const previewCells = playerGameboardPreview.children;
const flipButton = document.getElementById("flip-button");
const randomButton = document.getElementById("random-button");
const startButton = document.getElementById("start-button");
const placementErrorMsg = document.getElementById("placement-error");
const everyShipInContainer = document.querySelectorAll(".ship");
const corvetteShipDiv = document.getElementById("corvette");
const submarineShipDiv = document.getElementById("submarine");
const cruiserShipDiv = document.getElementById("cruiser");
const frigateShipDiv = document.getElementById("frigate");
const carrierShipDiv = document.getElementById("carrier");

let isPlayerTurn = true;
let previewAngle = 0;
let draggedShip;

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
            ship.addEventListener("dragstart", (e) => {
                draggedShip = e.target;
            });
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

function dropShip(e, player) {
    e.preventDefault();
    const targetCell = e.target;
    const shipId = draggedShip.id;
    let y = parseInt(targetCell.dataset.x);
    let x = parseInt(targetCell.dataset.y);
    let direction = previewAngle === 0 ? "horizontal" : "vertical";

    if (!shipId) return;

    try {
        if (shipId === "corvette") {
            player.gameboard.placeShip(
                new Ship("Corvette", 2),
                x,
                y,
                direction
            );
            corvetteShipDiv.style.display = "none";
            placementErrorMsg.style.display = "none";
        }
        if (shipId === "submarine") {
            player.gameboard.placeShip(
                new Ship("Submarine", 3),
                x,
                y,
                direction
            );
            submarineShipDiv.style.display = "none";
            placementErrorMsg.style.display = "none";
        }
        if (shipId === "cruiser") {
            player.gameboard.placeShip(new Ship("Cruiser", 3), x, y, direction);
            cruiserShipDiv.style.display = "none";
            placementErrorMsg.style.display = "none";
        }
        if (shipId === "frigate") {
            player.gameboard.placeShip(new Ship("Frigate", 4), x, y, direction);
            frigateShipDiv.style.display = "none";
            placementErrorMsg.style.display = "none";
        }
        if (shipId === "carrier") {
            player.gameboard.placeShip(new Ship("Carrier", 5), x, y, direction);
            carrierShipDiv.style.display = "none";
            placementErrorMsg.style.display = "none";
        }

        renderPreviewGameboard(player, playerGameboardPreview);
        attachPreviewShipEventListeners(player);
    } catch (error) {
        console.error("Invalid placement:", error.message);
        placementErrorMsg.style.display = "block";
        placementErrorMsg.textContent = "Invalid placement";
    }
}

function attachPreviewShipEventListeners(player) {
    Array.from(previewCells).forEach((cell) => {
        cell.addEventListener("dragover", (e) => {
            previewOnDragover(e, player);
        });
        cell.addEventListener("drop", (e) => {
            dropShip(e, player);
        });
    });
}

function previewOnDragover(e, player) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const targetCell = e.target;
    if (!draggedShip) return;

    const shipId = draggedShip.id;
    let x = parseInt(targetCell.dataset.x);
    let y = parseInt(targetCell.dataset.y);
    let direction = previewAngle === 0 ? "horizontal" : "vertical";

    let shipLength = {
        corvette: 2,
        submarine: 3,
        cruiser: 3,
        frigate: 4,
        carrier: 5,
    }[shipId];

    if (!shipLength) return;

    let targetDivs = Array.from(previewCells).filter((cell) => {
        return direction === "horizontal"
            ? cell.dataset.y == y &&
                  cell.dataset.x >= x &&
                  cell.dataset.x < x + shipLength
            : cell.dataset.x == x &&
                  cell.dataset.y >= y &&
                  cell.dataset.y < y + shipLength;
    });

    Array.from(previewCells).forEach((cell) =>
        cell.classList.remove("hover", "invalid")
    );

    targetDivs.forEach((div) => {
        div.classList.add("hover");
    });
}

function renderPreviewGameboard(player, playerGameboard) {
    playerGameboard.replaceChildren();
    player.gameboard.board.forEach((subarray, y) => {
        subarray.forEach((cell, x) => {
            const div = document.createElement("div");

            div.classList.add("cell");

            if (cell === null) {
                div.textContent = "";
            } else if (typeof cell === "object") {
                div.style.backgroundColor = "gray";
            } else if (cell === "miss") {
                div.textContent = "🫧";
            } else if (cell === "hit") {
                div.textContent = "🔥";
                div.style.backgroundColor = "gray";
            }

            div.dataset.x = x;
            div.dataset.y = y;

            playerGameboard.appendChild(div);
        });
    });
}

function flipPreviewShips() {
    previewAngle = previewAngle === 0 ? 90 : 0;
    everyShipInContainer.forEach(
        (div) => (div.style.transform = `rotate(${previewAngle}deg)`)
    );
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
        infoMsg.textContent = `${playerTwo.name} hit ${playerOne.name}'s ship. ${playerTwo.name} aiming to fire again`;
        setTimeout(() => {
            computerTurn(
                playerOne,
                playerOneGameboard,
                playerTwo,
                playerTwoGameboard
            );
        }, 2000);
    }

    isPlayerTurn = true;
}

function placeShipRandomly(player, ship) {
    let placed = false;

    while (!placed) {
        const { x, y, direction } = getRandomCoordinatesAndDirection();

        try {
            player.gameboard.placeShip(ship, x, y, direction);
            placed = true;
        } catch (error) {
            continue;
        }
    }
}

function getRandomCoordinatesAndDirection() {
    const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return { x, y, direction };
}

// Game over logic
function checkGameOver(playerOne, playerTwo, modalDiv, messageDiv) {
    if (playerTwo.gameboard.allShipsSunk()) {
        setTimeout(() => (infoMsg.textContent = ""), 0);
        modalDiv.style.display = "flex";
        messageDiv.textContent = `${playerOne.name} won!`;
    } else if (playerOne.gameboard.allShipsSunk()) {
        setTimeout(() => (infoMsg.textContent = ""), 0);
        modalDiv.style.display = "flex";
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
    infoMsg.textContent = "";
    playerOneGameboardDiv.replaceChildren();
    playerTwoGameboardDiv.replaceChildren();
    gameOverModalContainer.style.display = "none";
    playerOneName.textContent = "";
    playerTwoName.textContent = "";
    previewAngle = 0;
    isPlayerTurn = true;
    draggedShip = undefined;
    everyShipInContainer.forEach((ship) => (ship.style.display = "flex"));
    everyShipInContainer.forEach(
        (ship) => (ship.style.transform = "rotate(0deg")
    );
    newGame();
}
