import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Settings } from 'lucide-react';
import { useElevenLabs } from '../hooks/useElevenLabs';
import { useLanguage } from '../contexts/LanguageContext';
import TTSPlayer from './TTSPlayer';
import VoiceSettings from './VoiceSettings';

interface EnhancedVoiceActivationProps {
  onVoiceCommand?: (command: string) => void;
  className?: string;
}

const EnhancedVoiceActivation: React.FC<EnhancedVoiceActivationProps> = ({
  onVoiceCommand,
  className = '',
}) => {
  const { t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [status, setStatus] = useState(t('voice.sayFriday'));
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('pNInz6obpgDQGcFmaJgB');
  const [voiceSettings, setVoiceSettings] = useState({
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.0,
    use_speaker_boost: true,
  });
  const [responseText, setResponseText] = useState('');

  const { generateSpeech, isLoading: ttsLoading } = useElevenLabs();

  useEffect(() => {
    // Check microphone permission
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then(
        (permissionStatus) => {
          setHasPermission(permissionStatus.state === 'granted');
          
          permissionStatus.onchange = () => {
            setHasPermission(permissionStatus.state === 'granted');
          };
        }
      );
    }
  }, []);

  const handleVoiceToggle = async () => {
    if (!hasPermission) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (err) {
        setStatus('Microphone access denied');
        return;
      }
    }

    if (!wakeWordDetected && !isListening) {
      // Simulate wake word detection
      setWakeWordDetected(true);
      setIsListening(true);
      setStatus(t('voice.fridayActivated'));
      
      // Simulate voice command processing
      setTimeout(() => {
        const command = 'Hello Friday, how can you help me today?';
        setIsListening(false);
        setWakeWordDetected(false);
        setStatus(t('voice.processing'));
        
        // Generate AI response
        const response = t('console.hello');
        setResponseText(response);
        
        // Generate speech for the response
        generateSpeech(response, {
          voice_id: selectedVoice,
          voice_settings: voiceSettings,
        });
        
        onVoiceCommand?.(command);
        
        setTimeout(() => {
          setStatus(t('voice.sayFriday'));
        }, 2000);
      }, 3000);
    } else if (isListening) {
      // Stop listening
      setIsListening(false);
      setWakeWordDetected(false);
      setStatus(t('voice.sayFriday'));
    }
  };

  const getButtonState = () => {
    if (wakeWordDetected && isListening) {
      return {
        className: 'bg-gradient-to-br from-green-500 to-green-600 text-white animate-pulse',
        icon: <Mic className="h-6 w-6" />,
        ringColor: 'focus:ring-green-200 dark:focus:ring-green-800'
      };
    } else if (wakeWordDetected) {
      return {
        className: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
        icon: <Mic className="h-6 w-6" />,
        ringColor: 'focus:ring-blue-200 dark:focus:ring-blue-800'
      };
    } else {
      return {
        className: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700',
        icon: <Mic className="h-6 w-6" />,
        ringColor: 'focus:ring-primary-200 dark:focus:ring-primary-800'
      };
    }
  };

  const buttonState = getButtonState();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Voice Activation */}
      <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 w-full">
          {/* Voice Activation Button */}
          <div className="relative">
            <button
              onClick={handleVoiceToggle}
              disabled={!hasPermission}
              className={`
                relative w-16 h-16 rounded-full flex items-center justify-center
                transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${buttonState.ringColor}
                ${buttonState.className}
                ${!hasPermission ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              aria-label={wakeWordDetected ? 'Friday is listening' : 'Activate Friday'}
              aria-pressed={wakeWordDetected}
            >
              {buttonState.icon}
              
              {wakeWordDetected && isListening && (
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25"></div>
              )}
            </button>
          </div>

          {/* Status and Controls */}
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              wakeWordDetected && isListening 
                ? 'text-green-600 dark:text-green-400' 
                : wakeWordDetected 
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {status}
            </p>
            
            {!hasPermission && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {t('voice.micPermission')}
              </p>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Voice Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Visual feedback for listening */}
        {wakeWordDetected && isListening && (
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 bg-green-500 rounded-full animate-pulse`}
                style={{ 
                  animationDelay: `${i * 0.15}s`,
                  height: `${Math.random() * 20 + 16}px`
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Wake word indicator */}
        {wakeWordDetected && !isListening && (
          <div className="text-center">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Friday is ready to listen
            </p>
          </div>
        )}
      </div>

      {/* Voice Settings Panel */}
      {showSettings && (
        <VoiceSettings
          onVoiceChange={setSelectedVoice}
          onSettingsChange={setVoiceSettings}
          className="animate-slide-up"
        />
      )}

      {/* TTS Response Player */}
      {responseText && (
        <div className="animate-slide-up">
          <TTSPlayer
            text={responseText}
            voiceId={selectedVoice}
            autoPlay={true}
            onPlayEnd={() => {
              // Optional: Clear response after playback
              // setResponseText('');
            }}
          />
        </div>
      )}

      {/* Loading Indicator */}
      {ttsLoading && (
        <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-sm text-blue-600 dark:text-blue-400">
            Generating Friday's response...
          </span>
        </div>
      )}
    </div>
  );
};

export default EnhancedVoiceActivation;