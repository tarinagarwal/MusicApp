import React from "react";
import { Play, Heart, Share2, Pause } from "lucide-react";
import { usePlayerStore } from "../store/playerStore";
import { useLikes } from "../hooks/useLikes";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { shareContent } from "../lib/share";
import type { Song } from "../types/database";
import { formatDuration } from "../lib/utils";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

interface SongCardProps {
  song: Song;
  showDuration?: boolean;
}

export function SongCard({ song, showDuration = false }: SongCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playSong, currentSong, isPlaying, togglePlayPause } =
    usePlayerStore();
  const { isLiked, toggleLike } = useLikes(song.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
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
    <Card className="group overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg bg-transparent border border-black">
      <CardContent className="p-4">
        <div className="relative aspect-square mb-4">
          <img
            src={song.cover_url}
            alt={song.title}
            className="h-full w-full object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-md" />
          <Button
            size="icon"
            variant="ghost"
            className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-blue-500/80 text-white shadow-lg transition-transform duration-300 hover:bg-blue-600/80 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              isCurrentSong ? togglePlayPause() : playSong(song);
            }}
          >
            {isCurrentSong && isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
        </div>
        <div className="flex flex-col space-y-1">
          <h3 className="text-lg font-semibold text-white truncate">
            {song.title}
          </h3>
          <p className="text-sm text-blue-500/80 truncate">{song.artist}</p>
          {showDuration && (
            <p className="text-xs text-muted-foreground">
              {formatDuration(song.duration)}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`rounded-full hover:bg-transparent text-muted-foreground hover:text-muted-foreground  ${
                    isLiked ? "text-blue-500" : ""
                  } transition-colors duration-300  hover:text-blue-500`}
                  onClick={handleLike}
                >
                  <Heart
                    className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isLiked ? "Unlike" : "Like"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-muted-foreground transition-colors duration-300 hover:text-muted-foreground hover:bg-transparent"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
