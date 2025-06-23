import React from 'react';
import { Check, X, Zap, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Pricing: React.FC = () => {
  const { user } = useAuth();

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
      popular: false
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
      popular: true
    }
  ];

  const handleUpgrade = (planName: string) => {
    if (planName === 'Free Trial') {
      // Navigate to dashboard for free trial
      window.location.href = '/dashboard';
    } else {
      if (!user) {
        // Redirect to login or show a message if user is not authenticated
        window.location.href = '/login';
        return;
      }
      // Simulate upgrade process
      alert('Upgrade functionality would be implemented here');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start with our free trial and upgrade when you're ready to unlock the full potential of AI-powered business assistance.
          </p>
        </div>

        {/* Pricing Cards */}
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
                  onClick={() => handleUpgrade(plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    plan.popular
                      ? 'bg-primary-500 text-white hover:bg-primary-600 transform hover:scale-105 shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  disabled={user?.plan === 'pro' && plan.name === 'Pro'}
                >
                  {user?.plan === 'pro' && plan.name === 'Pro' ? 'Current Plan' : plan.cta}
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

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "Can I upgrade my plan at any time?",
                answer: "Yes, you can upgrade your plan at any time. Changes take effect immediately, and you'll be charged the proper amounts."
              },
              {
                question: "What happens when my free trial ends?",
                answer: "Your free trial lasts 14 days. After that, you can upgrade to Pro or your account will be limited to basic features."
              },
              {
                question: "Is my data secure?",
                answer: "Absolutely. We use enterprise-grade security with end-to-end encryption and comply with industry standards like SOC 2 and GDPR."
              },
              {
                question: "Do you offer team discounts?",
                answer: "Yes, we offer custom pricing for teams of 10 or more. Contact our sales team for more information."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;