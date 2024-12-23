import { create } from 'zustand';
import { Howl } from 'howler';
import type { Song } from '../types/database';

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  sound: Howl | null;
  queue: Song[];
  shuffle: boolean;
  repeat: boolean;
  setCurrentSong: (song: Song) => void;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
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
  shuffle: false,
  repeat: false,

  setCurrentSong: (song) => {
    set({ currentSong: song });
  },

  playSong: (song) => {
    const { sound: currentSound } = get();
    if (currentSound) {
      currentSound.unload();
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
        // Update current time
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
    // Implement next song logic
  },

  previousSong: () => {
    // Implement previous song logic
  },

  toggleShuffle: () => {
    set((state) => ({ shuffle: !state.shuffle }));
  },

  toggleRepeat: () => {
    set((state) => ({ repeat: !state.repeat }));
  },

  addToQueue: (song) => {
    set((state) => ({ queue: [...state.queue, song] }));
  },
}));