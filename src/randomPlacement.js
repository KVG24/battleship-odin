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
