import React from 'react';
import { Play, Heart, Share2, Pause } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useLikes } from '../hooks/useLikes';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { shareContent } from '../lib/share';
import type { Song } from '../types/database';
import { formatDuration } from '../lib/utils';
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"

interface SongCardProps {
  song: Song;
  showDuration?: boolean;
}

export function SongCard({ song, showDuration = false }: SongCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playSong, currentSong, isPlaying, togglePlayPause } = usePlayerStore();
  const { isLiked, toggleLike } = useLikes(song.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }
    toggleLike();
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await shareContent({
      title: song.title,
      text: `Listen to ${song.title} by ${song.artist}`,
      url: `${window.location.origin}/play/${song.id}`,
    });
  };

  const isCurrentSong = currentSong?.id === song.id;

  return (
    <Card 
      className="bg-gray-900/40 hover:bg-gray-800/60 transition cursor-pointer group border-0 rounded-lg overflow-hidden"
      onClick={() => isCurrentSong ? togglePlayPause() : playSong(song)}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={song.cover_url}
            alt={song.title}
            className="w-full aspect-square object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full bg-blue-500 hover:bg-blue-600 text-white mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      isCurrentSong ? togglePlayPause() : playSong(song);
                    }}
                  >
                    {isCurrentSong && isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCurrentSong && isPlaying ? 'Pause' : 'Play'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`rounded-full ${
                      isLiked ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                    } mr-2`}
                    onClick={handleLike}
                  >
                    <Heart
                      className={`h-4 w-4 ${isLiked ? 'fill-white text-white' : 'text-white'}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isLiked ? 'Unlike' : 'Like'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full bg-gray-700 hover:bg-gray-600"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="p-4 bg-gray-900">
          <h3 className="font-semibold truncate text-blue-100">{song.title}</h3>
          <p className="text-sm text-blue-300 truncate">{song.artist}</p>
          {showDuration && (
            <p className="text-xs text-blue-400 mt-1">
              {formatDuration(song.duration)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

