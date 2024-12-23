import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-client';
import { useAuth } from './useAuth';

export function useLikes(songId: string) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!user) {
      setIsLiked(false);
      setLoading(false);
      return;
    }

    async function checkLikeStatus() {
      try {
        const { data, error } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('song_id', songId)
          .maybeSingle();

        if (mounted) {
          // If there's no error or the error is just "no rows returned",
          // we can safely determine the like status
          if (!error || error.code === 'PGRST116') {
            setIsLiked(!!data);
          }
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkLikeStatus();

    return () => {
      mounted = false;
    };
  }, [user, songId]);

  const toggleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('song_id', songId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: user.id, song_id: songId });

        if (error) throw error;
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return { isLiked, loading, toggleLike };
}