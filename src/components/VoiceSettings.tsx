import React, { useState } from 'react';
import { Volume2, Settings, Mic, User } from 'lucide-react';

interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  accent: string;
  preview_url?: string;
}

interface VoiceSettingsProps {
  onVoiceChange?: (voiceId: string) => void;
  onSettingsChange?: (settings: any) => void;
  className?: string;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  onVoiceChange,
  onSettingsChange,
  className = '',
}) => {
  const [selectedVoice, setSelectedVoice] = useState('pNInz6obpgDQGcFmaJgB');
  const [voiceSettings, setVoiceSettings] = useState({
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.0,
    use_speaker_boost: true,
  });

  // Predefined voice profiles (Eleven Labs voices)
  const voiceProfiles: VoiceProfile[] = [
    {
      id: 'pNInz6obpgDQGcFmaJgB',
      name: 'Adam',
      description: 'Deep, authoritative male voice',
      gender: 'male',
      accent: 'American',
    },
    {
      id: 'EXAVITQu4vr4xnSDxMaL',
      name: 'Bella',
      description: 'Warm, friendly female voice',
      gender: 'female',
      accent: 'American',
    },
    {
      id: 'ErXwobaYiN019PkySvjV',
      name: 'Antoni',
      description: 'Smooth, professional male voice',
      gender: 'male',
      accent: 'American',
    },
    {
      id: 'MF3mGyEYCl7XYWbV9V6O',
      name: 'Elli',
      description: 'Young, energetic female voice',
      gender: 'female',
      accent: 'American',
    },
    {
      id: 'TxGEqnHWrfWFTfGW9XjX',
      name: 'Josh',
      description: 'Casual, conversational male voice',
      gender: 'male',
      accent: 'American',
    },
    {
      id: 'VR6AewLTigWG4xSOukaG',
      name: 'Arnold',
      description: 'Strong, confident male voice',
      gender: 'male',
      accent: 'American',
    },
  ];

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    onVoiceChange?.(voiceId);
  };

  const handleSettingChange = (key: string, value: number | boolean) => {
    const newSettings = { ...voiceSettings, [key]: value };
    setVoiceSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const selectedProfile = voiceProfiles.find(v => v.id === selectedVoice);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 text-primary-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Voice Settings
        </h2>
      </div>

      {/* Voice Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Voice Profile
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {voiceProfiles.map((voice) => (
            <div
              key={voice.id}
              onClick={() => handleVoiceChange(voice.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedVoice === voice.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-medium ${
                  selectedVoice === voice.id 
                    ? 'text-primary-700 dark:text-primary-300' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {voice.name}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  voice.gender === 'male' 
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400'
                }`}>
                  {voice.gender}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {voice.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {voice.accent} accent
              </p>
            </div>
          ))}
        </div>

        {selectedProfile && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Selected: {selectedProfile.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedProfile.description} • {selectedProfile.accent} accent
            </p>
          </div>
        )}
      </div>

      {/* Voice Parameters */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <Volume2 className="h-5 w-5 mr-2" />
          Voice Parameters
        </h3>

        {/* Stability */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Stability
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {voiceSettings.stability.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={voiceSettings.stability}
            onChange={(e) => handleSettingChange('stability', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Higher values make the voice more stable and consistent
          </p>
        </div>

        {/* Similarity Boost */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Similarity Boost
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {voiceSettings.similarity_boost.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={voiceSettings.similarity_boost}
            onChange={(e) => handleSettingChange('similarity_boost', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enhances similarity to the original voice
          </p>
        </div>

        {/* Style */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Style Exaggeration
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {voiceSettings.style.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={voiceSettings.style}
            onChange={(e) => handleSettingChange('style', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Amplifies the style of the original speaker
          </p>
        </div>

        {/* Speaker Boost */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Speaker Boost
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Boost similarity to the speaker
            </p>
          </div>
          <button
            onClick={() => handleSettingChange('use_speaker_boost', !voiceSettings.use_speaker_boost)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              voiceSettings.use_speaker_boost ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                voiceSettings.use_speaker_boost ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Presets
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              const settings = { stability: 0.3, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true };
              setVoiceSettings(settings);
              onSettingsChange?.(settings);
            }}
            className="px-3 py-2 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
          >
            Expressive
          </button>
          <button
            onClick={() => {
              const settings = { stability: 0.7, similarity_boost: 0.6, style: 0.0, use_speaker_boost: true };
              setVoiceSettings(settings);
              onSettingsChange?.(settings);
            }}
            className="px-3 py-2 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
          >
            Stable
          </button>
          <button
            onClick={() => {
              const settings = { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true };
              setVoiceSettings(settings);
              onSettingsChange?.(settings);
            }}
            className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Balanced
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceSettings;