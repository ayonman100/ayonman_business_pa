import React from 'react';
import { Check, X, Zap, Crown, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';

const ProPage: React.FC = () => {
  const { user, startTrial } = useAuth();
  const { t } = useLanguage();

  const plans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: '14 days',
      description: 'Perfect for trying out our AI business assistant',
      icon: Zap,
      features: [
        'Voice command recognition',
        'Basic scheduling assistance',
        'Simple analytics dashboard',
        'Email support',
        'Up to 50 voice commands/day',
        'Basic calendar integration'
      ],
      limitations: [
        'Advanced AI features',
        'Team collaboration tools',
        'Custom integrations',
        'Priority support',
        'Advanced analytics',
        'White-label options'
      ],
      cta: 'Start Free Trial',
      popular: false,
      isComingSoon: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'Full-featured AI assistant for growing businesses',
      icon: Crown,
      features: [
        'Unlimited voice commands',
        'Advanced AI scheduling',
        'Complete business analytics',
        'Team collaboration tools',
        'Custom integrations',
        'Priority support',
        'Advanced reporting',
        'White-label options',
        'API access',
        'Custom voice models',
        'Multi-language support',
        'Advanced security features'
      ],
      limitations: [],
      cta: 'Upgrade to Pro',
      popular: true,
      isComingSoon: true
    }
  ];

  const roadmapItems = [
    {
      title: 'Advanced Voice Recognition',
      description: 'Enhanced natural language processing with support for multiple languages and accents.',
      features: [
        'Multi-language support (Spanish, French, German)',
        'Accent recognition improvements',
        'Contextual understanding',
        'Voice emotion detection'
      ]
    },
    {
      title: 'Team Collaboration Suite',
      description: 'Comprehensive tools for team management, task delegation, and collaborative workflows.',
      features: [
        'Team workspaces',
        'Real-time collaboration',
        'Role-based permissions',
        'Shared calendars and tasks'
      ]
    },
    {
      title: 'Mobile Applications',
      description: 'Native iOS and Android apps with full feature parity and offline capabilities.',
      features: [
        'Native iOS app',
        'Native Android app',
        'Offline functionality',
        'Push notifications'
      ]
    }
  ];

  const handleUpgrade = () => {
    if (!user) {
      startTrial();
      return;
    }
    // Simulate upgrade process
    alert('Upgrade functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pro Plans & Roadmap
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose your plan and see what's coming next for Ayonman Business PA.
          </p>
        </div>

        {/* Pricing Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Choose Your Plan
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="bg-primary-500 text-white text-sm font-semibold px-4 py-2 rounded-t-2xl text-center">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-full ${
                        plan.popular ? 'bg-primary-100 dark:bg-primary-900' : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <plan.icon className={`h-8 w-8 ${
                          plan.popular ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Included Features
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Not Included
                      </h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center">
                            <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                            <span className="text-gray-500 dark:text-gray-400">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={handleUpgrade}
                    disabled={plan.isComingSoon || (user?.plan === 'pro' && plan.name === 'Pro')}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                      plan.isComingSoon
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-primary-500 text-white hover:bg-primary-600 transform hover:scale-105 shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {plan.isComingSoon 
                      ? 'Coming Soon' 
                      : user?.plan === 'pro' && plan.name === 'Pro' 
                      ? 'Current Plan' 
                      : plan.cta
                    }
                  </button>

                  {plan.name === 'Free Trial' && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                      No credit card required
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What's Coming Next
          </h2>
          
          <div className="space-y-8">
            {roadmapItems.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col">
                  <div className="flex-1 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {item.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {item.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-primary-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start using Ayonman Business PA today with our free trial.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProPage;