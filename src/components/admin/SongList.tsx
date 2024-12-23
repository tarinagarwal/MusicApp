import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { formatDuration, formatDate } from '../../lib/utils';
import type { Song } from '../../types/database';
import { Trash2, Heart } from 'lucide-react';
import { Button } from "../../components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"

interface SongWithLikes extends Song {
  like_count: number;
}

export function SongList() {
  const [songs, setSongs] = useState<SongWithLikes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*, likes(count)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const songsWithLikes = data.map(song => ({
        ...song,
        like_count: song.likes?.[0]?.count || 0
      }));
      
      setSongs(songsWithLikes);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSong = async (id: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSongs(songs.filter(song => song.id !== id));
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  return (
    <Card className="w-full bg-gray-900/40 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Song List</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-gray-800" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-800">
                  <TableHead className="text-gray-400">Title</TableHead>
                  <TableHead className="text-gray-400">Artist</TableHead>
                  <TableHead className="text-gray-400">Album</TableHead>
                  <TableHead className="text-gray-400">Duration</TableHead>
                  <TableHead className="text-gray-400">Added</TableHead>
                  <TableHead className="text-gray-400">Likes</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {songs.map((song) => (
                  <TableRow key={song.id} className="border-b border-gray-800 hover:bg-gray-800/40">
                    <TableCell className="text-white">{song.title}</TableCell>
                    <TableCell className="text-gray-300">{song.artist}</TableCell>
                    <TableCell className="text-gray-300">{song.album}</TableCell>
                    <TableCell className="text-gray-300">{formatDuration(song.duration)}</TableCell>
                    <TableCell className="text-gray-300">{formatDate(song.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Heart size={16} className="text-red-500" />
                        <span>{song.like_count}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSong(song.id)}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
