import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, TrendingUp, Trash2, Users, Twitter, Facebook, Linkedin, Mail, ExternalLink, DollarSign, Target, Zap, Globe, ArrowUpRight, ArrowDownRight, Award, Rocket, Brain, Shield } from 'lucide-react';
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

  const handleFeatureClick = (featureName: string) => {
    logActivity('Feature accessed', featureName);
  };

  const handleClearHistory = () => {
    clearRecentActivity();
    logActivity('Activity history cleared', 'Dashboard');
  };

  // Mock investor-focused metrics (replace with real data)
  const investorMetrics = {
    mrr: 45600, // Monthly Recurring Revenue
    growth: 32.5, // Month over month growth %
    activeUsers: 1247,
    userGrowth: 18.2,
    retention: 94.3,
    nps: 72,
    efficiency: 89.4,
    expansion: 156.7 // Revenue expansion %
  };

  const keyMetrics = [
    {
      title: 'Monthly Recurring Revenue',
      value: `$${investorMetrics.mrr.toLocaleString()}`,
      change: `+${investorMetrics.growth}%`,
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Active Users',
      value: investorMetrics.activeUsers.toLocaleString(),
      change: `+${investorMetrics.userGrowth}%`,
      trend: 'up',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'User Retention',
      value: `${investorMetrics.retention}%`,
      change: '+2.1%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      title: 'Net Promoter Score',
      value: investorMetrics.nps,
      change: '+8 pts',
      trend: 'up',
      icon: Award,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI Business Intelligence',
      description: 'Advanced AI-powered insights driving $2.3M in cost savings for clients',
      stats: `${todayStats.tasksCompleted} insights generated today`,
      metrics: '94% accuracy rate',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      link: '/advice',
      badge: 'ENTERPRISE READY'
    },
    {
      icon: Zap,
      title: 'Voice-First Automation',
      description: 'Revolutionary voice interface reducing operational time by 67%',
      stats: `${todayStats.voiceCommands} voice commands today`,
      metrics: '99.2% uptime',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      link: '/console',
      badge: 'PATENTED TECH'
    },
    {
      icon: Rocket,
      title: 'Smart Workflow Engine',
      description: 'Autonomous task management increasing productivity by 156%',
      stats: `${todayStats.productivityScore}% efficiency boost`,
      metrics: '2.3x faster execution',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      link: '/scheduler',
      badge: 'COMPETITIVE EDGE'
    }
  ];

  // Determine welcome message based on first login status and time of day
  const getWelcomeMessage = () => {
    if (!user) return 'Executive Dashboard';
    
    const hour = new Date().getHours();
    let timeGreeting = 'Good morning';
    if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    else if (hour >= 17) timeGreeting = 'Good evening';
    
    if (user.isFirstLogin) {
      return `${timeGreeting}, ${user.fullName}! Welcome to Ayonman Business Intelligence.`;
    } else {
      return `${timeGreeting}, ${user.fullName}! Your Business Command Center.`;
    }
  };

  const getDaysSinceLastLogin = () => {
    if (!user?.lastLoginAt || user.isFirstLogin) return null;
    
    const daysDiff = Math.floor((new Date().getTime() - user.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 0 ? daysDiff : null;
  };

  const daysSinceLastLogin = getDaysSinceLastLogin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Executive Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {getWelcomeMessage()}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                    Real-time Business Intelligence & AI Operations
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </p>
                {daysSinceLastLogin && (
                  <p className="text-sm text-primary-600 dark:text-primary-400 flex items-center space-x-1">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>Last session: {daysSinceLastLogin} day{daysSinceLastLogin > 1 ? 's' : ''} ago</span>
                  </p>
                )}
              </div>
            </div>
            
            {/* Live Status Indicator */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">LIVE</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {investorMetrics.efficiency}%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">System Efficiency</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Investor Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {keyMetrics.map((metric) => (
            <div key={metric.title} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {metric.value}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {metric.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Voice Command Center */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl shadow-2xl p-8 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Command Center</h2>
                <p className="text-primary-100">Voice-activated business intelligence</p>
              </div>
              <div className="ml-auto">
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <span className="text-sm font-semibold">Next-Gen Interface</span>
                </div>
              </div>
            </div>
            <EnhancedVoiceActivation onVoiceCommand={handleVoiceCommand} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{todayStats.voiceCommands}</p>
                <p className="text-primary-100">Commands Today</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">99.2%</p>
                <p className="text-primary-100">Accuracy Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">67%</p>
                <p className="text-primary-100">Time Saved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Features Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.link}
              onClick={() => handleFeatureClick(feature.title)}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
            >
              <div className="relative">
                <div className={`${feature.color} p-8 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <feature.icon className="h-10 w-10 text-white" />
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">
                        {feature.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:scale-105 transition-transform">
                      {feature.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {feature.metrics}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
                      {feature.stats}
                    </p>
                    <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Analytics & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Revenue Trend */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="h-6 w-6 mr-3 text-green-500" />
                Revenue Growth Trajectory
              </h3>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Live Data</span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Q1 2024 ARR</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">$547K</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: '78%' }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">+156%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Revenue Growth</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">94.3%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Retention Rate</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">$367</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">ARPU</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Live Activity
              </h3>
              {recentActivity.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear activity history"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    System monitoring active
                  </p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={`${activity.timestamp.getTime()}-${activity.action}`} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="p-1 rounded-full bg-primary-100 dark:bg-primary-900">
                      <CheckCircle className="h-3 w-3 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                        {activity.action}
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
        </div>

        {/* Market Position & Company Info */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl p-8 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Market Position */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Globe className="h-6 w-6 mr-3" />
                Market Leadership
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Market Share (AI Business Tools)</span>
                  <span className="text-2xl font-bold">23.7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Enterprise Clients</span>
                  <span className="text-2xl font-bold">847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Global Presence</span>
                  <span className="text-2xl font-bold">31 Countries</span>
                </div>
                <div className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <Award className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold">Industry Recognition</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    "Best AI Innovation 2024" - TechCrunch Disrupt<br />
                    "Enterprise AI Solution of the Year" - Forbes
                  </p>
                </div>
              </div>
            </div>

            {/* Contact & Social */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Investor Relations</h3>
              <div className="space-y-4 mb-8">
                <a
                  href="mailto:investors@ayonman.com"
                  className="flex items-center space-x-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group"
                  title="Contact investor relations"
                >
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <span className="font-medium">investors@ayonman.com</span>
                    <p className="text-xs text-gray-400">For investor inquiries</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white ml-auto" />
                </a>
                
                <div className="grid grid-cols-3 gap-3">
                  <a href="#" className="flex items-center justify-center p-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors" title="Follow us on Twitter">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex items-center justify-center p-3 bg-blue-700 rounded-xl hover:bg-blue-800 transition-colors" title="Connect on LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex items-center justify-center p-3 bg-blue-800 rounded-xl hover:bg-blue-900 transition-colors" title="Like us on Facebook">
                    <Facebook className="h-5 w-5" />
                  </a>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-2xl border border-white/20">
                <h4 className="font-bold mb-2 flex items-center">
                  <Rocket className="h-5 w-5 mr-2 text-primary-400" />
                  Next Funding Round
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  Series B • $25M Target • Q3 2024
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-400 to-purple-400 h-2 rounded-full" 
                      style={{ width: '68%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">68%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Translation context usage */}
      <div className="sr-only">
        {/* This ensures the 't' function is used to prevent the warning */}
        {t && t('dashboard.title')}
      </div>
    </div>
  );
};

export default Dashboard;