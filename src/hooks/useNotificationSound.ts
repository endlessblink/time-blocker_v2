import { useCallback, useEffect, useRef, useState } from 'react';
import type { NotificationSettings } from '@context/NotificationContext';

interface AudioState {
  isLoaded: boolean;
  isPlaying: boolean;
  error: Error | null;
}

interface UseNotificationSoundProps {
  settings: NotificationSettings;
}

// Use CDN URLs that don't require CORS
const SOUND_URLS = {
  warning: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
  start: "https://assets.mixkit.co/active_storage/sfx/1114/1114-preview.mp3"
} as const;

export function useNotificationSound({ settings }: UseNotificationSoundProps) {
  const [audioStates, setAudioStates] = useState<Record<string, AudioState>>({
    warning: { isLoaded: false, isPlaying: false, error: null },
    start: { isLoaded: false, isPlaying: false, error: null },
  });

  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({
    warning: null,
    start: null,
  });

  // Initialize audio elements
  useEffect(() => {
    const loadAudio = async (type: keyof typeof SOUND_URLS) => {
      try {
        const audio = new Audio();
        audio.volume = settings.volume;
        audio.src = SOUND_URLS[type];
        
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
          audio.load();
        });

        audioRefs.current[type] = audio;
        
        setAudioStates(prev => ({
          ...prev,
          [type]: { ...prev[type], isLoaded: true, error: null }
        }));
      } catch (error) {
        console.error(`Failed to load ${type} sound:`, error);
        setAudioStates(prev => ({
          ...prev,
          [type]: { ...prev[type], isLoaded: false, error: error as Error }
        }));
      }
    };

    loadAudio('warning');
    loadAudio('start');

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
      audioRefs.current = { warning: null, start: null };
    };
  }, []);

  // Update volume when settings change
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.volume = settings.volume;
      }
    });
  }, [settings.volume]);

  const playSound = useCallback(async (type: keyof typeof SOUND_URLS): Promise<void> => {
    if (!settings.enabled || !settings.sounds[type]) {
      return;
    }

    const audio = audioRefs.current[type];
    if (!audio) {
      throw new Error('Audio not initialized');
    }
    
    try {
      setAudioStates(prev => ({
        ...prev,
        [type]: { ...prev[type], isPlaying: true, error: null }
      }));

      audio.currentTime = 0;
      await audio.play();

      await new Promise(resolve => {
        audio.onended = resolve;
      });

      setAudioStates(prev => ({
        ...prev,
        [type]: { ...prev[type], isPlaying: false }
      }));
    } catch (error) {
      console.error(`Failed to play ${type} sound:`, error);
      setAudioStates(prev => ({
        ...prev,
        [type]: { ...prev[type], isPlaying: false, error: error as Error }
      }));
      throw error;
    }
  }, [settings]);

  return {
    playSound,
    audioStates,
  };
}