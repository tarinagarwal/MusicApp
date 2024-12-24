import { create } from "zustand";
import { Howl } from "howler";
import type { Song } from "../types/database";
import { shuffleArray } from "../lib/queue";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  sound: Howl | null;
  queue: Song[];
  originalQueue: Song[];
  currentIndex: number;
  shuffle: boolean;
  repeat: boolean;
  setCurrentSong: (song: Song) => void;
  playSong: (song: Song, songs?: Song[]) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  nextSong: () => void;
  previousSong: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (song: Song) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.5,
  currentTime: 0,
  sound: null,
  queue: [],
  originalQueue: [],
  currentIndex: -1,
  shuffle: false,
  repeat: false,

  setCurrentSong: (song) => {
    set({ currentSong: song });
  },

  playSong: (song, songs = []) => {
    const { sound: currentSound, shuffle } = get();
    if (currentSound) {
      currentSound.unload();
    }

    // If songs array is provided, set up the queue
    if (songs.length > 0) {
      const songIndex = songs.findIndex((s) => s.id === song.id);
      const queueToUse = shuffle ? shuffleArray(songs) : songs;
      set({
        originalQueue: songs,
        queue: queueToUse,
        currentIndex: shuffle
          ? queueToUse.findIndex((s) => s.id === song.id)
          : songIndex,
      });
    }

    const sound = new Howl({
      src: [song.song_url],
      volume: get().volume,
      onend: () => {
        if (get().repeat) {
          sound.play();
        } else {
          get().nextSong();
        }
      },
      onplay: () => {
        const interval = setInterval(() => {
          if (sound.playing()) {
            set({ currentTime: sound.seek() });
          } else {
            clearInterval(interval);
          }
        }, 1000);
      },
    });

    sound.play();
    set({ currentSong: song, isPlaying: true, sound, currentTime: 0 });
  },

  pauseSong: () => {
    const { sound } = get();
    if (sound) {
      sound.pause();
    }
    set({ isPlaying: false });
  },

  resumeSong: () => {
    const { sound } = get();
    if (sound) {
      sound.play();
    }
    set({ isPlaying: true });
  },

  togglePlayPause: () => {
    const { isPlaying, pauseSong, resumeSong } = get();
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  },

  setVolume: (volume) => {
    const { sound } = get();
    if (sound) {
      sound.volume(volume);
    }
    set({ volume });
  },

  seek: (time) => {
    const { sound } = get();
    if (sound) {
      sound.seek(time);
      set({ currentTime: time });
    }
  },

  nextSong: () => {
    const { queue, currentIndex, repeat } = get();
    if (queue.length === 0) return;

    let nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      if (repeat) {
        nextIndex = 0;
      } else {
        return;
      }
    }

    const nextSong = queue[nextIndex];
    if (nextSong) {
      set({ currentIndex: nextIndex });
      get().playSong(nextSong);
    }
  },

  previousSong: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;

    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) return;

    const prevSong = queue[prevIndex];
    if (prevSong) {
      set({ currentIndex: prevIndex });
      get().playSong(prevSong);
    }
  },

  toggleShuffle: () => {
    const { originalQueue, currentSong, shuffle } = get();
    const newShuffle = !shuffle;

    if (originalQueue.length > 0) {
      const newQueue = newShuffle
        ? shuffleArray(originalQueue)
        : [...originalQueue];
      const newIndex = newQueue.findIndex(
        (song) => song.id === currentSong?.id
      );

      set({
        shuffle: newShuffle,
        queue: newQueue,
        currentIndex: newIndex >= 0 ? newIndex : 0,
      });
    } else {
      set({ shuffle: newShuffle });
    }
  },

  toggleRepeat: () => {
    set((state) => ({ repeat: !state.repeat }));
  },

  addToQueue: (song) => {
    set((state) => ({
      queue: [...state.queue, song],
      originalQueue: [...state.originalQueue, song],
    }));
  },
}));
