
const numRows = 8;
const numCols = 8;
const numMines = 10;
var firstTile = true;
var startTime; // to keep track of the start time
var stopwatchInterval; // to keep track of the interval
var elapsedPausedTime = 0; // to keep track of the elapsed time while stopped
const gameBoard =
    document.getElementById(
        "gameBoard"
    );
let board = [];
let remainingFlags = numMines;
let remainingMines = numMines;

function initializeBoard() {
    game_won = false;
    document.getElementById("flagsPlaced").innerHTML = "Remaining Flags: " + remainingFlags;
    for (let i = 0; i < numRows; i++) {
        board[i] = [];
        for (
            let j = 0;
            j < numCols;
            j++
        ) {
            board[i][j] = {
                isMine: false,
                revealed: false,
                flagged: false,
                count: 0,
            };
        }
    }
}

function revealCell(row, col) {

    if (row < 0 || row >= numRows || col < 0 || col >= numCols || board[row][col].revealed || board[row][col].flagged) {
        return;
    }

    board[row][col].revealed = true;
    var starting_tile = board[row][col];

    if (firstTile) {
        startStopwatch();
        let minesPlaced = 0;
        while (minesPlaced < numMines) {
            const row = Math.floor(Math.random() * numRows);
            const col = Math.floor(Math.random() * numCols);
            if (!board[row][col].isMine && board[row][col] != starting_tile) {
                board[row][col].isMine = true;
                minesPlaced++;
            }
            firstTile = false;
        }
        for (let i = 0; i < numRows; i++) {
            for (
                let j = 0;
                j < numCols;
                j++
            ) {
                if (!board[i][j].isMine) {
                    let count = 0;
                    for (
                        let dx = -1;
                        dx <= 1;
                        dx++
                    ) {
                        for (
                            let dy = -1;
                            dy <= 1;
                            dy++
                        ) {
                            const ni =
                                i + dx;
                            const nj =
                                j + dy;
                            if (ni >= 0 && ni < numRows && nj >= 0 && nj < numCols && board[ni][nj].isMine) {
                                count++;
                            }
                        }
                    }
                    board[i][j].count = count;
                }
            }
        }
    }

    if (board[row][col].isMine) {
        // Handle game over
        alert("Game Over! You stepped on a mine.");
        stopStopwatch();

    }


    else if (
        board[row][col].count === 0
    ) {
        // If cell has no mines nearby,
        // Reveal adjacent cells
        for (
            let dx = -1;
            dx <= 1;
            dx++
        ) {
            for (
                let dy = -1;
                dy <= 1;
                dy++
            ) {
                revealCell(row + dx, col + dy);
            }
        }
    }

    renderBoard();
}

function renderBoard() {
    gameBoard.innerHTML = "";

    for (let i = 0; i < numRows; i++) {
        for (
            let j = 0;
            j < numCols;
            j++
        ) {
            const cell =
                document.createElement(
                    "div"
                );
            cell.className = "cell";
            if (board[i][j].revealed) {
                cell.classList.add("revealed");
                if (board[i][j].isMine) {
                    cell.classList.add("mine");
                }
                else if (board[i][j].count > 0) {
                    cell.textContent = board[i][j].count;
                }
            }
            else if (board[i][j].flagged) {
                cell.classList.add("flagged");
            }
            ["click", "ontouchstart"].forEach(event => {
                cell.addEventListener(
                    "click", () => revealCell(i, j));
            })

            cell.addEventListener('contextmenu', function (ev) {
                ev.preventDefault();

                var element = cell;
                if (!element.classList.contains("revealed")) { //if its not a revealed cell
                    if (!element.classList.contains("flagged") && remainingFlags > 0) {
                        board[i][j].flagged = !board[i][j].flagged;
                        element.classList.toggle("flagged");
                        remainingFlags = remainingFlags - 1;
                        document.getElementById("flagsPlaced").innerHTML = "Remaining Flags: " + remainingFlags;
                        if (board[i][j].isMine) {
                            remainingMines = remainingMines - 1;
                            if (remainingMines === 0) {
                                alert(
                                    "You win yay."
                                );
                                game_won = true;
                                stopStopwatch();

                            }
                        }
                    }
                    else if (element.classList.contains("flagged") && remainingFlags < 10) {
                        board[i][j].flagged = !board[i][j].flagged;
                        element.classList.toggle("flagged");
                        remainingFlags = remainingFlags + 1;
                        document.getElementById("flagsPlaced").innerHTML = "Remaining Flags: " + remainingFlags;
                        if (board[i][j].isMine) {
                            remainingMines = remainingMines + 1;
                        }
                    }


                }

                return false;
            }, false);
            gameBoard.appendChild(cell);
        }
        gameBoard.appendChild(
            document.createElement("br")
        );
    }
}

initializeBoard();
renderBoard();

function startStopwatch() {
    if (!stopwatchInterval) {
        startTime = new Date().getTime() - elapsedPausedTime; // get the starting time by subtracting the elapsed paused time from the current time
        stopwatchInterval = setInterval(updateStopwatch, 1000); // update every second
    }
}

function stopStopwatch() {
    clearInterval(stopwatchInterval); // stop the interval
    elapsedPausedTime = new Date().getTime() - startTime; // calculate elapsed paused time
    console.log(displayTime);

    stopwatchInterval = null; // reset the interval variable
    if (game_won) {
        var currentHighscore = localStorage.getItem("mineHighscore");
        if (currentHighscore === null) {
            localStorage.setItem("mineHighscore", displayTime);
        }
        else {
            if (currentHighscore > displayTime) {
                localStorage.setItem("mineHighscore", displayTime);
            }
        }
    }

}

function resetStopwatch() {
    stopStopwatch(); // stop the interval
    elapsedPausedTime = 0; // reset the elapsed paused time variable
    document.getElementById("stopwatch").innerHTML = "00:00"; // reset the display
}

function updateStopwatch() {
    var currentTime = new Date().getTime(); // get current time in milliseconds
    var elapsedTime = currentTime - startTime; // calculate elapsed time in milliseconds
    var seconds = Math.floor(elapsedTime / 1000) % 60; // calculate seconds
    var minutes = Math.floor(elapsedTime / 1000 / 60) % 60; // calculate minutes
    displayTime = pad(minutes) + ":" + pad(seconds); // format display time
    document.getElementById("stopwatch").innerHTML = displayTime; // update the display
}

function pad(number) {
    // add a leading zero if the number is less than 10
    return (number < 10 ? "0" : "") + number;
}
const resetGame = document.getElementById("resetSweeper");
resetGame.addEventListener('click', function () {
    window.location.reload();
})