import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, Settings, ChevronDown, User, LogOut, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.pricing'), href: '/pricing' },
    { name: t('nav.roadmap'), href: '/roadmap' },
    // Show Pro and Friday Features only for authenticated users
    ...(isAuthenticated ? [
      { name: 'Pro', href: '/pro' },
      { name: 'Friday Features', href: '/friday-features' }
    ] : []),
    // Show admin link only for admin users
    ...(user?.userRole === 'admin' || user?.userRole === 'enterprise_admin' ? [
      { name: 'Admin', href: '/admin' }
    ] : [])
  ];

  const isActive = (path: string) => location.pathname === path;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSettingsToggle = () => {
    setIsSettingsOpen(!isSettingsOpen);
    setIsUserMenuOpen(false);
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsSettingsOpen(false);
  };

  const handleMobileSettingsToggle = () => {
    setIsMobileSettingsOpen(!isMobileSettingsOpen);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    setIsSettingsOpen(false);
    setIsMobileSettingsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      closeAllMenus();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsSettingsOpen(false);
    setIsMobileSettingsOpen(false);
    setIsUserMenuOpen(false);
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex-shrink-0">
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

          {/* Desktop Auth & Settings */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Settings Dropdown */}
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

              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <Link
                    to="/settings"
                    onClick={closeAllMenus}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={handleThemeToggle}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Authentication Section */}
            {loading ? (
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full h-8 w-8"></div>
            ) : isAuthenticated && user ? (
              /* User Menu Dropdown */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={handleUserMenuToggle}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                      {getUserInitials(user.name)}
                    </div>
                  )}
                  <ChevronDown className={`h-4 w-4 transition-transform text-gray-500 dark:text-gray-400 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.fullName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      {user.userRole !== 'user' && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Shield className="h-3 w-3 text-primary-500" />
                          <span className="text-xs text-primary-600 dark:text-primary-400 capitalize">{user.userRole.replace('_', ' ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Menu Items */}
                    <Link
                      to="/profile"
                      onClick={closeAllMenus}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={closeAllMenus}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Account Settings</span>
                    </Link>

                    <hr className="my-2 border-gray-200 dark:border-gray-700" />

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Navigation Links */}
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

              {/* Mobile Auth Section */}
              {!loading && isAuthenticated && user && (
                <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                        {getUserInitials(user.name)}
                      </div>
                    )}
                    <div>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  {/* User Menu Items */}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    onClick={closeAllMenus}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}

              {/* Mobile Settings Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                <button
                  onClick={handleMobileSettingsToggle}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-expanded={isMobileSettingsOpen}
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
                    <Link
                      to="/settings"
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      onClick={closeAllMenus}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={handleThemeToggle}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;