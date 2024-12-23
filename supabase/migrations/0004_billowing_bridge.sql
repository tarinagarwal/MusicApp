/*
  # Update songs policy to allow public access
  
  1. Changes
    - Remove authentication requirement for viewing songs
    - Keep other policies unchanged
  
  2. Security
    - Allow public access to songs
    - Maintain admin-only write access
*/

DROP POLICY IF EXISTS "Users can view all songs" ON public.songs;
CREATE POLICY "Anyone can view songs" ON public.songs
  FOR SELECT USING (true);