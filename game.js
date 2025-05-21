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
    // 清空画布
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 移动蛇
    const head = {x: snake[0].x + velocity.x, y: snake[0].y + velocity.y};
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } else {
        snake.pop();
    }
    
    // 检查碰撞
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || 
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        alert('游戏结束！得分: ' + score);
        resetGame();
        return;
    }
    
    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    
    // 绘制蛇
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
    
    // 显示分数
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('得分: ' + score, 10, 30);
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
setInterval(gameLoop, 100);