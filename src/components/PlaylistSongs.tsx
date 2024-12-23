import React from 'react';
import { Trash2, Play } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import type { Song } from '../types/database';
import { supabase } from '../lib/supabase';
import { toast } from '../lib/toast';
import { formatDuration } from '../lib/utils';
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

interface Props {
  songs: Song[];
  playlistId: string;
  onSongRemoved: () => void;
}

export function PlaylistSongs({ songs, playlistId, onSongRemoved }: Props) {
  const { playSong, currentSong, isPlaying } = usePlayerStore();

  const removeSong = async (songId: string) => {
    try {
      const { error } = await supabase
        .from('playlist_songs')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('song_id', songId);

      if (error) throw error;
      toast.success('Song removed from playlist');
      onSongRemoved();
    } catch (error) {
      console.error('Error removing song:', error);
      toast.error('Failed to remove song');
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-b border-gray-800">
            <TableHead className="w-[100px] text-gray-300">Cover</TableHead>
            <TableHead className="text-gray-300">Title</TableHead>
            <TableHead className="text-gray-300">Artist</TableHead>
            <TableHead className="text-gray-300">Duration</TableHead>
            <TableHead className="text-right text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song) => (
            <TableRow key={song.id} className="border-b border-gray-800 hover:bg-gray-900/40">
              <TableCell className="font-medium">
                <img
                  src={song.cover_url}
                  alt={song.title}
                  className="w-12 h-12 rounded object-cover"
                />
              </TableCell>
              <TableCell className="font-medium text-white">{song.title}</TableCell>
              <TableCell className="text-gray-300">{song.artist}</TableCell>
              <TableCell className="text-gray-300">{formatDuration(song.duration)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className={`bg-gray-800 text-white hover:bg-gray-700 ${
                      currentSong?.id === song.id && isPlaying ? 'bg-green-500 text-black hover:bg-green-600' : ''
                    }`}
                    onClick={() => playSong(song)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="bg-gray-800 text-white hover:bg-gray-700"
                    onClick={() => removeSong(song.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

