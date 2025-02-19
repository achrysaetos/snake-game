import { useEffect, useRef } from 'react';
import { useSnakeGame } from '../hooks/useSnakeGame';
import '../styles/App.css';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, isRunning, resetGame, GRID_SIZE, CELL_SIZE } = useSnakeGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    // Draw snake
    ctx.fillStyle = '#4CAF50';
    gameState.snake.forEach(({ x, y }) => {
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
    });

    // Draw food
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(
      gameState.food.x * CELL_SIZE,
      gameState.food.y * CELL_SIZE,
      CELL_SIZE - 1,
      CELL_SIZE - 1
    );

    // Draw game over text
    if (gameState.gameOver) {
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Game Over! Press Space to Restart',
        (GRID_SIZE * CELL_SIZE) / 2,
        (GRID_SIZE * CELL_SIZE) / 2
      );
    }
  }, [gameState, GRID_SIZE, CELL_SIZE]);

  return (
    <div className="game-container">
      <img src="/logo.png" alt="Gentrace Logo" className="logo" />
      <div className="game-info">
        <p className="score">Score: {gameState.score}</p>
        {!isRunning && !gameState.gameOver && (
          <p className="instructions">Press Space to Start</p>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="game-canvas"
      />
      <div className="controls-info">
        <p>Use arrow keys to move</p>
        <p>Space to pause/resume</p>
      </div>
    </div>
  );
}
