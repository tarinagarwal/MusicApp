/*
  # Initial Schema for Spotify Clone

  1. New Tables
    - users (extends auth.users)
      - id (uuid, primary key)
      - full_name (text)
      - avatar_url (text)
      - created_at (timestamp)
    
    - songs
      - id (uuid, primary key)
      - title (text)
      - artist (text)
      - album (text)
      - duration (integer, in seconds)
      - cover_url (text)
      - song_url (text)
      - created_at (timestamp)
    
    - playlists
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - cover_url (text)
      - user_id (uuid, references users)
      - created_at (timestamp)
    
    - playlist_songs
      - id (uuid, primary key)
      - playlist_id (uuid, references playlists)
      - song_id (uuid, references songs)
      - added_at (timestamp)
    
    - likes
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - song_id (uuid, references songs)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE public.users (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  album text,
  duration integer NOT NULL,
  cover_url text,
  song_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cover_url text,
  user_id uuid REFERENCES public.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.playlist_songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES public.playlists ON DELETE CASCADE NOT NULL,
  song_id uuid REFERENCES public.songs ON DELETE CASCADE NOT NULL,
  added_at timestamptz DEFAULT now(),
  UNIQUE(playlist_id, song_id)
);

CREATE TABLE public.likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  song_id uuid REFERENCES public.songs ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, song_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all songs" ON public.songs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can view all playlists" ON public.playlists
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create playlists" ON public.playlists
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" ON public.playlists
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" ON public.playlists
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view playlist songs" ON public.playlist_songs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage songs in their playlists" ON public.playlist_songs
  FOR ALL TO authenticated USING (
    auth.uid() IN (
      SELECT user_id FROM public.playlists WHERE id = playlist_id
    )
  );

CREATE POLICY "Users can view all likes" ON public.likes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own likes" ON public.likes
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Insert some sample songs
INSERT INTO public.songs (title, artist, album, duration, cover_url, song_url) VALUES
  ('Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 354, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7', 'https://example.com/song1.mp3'),
  ('Stairway to Heaven', 'Led Zeppelin', 'Led Zeppelin IV', 482, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819', 'https://example.com/song2.mp3'),
  ('Hotel California', 'Eagles', 'Hotel California', 391, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f', 'https://example.com/song3.mp3');