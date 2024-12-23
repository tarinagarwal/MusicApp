import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Song } from '../types/database';
import { SongCard } from '../components/SongCard';

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSongs(data);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welcome to Spotify</h1>

      <div>
        <h2 className="text-2xl font-bold mb-4">Popular Songs</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} showDuration />
          ))}
        </div>
      </div>
    </div>
  );
}