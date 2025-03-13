import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, PauseIcon, PlayIcon, RotateCcw } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

type TouchControlsProps = {
  onDirectionChange: (direction: "UP" | "DOWN" | "LEFT" | "RIGHT") => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  isPaused: boolean;
  gameOver: boolean;
};

export function TouchControls({
  onDirectionChange,
  onPause,
  onResume,
  onReset,
  isPaused,
  gameOver,
}: TouchControlsProps) {
  const isMobile = useMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <div className="mt-4 w-full">
      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
        <div className="col-start-2">
          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full"
            onClick={() => onDirectionChange("UP")}
          >
            <ChevronUp className="h-8 w-8" />
          </Button>
        </div>
        <div className="col-start-1 row-start-2">
          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full"
            onClick={() => onDirectionChange("LEFT")}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        </div>
        <div className="col-start-3 row-start-2">
          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full"
            onClick={() => onDirectionChange("RIGHT")}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
        <div className="col-start-2 row-start-3">
          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full"
            onClick={() => onDirectionChange("DOWN")}
          >
            <ChevronDown className="h-8 w-8" />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center mt-4 space-x-4">
        {!gameOver && !isPaused ? (
          <Button 
            variant="outline" 
            size="icon"
            onClick={onPause}
          >
            <PauseIcon className="h-4 w-4" />
          </Button>
        ) : null}
        
        {!gameOver && isPaused ? (
          <Button 
            size="icon"
            onClick={onResume}
          >
            <PlayIcon className="h-4 w-4" />
          </Button>
        ) : null}
        
        <Button 
          variant={gameOver || isPaused ? "default" : "outline"} 
          size="icon"
          onClick={onReset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}