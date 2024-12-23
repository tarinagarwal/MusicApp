import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Search } from 'lucide-react';
import type { Song } from '../types/database';
import { toast } from '../lib/toast';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { ScrollArea } from "../components/ui/scroll-area"
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog"

interface Props {
  playlistId: string;
  onSongAdded: () => void;
}

export function AddSongToPlaylist({ playlistId, onSongAdded }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSongs();
    }
  }, [isOpen]);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('title');
      
      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
      toast.error('Failed to fetch songs');
    }
  };

  const addSongToPlaylist = async (songId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('playlist_songs')
        .insert({ playlist_id: playlistId, song_id: songId });

      if (error) throw error;
      toast.success('Song added to playlist');
      onSongAdded();
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding song:', error);
      toast.error('Failed to add song');
    } finally {
      setLoading(false);
    }
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="bg-gray-800 hover:bg-gray-700 text-white">
          Add Songs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        <ScrollArea className="h-[300px] w-full rounded-md border border-gray-700">
          {filteredSongs.map((song) => (
            <Button
              key={song.id}
              onClick={() => addSongToPlaylist(song.id)}
              disabled={loading}
              variant="ghost"
              className="w-full flex items-center justify-start space-x-3 p-2 hover:bg-gray-800 rounded-md"
            >
              <img
                src={song.cover_url}
                alt={song.title}
                className="w-10 h-10 rounded"
              />
              <div className="flex-1 text-left">
                <p className="font-medium truncate">{song.title}</p>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
              </div>
            </Button>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

