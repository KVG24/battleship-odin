// Game Over modal
const gameOverModal = document.querySelector(".modal-container");
const winnerMsg = document.getElementById("winner-message");
const restartBtn = document.getElementById("restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});

let isPlayerTurn = true;

export function renderGameboard(
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
                playerTwo.gameboard.receiveAttack(y, x);
                renderGameboard(
                    playerOne,
                    playerOneGameboard,
                    playerTwo,
                    playerTwoGameboard
                );

                isPlayerTurn = false;

                setTimeout(() => {
                    computerTurn(
                        playerOne,
                        playerOneGameboard,
                        playerTwo,
                        playerTwoGameboard
                    );
                }, 500);
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
    playerOne.gameboard.receiveAttack(y, x);
    renderGameboard(
        playerOne,
        playerOneGameboard,
        playerTwo,
        playerTwoGameboard
    );

    isPlayerTurn = true;
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
