export function renderGameboard(playerObj, playerGameboard) {
    let gameboard = playerObj.gameboard.board;
    gameboard.forEach((subarray, y) => {
        subarray.forEach((cell, x) => {
            const div = document.createElement("div");

            div.classList.add("cell");

            if (playerObj.type === "real") {
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
            } else {
                if (cell === null) {
                    div.textContent = "";
                } else if (cell === "miss") {
                    div.textContent = "🫧";
                } else if (cell === "hit") {
                    div.textContent = "🔥";
                    div.style.backgroundColor = "gray";
                }

                div.classList.add("enemy-cell");

                div.addEventListener("click", () => {
                    playerGameboard.replaceChildren();
                    playerObj.gameboard.receiveAttack(y, x);
                    renderGameboard(playerObj, playerGameboard);
                });
            }

            div.setAttribute("data-x", x);
            div.setAttribute("data-y", y);

            playerGameboard.appendChild(div);
        });
    });
}
