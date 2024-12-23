import React from 'react';
import { formatDuration } from '../../lib/utils';
import { Slider } from "../ui/slider"

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const progress = (currentTime / duration) * 100;

  const handleSeek = (value: number[]) => {
    onSeek((value[0] / 100) * duration);
  };

  return (
    <div className="w-full space-y-1">
      <Slider
        value={[progress]}
        max={100}
        step={0.1}
        onValueChange={handleSeek}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatDuration(Math.floor(currentTime))}</span>
        <span>{formatDuration(Math.floor(duration))}</span>
      </div>
    </div>
  );
}

