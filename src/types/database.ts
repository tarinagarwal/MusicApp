export interface User {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_admin: boolean;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_admin: boolean;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover_url: string;
  song_url: string;
  created_at: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  user_id: string;
  created_at: string;
}

export interface SongUpload {
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover_file: File | null;
  song_file: File | null;
}