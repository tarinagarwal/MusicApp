import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  shuffle: boolean;
  repeat: boolean;
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
}

export function Controls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  shuffle,
  repeat,
  onShuffleToggle,
  onRepeatToggle,
}: ControlsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center space-x-2 sm:space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onShuffleToggle}
              className={
                shuffle
                  ? "text-green-500 hover:bg-transparent hover:text-green-500"
                  : "text-gray-400 hover:bg-transparent hover:text-gray-400"
              }
            >
              <Shuffle className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white">
            <p>Shuffle</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="text-gray-400 hover:bg-transparent hover:text-gray-400"
            >
              <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white">
            <p>Previous</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="icon"
              onClick={onPlayPause}
              className="bg-white hover:bg-gray-200 text-black h-10 w-10 sm:h-12 sm:w-12"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Play className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white">
            <p>{isPlaying ? "Pause" : "Play"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="text-gray-400 hover:bg-transparent hover:text-gray-400"
            >
              <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white">
            <p>Next</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRepeatToggle}
              className={
                repeat
                  ? "text-green-500 hover:bg-transparent hover:text-green-500"
                  : "text-gray-400 hover:bg-transparent hover:text-gray-400"
              }
            >
              <Repeat className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white">
            <p>Repeat</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
