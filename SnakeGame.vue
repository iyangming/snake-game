<template>
  <div class="game-container">
    <h1>Snake Game</h1>
    <div class="score-display">
      <div>当前分数: {{ score }}</div>
      <div>最高分数: {{ highScore }}</div>
    </div>
    <canvas ref="gameCanvas" width="400" height="400"></canvas>
    <div class="controls">
      <button @click="startGame">{{ gameRunning ? 'Restart' : 'Start Game' }}</button>
      <button @click="pauseGame">{{ isPaused ? 'Resume' : 'Pause' }}</button>
      <select v-model="selectedSpeed" @change="updateSpeed">
        <option v-for="option in speedOptions" :value="option.value">{{ option.label }}</option>
      </select>
      <select v-model="selectedDifficulty" @change="generateObstacles">
        <option v-for="option in difficultyOptions" :value="option.value">{{ option.label }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      gridSize: 20,
      tileCount: 20,
      snake: [{x: 10, y: 10}],
      food: {x: 0, y: 0},
      obstacles: [],
      velocity: {x: 0, y: 0},
      score: 0,
      highScore: localStorage.getItem('snakeHighScore') || 0,
      gameRunning: false,
      isPaused: false,
      gameInterval: null,
      speedOptions: [
        { label: '慢速', value: 200 },
        { label: '中速', value: 100 },
        { label: '快速', value: 50 }
      ],
      selectedSpeed: 100,
      difficultyOptions: [
        { label: '简单', value: 0.05 },
        { label: '中等', value: 0.1 },
        { label: '困难', value: 0.2 }
      ],
      selectedDifficulty: 0.1
    }
  },
  mounted() {
    this.canvas = this.$refs.gameCanvas;
    if (!this.canvas) {
      console.error('Canvas element not found');
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.tileCount = this.canvas.width / this.gridSize;
    this.resetFood();
    window.addEventListener('keydown', this.handleKeyPress);
  },
  methods: {
    resetFood() {
      this.food = {
        x: Math.floor(Math.random() * this.tileCount),
        y: Math.floor(Math.random() * this.tileCount)
      };
    },
    resetGame() {
      this.snake = [{x: 10, y: 10}];
      this.velocity = {x: 0, y: 0};
      this.score = 0;
      this.resetFood();
      this.generateObstacles();
      
      // 确保蛇的初始位置不与障碍物重叠
      while (this.obstacles.some(obs => obs.x === this.snake[0].x && obs.y === this.snake[0].y)) {
        this.snake[0].x = Math.floor(Math.random() * this.tileCount);
        this.snake[0].y = Math.floor(Math.random() * this.tileCount);
      }
    },
    startGame() {
      if (!this.gameRunning) {
        this.resetGame();
        this.gameRunning = true;
        this.isPaused = false;
        this.gameInterval = setInterval(this.gameLoop, this.selectedSpeed);
      } else {
        this.resetGame();
      }
    },
    pauseGame() {
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        clearInterval(this.gameInterval);
      } else {
        this.gameInterval = setInterval(this.gameLoop, this.selectedSpeed);
      }
    },
    updateSpeed() {
      if (this.gameRunning && !this.isPaused) {
        clearInterval(this.gameInterval);
        this.gameInterval = setInterval(this.gameLoop, this.selectedSpeed);
      }
    },
    generateObstacles() {
      this.obstacles = [];
      const obstacleCount = Math.floor(this.tileCount * this.tileCount * this.selectedDifficulty);
      
      for (let i = 0; i < obstacleCount; i++) {
        let newObstacle;
        do {
          newObstacle = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
          };
        } while (
          (newObstacle.x === this.food.x && newObstacle.y === this.food.y) ||
          this.obstacles.some(obs => obs.x === newObstacle.x && obs.y === newObstacle.y)
        );
        
        this.obstacles.push(newObstacle);
      }
    },
    
    gameLoop() {
      // Clear canvas
      this.ctx.fillStyle = '#f0f0f0';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw obstacles
      this.ctx.fillStyle = '#888';
      this.obstacles.forEach(obs => {
        this.ctx.fillRect(obs.x * this.gridSize, obs.y * this.gridSize, this.gridSize, this.gridSize);
      });
      
      // Move snake
      const head = {
        x: this.snake[0].x + this.velocity.x,
        y: this.snake[0].y + this.velocity.y
      };
      this.snake.unshift(head);
      
      // Check if food is eaten
      if (head.x === this.food.x && head.y === this.food.y) {
        this.score++;
        this.resetFood();
      } else {
        this.snake.pop();
      }
      
      // Check collision
      if (head.x < 0 || head.x >= this.tileCount || 
        head.y < 0 || head.y >= this.tileCount || 
        this.snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y) ||
        this.obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
        this.gameOver();
        return;
      }
      
      // Draw food
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize, this.gridSize);
      
      // Draw snake
      this.ctx.fillStyle = 'green';
      this.snake.forEach(segment => {
        this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
      });
      
      // Display score
      this.ctx.fillStyle = 'black';
      this.ctx.font = '20px Arial';
      this.ctx.fillText('Score: ' + this.score, this.canvas.width - 120, 30);
    },
    gameOver() {
      clearInterval(this.gameInterval);
      this.gameRunning = false;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('snakeHighScore', this.highScore);
      }
      alert('游戏结束! 当前分数: ' + this.score + ' 最高分数: ' + this.highScore);
    },
    handleKeyPress(event) {
      switch(event.key) {
        case 'ArrowUp':
          if (this.velocity.y === 0) this.velocity = {x: 0, y: -1};
          break;
        case 'ArrowDown':
          if (this.velocity.y === 0) this.velocity = {x: 0, y: 1};
          break;
        case 'ArrowLeft':
          if (this.velocity.x === 0) this.velocity = {x: -1, y: 0};
          break;
        case 'ArrowRight':
          if (this.velocity.x === 0) this.velocity = {x: 1, y: 0};
          break;
      }
    }
  }
}
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
}
canvas {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
.controls {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}
button {
  padding: 10px 20px;
  margin: 0 8px;
  cursor: pointer;
  background: #4a6bff;
  color: white;
  border: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 16px;
}

button:hover {
  background: #3a5bef;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

select {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-align: center;
  text-align-last: center;
}

select:hover {
  background-color: #45a049;
}
.score-display {
  font-size: 24px;
  margin: 10px 0;
  color: #333;
}
</style>