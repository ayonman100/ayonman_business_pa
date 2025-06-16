import React, { useState } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useElevenLabs } from '../hooks/useElevenLabs';

interface TTSPlayerProps {
  text?: string;
  voiceId?: string;
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  onError?: (error: string) => void;
}

const TTSPlayer: React.FC<TTSPlayerProps> = ({
  text = '',
  voiceId = 'pNInz6obpgDQGcFmaJgB', // Adam voice
  className = '',
  autoPlay = false,
  showControls = true,
  onPlayStart,
  onPlayEnd,
  onError,
}) => {
  const {
    isLoading,
    isPlaying,
    isPaused,
    error,
    audioUrl,
    duration,
    currentTime,
    generateSpeech,
    play,
    pause,
    stop,
    seekTo,
  } = useElevenLabs();

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Generate speech when text changes
  React.useEffect(() => {
    if (text.trim()) {
      generateSpeech(text, {
        voice_id: voiceId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      });
    }
  }, [text, voiceId, generateSpeech]);

  // Auto play when audio is ready
  React.useEffect(() => {
    if (audioUrl && autoPlay && !isPlaying) {
      play();
    }
  }, [audioUrl, autoPlay, play, isPlaying]);

  // Handle play state changes
  React.useEffect(() => {
    if (isPlaying && onPlayStart) {
      onPlayStart();
    } else if (!isPlaying && !isPaused && currentTime === 0 && onPlayEnd) {
      onPlayEnd();
    }
  }, [isPlaying, isPaused, currentTime, onPlayStart, onPlayEnd]);

  // Handle errors
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!text.trim()) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      {/* Text Display */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Text to Speech:</p>
        <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
          {text}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mb-4 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Generating speech...</span>
        </div>
      )}

      {/* Controls */}
      {showControls && audioUrl && (
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="relative">
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Play/Pause Button */}
              <button
                onClick={handlePlayPause}
                disabled={isLoading}
                className="flex items-center justify-center w-10 h-10 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </button>

              {/* Stop Button */}
              <button
                onClick={stop}
                disabled={isLoading || (!isPlaying && !isPaused)}
                className="flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Square className="h-4 w-4" />
              </button>

              {/* Restart Button */}
              <button
                onClick={() => seekTo(0)}
                disabled={isLoading || !audioUrl}
                className="flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Volume Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMuteToggle}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hidden Audio Element for Accessibility */}
      {audioUrl && (
        <audio
          src={audioUrl}
          volume={isMuted ? 0 : volume}
          className="hidden"
          preload="metadata"
        />
      )}
    </div>
  );
};

export default TTSPlayer;