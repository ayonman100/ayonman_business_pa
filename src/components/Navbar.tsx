import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Settings, User, LogOut, ChevronDown, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const navigation = isAuthenticated ? [
    { name: t('nav.home'), href: '/home' },
    { name: t('nav.dashboard'), href: '/dashboard' },
    { name: 'Pro', href: '/pro' },
    { name: 'Friday Features', href: '/friday-features' }
  ] : [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.pricing'), href: '/pricing' },
    { name: t('nav.roadmap'), href: '/roadmap' }
  ];

  const isActive = (path: string) => location.pathname === path;
  const showBackToDashboard = isAuthenticated && location.pathname !== '/dashboard';

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSettingsToggle = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleMobileSettingsToggle = () => {
    setIsMobileSettingsOpen(!isMobileSettingsOpen);
  };

  const handleLogout = () => {
    logout();
    setIsSettingsOpen(false);
    setIsMenuOpen(false);
    setIsMobileSettingsOpen(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    setIsSettingsOpen(false);
    setIsMobileSettingsOpen(false);
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsSettingsOpen(false);
    setIsMobileSettingsOpen(false);
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Settings & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Back to Dashboard Button */}
            {showBackToDashboard && (
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={handleSettingsToggle}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-expanded={isSettingsOpen}
                  aria-haspopup="true"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Desktop Settings Dropdown */}
                {isSettingsOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.fullName || user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Settings Options */}
                    <div className="py-1">
                      <Link
                        to="/settings"
                        onClick={closeAllMenus}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Account Settings</span>
                      </Link>

                      <button
                        onClick={handleThemeToggle}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                      </button>

                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t('auth.signout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <Link
                  to="/signin"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {t('auth.signin')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={closeAllMenus}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Back to Dashboard Button */}
              {showBackToDashboard && (
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  onClick={closeAllMenus}
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Dashboard</span>
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  {/* Mobile Settings Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                    <button
                      onClick={handleMobileSettingsToggle}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isMobileSettingsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Mobile Settings Submenu */}
                    {isMobileSettingsOpen && (
                      <div className="ml-4 mt-2 space-y-1">
                        {/* User Info */}
                        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user?.fullName || user?.name || 'User'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                          onClick={closeAllMenus}
                        >
                          <Settings className="h-5 w-5" />
                          <span>Account Settings</span>
                        </Link>

                        <button
                          onClick={handleThemeToggle}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>{t('auth.signout')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                    <button
                      onClick={handleThemeToggle}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <Link
                      to="/signin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors mt-2"
                      onClick={closeAllMenus}
                    >
                      {t('auth.signin')}
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;