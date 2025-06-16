import React, { useState } from 'react';
import { Mic, Calendar, BarChart3, MessageSquare, Brain, Zap, ArrowRight, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';

const FridayFeaturesPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeFeature, setActiveFeature] = useState('console');

  const features = [
    {
      id: 'console',
      title: 'AI Console',
      icon: MessageSquare,
      description: 'Chat with Friday using voice or text commands',
      color: 'bg-blue-500',
      link: '/console',
      details: [
        'Natural language processing',
        'Voice recognition in multiple languages',
        'Context-aware responses',
        'Real-time conversation history'
      ]
    },
    {
      id: 'scheduler',
      title: 'Smart Scheduler',
      icon: Calendar,
      description: 'AI-powered calendar and task management',
      color: 'bg-green-500',
      link: '/scheduler',
      details: [
        'Intelligent meeting scheduling',
        'Automatic conflict resolution',
        'Task prioritization',
        'Calendar integration'
      ]
    },
    {
      id: 'advice',
      title: 'Business Advice',
      icon: Brain,
      description: 'Get expert business insights and recommendations',
      color: 'bg-purple-500',
      link: '/advice',
      details: [
        'Industry-specific guidance',
        'Performance analytics',
        'Growth strategies',
        'Market insights'
      ]
    }
  ];

  const capabilities = [
    {
      title: 'Voice Commands',
      icon: Mic,
      description: 'Control Friday with natural voice commands in English, Yoruba, or Pidgin',
      examples: [
        '"Friday, schedule a meeting for tomorrow"',
        '"Show me this week\'s analytics"',
        '"What\'s my next appointment?"'
      ]
    },
    {
      title: 'Smart Analytics',
      icon: BarChart3,
      description: 'Get intelligent insights about your business performance',
      examples: [
        'Revenue trend analysis',
        'Customer behavior patterns',
        'Performance benchmarking'
      ]
    },
    {
      title: 'Automation',
      icon: Zap,
      description: 'Automate repetitive tasks and workflows',
      examples: [
        'Automatic email responses',
        'Task delegation',
        'Report generation'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Friday Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover all the powerful features that make Friday your ultimate AI business assistant.
          </p>
        </div>

        {/* Main Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Core Features
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  activeFeature === feature.id 
                    ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className={`p-3 rounded-lg ${feature.color} mr-4`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {feature.details.map((detail, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  
                  <a
                    href={feature.link}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors group"
                  >
                    <Play className="h-4 w-4" />
                    <span>Try Now</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            AI Capabilities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg mr-4">
                    <capability.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {capability.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {capability.description}
                </p>
                
                <div className="space-y-3">
                  {capability.examples.map((example, exampleIndex) => (
                    <div
                      key={exampleIndex}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        {example}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-12 relative">
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="text-center">
              <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold text-xl mb-4">
                COMING SOON
              </div>
              <p className="text-white text-lg">
                Seamless integrations are being developed
              </p>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Seamless Integration
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Friday works with your existing tools and workflows
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Google Calendar', 'Microsoft Teams', 'Slack', 'Zoom', 'Salesforce', 'Notion', 'Trello', 'WhatsApp'].map((integration, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">
                    {integration.charAt(0)}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {integration}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience Friday?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start using all these powerful features today with your free trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/console"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Chat with Friday</span>
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-white/20"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FridayFeaturesPage;