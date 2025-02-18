// script.js

const emojis = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒'];
const boardSize = 6;
let board = [];
let score = 0;
let firstTile = null;
let secondTile = null;

function generateBoard() {
    board = [];
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = emojis[Math.floor(Math.random() * emojis.length)];
        }
    }
}

function renderBoard() {
    const gameBoard = document.querySelector('.game-board');
    gameBoard.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.textContent = board[i][j];
            tile.dataset.row = i;
            tile.dataset.col = j;
            tile.addEventListener('click', handleTileClick);
            tile.addEventListener('touchstart', handleTileClick);
            gameBoard.appendChild(tile);
        }
    }
}

function handleTileClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    if (!firstTile) {
        firstTile = { row, col, element: event.target };
        firstTile.element.classList.add('selected');
    } else {
        secondTile = { row, col, element: event.target };
        swapTiles();
        firstTile.element.classList.remove('selected');
        firstTile = null;
        secondTile = null;
    }
}

function swapTiles() {
    const temp = board[firstTile.row][firstTile.col];
    board[firstTile.row][firstTile.col] = board[secondTile.row][secondTile.col];
    board[secondTile.row][secondTile.col] = temp;
    renderBoard();
    checkMatches();
}

function checkMatches() {
    let matches = [];
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (j < boardSize - 2 && board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2]) {
                matches.push({ row: i, col: j });
                matches.push({ row: i, col: j + 1 });
                matches.push({ row: i, col: j + 2 });
            }
            if (i < boardSize - 2 && board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j]) {
                matches.push({ row: i, col: j });
                matches.push({ row: i + 1, col: j });
                matches.push({ row: i + 2, col: j });
            }
        }
    }
    if (matches.length > 0) {
        removeMatches(matches);
    }
}

function removeMatches(matches) {
    matches.forEach(match => {
        board[match.row][match.col] = null;
    });
    dropTiles();
    updateScore(matches.length);
}

function dropTiles() {
    for (let col = 0; col < boardSize; col++) {
        for (let row = boardSize - 1; row >= 0; row--) {
            if (board[row][col] === null) {
                for (let r = row; r > 0; r--) {
                    board[r][col] = board[r - 1][col];
                }
                board[0][col] = emojis[Math.floor(Math.random() * emojis.length)];
            }
        }
    }
    renderBoard();
    setTimeout(checkMatches, 500);
}

function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}

document.getElementById('reset-button').addEventListener('click', () => {
    score = 0;
    document.getElementById('score').textContent = score;
    generateBoard();
    renderBoard();
});

function initGame() {
    generateBoard();
    renderBoard();
}

initGame();
