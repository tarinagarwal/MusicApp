import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { Music, Users, List } from 'lucide-react';

interface Stats {
  songs: number;
  users: number;
  playlists: number;
}

export function Stats() {
  const [stats, setStats] = useState<Stats>({ songs: 0, users: 0, playlists: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [songs, users, playlists] = await Promise.all([
          supabase.from('songs').select('id', { count: 'exact' }),
          supabase.from('users').select('id', { count: 'exact' }),
          supabase.from('playlists').select('id', { count: 'exact' }),
        ]);

        setStats({
          songs: songs.count || 0,
          users: users.count || 0,
          playlists: playlists.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statItems = [
    { title: 'Total Songs', value: stats.songs, icon: Music },
    { title: 'Total Users', value: stats.users, icon: Users },
    { title: 'Total Playlists', value: stats.playlists, icon: List },
  ];

  return (
    <Card className="bg-gray-900/40 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? statItems.map((item, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      {item.title}
                    </CardTitle>
                    <item.icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-7 w-20 bg-gray-700" />
                  </CardContent>
                </Card>
              ))
            : statItems.map((item, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      {item.title}
                    </CardTitle>
                    <item.icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{item.value}</div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </CardContent>
    </Card>
  );
}

