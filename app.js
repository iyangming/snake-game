import { createApp } from 'vue'
import SnakeGame from './SnakeGame.vue'

const app = createApp(SnakeGame)
app.mount('#app')

if (import.meta.env.PROD) {
  console.log('Running in production mode')
}