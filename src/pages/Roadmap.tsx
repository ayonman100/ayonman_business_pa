import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Mail, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const Roadmap: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const roadmapItems = [
    {
      id: 1,
      title: 'Advanced Voice Recognition',
      description: 'Enhanced natural language processing with support for multiple languages and accents.',
      status: 'in-progress',
      quarter: 'Q1 2025',
      progress: 75,
      features: [
        'Multi-language support (Spanish, French, German)',
        'Accent recognition improvements',
        'Contextual understanding',
        'Voice emotion detection'
      ]
    },
    {
      id: 2,
      title: 'Team Collaboration Suite',
      description: 'Comprehensive tools for team management, task delegation, and collaborative workflows.',
      status: 'planned',
      quarter: 'Q2 2025',
      progress: 25,
      features: [
        'Team workspaces',
        'Real-time collaboration',
        'Role-based permissions',
        'Shared calendars and tasks'
      ]
    },
    {
      id: 3,
      title: 'Advanced Analytics Dashboard',
      description: 'Deep insights into business performance with predictive analytics and custom reporting.',
      status: 'planned',
      quarter: 'Q2 2025',
      progress: 15,
      features: [
        'Predictive analytics',
        'Custom report builder',
        'Data visualization tools',
        'Performance benchmarking'
      ]
    },
    {
      id: 4,
      title: 'Mobile Applications',
      description: 'Native iOS and Android apps with full feature parity and offline capabilities.',
      status: 'planned',
      quarter: 'Q3 2025',
      progress: 0,
      features: [
        'Native iOS app',
        'Native Android app',
        'Offline functionality',
        'Push notifications'
      ]
    },
    {
      id: 5,
      title: 'API Platform & Integrations',
      description: 'Comprehensive API platform with pre-built integrations for popular business tools.',
      status: 'planned',
      quarter: 'Q3 2025',
      progress: 0,
      features: [
        'REST API platform',
        'Webhook support',
        'Salesforce integration',
        'Slack integration',
        'Microsoft Teams integration'
      ]
    },
    {
      id: 6,
      title: 'AI-Powered Document Processing',
      description: 'Automatic document analysis, summarization, and intelligent data extraction.',
      status: 'planned',
      quarter: 'Q4 2025',
      progress: 0,
      features: [
        'Document OCR',
        'Intelligent summarization',
        'Data extraction',
        'Contract analysis'
      ]
    }
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Product Roadmap
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            See what's coming next for Ayonman Business PA. Our roadmap shows the exciting features 
            and improvements we're working on to make your business even more efficient.
          </p>
        </div>

        {/* Email Subscription */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-12">
          <div className="text-center">
            <Mail className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Get notified when new features are released and be the first to try them out.
            </p>
            
            {!isSubscribed ? (
              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto flex space-x-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-600 dark:text-green-400 font-semibold">
                  Thanks for subscribing! You'll receive updates about new features.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-8">
          {roadmapItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                {/* Main Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    {getStatusIcon(item.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      {item.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{item.quarter}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-6 lg:mt-0 lg:w-48">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                      {item.progress}%
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                      <div
                        className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Progress
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Don't wait for the future - start using Ayonman Business PA today with our free trial.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;