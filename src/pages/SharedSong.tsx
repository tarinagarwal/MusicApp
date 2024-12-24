import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { usePlayerStore } from "../store/playerStore";
import { useLikes } from "../hooks/useLikes";
import { useAuth } from "../hooks/useAuth";
import { shareContent } from "../lib/share";
import type { Song } from "../types/database";
import { Play, Pause, ArrowLeft, Heart, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { SongCard } from "../components/SongCard";
import { formatDuration } from "../lib/utils";

export default function SharedSong() {
  const { songId } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song | null>(null);
  const [otherSongs, setOtherSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { playSong, currentSong, isPlaying, togglePlayPause } =
    usePlayerStore();
  const { isLiked, toggleLike } = useLikes(songId || "");

  useEffect(() => {
    async function fetchSong() {
      try {
        const { data, error } = await supabase
          .from("songs")
          .select("*")
          .eq("id", songId)
          .single();

        if (error) throw error;
        setSong(data);

        const { data: otherSongsData, error: otherSongsError } = await supabase
          .from("songs")
          .select("*")
          .neq("id", songId)
          .order("created_at", { ascending: false })
          .limit(4);

        if (otherSongsError) throw otherSongsError;
        setOtherSongs(otherSongsData);
      } catch (error) {
        console.error("Error fetching song:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    if (songId) {
      fetchSong();
    }
  }, [songId, navigate]);

  const handlePlayPause = () => {
    if (song) {
      if (currentSong?.id !== song.id) {
        playSong(song);
      } else {
        togglePlayPause();
      }
    }
  };

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
    if (song) {
      await shareContent({
        title: song.title,
        text: `Listen to ${song.title} by ${song.artist}`,
        url: `${window.location.origin}/play/${song.id}`,
      });
    }
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="h-96 w-96 rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-16 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!song) {
    return null;
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-12">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="mb-6 text-blue-500 hover:text-blue-600 hover:bg-blue-100/10 transition-colors duration-200"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Home
      </Button>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start">
          <div className="relative w-80 h-80 lg:w-96 lg:h-96 group">
            <img
              src={song.cover_url}
              alt={song.title}
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-lg" />
            <Button
              size="icon"
              variant="ghost"
              className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-blue-500/80 text-white shadow-lg transition-transform duration-300 hover:bg-blue-600/80 opacity-0 group-hover:opacity-100"
              onClick={handlePlayPause}
            >
              {isPlaying && currentSong?.id === song.id ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{song.title}</h1>
            <p className="text-xl text-blue-500/80">{song.artist}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {formatDuration(song.duration)}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handlePlayPause}
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-6 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              {isPlaying && currentSong?.id === song.id ? (
                <Pause className="mr-3 h-6 w-6" />
              ) : (
                <Play className="mr-3 h-6 w-6" />
              )}
              {isPlaying && currentSong?.id === song.id ? "Pause" : "Play Now"}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleLike}
                    variant="outline"
                    className={`rounded-full p-3 ${
                      isLiked
                        ? "text-blue-500 border-blue-500"
                        : "text-muted-foreground border-muted-foreground"
                    } hover:text-blue-500 hover:border-blue-500 transition-colors duration-300`}
                  >
                    <Heart
                      className="h-6 w-6"
                      fill={isLiked ? "currentColor" : "none"}
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
                    onClick={handleShare}
                    variant="outline"
                    className="rounded-full p-3 text-muted-foreground border-muted-foreground hover:text-muted-foreground hover:bg-white hover:border-white transition-colors duration-300"
                  >
                    <Share2 className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-white mb-6">
          You May Also Like
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {otherSongs.map((song) => (
            <SongCard key={song.id} song={song} showDuration />
          ))}
        </div>
      </div>
    </div>
  );
}
