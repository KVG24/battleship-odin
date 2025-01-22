import "./classes";

export function renderGameboard(playerObj, playerGameboard) {
    let gameboard = playerObj.gameboard.board;
    gameboard.forEach((subarray, y) => {
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

            div.setAttribute("data-y", y);
            div.setAttribute("data-x", x);

            playerGameboard.appendChild(div);
        });
    });
}
