<template>
  <div class="game-container">
    <h1>Snake Game</h1>
    <div class="score-display">Score: {{ score }}</div>
    <canvas ref="gameCanvas" width="400" height="400"></canvas>
    <div class="controls">
      <button @click="startGame">{{ gameRunning ? 'Restart' : 'Start Game' }}</button>
      <button @click="pauseGame">{{ isPaused ? 'Resume' : 'Pause' }}</button>
      <select v-model="selectedSpeed" @change="updateSpeed">
        <option v-for="option in speedOptions" :value="option.value">{{ option.label }}</option>
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
      velocity: {x: 0, y: 0},
      score: 0,
      gameRunning: false,
      isPaused: false,
      gameInterval: null,
      speedOptions: [
        { label: '慢速', value: 200 },
        { label: '中速', value: 100 },
        { label: '快速', value: 50 }
      ],
      selectedSpeed: 100
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
    gameLoop() {
      // Clear canvas
      this.ctx.fillStyle = '#f0f0f0';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
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
        this.snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
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
      this.ctx.fillText('Score: ' + this.score, 10, 30);
    },
    gameOver() {
      clearInterval(this.gameInterval);
      this.gameRunning = false;
      alert('Game Over! Score: ' + this.score);
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
  margin: 0 auto;
  width: fit-content;
  text-align: center;
}
canvas {
  border: 2px solid #333;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
.controls {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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