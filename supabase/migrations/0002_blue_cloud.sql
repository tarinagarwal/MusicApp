/*
  # Add admin functionality and storage buckets

  1. Changes
    - Add is_admin column to users table
    - Create storage buckets for songs and covers
    - Add policies for admin users

  2. Security
    - Only admin users can upload files
    - Only admin users can delete files
*/

-- Add is_admin column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create policies for admin access
CREATE POLICY "Admin users can insert songs" ON public.songs
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admin users can update songs" ON public.songs
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admin users can delete songs" ON public.songs
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Storage policies for songs bucket
CREATE POLICY "Admin users can upload songs"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'songs' AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Anyone can download songs"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'songs');

CREATE POLICY "Admin users can delete songs"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'songs' AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Storage policies for covers bucket
CREATE POLICY "Admin users can upload covers"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'covers' AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Anyone can download covers"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'covers');

CREATE POLICY "Admin users can delete covers"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'covers' AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );