import React from 'react';
import { Bot } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', showText = true }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <Bot className="h-8 w-8 text-primary-500 animate-bounce-gentle" />
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      {showText && (
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          Ayonman
        </span>
      )}
    </div>
  );
};

export default Logo;