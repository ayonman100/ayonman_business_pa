import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('ayonman_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('ayonman_language', language);
  };

  // Comprehensive translation function
  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        // Welcome and Hero
        'welcome.title': 'Welcome to Ayonman',
        'welcome.subtitle': 'Your AI-Powered Business Assistant',
        'welcome.description': 'Meet Friday - Your intelligent business partner',
        
      
        
        // Navigation
        'nav.home': 'Home',
        'nav.pricing': 'Pricing',
        'nav.roadmap': 'Roadmap',
        'nav.dashboard': 'Dashboard',
        'nav.console': 'Console',
        'nav.scheduler': 'Scheduler',
        'nav.advice': 'Advice',
        'nav.settings': 'Settings',
        
        // Languages
        'language.english': 'English',
        'language.yoruba': 'Yoruba',
        'language.pidgin': 'Nigerian Pidgin',
        
        // Hero Section
        'hero.meetFriday': 'Meet Friday',
        'hero.viewPricing': 'View Pricing',
        'hero.trialInfo': '14-day free trial • No credit card required • Available in English, Yoruba, and Pidgin',
        'hero.getStarted': 'Get Started Now',
        'hero.readyToMeet': 'Ready to meet Friday?',
        'hero.enterSite': 'Enter Site',
        'hero.title': 'Meet Friday - Your AI Business Partner',
        'hero.subtitle': 'Friday is your intelligent business assistant that streamlines operations, enhances productivity, and provides smart insights to help entrepreneurs in the US and Africa thrive in today\'s competitive market.',
        
        // Features
        'features.voiceInteraction': 'Voice Interaction',
        'features.voiceInteractionDesc': 'Talk naturally to Friday, your AI assistant, using advanced voice recognition technology.',
        'features.smartScheduling': 'Smart Scheduling',
        'features.smartSchedulingDesc': 'AI-powered calendar management that learns your preferences and optimizes your time.',
        'features.businessIntelligence': 'Business Intelligence',
        'features.businessIntelligenceDesc': 'Get actionable insights and data-driven recommendations to grow your business.',
        'features.chatWithFriday': 'Chat with Friday',
        'features.chatWithFridayDesc': 'Seamless conversation with your AI assistant through voice or text commands.',
        'features.easyTransitioning': 'Easy & Smooth Transitioning',
        'features.easyTransitioningDesc': 'Effortless integration with your existing workflows and business processes.',
        'features.prioritySupport': 'Priority Support & More',
        'features.prioritySupportDesc': 'Get premium support and access to advanced features. Click to view more.',
        
        // Common
        'common.everything': 'Everything you need to succeed',
        'common.featuresDesc': 'Powerful features designed to transform how you manage your business operations with the help of Friday.',
        'common.joinThousands': 'Join thousands of entrepreneurs who are already using Friday to grow their businesses.',
        
        // Dashboard
        'dashboard.welcome': 'Welcome',
        'dashboard.welcomeBack': 'Welcome back',
        'dashboard.aiVoiceAssistant': 'AI Voice Assistant',
        'dashboard.sayFriday': 'Say "Friday" to activate your AI assistant with natural voice responses',
        'dashboard.recentActivity': 'Recent Activity',
        'dashboard.todaySummary': 'Today\'s Summary',
        'dashboard.tasksCompleted': 'Tasks Completed',
        'dashboard.voiceCommands': 'Voice Commands',
        'dashboard.productivityScore': 'Productivity Score',
        'dashboard.dailyProgress': 'Daily Progress',
        'dashboard.actionsToday': 'actions today',
        'dashboard.noActivity': 'No recent activity. Start by clicking on a feature above!',
        
        // Voice Commands
        'voice.sayFriday': 'Say "Friday" to activate',
        'voice.fridayActivated': 'Friday activated! Listening for your command...',
        'voice.listening': 'Listening... Speak now',
        'voice.processing': 'Processing your request...',
        'voice.clickToAsk': 'Click to ask Friday',
        'voice.micPermission': 'Microphone permission required',
        
        // Business Advice
        'advice.title': 'Business Advice Center',
        'advice.subtitle': 'Get expert insights and actionable advice to grow your business. Ask Friday for personalized recommendations.',
        'advice.askFriday': 'Ask Friday for Advice',
        'advice.tryCommands': 'Try saying: "Friday, give me marketing advice" or "Help me with pricing strategy"',
        'advice.marketing': 'Marketing',
        'advice.pricing': 'Pricing',
        'advice.productivity': 'Productivity',
        'advice.strategy': 'Startup Strategy',
        
        // Scheduler
        'scheduler.title': 'Smart Scheduler',
        'scheduler.subtitle': 'Manage your tasks, reminders, and appointments',
        'scheduler.addTask': 'Add New Task',
        'scheduler.setReminder': 'Set Reminder',
        'scheduler.scheduleMeeting': 'Schedule Meeting',
        'scheduler.upcoming': 'Upcoming',
        'scheduler.noTasks': 'No upcoming tasks. Click "Add New Task" to get started!',
        
        // Console
        'console.title': 'Chat with Friday',
        'console.subtitle': 'Your AI business assistant with natural voice responses',
        'console.hello': 'Hello! I\'m Friday, your AI business assistant. I can help you with scheduling, business advice, analytics, and much more. How can I assist you today?',
      },
      
      yo: {
        // Welcome and Hero
        'welcome.title': 'Kaabo si Ayonman',
        'welcome.subtitle': 'Oluranlowo Iṣowo Ẹrọ Ayọnu Rẹ',
        'welcome.description': 'Pade Friday - Alabaṣepọ ọgbọn rẹ',
        
        
        // Navigation
        'nav.home': 'Ile',
        'nav.pricing': 'Idiyele',
        'nav.roadmap': 'Maapu Ọna',
        'nav.dashboard': 'Pẹpẹ Iṣakoso',
        'nav.console': 'Konsolu',
        'nav.scheduler': 'Eto Akoko',
        'nav.advice': 'Imọran',
        'nav.settings': 'Eto',
        
        // Languages
        'language.english': 'Gẹẹsi',
        'language.yoruba': 'Yoruba',
        'language.pidgin': 'Pidgin Naijiria',
        
        // Hero Section
        'hero.meetFriday': 'Pade Friday',
        'hero.viewPricing': 'Wo Idiyele',
        'hero.trialInfo': 'Idanwo ọjọ 14 lọfẹ • Ko si kaadi kirẹditi • Wa ni Gẹẹsi, Yoruba, ati Pidgin',
        'hero.getStarted': 'Bẹrẹ Bayi',
        'hero.readyToMeet': 'Ṣetan lati pade Friday?',
        'hero.enterSite': 'Wọle si Oju-opo',
        'hero.title': 'Pade Friday - Alabaṣepọ Iṣowo Ẹrọ Ayọnu Rẹ',
        'hero.subtitle': 'Friday ni oluranlowo ọgbọn ti o ṣe iranlọwọ fun awọn iṣẹ ṣiṣe, mu iṣẹ ṣiṣe pọ si, ati pese awọn imọran ọgbọn lati ran awọn onimọ-ẹrọ ni Amẹrika ati Afrika lọwọ lati ṣaṣeyọri ninu ọja idije oni.',
        
        // Features
        'features.voiceInteraction': 'Ibaraẹnisọrọ Ohun',
        'features.voiceInteractionDesc': 'Sọrọ ni ọna adayeba si Friday, oluranlọwọ AI rẹ, nipa lilo imọ-ẹrọ idanimọ ohun to ga.',
        'features.smartScheduling': 'Eto Akoko Ọgbọn',
        'features.smartSchedulingDesc': 'Iṣakoso kalẹnda ti AI ṣe ti o kọ awọn ayanfẹ rẹ ti o si mu akoko rẹ dara.',
        'features.businessIntelligence': 'Ọgbọn Iṣowo',
        'features.businessIntelligenceDesc': 'Gba awọn imọran ti o le ṣe ati awọn iṣeduro ti o da lori data lati dagba iṣowo rẹ.',
        'features.chatWithFriday': 'Sọrọ pẹlu Friday',
        'features.chatWithFridayDesc': 'Ibaraẹnisọrọ ti ko ni wahala pẹlu oluranlọwọ AI rẹ nipasẹ ohun tabi awọn aṣẹ ọrọ.',
        'features.easyTransitioning': 'Iyipada Rọrun ati Didan',
        'features.easyTransitioningDesc': 'Iṣọpọ ti ko ni wahala pẹlu awọn ṣiṣe iṣẹ ti o wa tẹlẹ ati awọn ilana iṣowo.',
        'features.prioritySupport': 'Atilẹyin Pataki ati Diẹ Sii',
        'features.prioritySupportDesc': 'Gba atilẹyin giga ati iwọle si awọn ẹya to ga. Tẹ lati wo diẹ sii.',
        
        // Common
        'common.everything': 'Gbogbo ohun ti o nilo lati ṣaṣeyọri',
        'common.featuresDesc': 'Awọn ẹya agbara ti a ṣe lati yi bi o ṣe n ṣakoso awọn iṣẹ ṣiṣe iṣowo rẹ pada pẹlu iranlọwọ Friday.',
        'common.joinThousands': 'Darapọ mọ awọn ẹgbẹẹgbẹrun onimọ-ẹrọ ti o ti nlo Friday lati dagba awọn iṣowo wọn.',
        
        // Dashboard
        'dashboard.welcome': 'Kaabo',
        'dashboard.welcomeBack': 'Kaabo pada',
        'dashboard.aiVoiceAssistant': 'Oluranlọwọ Ohun AI',
        'dashboard.sayFriday': 'Sọ "Friday" lati mu oluranlọwọ AI rẹ ṣiṣẹ pẹlu awọn idahun ohun adayeba',
        'dashboard.recentActivity': 'Iṣẹ Ṣiṣe Aipẹ',
        'dashboard.todaySummary': 'Akopọ Oni',
        'dashboard.tasksCompleted': 'Awọn Iṣẹ Ti Pari',
        'dashboard.voiceCommands': 'Awọn Aṣẹ Ohun',
        'dashboard.productivityScore': 'Ami Iṣẹ Ṣiṣe',
        'dashboard.dailyProgress': 'Ilọsiwaju Ojoojumọ',
        'dashboard.actionsToday': 'awọn iṣe oni',
        'dashboard.noActivity': 'Ko si iṣẹ ṣiṣe aipẹ. Bẹrẹ nipa titẹ lori ẹya kan loke!',
        
        // Voice Commands
        'voice.sayFriday': 'Sọ "Friday" lati mu ṣiṣẹ',
        'voice.fridayActivated': 'Friday ti ṣiṣẹ! Ngbọ fun aṣẹ rẹ...',
        'voice.listening': 'Ngbọ... Sọrọ bayi',
        'voice.processing': 'Nṣiṣẹ lori ibeere rẹ...',
        'voice.clickToAsk': 'Tẹ lati beere Friday',
        'voice.micPermission': 'Igbanilaaye mikirofoonu nilo',
        
        // Business Advice
        'advice.title': 'Ile-iṣẹ Imọran Iṣowo',
        'advice.subtitle': 'Gba awọn imọran alamọdaju ati awọn imọran ti o le ṣe lati dagba iṣowo rẹ. Beere Friday fun awọn iṣeduro ti ara ẹni.',
        'advice.askFriday': 'Beere Friday fun Imọran',
        'advice.tryCommands': 'Gbiyanju sisọ: "Friday, fun mi ni imọran titaja" tabi "Ran mi lọwọ pẹlu eto idiyele"',
        'advice.marketing': 'Titaja',
        'advice.pricing': 'Idiyele',
        'advice.productivity': 'Iṣẹ Ṣiṣe',
        'advice.strategy': 'Eto Ibẹrẹ',
        
        // Scheduler
        'scheduler.title': 'Eto Akoko Ọgbọn',
        'scheduler.subtitle': 'Ṣakoso awọn iṣẹ, awọn iranileti, ati awọn ipade rẹ',
        'scheduler.addTask': 'Fi Iṣẹ Tuntun Kun',
        'scheduler.setReminder': 'Ṣeto Iranileti',
        'scheduler.scheduleMeeting': 'Ṣeto Ipade',
        'scheduler.upcoming': 'Ti nbọ',
        'scheduler.noTasks': 'Ko si awọn iṣẹ ti nbọ. Tẹ "Fi Iṣẹ Tuntun Kun" lati bẹrẹ!',
        
        // Console
        'console.title': 'Sọrọ pẹlu Friday',
        'console.subtitle': 'Oluranlọwọ iṣowo AI rẹ pẹlu awọn idahun ohun adayeba',
        'console.hello': 'Bawo! Emi ni Friday, oluranlọwọ iṣowo AI rẹ. Mo le ran ọ lọwọ pẹlu ṣiṣeto, imọran iṣowo, awọn itupalẹ, ati ọpọlọpọ diẹ sii. Bawo ni mo ṣe le ran ọ lọwọ loni?',
      },
      
      pcm: {
        // Welcome and Hero
        'welcome.title': 'Welcome to Ayonman',
        'welcome.subtitle': 'Your AI-Powered Business Assistant',
        'welcome.description': 'Meet Friday - Your intelligent business partner',
        
        
        // Navigation
        'nav.home': 'Home',
        'nav.pricing': 'Price',
        'nav.roadmap': 'Road Map',
        'nav.dashboard': 'Dashboard',
        'nav.console': 'Console',
        'nav.scheduler': 'Schedule',
        'nav.advice': 'Advice',
        'nav.settings': 'Settings',
        
        // Languages
        'language.english': 'English',
        'language.yoruba': 'Yoruba',
        'language.pidgin': 'Nigerian Pidgin',
        
        // Hero Section
        'hero.meetFriday': 'Meet Friday',
        'hero.viewPricing': 'See Price',
        'hero.trialInfo': '14 days free trial • No credit card need • Dey for English, Yoruba, and Pidgin',
        'hero.getStarted': 'Start Now',
        'hero.readyToMeet': 'You ready to meet Friday?',
        'hero.enterSite': 'Enter Site',
        'hero.title': 'Meet Friday - Your AI Business Partner',
        'hero.subtitle': 'Friday na your intelligent business assistant wey dey help streamline operations, make productivity better, and give smart insights to help entrepreneurs for US and Africa succeed for today competitive market.',
        
        // Features
        'features.voiceInteraction': 'Voice Interaction',
        'features.voiceInteractionDesc': 'Talk naturally to Friday, your AI assistant, using advanced voice recognition technology.',
        'features.smartScheduling': 'Smart Scheduling',
        'features.smartSchedulingDesc': 'AI-powered calendar management wey dey learn your preferences and optimize your time.',
        'features.businessIntelligence': 'Business Intelligence',
        'features.businessIntelligenceDesc': 'Get actionable insights and data-driven recommendations to grow your business.',
        'features.chatWithFriday': 'Chat with Friday',
        'features.chatWithFridayDesc': 'Seamless conversation with your AI assistant through voice or text commands.',
        'features.easyTransitioning': 'Easy & Smooth Transitioning',
        'features.easyTransitioningDesc': 'Effortless integration with your existing workflows and business processes.',
        'features.prioritySupport': 'Priority Support & More',
        'features.prioritySupportDesc': 'Get premium support and access to advanced features. Click to see more.',
        
        // Common
        'common.everything': 'Everything you need to succeed',
        'common.featuresDesc': 'Powerful features wey design to transform how you dey manage your business operations with Friday help.',
        'common.joinThousands': 'Join thousands of entrepreneurs wey already dey use Friday to grow their business.',
        
        // Dashboard
        'dashboard.welcome': 'Welcome',
        'dashboard.welcomeBack': 'Welcome back',
        'dashboard.aiVoiceAssistant': 'AI Voice Assistant',
        'dashboard.sayFriday': 'Talk "Friday" to activate your AI assistant with natural voice responses',
        'dashboard.recentActivity': 'Recent Activity',
        'dashboard.todaySummary': 'Today Summary',
        'dashboard.tasksCompleted': 'Tasks Completed',
        'dashboard.voiceCommands': 'Voice Commands',
        'dashboard.productivityScore': 'Productivity Score',
        'dashboard.dailyProgress': 'Daily Progress',
        'dashboard.actionsToday': 'actions today',
        'dashboard.noActivity': 'No recent activity. Start by clicking on feature for top!',
        
        // Voice Commands
        'voice.sayFriday': 'Talk "Friday" to activate',
        'voice.fridayActivated': 'Friday don activate! Dey listen for your command...',
        'voice.listening': 'Dey listen... Talk now',
        'voice.processing': 'Dey process your request...',
        'voice.clickToAsk': 'Click to ask Friday',
        'voice.micPermission': 'Microphone permission need',
        
        // Business Advice
        'advice.title': 'Business Advice Center',
        'advice.subtitle': 'Get expert insights and actionable advice to grow your business. Ask Friday for personalized recommendations.',
        'advice.askFriday': 'Ask Friday for Advice',
        'advice.tryCommands': 'Try talk: "Friday, give me marketing advice" or "Help me with pricing strategy"',
        'advice.marketing': 'Marketing',
        'advice.pricing': 'Pricing',
        'advice.productivity': 'Productivity',
        'advice.strategy': 'Startup Strategy',
        
        // Scheduler
        'scheduler.title': 'Smart Scheduler',
        'scheduler.subtitle': 'Manage your tasks, reminders, and appointments',
        'scheduler.addTask': 'Add New Task',
        'scheduler.setReminder': 'Set Reminder',
        'scheduler.scheduleMeeting': 'Schedule Meeting',
        'scheduler.upcoming': 'Upcoming',
        'scheduler.noTasks': 'No upcoming tasks. Click "Add New Task" to start!',
        
        // Console
        'console.title': 'Chat with Friday',
        'console.subtitle': 'Your AI business assistant with natural voice responses',
        'console.hello': 'Hello! I be Friday, your AI business assistant. I fit help you with scheduling, business advice, analytics, and plenty more. How I fit assist you today?',
      }
    };

    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};