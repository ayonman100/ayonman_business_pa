import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LoadingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleEnterSite = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:bg-gradient-to-b dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      
      <a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className="absolute top-4 right-4 z-50"
>
     <img
       src="/black_circle.png"
       alt="Built with Bolt.New"
       className="w-14 h-14 rounded-full hover:scale-105 transition-transform duration-300"
     />
     </a>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 dark:bg-primary-800 rounded-full opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo and Branding */}
          <div className="mb-12 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bot className="h-12 w-12 text-primary-500 animate-bounce-gentle" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  Ayonman
                </span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                Ayonman PA
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              {t('welcome.subtitle')}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-500">
              {t('welcome.description')}
            </p>
          </div>

          {/* Enter Site Button */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleEnterSite}
              className="w-full max-w-md mx-auto flex items-center justify-center space-x-3 px-8 py-4 bg-primary-500 text-white text-lg font-semibold rounded-xl hover:bg-primary-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <span>{t('hero.enterSite')}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Footer Text */}
          <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('hero.trialInfo')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;