import React from 'react';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Slider } from "../../components/ui/slider"
import { Button } from "../../components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 0.3) return <Volume className="h-4 w-4" />;
    if (volume < 0.7) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  const toggleMute = () => {
    onVolumeChange(volume === 0 ? 0.5 : 0);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-gray-400 hover:bg-transparent hover:text-gray-400">
              <VolumeIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white">
            <p>{volume === 0 ? 'Unmute' : 'Mute'}</p>
          </TooltipContent>
        </Tooltip>
        <Slider
          value={[volume * 100]}
          max={100}
          step={1}
          onValueChange={(value) => onVolumeChange(value[0] / 100)}
          className="w-24"
        />
      </div>
    </TooltipProvider>
  );
}

