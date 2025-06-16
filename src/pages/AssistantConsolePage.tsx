import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Pause, Square, RotateCcw, Send, Volume2 } from 'lucide-react';
import { useStats } from '../contexts/StatsContext';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import TTSPlayer from '../components/TTSPlayer';
import VoiceSettings from '../components/VoiceSettings';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  hasAudio?: boolean;
}

const AssistantConsolePage: React.FC = () => {
  const { incrementVoiceCommands, logActivity } = useStats();
  const { t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: t('console.hello'),
      timestamp: new Date(),
      hasAudio: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('pNInz6obpgDQGcFmaJgB');
  const [voiceSettings, setVoiceSettings] = useState({
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.0,
    use_speaker_boost: true,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceToggle = () => {
    if (isPaused) {
      setIsPaused(false);
      return;
    }

    if (isListening) {
      setIsListening(false);
      // Simulate processing voice input
      setTimeout(() => {
        addMessage('user', 'Can you help me schedule a meeting for tomorrow at 2 PM?');
        incrementVoiceCommands();
        logActivity('Voice command used', 'Console voice interaction');
        setTimeout(() => {
          addMessage('assistant', "I'd be happy to help you schedule a meeting for tomorrow at 2 PM. Let me check your calendar availability and set that up for you. What's the meeting about and who should I invite?", true);
        }, 1000);
      }, 500);
    } else {
      setIsListening(true);
      logActivity('Voice recording started', 'Console');
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (isListening) {
      setIsListening(false);
    }
    logActivity('Voice recording paused', 'Console');
  };

  const handleStop = () => {
    setIsListening(false);
    setIsPaused(false);
    logActivity('Voice recording stopped', 'Console');
  };

  const handleReset = () => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: t('console.hello'),
        timestamp: new Date(),
        hasAudio: true
      }
    ]);
    setIsListening(false);
    setIsPaused(false);
    logActivity('Chat conversation reset', 'Console');
  };

  const addMessage = (type: 'user' | 'assistant', content: string, hasAudio: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      hasAudio
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      addMessage('user', inputText);
      logActivity('Text message sent', inputText.substring(0, 50) + '...');
      setInputText('');
      
      // Simulate AI response with audio
      setTimeout(() => {
        const responses = [
          "Thank you for your message. I'm processing your request and will provide assistance shortly.",
          "I understand your request. Let me help you with that right away.",
          "Great question! I'll analyze this and provide you with the best solution.",
          "I'm here to help. Let me gather the information you need.",
          "Perfect! I'll take care of that for you immediately."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage('assistant', randomResponse, true);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('console.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('console.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Container */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Messages Area */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md space-y-2`}>
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      
                      {/* TTS Player for assistant messages */}
                      {message.type === 'assistant' && message.hasAudio && (
                        <div className="mt-2">
                          <TTSPlayer
                            text={message.content}
                            voiceId={selectedVoice}
                            autoPlay={false}
                            showControls={true}
                            className="!p-3 !border-0 !shadow-none !bg-gray-50 dark:!bg-gray-600"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Voice Controls */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  {/* Main Voice Button */}
                  <div className="relative">
                    <button
                      onClick={handleVoiceToggle}
                      disabled={isPaused}
                      className={`
                        relative w-20 h-20 rounded-full flex items-center justify-center
                        transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800
                        ${isListening 
                          ? 'bg-gradient-to-br from-red-500 to-red-600 text-white animate-pulse' 
                          : isPaused
                          ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white'
                          : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                        }
                        ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {isListening ? (
                        <MicOff className="h-8 w-8" />
                      ) : (
                        <Mic className="h-8 w-8" />
                      )}
                      
                      {isListening && (
                        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25"></div>
                      )}
                    </button>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePause}
                      className="p-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                      title="Pause"
                    >
                      <Pause className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleStop}
                      className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Stop"
                    >
                      <Square className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                      title="Reset"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Voice Waveform Animation */}
                {isListening && (
                  <div className="flex justify-center space-x-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary-500 rounded-full animate-pulse"
                        style={{ 
                          height: `${Math.random() * 20 + 10}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '0.5s'
                        }}
                      ></div>
                    ))}
                  </div>
                )}

                {/* Status Text */}
                <div className="text-center mb-4">
                  <p className={`text-sm font-medium ${
                    isListening ? 'text-red-600 dark:text-red-400' : 
                    isPaused ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {isListening ? t('voice.listening') : 
                     isPaused ? 'Conversation paused' :
                     t('voice.clickToAsk')}
                  </p>
                </div>

                {/* Text Input Alternative */}
                <form onSubmit={handleTextSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Or type your message here..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Voice Settings Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5 text-primary-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Voice Settings</span>
                </div>
                <div className={`transform transition-transform ${showVoiceSettings ? 'rotate-180' : ''}`}>
                  ↓
                </div>
              </button>
            </div>

            {showVoiceSettings && (
              <VoiceSettings
                onVoiceChange={setSelectedVoice}
                onSettingsChange={setVoiceSettings}
                className="animate-slide-up"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantConsolePage;