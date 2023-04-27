// get a random integer between the range of [min,max]
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate a new tetromino sequence
function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    while (sequence.length) {
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        tetrominoSequence.push(name);
    }
}

// get the next tetromino in the sequence
function getNextTetromino() {
    if (tetrominoSequence.length === 0) {
        generateSequence();
        //showGameOver();
    }

    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];

    // I and O start centered, all others start in left-middle
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = name === 'I' ? -1 : -2;

    return {
        name: name,      // name of the piece (L, O, etc.)
        matrix: matrix,  // the current rotation matrix
        row: row,        // current row (starts offscreen)
        col: col         // current col 
    };
}

// rotate an NxN matrix 90deg
function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );

    return result;
}

// check to see if the new matrix/row/col is valid
function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (!matrix[row][col]) continue;
            if (cellCol + col < 0 || cellCol + col >= playfield[0].length || cellRow + row >= playfield.length) return false;
            if (playfield[cellRow + row][cellCol + col]) return false;
        }
    }
    return true;
}

const scoreDisplay = document.getElementById("score");
let score = 0;


function placeTetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {

                // game over if piece has any part offscreen
                if (tetromino.row + row < 0) {
                    return showGameOver();
                }

                playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
            }
        }
    }

    // check for line clears starting from the bottom and working our way up
    for (let row = playfield.length - 1; row >= 0;) {
        if (playfield[row].every(cell => !!cell)) {
            //increase the score with every line clear and increase the speed of the game
            score += 1;
            scoreDisplay.innerHTML = "Score " + score;
            if (speed > 30) {
                speed -= 30;
            }
            if (speed = 30) {
                speed -= 15;
            }
            alert(speed);

            // drop every row above this one
            for (let r = row; r >= 0; r--) {
                for (let c = 0; c < playfield[r].length; c++) {
                    playfield[r][c] = playfield[r - 1][c];
                }
            }
        }
        else {
            row--;
        }
    }

    tetromino = getNextTetromino();
}

//Piece movement
function moveTetrominoRight() {
    if (isValidMove(tetromino.matrix, tetromino.row, tetromino.col + 1)) {
        tetromino.col += 1;
    }
};

function moveTetrominoLeft() {
    if (isValidMove(tetromino.matrix, tetromino.row, tetromino.col - 1)) {
        tetromino.col += -1;
    }
};

function moveTetrominoDown() {
    if (isValidMove(tetromino.matrix, tetromino.row + 1, tetromino.col)) {
        tetromino.row += 1;
    }
};

function moveTetrominoInstaDrop() {
    while (isValidMove(tetromino.matrix, tetromino.row + 1, tetromino.col)) {
        tetromino.row += 1;
    }
};

function rotateTetromino() {
    const matrix = rotate(tetromino.matrix);
    if (isValidMove(matrix, tetromino.row, tetromino.col)) {
        tetromino.matrix = matrix;
    }
};

// show the game over screen
function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;

    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
}

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 32;
const tetrominoSequence = [];

// keep track of what is in every cell of the game using a 2d array
// tetris playfield is 10x20, with a few rows offscreen
const playfield = [];

// populate the empty state
for (let row = -2; row < 20; row++) {
    playfield[row] = [];

    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
}

// how to draw each tetromino
const tetrominos = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'O': [
        [1, 1],
        [1, 1],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ]
};

// color of each tetromino
const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};

let count = 0;
let tetromino = getNextTetromino();
let rAF = null;  // keep track of the animation frame so we can cancel it
let gameOver = false;
let speed = 120;

// game loop
function loop() {
    rAF = requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    //draw the playfield
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                const name = playfield[row][col];
                context.fillStyle = colors[name];

                // drawing 1 px smaller than the grid creates a grid effect
                //end position
                context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
            }
        }
    }
    //shadow showing end position
    let shadowRow = tetromino.row;
    while (isValidMove(tetromino.matrix, shadowRow + 1, tetromino.col)) {
        shadowRow++;
    }
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
                const shadowX = (tetromino.col + col) * grid;
                const shadowY = (shadowRow + row) * grid;
                context.fillStyle = 'rgba(0, 0, 0, 0.2)';
                context.fillRect(shadowX, shadowY, grid - 1, grid - 1);
            }
        }
    }

    // draw the active tetromino
    if (tetromino) {

        // tetromino falls every 120 frames initially and speeds up as the game progresses
        if (++count > speed) {
            tetromino.row++;
            count = 0;

            // place piece if it runs into anything
            if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
                tetromino.row--;
                placeTetromino();
            }
        }

        context.fillStyle = colors[tetromino.name];

        for (let row = 0; row < tetromino.matrix.length; row++) {
            for (let col = 0; col < tetromino.matrix[row].length; col++) {
                if (tetromino.matrix[row][col]) {

                    // drawing 1 px smaller than the grid creates a grid effect
                    //during movement
                    context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid - 1, grid - 1);
                }
            }
        }
    }
}

// listen to keyboard events to move the active tetromino
document.addEventListener('keydown', function (e) {
    if (gameOver) return;

    const LEFT = "ArrowLeft";
    const RIGHT = "ArrowRight";
    const UP = "ArrowUp";
    const DOWN = "ArrowDown";
    const K_KEY = "KeyK";
    const P_KEY = 'KeyP';

    // up arrow key (rotate)
    if (e.code === LEFT) {
        moveTetrominoLeft();
    }

    if (e.code === RIGHT) {
        moveTetrominoRight();
    }

    // up arrow key (rotate)
    if (e.code === UP) {
        rotateTetromino();
    }

    // down arrow key (drop)
    if (e.code === DOWN) {
        moveTetrominoDown();
    }

    // K instadrop
    if (e.code === K_KEY) {
        moveTetrominoInstaDrop();
    }

    //P to pause
    if (e.code === P_KEY) {
        pause();
    }
});

//funciton to pause game
let isPaused = false;
var message = document.createElement("div");
function pause() {
    if (isPaused) {

        rAF = requestAnimationFrame(loop);
        isPaused = false;
        document.body.removeChild(message);


    } else {
        cancelAnimationFrame(rAF);
        isPaused = true;
        message.innerHTML = "Game Paused";
        message.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        message.style.color = "white";
        message.style.fontSize = "30px";
        message.style.position = "fixed";
        message.style.left = "50%";
        message.style.top = "50%";
        message.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(message);

    }
};

// start the game
rAF = requestAnimationFrame(loop);

// Create an array of the functions
const moves = [moveTetrominoDown, moveTetrominoLeft, moveTetrominoRight, rotateTetromino];

// Define a function to call a random function every 100ms
function randomMovement() {
    const randomIndex = Math.floor(Math.random() * moves.length);
    moves[randomIndex]();
};

// Call the function every 100ms
function runBudgetAI() {
    speed = 60;
    //setInterval(randomMovement, 100);
    setInterval(betterAI(), 5000);
};


function betterAI() {
    getEndPositions();
    height = 18;


    for(i = 0; i < endPositions.length-1;i++){
        if(height > endPositions[i][0]){
            endPositions.splice(i,1);
            console.log("height is now " + endPositions[i][0])
        }
    }


    const randomIndex = Math.floor(Math.random() * endPositions.length - 1);
    newRow = endPositions[randomIndex][0];
    newCol = endPositions[randomIndex][1];
    newMatrix = endPositions[randomIndex][2];

    if (isValidMove(newMatrix, newRow, newCol)) {
        tetromino.row = newRow;
        tetromino.col = newCol;
        tetromino.matrix = newMatrix;
    }
};

const endPositions = [];
function getEndPositions() {
    clonePiece = { ...tetromino };
    //reset end position array
    endPositions.length = 0;

    for (i = 0; i <= 4; i++) {
        matrix = rotate(clonePiece.matrix);
        if (isValidMove(matrix, clonePiece.row, clonePiece.col)) {
            clonePiece.matrix = matrix;
        }
        // Iterate through each column on the board
        for (let col = 0; col < playfield[0].length; col++) {
            let row = -1;
            // Find the lowest empty cell in the current column
            while (isValidMove(clonePiece.matrix, row + 1, col)) {
                row++;
            }
            //adds possible positions to the endPositions array
            if (row > 0) {
                endPositions.push([row, col, clonePiece.matrix]);
            }

        }
    };
    console.log(endPositions);
};