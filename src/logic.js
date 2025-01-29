import { Player, Ship } from "./classes";

const playerOneName = document.getElementById("player-one-name");
const playerTwoName = document.getElementById("player-two-name");
const playerOneGameboardDiv = document.getElementById("player-one-gameboard");
const playerTwoGameboardDiv = document.getElementById("player-two-gameboard");
const infoMsg = document.getElementById("info-msg");

// New game modal
const enterNameModal = document.querySelector(".enter-name-modal");
const inputName = document.getElementById("name");
const enterNameButton = document.getElementById("enter-name-button");

// Gameboard preview / ship placement modal
const gameBoardPreviewModal = document.querySelector(
    ".gameboard-preview-modal"
);
const playerGameboardPreview = document.querySelector(
    ".player-gameboard-preview"
);
const flipButton = document.getElementById("flip-button");
const startButton = document.getElementById("start-button");
const shipsForPlacementContainer = document.querySelector(
    ".ships-for-placement-container"
);
const everyShipInContainer = document.querySelectorAll(".ship");
const corvetteShipDiv = document.getElementById("corvette");
const submarineShipDiv = document.getElementById("submarine");
const cruiserShipDiv = document.getElementById("cruiser");
const frigateShipDiv = document.getElementById("frigate");
const carrierShipDiv = document.getElementById("carrier");

// Game Over modal
const gameOverModal = document.querySelector(".modal-container");
const winnerMsg = document.getElementById("winner-message");
const restartBtn = document.getElementById("restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});

let isPlayerTurn = true;
let previewAngle = 0;

export function newGame() {
    // Enter name modal
    enterNameModal.style.display = "flex";
    enterNameButton.addEventListener("click", () => {
        enterNameModal.style.display = "none";
        const playerOne = new Player(`${inputName.value}`, "real");
        const playerTwo = new Player("Computer", "computer");

        // Ship placement modal
        gameBoardPreviewModal.style.display = "block";
        playerOne.gameboard.board.forEach((subarray, y) => {
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

                div.setAttribute("data-x", x);
                div.setAttribute("data-y", y);

                playerGameboardPreview.appendChild(div);

                flipButton.addEventListener("click", flipPreviewShips);
                startButton.addEventListener("click", () => {
                    gameBoardPreviewModal.style.display = "none";
                    renderGameboard(
                        playerOne,
                        playerOneGameboardDiv,
                        playerTwo,
                        playerTwoGameboardDiv
                    );
                });
            });
        });
    });
}

function flipPreviewShips() {
    previewAngle = previewAngle === 0 ? 90 : 0;
    everyShipInContainer.forEach(
        (div) => (div.style.transform = `rotate(${previewAngle}deg)`)
    );
}

function renderGameboard(
    playerOne,
    playerOneGameboard,
    playerTwo,
    playerTwoGameboard
) {
    const playerOneGameboardDiv = playerOne.gameboard.board;
    const playerTwoGameboardDiv = playerTwo.gameboard.board;

    playerOneGameboardDiv.forEach((subarray, y) => {
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

            div.setAttribute("data-x", x);
            div.setAttribute("data-y", y);

            playerOneGameboard.appendChild(div);
        });
    });
    playerTwoGameboardDiv.forEach((subarray, y) => {
        subarray.forEach((cell, x) => {
            const div = document.createElement("div");

            div.classList.add("cell");
            div.classList.add("enemy-cell");

            if (cell === null) {
                div.textContent = "";
            } else if (cell === "miss") {
                div.textContent = "🫧";
            } else if (cell === "hit") {
                div.textContent = "🔥";
                div.style.backgroundColor = "gray";
            } else if (typeof cell === "object") {
                div.style.backgroundColor = "gray";
            } // remove last "else if" after testing

            div.setAttribute("data-x", x);
            div.setAttribute("data-y", y);

            div.addEventListener("click", () => {
                if (!isPlayerTurn || cell === "miss" || cell === "hit") return;

                playerOneGameboard.replaceChildren();
                playerTwoGameboard.replaceChildren();

                const prevArray = playerTwo.gameboard.missedAttacks.length;
                playerTwo.gameboard.receiveAttack(y, x);
                renderGameboard(
                    playerOne,
                    playerOneGameboard,
                    playerTwo,
                    playerTwoGameboard
                );
                const newArray = playerTwo.gameboard.missedAttacks.length;

                infoMsg.textContent = `${playerOne.name} hit ${playerTwo.name}'s ship. ${playerOne.name} aiming to fire again`;

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
    checkGameOver(playerOne, playerTwo, gameOverModal, winnerMsg);
}

// Computer's logic
function computerTurn(
    playerOne,
    playerOneGameboard,
    playerTwo,
    playerTwoGameboard
) {
    let x, y;

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
    renderGameboard(
        playerOne,
        playerOneGameboard,
        playerTwo,
        playerTwoGameboard
    );
    const newArray = playerOne.gameboard.missedAttacks.length;

    infoMsg.textContent = `${playerTwo.name} missed. ${playerOne.name} aiming...`;

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

export function placeShipRandomly(player, ship) {
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
export function checkGameOver(playerOne, playerTwo, modalDiv, messageDiv) {
    if (playerTwo.gameboard.allShipsSunk()) {
        modalDiv.style.display = "block";
        messageDiv.textContent = `${playerOne.name} won!`;
    } else if (playerOne.gameboard.allShipsSunk()) {
        modalDiv.style.display = "block";
        messageDiv.textContent = `${playerTwo.name} won!`;
    }
}
