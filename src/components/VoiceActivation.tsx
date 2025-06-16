import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceActivationProps {
  onVoiceCommand?: (command: string) => void;
}

const VoiceActivation: React.FC<VoiceActivationProps> = ({ onVoiceCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [status, setStatus] = useState('Say the wake word "Friday" to activate');

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
      setStatus('Friday activated! Listening for your command...');
      
      // Simulate voice command processing after 3 seconds
      setTimeout(() => {
        setIsListening(false);
        setWakeWordDetected(false);
        setStatus('Command processed. Say "Friday" to activate again.');
        onVoiceCommand?.('Hello Friday, show me today\'s schedule');
      }, 3000);
    } else if (isListening) {
      // Stop listening
      setIsListening(false);
      setWakeWordDetected(false);
      setStatus('Say the wake word "Friday" to activate');
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
    <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
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

      <div className="text-center">
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
            Microphone permission required
          </p>
        )}
      </div>

      {/* Visual feedback for listening */}
      {wakeWordDetected && isListening && (
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-8 bg-green-500 rounded-full animate-pulse`}
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
  );
};

export default VoiceActivation;