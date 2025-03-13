import { useState, useEffect, useCallback } from "react";

// Define types
type Cell = "empty" | "snake" | "food";
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { row: number; col: number };

// Grid dimensions
const GRID_ROWS = 20;
const GRID_COLS = 20;

// Game speed (milliseconds)
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;
const MIN_SPEED = 50;

// Initialize empty grid
const createEmptyGrid = (): Cell[][] => {
  return Array(GRID_ROWS)
    .fill(null)
    .map(() => Array(GRID_COLS).fill("empty"));
};

// Generate random position for food
const generateFoodPosition = (snake: Position[]): Position => {
  let position: Position;
  let isValidPosition = false;

  while (!isValidPosition) {
    position = {
      row: Math.floor(Math.random() * GRID_ROWS),
      col: Math.floor(Math.random() * GRID_COLS),
    };

    isValidPosition = !snake.some(
      (segment) => segment.row === position.row && segment.col === position.col
    );

    if (isValidPosition) {
      return position;
    }
  }

  // Fallback (should never reach here if the grid is not full)
  return { row: 0, col: 0 };
};

export const useSnakeGame = () => {
  // Initial snake position in the middle of the grid
  const initialSnake: Position[] = [
    { row: Math.floor(GRID_ROWS / 2), col: Math.floor(GRID_COLS / 2) },
  ];

  const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid());
  const [snake, setSnake] = useState<Position[]>(initialSnake);
  const [food, setFood] = useState<Position>(
    generateFoodPosition(initialSnake)
  );
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [nextDirection, setNextDirection] = useState<Direction>("RIGHT");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);

  // Update grid with snake and food
  const updateGrid = useCallback(() => {
    const newGrid = createEmptyGrid();

    // Add snake to grid
    snake.forEach((segment) => {
      if (
        segment.row >= 0 &&
        segment.row < GRID_ROWS &&
        segment.col >= 0 &&
        segment.col < GRID_COLS
      ) {
        newGrid[segment.row][segment.col] = "snake";
      }
    });

    // Add food to grid
    newGrid[food.row][food.col] = "food";

    setGrid(newGrid);
  }, [snake, food]);

  // Game loop
  useEffect(() => {
    if (!isRunning || isPaused || gameOver) return;

    const moveSnake = () => {
      setDirection(nextDirection);

      const head = { ...snake[0] };
      
      // Move head based on direction
      switch (direction) {
        case "UP":
          head.row -= 1;
          break;
        case "DOWN":
          head.row += 1;
          break;
        case "LEFT":
          head.col -= 1;
          break;
        case "RIGHT":
          head.col += 1;
          break;
      }

      // Check for collisions with walls
      if (
        head.row < 0 ||
        head.row >= GRID_ROWS ||
        head.col < 0 ||
        head.col >= GRID_COLS
      ) {
        setGameOver(true);
        return;
      }

      // Check for collisions with self (excluding the tail that will move)
      if (
        snake.some(
          (segment, index) =>
            // Skip checking the tail that's about to move
            index < snake.length - 1 &&
            segment.row === head.row &&
            segment.col === head.col
        )
      ) {
        setGameOver(true);
        return;
      }

      const newSnake = [head, ...snake];

      // Check if snake eats food
      if (head.row === food.row && head.col === food.col) {
        // Increase score
        setScore((prev) => prev + 1);
        
        // Increase speed
        setSpeed((prevSpeed) => 
          Math.max(MIN_SPEED, prevSpeed - SPEED_INCREMENT)
        );
        
        // Generate new food
        setFood(generateFoodPosition(newSnake));
      } else {
        // Remove tail if no food eaten
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [isRunning, isPaused, gameOver, snake, food, direction, nextDirection, speed]);

  // Update grid when snake or food changes
  useEffect(() => {
    updateGrid();
  }, [snake, food, updateGrid]);

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;

      if (isPaused) {
        // Only allow resuming with space when paused
        if (e.key === " ") {
          setIsPaused(false);
        }
        return;
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (direction !== "DOWN") {
            setNextDirection("UP");
          }
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (direction !== "UP") {
            setNextDirection("DOWN");
          }
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (direction !== "RIGHT") {
            setNextDirection("LEFT");
          }
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (direction !== "LEFT") {
            setNextDirection("RIGHT");
          }
          break;
        case " ":
          setIsPaused((prev) => !prev);
          break;
      }
    },
    [direction, gameOver, isPaused]
  );

  // Start the game
  const startGame = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  // Pause the game
  const pauseGame = useCallback(() => {
    setIsPaused(true);
  }, []);

  // Resume the game
  const resumeGame = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Reset the game
  const resetGame = useCallback(() => {
    setSnake(initialSnake);
    setFood(generateFoodPosition(initialSnake));
    setDirection("RIGHT");
    setNextDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  // Auto-start the game on first load
  useEffect(() => {
    startGame();
  }, [startGame]);

  return {
    grid,
    score,
    gameOver,
    isPaused,
    direction,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    handleKeyDown,
  };
};