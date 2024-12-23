import React from 'react';
import { usePlayerStore } from '../store/playerStore';
import { Controls } from './player/Controls';
import { ProgressBar } from './player/ProgressBar';
import { VolumeControl } from './player/VolumeControl';

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
    <div className="h-24 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4 w-1/4">
        <img
          src={currentSong.cover_url}
          alt={currentSong.title}
          className="h-14 w-14 rounded-md"
        />
        <div>
          <h4 className="text-sm font-semibold">{currentSong.title}</h4>
          <p className="text-xs text-gray-400">{currentSong.artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center w-1/2 space-y-2">
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
        <ProgressBar
          currentTime={currentTime}
          duration={currentSong.duration}
          onSeek={seek}
        />
      </div>

      <div className="w-1/4 flex justify-end">
        <VolumeControl volume={volume} onVolumeChange={setVolume} />
      </div>
    </div>
  );
}