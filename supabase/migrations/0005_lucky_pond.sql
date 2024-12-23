/*
  # Create storage buckets and policies
  
  1. Creates storage buckets for:
    - songs: For storing audio files
    - covers: For storing album artwork
  
  2. Sets up RLS policies for:
    - Public read access
    - Admin-only write/delete access
*/

-- Drop existing buckets if they exist (to ensure clean state)
DO $$
BEGIN
  DELETE FROM storage.buckets WHERE id IN ('songs', 'covers');
END $$;

-- Create the buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'songs',
    'songs',
    true,
    52428800, -- 50MB limit
    ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
  ),
  (
    'covers',
    'covers',
    true,
    5242880,  -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  );

-- Drop existing policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admin users can upload songs" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can download songs" ON storage.objects;
  DROP POLICY IF EXISTS "Admin users can delete songs" ON storage.objects;
  DROP POLICY IF EXISTS "Admin users can upload covers" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can download covers" ON storage.objects;
  DROP POLICY IF EXISTS "Admin users can delete covers" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies for songs bucket
CREATE POLICY "Admin users can upload songs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'songs' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Anyone can download songs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'songs');

CREATE POLICY "Admin users can delete songs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'songs' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Create policies for covers bucket
CREATE POLICY "Admin users can upload covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'covers' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Anyone can download covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'covers');

CREATE POLICY "Admin users can delete covers"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'covers' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  )
);