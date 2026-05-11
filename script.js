// Canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;

let playerY = canvas.height / 2 - paddleHeight / 2;
let computerY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

let playerScore = 0;
let computerScore = 0;

// Mouse position
let mouseY = canvas.height / 2;
let keyUpPressed = false;
let keyDownPressed = false;

// Event listeners
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') keyUpPressed = true;
    if (e.key === 'ArrowDown') keyDownPressed = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') keyUpPressed = false;
    if (e.key === 'ArrowDown') keyDownPressed = false;
});

// Update player paddle position
function updatePlayerPaddle() {
    // Mouse control
    if (mouseY > 0 && mouseY < canvas.height) {
        playerY = mouseY - paddleHeight / 2;
    }

    // Keyboard control
    if (keyUpPressed && playerY > 0) {
        playerY -= 6;
    }
    if (keyDownPressed && playerY < canvas.height - paddleHeight) {
        playerY += 6;
    }

    // Keep paddle within bounds
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - paddleHeight) playerY = canvas.height - paddleHeight;
}

// Computer AI
function updateComputerPaddle() {
    const computerCenter = computerY + paddleHeight / 2;
    const difficulty = 4;

    if (computerCenter < ballY - 35) {
        computerY += difficulty;
    } else if (computerCenter > ballY + 35) {
        computerY -= difficulty;
    }

    // Keep paddle within bounds
    if (computerY < 0) computerY = 0;
    if (computerY > canvas.height - paddleHeight) computerY = canvas.height - paddleHeight;
}

// Update ball position
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
        ballSpeedY = -ballSpeedY;
        ballY = ballY - ballSize < 0 ? ballSize : canvas.height - ballSize;
    }

    // Ball collision with paddles
    // Player paddle collision
    if (
        ballX - ballSize < paddleWidth &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        ballX = paddleWidth + ballSize;
        // Add spin based on where ball hits paddle
        ballSpeedY += (ballY - (playerY + paddleHeight / 2)) / 10;
    }

    // Computer paddle collision
    if (
        ballX + ballSize > canvas.width - paddleWidth &&
        ballY > computerY &&
        ballY < computerY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        ballX = canvas.width - paddleWidth - ballSize;
        // Add spin based on where ball hits paddle
        ballSpeedY += (ballY - (computerY + paddleHeight / 2)) / 10;
    }

    // Ball out of bounds (left side - computer scores)
    if (ballX < 0) {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
        resetBall();
    }

    // Ball out of bounds (right side - player scores)
    if (ballX > canvas.width) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        resetBall();
    }
}

// Reset ball position
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5;
    ballSpeedY = (Math.random() - 0.5) * 8;
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = '#667eea';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw player paddle
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(0, playerY, paddleWidth, paddleHeight);

    // Draw computer paddle
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();
}

// Main game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();