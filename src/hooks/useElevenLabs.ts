import { useState, useCallback, useRef, useEffect } from 'react';

interface TTSOptions {
  voice_id?: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
  output_format?: string;
}

interface TTSState {
  isLoading: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  error: string | null;
  audioUrl: string | null;
  duration: number;
  currentTime: number;
}

export const useElevenLabs = () => {
  const [state, setState] = useState<TTSState>({
    isLoading: false,
    isPlaying: false,
    isPaused: false,
    error: null,
    audioUrl: null,
    duration: 0,
    currentTime: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio event handlers
  const handleAudioLoad = useCallback(() => {
    if (audioRef.current) {
      setState(prev => ({
        ...prev,
        duration: audioRef.current?.duration || 0,
      }));
    }
  }, []);

  const handleAudioTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setState(prev => ({
        ...prev,
        currentTime: audioRef.current?.currentTime || 0,
      }));
    }
  }, []);

  const handleAudioEnded = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
    }));
  }, []);

  const handleAudioError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: 'Audio playback error',
      isLoading: false,
      isPlaying: false,
    }));
  }, []);

  // Generate speech from text using ElevenLabs API
  const generateSpeech = useCallback(async (
    text: string,
    options: TTSOptions = {}
  ): Promise<void> => {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      setState(prev => ({
        ...prev,
        error: 'ElevenLabs API key not configured'
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const defaultOptions: TTSOptions = {
        voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam voice (default)
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
        output_format: 'mp3_44100_128',
        ...options,
      };

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${defaultOptions.voice_id}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: defaultOptions.model_id,
          voice_settings: defaultOptions.voice_settings,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate speech';
        if (response.status === 429) {
          errorMessage = 'Rate limit exceeded. Please try again later.';
        } else if (response.status === 401) {
          errorMessage = 'Invalid API key. Please check your configuration.';
        } else if (response.status === 422) {
          errorMessage = 'Invalid request parameters.';
        }
        throw new Error(errorMessage);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Clean up previous audio URL
      if (state.audioUrl) {
        URL.revokeObjectURL(state.audioUrl);
      }

      setState(prev => ({
        ...prev,
        audioUrl,
        isLoading: false,
        error: null,
      }));

    } catch (error: any) {
      console.error('TTS Error:', error);
      
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to generate speech',
        isLoading: false,
      }));
    }
  }, [state.audioUrl]);

  // Play audio
  const play = useCallback(() => {
    if (audioRef.current && state.audioUrl) {
      audioRef.current.play().catch((error) => {
        console.error('Play error:', error);
        setState(prev => ({
          ...prev,
          error: 'Failed to play audio'
        }));
      });
      setState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
      }));
    }
  }, [state.audioUrl]);

  // Pause audio
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: true,
      }));
    }
  }, []);

  // Stop audio
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentTime: 0,
      }));
    }
  }, []);

  // Seek to specific time
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({
        ...prev,
        currentTime: time,
      }));
    }
  }, []);

  // Cleanup
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }
    setState({
      isLoading: false,
      isPlaying: false,
      isPaused: false,
      error: null,
      audioUrl: null,
      duration: 0,
      currentTime: 0,
    });
  }, [state.audioUrl]);

  // Create audio element when audioUrl changes
  useEffect(() => {
    if (state.audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', handleAudioLoad);
        audioRef.current.removeEventListener('timeupdate', handleAudioTimeUpdate);
        audioRef.current.removeEventListener('ended', handleAudioEnded);
        audioRef.current.removeEventListener('error', handleAudioError);
      }

      audioRef.current = new Audio(state.audioUrl);
      audioRef.current.addEventListener('loadedmetadata', handleAudioLoad);
      audioRef.current.addEventListener('timeupdate', handleAudioTimeUpdate);
      audioRef.current.addEventListener('ended', handleAudioEnded);
      audioRef.current.addEventListener('error', handleAudioError);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleAudioLoad);
        audioRef.current.removeEventListener('timeupdate', handleAudioTimeUpdate);
        audioRef.current.removeEventListener('ended', handleAudioEnded);
        audioRef.current.removeEventListener('error', handleAudioError);
      }
    };
  }, [state.audioUrl, handleAudioLoad, handleAudioTimeUpdate, handleAudioEnded, handleAudioError]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    ...state,
    generateSpeech,
    play,
    pause,
    stop,
    seekTo,
    cleanup,
  };
};