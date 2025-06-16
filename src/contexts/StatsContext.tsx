import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface StatsContextType {
  todayStats: {
    tasksCompleted: number;
    voiceCommands: number;
    productivityScore: number;
  };
  recentActivity: Array<{
    action: string;
    timestamp: Date;
    details?: string;
  }>;
  incrementTasksCompleted: () => void;
  incrementVoiceCommands: () => void;
  logActivity: (action: string, details?: string) => void;
  clearRecentActivity: () => void;
}

// Initialize context with default values
const StatsContext = createContext<StatsContextType>({
  todayStats: {
    tasksCompleted: 0,
    voiceCommands: 0,
    productivityScore: 0,
  },
  recentActivity: [],
  incrementTasksCompleted: () => {},
  incrementVoiceCommands: () => {},
  logActivity: () => {},
  clearRecentActivity: () => {},
});

// Create provider component with state management and helper functions
export const StatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todayStats, setTodayStats] = useState({
    tasksCompleted: 0,
    voiceCommands: 0,
    productivityScore: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState<Array<{
    action: string;
    timestamp: Date;
    details?: string;
  }>>([]);

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('ayonman_stats');
    const savedActivity = localStorage.getItem('ayonman_activity');
    
    if (savedStats) {
      try {
        setTodayStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
    
    if (savedActivity) {
      try {
        const parsedActivity = JSON.parse(savedActivity);
        // Convert timestamp strings back to Date objects
        const activityWithDates = parsedActivity.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setRecentActivity(activityWithDates);
      } catch (error) {
        console.error('Error loading activity:', error);
      }
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ayonman_stats', JSON.stringify(todayStats));
  }, [todayStats]);

  // Save activity to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ayonman_activity', JSON.stringify(recentActivity));
  }, [recentActivity]);

  const incrementTasksCompleted = useCallback(() => {
    setTodayStats(prev => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted + 1,
      productivityScore: Math.min(100, prev.productivityScore + 5), // Cap at 100%
    }));
  }, []);

  const incrementVoiceCommands = useCallback(() => {
    setTodayStats(prev => ({
      ...prev,
      voiceCommands: prev.voiceCommands + 1,
      productivityScore: Math.min(100, prev.productivityScore + 2), // Smaller increment for voice commands
    }));
  }, []);

  const logActivity = useCallback((action: string, details?: string) => {
    setRecentActivity(prev => [
      { action, timestamp: new Date(), details },
      ...prev.slice(0, 9), // Keep only last 10 activities
    ]);
  }, []);

  const clearRecentActivity = useCallback(() => {
    setRecentActivity([]);
    localStorage.removeItem('ayonman_activity');
  }, []);

  const value = {
    todayStats,
    recentActivity,
    incrementTasksCompleted,
    incrementVoiceCommands,
    logActivity,
    clearRecentActivity,
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};