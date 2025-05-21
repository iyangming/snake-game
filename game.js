const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};
let velocity = {x: 0, y: 0};
let score = 0;

function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Move snake
    const head = {x: snake[0].x + velocity.x, y: snake[0].y + velocity.y};
    snake.unshift(head);
    
    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } else {
        snake.pop();
    }
    
    // Check collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || 
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    
    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
    
    // Display score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    velocity = {x: 0, y: 0};
    score = 0;
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

// 键盘控制
document.addEventListener('keydown', event => {
    switch(event.key) {
        case 'ArrowUp':
            if (velocity.y === 0) velocity = {x: 0, y: -1};
            break;
        case 'ArrowDown':
            if (velocity.y === 0) velocity = {x: 0, y: 1};
            break;
        case 'ArrowLeft':
            if (velocity.x === 0) velocity = {x: -1, y: 0};
            break;
        case 'ArrowRight':
            if (velocity.x === 0) velocity = {x: 1, y: 0};
            break;
    }
});

// 开始游戏
let gameRunning = false;
let gameInterval;

function startGame() {
    if (!gameRunning) {
        resetGame();  // 添加这行确保每次开始都重置游戏状态
        gameRunning = true;
        gameInterval = setInterval(gameLoop, 100);
        document.getElementById('startBtn').textContent = '重新开始';
    } else {
        resetGame();
    }
}

function pauseGame() {
    gameRunning = !gameRunning;
    if (gameRunning) {
        gameInterval = setInterval(gameLoop, 100);
        document.getElementById('pauseBtn').textContent = '暂停';
    } else {
        clearInterval(gameInterval);
        document.getElementById('pauseBtn').textContent = '继续';
    }
}

// 更新分数显示
function updateScoreDisplay() {
    document.getElementById('score').textContent = score;
}

// 修改gameLoop函数中的alert为更新UI
function gameOver() {
    clearInterval(gameInterval);
    gameRunning = false;
    alert('游戏结束！得分: ' + score);
    updateScoreDisplay();
}

// 添加按钮事件监听 - 确保在DOM完全加载后执行
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', pauseGame);
});