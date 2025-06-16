import React, { useState, useEffect } from 'react';
import { Calendar, MessageSquare, BarChart3, Clock, CheckCircle, TrendingUp, Trash2, Info, Users, Twitter, Facebook, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStats } from '../contexts/StatsContext';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import EnhancedVoiceActivation from '../components/EnhancedVoiceActivation';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { todayStats, recentActivity, logActivity, incrementVoiceCommands, clearRecentActivity } = useStats();
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVoiceCommand = (command: string) => {
    incrementVoiceCommands();
    logActivity('Voice command used', command);
  };

  const handleFeatureClick = (featureName: string, link: string) => {
    logActivity('Feature accessed', featureName);
  };

  const handleClearHistory = () => {
    clearRecentActivity();
    logActivity('Activity history cleared', 'Dashboard');
  };

  const features = [
    {
      icon: Calendar,
      title: t('features.smartScheduling'),
      description: 'AI-powered calendar management and task scheduling',
      stats: `${todayStats.tasksCompleted} ${t('dashboard.tasksCompleted').toLowerCase()} today`,
      color: 'bg-blue-500',
      link: '/scheduler'
    },
    {
      icon: MessageSquare,
      title: t('features.chatWithFriday'),
      description: 'Interact with your AI assistant using voice or text',
      stats: `${todayStats.voiceCommands} ${t('dashboard.voiceCommands').toLowerCase()} today`,
      color: 'bg-green-500',
      link: '/console'
    },
    {
      icon: BarChart3,
      title: t('features.businessIntelligence'),
      description: 'Get insights and analytics to drive better decisions',
      stats: `${todayStats.productivityScore}% ${t('dashboard.productivityScore').toLowerCase()}`,
      color: 'bg-purple-500',
      link: '/advice'
    }
  ];

  // Determine welcome message based on first login status and time of day
  const getWelcomeMessage = () => {
    if (!user) return t('dashboard.welcome') + '!';
    
    const hour = new Date().getHours();
    let timeGreeting = 'Good morning';
    if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    else if (hour >= 17) timeGreeting = 'Good evening';
    
    if (user.isFirstLogin) {
      return `${timeGreeting}, ${user.fullName}! Welcome to Ayonman Business PA.`;
    } else {
      return `${timeGreeting}, ${user.fullName}! Welcome back.`;
    }
  };

  // Calculate days since last login for returning users
  const getDaysSinceLastLogin = () => {
    if (!user?.lastLoginAt || user.isFirstLogin) return null;
    
    const daysDiff = Math.floor((new Date().getTime() - user.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 0 ? daysDiff : null;
  };

  const daysSinceLastLogin = getDaysSinceLastLogin();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {getWelcomeMessage()}
              </h1>
              <div className="flex flex-col space-y-1 mt-1">
                <p className="text-gray-600 dark:text-gray-400">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
                {daysSinceLastLogin && (
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    Last login: {daysSinceLastLogin} day{daysSinceLastLogin > 1 ? 's' : ''} ago
                  </p>
                )}
                {user?.plan && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Plan: {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} • 
                    Trial ends: {user.trialEndsAt.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Voice Activation with TTS */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('dashboard.aiVoiceAssistant')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('dashboard.sayFriday')}
          </p>
          <EnhancedVoiceActivation onVoiceCommand={handleVoiceCommand} />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              to={feature.link}
              onClick={() => handleFeatureClick(feature.title, feature.link)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${feature.color} group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.stats}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent Activity and Today's Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {t('dashboard.recentActivity')}
              </h3>
              {recentActivity.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Clear history"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('dashboard.noActivity')}
                  </p>
                </div>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                      <CheckCircle className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.action}
                        {activity.details && (
                          <span className="text-gray-600 dark:text-gray-400"> - {activity.details}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              {t('dashboard.todaySummary')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('dashboard.tasksCompleted')}</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">{todayStats.tasksCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('dashboard.voiceCommands')}</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{todayStats.voiceCommands}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('dashboard.productivityScore')}</span>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{todayStats.productivityScore}%</span>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('dashboard.dailyProgress')}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {todayStats.tasksCompleted + todayStats.voiceCommands} {t('dashboard.actionsToday')}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, todayStats.productivityScore)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* About Us and Social Links Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* About Us */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                About Us
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ayonman Business PA is your intelligent AI-powered business assistant designed to streamline operations, 
                enhance productivity, and provide smart insights for entrepreneurs in the US and Africa.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Meet Friday - your dedicated AI partner that understands your business needs and helps you thrive 
                in today's competitive market through voice commands, smart scheduling, and business intelligence.
              </p>
              
              {/* Support */}
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Support
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Need help? Our support team is here to assist you.
                </p>
                <a
                  href="mailto:support@ayonman.com"
                  className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>support@ayonman.com</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Follow Us
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Stay connected with us on social media for the latest updates, tips, and features.
              </p>
              
              <div className="space-y-3">
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Twitter className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-900 dark:text-white font-medium">Twitter</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Follow us for updates</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </a>

                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Facebook className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-900 dark:text-white font-medium">Facebook</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Like our page</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </a>

                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <div className="p-2 bg-blue-700 rounded-lg">
                    <Linkedin className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-900 dark:text-white font-medium">LinkedIn</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Connect with us</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;