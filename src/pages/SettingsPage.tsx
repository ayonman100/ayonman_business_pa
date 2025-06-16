import React, { useState, useEffect } from 'react';
import { Save, User, Globe, Volume2, Palette, Bell, Shield, Crown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

interface UserSettings {
  voiceType: 'male' | 'female';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    voice: boolean;
    reminders: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    voiceRecording: boolean;
  };
}

interface ProfileData {
  fullName: string;
  email: string;
  companyName: string;
  jobTitle: string;
  phoneNumber: string;
  language: string;
  timezone: string;
}

const SettingsPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    voiceType: 'male', // Default to male for free plan
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      voice: false,
      reminders: true
    },
    privacy: {
      dataCollection: true,
      analytics: false,
      voiceRecording: true
    }
  });
  
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    email: '',
    companyName: '',
    jobTitle: '',
    phoneNumber: '',
    language: 'English',
    timezone: 'UTC'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('ayonman_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }

    // Initialize profile data from user context
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        companyName: user.companyName || '',
        jobTitle: user.jobTitle || '',
        phoneNumber: user.phoneNumber || '',
        language: user.language || 'English',
        timezone: user.timezone || 'UTC'
      });
    }
  }, [user]);

  const handleSettingChange = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' 
        ? { ...prev[category], [key]: value }
        : value
    }));
  };

  const handleProfileChange = (key: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('ayonman_settings', JSON.stringify(settings));
      
      // Update user profile data
      if (user) {
        updateUser({
          fullName: profileData.fullName,
          companyName: profileData.companyName,
          jobTitle: profileData.jobTitle,
          phoneNumber: profileData.phoneNumber,
          language: profileData.language,
          timezone: profileData.timezone
        });
      }
      
      setSaveMessage('Settings saved successfully!');
      
      // Handle theme change
      if (settings.theme !== 'system') {
        if ((settings.theme === 'dark') !== isDark) {
          toggleTheme();
        }
      }
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch: React.FC<{ 
    checked: boolean; 
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }> = ({ checked, onChange, disabled = false }) => (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${checked ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );

  const isFreePlan = user?.plan === 'free';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your Ayonman Business PA experience
          </p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            saveMessage.includes('Error') 
              ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' 
              : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
          }`}>
            {saveMessage}
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-primary-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Profile Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => handleProfileChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={profileData.companyName}
                  onChange={(e) => handleProfileChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Your company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={profileData.jobTitle}
                  onChange={(e) => handleProfileChange('jobTitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Your job title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={profileData.language}
                  onChange={(e) => handleProfileChange('language', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="English">English</option>
                  <option value="Yoruba">Yoruba</option>
                  <option value="Pidgin">Nigerian Pidgin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={profileData.timezone}
                  onChange={(e) => handleProfileChange('timezone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="America/Chicago">America/Chicago</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Africa/Lagos">Africa/Lagos</option>
                  <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                  <option value="Australia/Sydney">Australia/Sydney</option>
                </select>
              </div>
            </div>
          </div>

          {/* Voice Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <Volume2 className="h-6 w-6 text-primary-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Voice Settings
              </h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voice Type
              </label>
              <div className="relative">
                <select
                  value={settings.voiceType}
                  onChange={(e) => handleSettingChange('voiceType', '', e.target.value)}
                  disabled={isFreePlan}
                  className={`w-full max-w-xs px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    isFreePlan ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-600' : ''
                  }`}
                >
                  <option value="male">Male Voice</option>
                  <option value="female">Female Voice</option>
                </select>
                {isFreePlan && (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-amber-600 dark:text-amber-400">
                    <Crown className="h-4 w-4" />
                    <span>Upgrade to Pro to unlock more voice options</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <Palette className="h-6 w-6 text-primary-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Appearance
              </h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', '', e.target.value)}
                className="w-full max-w-xs px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <Bell className="h-6 w-6 text-primary-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {key === 'email' && 'Receive notifications via email'}
                      {key === 'push' && 'Receive push notifications in browser'}
                      {key === 'voice' && 'Receive voice notifications from Friday'}
                      {key === 'reminders' && 'Get reminded about tasks and meetings'}
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={value}
                    onChange={(checked) => handleSettingChange('notifications', key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-primary-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Privacy & Data
              </h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(settings.privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {key === 'dataCollection' && 'Data Collection'}
                      {key === 'analytics' && 'Analytics'}
                      {key === 'voiceRecording' && 'Voice Recording'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {key === 'dataCollection' && 'Allow collection of usage data to improve service'}
                      {key === 'analytics' && 'Share anonymous analytics data'}
                      {key === 'voiceRecording' && 'Allow voice recordings for better recognition'}
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={value}
                    onChange={(checked) => handleSettingChange('privacy', key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;