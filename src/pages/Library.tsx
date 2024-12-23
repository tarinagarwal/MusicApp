import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PlusCircle, Music4, Trash2 } from 'lucide-react';
import type { Playlist, Song } from '../types/database';
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import { AddSongToPlaylist } from '../components/AddSongToPlaylist';
import { PlaylistSongs } from '../components/PlaylistSongs';
import { toast } from '../lib/toast';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { ScrollArea } from "../components/ui/scroll-area"

export default function Library() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    if (selectedPlaylist) {
      fetchPlaylistSongs(selectedPlaylist.id);
    }
  }, [selectedPlaylist]);

  const fetchPlaylists = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaylists(data);
      if (data.length > 0 && !selectedPlaylist) {
        setSelectedPlaylist(data[0]);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylistSongs = async (playlistId: string) => {
    try {
      const { data, error } = await supabase
        .from('playlist_songs')
        .select('songs(*)')
        .eq('playlist_id', playlistId)
        .order('added_at', { ascending: true });

      if (error) throw error;
      setPlaylistSongs(data.map(item => item.songs as Song));
    } catch (error) {
      console.error('Error fetching playlist songs:', error);
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId);

      if (error) throw error;
      toast.success('Playlist deleted');
      setSelectedPlaylist(null);
      fetchPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;

  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Your Library</h1>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" asChild className="bg-white/10 hover:bg-white/20 text-white border-none">
              <Link to="/liked">
                Liked Songs
              </Link>
            </Button>
            <Button onClick={() => setIsModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-black">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Playlist
            </Button>
          </div>
        </div>

        {playlists.length === 0 ? (
          <Card className="bg-gray-900/40 border-gray-800 text-center py-12">
            <CardContent>
              <Music4 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-white">Create your first playlist</h3>
              <p className="mt-2 text-sm text-gray-400">It's easy, just click the button above.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gray-900/40 border-gray-800 md:col-span-1">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold text-white mb-4">Playlists</h2>
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-2">
                    {playlists.map((playlist) => (
                      <button
                        key={playlist.id}
                        className={`w-full text-left p-3 rounded-lg transition ${
                          selectedPlaylist?.id === playlist.id
                            ? 'bg-gray-900/60'
                            : 'hover:bg-gray-900/40'
                        }`}
                        onClick={() => setSelectedPlaylist(playlist)}
                      >
                        <h3 className="font-medium text-white truncate">{playlist.name}</h3>
                        <p className="text-sm text-gray-400 truncate">
                          {playlist.description || 'No description'}
                        </p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/40 border-gray-800 md:col-span-3">
              <CardContent className="p-6">
                {selectedPlaylist && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedPlaylist.name}</h2>
                        <p className="text-gray-400">
                          {selectedPlaylist.description || 'No description'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <AddSongToPlaylist
                          playlistId={selectedPlaylist.id}
                          onSongAdded={() => fetchPlaylistSongs(selectedPlaylist.id)}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deletePlaylist(selectedPlaylist.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <PlaylistSongs
                      songs={playlistSongs}
                      playlistId={selectedPlaylist.id}
                      onSongRemoved={() => fetchPlaylistSongs(selectedPlaylist.id)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <CreatePlaylistModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPlaylistCreated={fetchPlaylists}
        />
      </div>
    </div>
  );
}

