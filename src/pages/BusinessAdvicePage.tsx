import React, { useState } from 'react';
import { TrendingUp, DollarSign, Zap, Target, Mic, ChevronRight } from 'lucide-react';
import { useStats } from '../contexts/StatsContext';
import Navbar from '../components/Navbar';

interface AdviceCategory {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  tips: string[];
  quotes: string[];
}

const BusinessAdvicePage: React.FC = () => {
  const { incrementVoiceCommands, logActivity } = useStats();
  const [selectedCategory, setSelectedCategory] = useState<string>('marketing');
  const [isListening, setIsListening] = useState(false);

  const categories: AdviceCategory[] = [
    {
      id: 'marketing',
      title: 'Marketing',
      icon: TrendingUp,
      color: 'bg-blue-500',
      tips: [
        'Focus on your target audience and create buyer personas',
        'Use social media consistently to build brand awareness',
        'Content marketing drives 3x more leads than paid advertising',
        'Email marketing has an average ROI of $42 for every $1 spent',
        'Customer testimonials and reviews build trust and credibility'
      ],
      quotes: [
        '"The best marketing doesn\'t feel like marketing." - Tom Fishburne',
        '"Content is fire, social media is gasoline." - Jay Baer',
        '"Marketing is no longer about the stuff you make, but the stories you tell." - Seth Godin'
      ]
    },
    {
      id: 'pricing',
      title: 'Pricing',
      icon: DollarSign,
      color: 'bg-green-500',
      tips: [
        'Price based on value, not just cost-plus margins',
        'Test different pricing strategies with A/B testing',
        'Consider psychological pricing (e.g., $99 vs $100)',
        'Bundle products/services to increase average order value',
        'Regularly review and adjust pricing based on market conditions'
      ],
      quotes: [
        '"Price is what you pay. Value is what you get." - Warren Buffett',
        '"The bitterness of poor quality remains long after the sweetness of low price is forgotten." - Benjamin Franklin',
        '"If you compete on price, someone will always beat you." - Unknown'
      ]
    },
    {
      id: 'productivity',
      title: 'Productivity',
      icon: Zap,
      color: 'bg-yellow-500',
      tips: [
        'Use the 80/20 rule - focus on the 20% that drives 80% of results',
        'Time-block your calendar for deep work sessions',
        'Automate repetitive tasks wherever possible',
        'Take regular breaks to maintain focus and creativity',
        'Set clear priorities and deadlines for all projects'
      ],
      quotes: [
        '"Productivity is never an accident. It is always the result of a commitment to excellence." - Paul J. Meyer',
        '"Focus on being productive instead of busy." - Tim Ferriss',
        '"The key is not to prioritize what\'s on your schedule, but to schedule your priorities." - Stephen Covey'
      ]
    },
    {
      id: 'strategy',
      title: 'Startup Strategy',
      icon: Target,
      color: 'bg-purple-500',
      tips: [
        'Validate your business idea before investing heavily',
        'Start with a minimum viable product (MVP)',
        'Focus on customer acquisition and retention',
        'Build a strong company culture from day one',
        'Keep your burn rate low and extend your runway'
      ],
      quotes: [
        '"The way to get started is to quit talking and begin doing." - Walt Disney',
        '"Your most unhappy customers are your greatest source of learning." - Bill Gates',
        '"Ideas are easy. Implementation is hard." - Guy Kawasaki'
      ]
    }
  ];

  const currentCategory = categories.find(cat => cat.id === selectedCategory) || categories[0];

  const handleVoiceCommand = () => {
    setIsListening(true);
    incrementVoiceCommands();
    logActivity('Voice advice request', `Asked for ${selectedCategory} advice`);
    
    // Simulate voice processing
    setTimeout(() => {
      setIsListening(false);
      // This would integrate with actual voice recognition
      alert(`Voice command processed: "Friday, give me ${selectedCategory} advice"`);
    }, 3000);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    logActivity('Advice category changed', `Switched to ${categoryId} advice`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Business Advice Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Get expert insights and actionable advice to grow your business. Ask Friday for personalized recommendations.
          </p>
        </div>

        {/* Voice Command Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ask Friday for Advice
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try saying: "Friday, give me marketing advice" or "Help me with pricing strategy"
            </p>
            
            <button
              onClick={handleVoiceCommand}
              className={`
                relative w-16 h-16 rounded-full flex items-center justify-center
                transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800
                ${isListening 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white animate-pulse' 
                  : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                }
              `}
            >
              <Mic className="h-6 w-6" />
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25"></div>
              )}
            </button>
            
            <p className={`mt-4 text-sm font-medium ${
              isListening ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {isListening ? 'Listening for your question...' : 'Click to ask Friday'}
            </p>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`
                p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105
                ${selectedCategory === category.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className={`font-semibold ${
                selectedCategory === category.id 
                  ? 'text-primary-700 dark:text-primary-300' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {category.title}
              </h3>
            </button>
          ))}
        </div>

        {/* Selected Category Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tips Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center mb-6">
              <div className={`w-10 h-10 ${currentCategory.color} rounded-lg flex items-center justify-center mr-4`}>
                <currentCategory.icon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentCategory.title} Tips
              </h2>
            </div>
            
            <div className="space-y-4">
              {currentCategory.tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quotes Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Inspirational Quotes
            </h2>
            
            <div className="space-y-6">
              {currentCategory.quotes.map((quote, index) => (
                <div key={index} className="relative">
                  <div className="absolute top-0 left-0 text-4xl text-primary-500 opacity-50 font-serif">
                    "
                  </div>
                  <blockquote className="pl-8 pr-4 py-2">
                    <p className="text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed mb-2">
                      {quote.split(' - ')[0].replace(/^"/, '').replace(/"$/, '')}
                    </p>
                    <cite className="text-primary-600 dark:text-primary-400 font-semibold">
                      — {quote.split(' - ')[1]}
                    </cite>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Need Personalized Advice?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Friday can provide tailored recommendations based on your specific business needs and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleVoiceCommand}
              className="flex items-center justify-center space-x-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Mic className="h-5 w-5" />
              <span>Ask Friday Now</span>
            </button>
            <button 
              onClick={() => logActivity('Consultation scheduled', 'Business advice consultation')}
              className="flex items-center justify-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-white/20"
            >
              <span>Schedule Consultation</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAdvicePage;