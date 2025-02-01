import { Ship } from "./classes";

const playerGameboardPreview = document.querySelector(
    ".player-gameboard-preview"
);
const previewCells = playerGameboardPreview.children;
const placementErrorMsg = document.getElementById("placement-error");

const everyShipInContainer = document.querySelectorAll(".ship");
const corvetteShipDiv = document.getElementById("corvette");
const submarineShipDiv = document.getElementById("submarine");
const cruiserShipDiv = document.getElementById("cruiser");
const frigateShipDiv = document.getElementById("frigate");
const carrierShipDiv = document.getElementById("carrier");

let previewAngle = 0;
let draggedShip;

export function attachPreviewShipEventListeners(player) {
    Array.from(previewCells).forEach((cell) => {
        cell.addEventListener("dragover", (e) => {
            previewOnDragover(e);
        });
        cell.addEventListener("drop", (e) => {
            dropShip(e, player);
        });
    });
}

export function defineDraggedShip(e) {
    draggedShip = e.target;
}

function previewOnDragover(e) {
    e.preventDefault();
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

    Array.from(previewCells).forEach((cell) => cell.classList.remove("hover"));

    targetDivs.forEach((div) => {
        div.classList.add("hover");
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

export function renderPreviewGameboard(player, playerGameboard) {
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

export function flipPreviewShips() {
    previewAngle = previewAngle === 0 ? 90 : 0;
    everyShipInContainer.forEach(
        (div) => (div.style.transform = `rotate(${previewAngle}deg)`)
    );
}
