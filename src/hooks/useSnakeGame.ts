import { useState, useEffect, useCallback } from 'react';
import { Direction, Position, GameState } from '../types';

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const INITIAL_SPEED = 150;

const createInitialState = (): GameState => ({
  snake: [{ x: 10, y: 10 }],
  food: { x: 15, y: 15 },
  direction: 'RIGHT',
  gameOver: false,
  score: 0,
});

const generateFood = (snake: Position[]): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

export const useSnakeGame = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [isRunning, setIsRunning] = useState(false);

  const moveSnake = useCallback(() => {
    if (gameState.gameOver) return;

    setGameState(prevState => {
      const newHead = { ...prevState.snake[0] };
      
      switch (prevState.direction) {
        case 'UP':
          newHead.y = (newHead.y - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'DOWN':
          newHead.y = (newHead.y + 1) % GRID_SIZE;
          break;
        case 'LEFT':
          newHead.x = (newHead.x - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'RIGHT':
          newHead.x = (newHead.x + 1) % GRID_SIZE;
          break;
      }

      // Check for collision with self
      if (prevState.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        return { ...prevState, gameOver: true };
      }

      const newSnake = [newHead, ...prevState.snake];
      
      // Check if snake ate food
      if (newHead.x === prevState.food.x && newHead.y === prevState.food.y) {
        return {
          ...prevState,
          snake: newSnake,
          food: generateFood(newSnake),
          score: prevState.score + 1,
        };
      }

      newSnake.pop(); // Remove tail if no food was eaten
      return { ...prevState, snake: newSnake };
    });
  }, [gameState.gameOver]);

  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prevState => {
      // Prevent 180-degree turns
      const invalidMove =
        (prevState.direction === 'UP' && newDirection === 'DOWN') ||
        (prevState.direction === 'DOWN' && newDirection === 'UP') ||
        (prevState.direction === 'LEFT' && newDirection === 'RIGHT') ||
        (prevState.direction === 'RIGHT' && newDirection === 'LEFT');

      if (invalidMove) return prevState;
      return { ...prevState, direction: newDirection };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialState());
    setIsRunning(true);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          changeDirection('UP');
          break;
        case 'ArrowDown':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          changeDirection('RIGHT');
          break;
        case ' ':
          if (gameState.gameOver) {
            resetGame();
          } else {
            setIsRunning(prev => !prev);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, resetGame, gameState.gameOver]);

  useEffect(() => {
    if (!isRunning) return;

    const gameLoop = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameLoop);
  }, [isRunning, moveSnake]);

  return {
    gameState,
    isRunning,
    resetGame,
    GRID_SIZE,
    CELL_SIZE,
  };
}; 