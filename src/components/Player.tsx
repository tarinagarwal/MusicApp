import React from "react";
import { usePlayerStore } from "../store/playerStore";
import { Controls } from "./player/Controls";
import { ProgressBar } from "./player/ProgressBar";
import { VolumeControl } from "./player/VolumeControl";

export default function Player() {
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    shuffle,
    repeat,
    playSong,
    pauseSong,
    resumeSong,
    setVolume,
    seek,
    nextSong,
    previousSong,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  if (!currentSong) return null;

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  return (
    <div className="h-auto md:h-24 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 px-4 py-2 md:py-0 flex flex-col md:flex-row items-center justify-between sticky bottom-0 z-10">
      <div className="flex items-center space-x-4 w-full md:w-1/4 mb-2 md:mb-0">
        <img
          src={currentSong.cover_url}
          alt={currentSong.title}
          className="h-12 w-12 md:h-14 md:w-14 rounded-md"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold truncate">
            {currentSong.title}
          </h4>
          <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full md:w-1/2 space-y-1">
        <Controls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={nextSong}
          onPrevious={previousSong}
          shuffle={shuffle}
          repeat={repeat}
          onShuffleToggle={toggleShuffle}
          onRepeatToggle={toggleRepeat}
        />
        <div className="w-full px-2 md:px-4">
          <ProgressBar
            currentTime={currentTime}
            duration={currentSong.duration}
            onSeek={seek}
          />
        </div>
      </div>

      <div className="w-full md:w-1/4 flex justify-center md:justify-end mt-2 md:mt-0">
        <VolumeControl volume={volume} onVolumeChange={setVolume} />
      </div>
    </div>
  );
}
