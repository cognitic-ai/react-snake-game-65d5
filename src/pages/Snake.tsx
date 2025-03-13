import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSnakeGame } from "@/hooks/use-snake-game";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Snake = () => {
  const {
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
  } = useSnakeGame();

  const [isGameOverDialogOpen, setIsGameOverDialogOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction, isPaused, gameOver, handleKeyDown]);

  useEffect(() => {
    if (gameOver) {
      setIsGameOverDialogOpen(true);
    }
  }, [gameOver]);

  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Snake Game</CardTitle>
          <div className="text-center font-semibold">Score: {score}</div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-gray-300 rounded-md overflow-hidden">
            <div className="grid grid-cols-20 gap-0 max-w-full">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-5 h-5 ${
                      cell === "snake"
                        ? "bg-green-500"
                        : cell === "food"
                        ? "bg-red-500"
                        : "bg-white"
                    }`}
                  />
                ))
              )}
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Use arrow keys or WASD to control the snake
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-2">
          {!gameOver && !isPaused && (
            <Button variant="outline" onClick={pauseGame}>
              Pause
            </Button>
          )}
          {!gameOver && isPaused && (
            <Button onClick={resumeGame}>Resume</Button>
          )}
          <Button
            variant={gameOver || isPaused ? "default" : "outline"}
            onClick={resetGame}
          >
            Reset
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isGameOverDialogOpen} onOpenChange={setIsGameOverDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Game Over!</AlertDialogTitle>
            <AlertDialogDescription>
              Your final score is {score}. Would you like to play again?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={resetGame}>Play Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Snake;