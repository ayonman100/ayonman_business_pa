import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  // Immediately redirect to dashboard/home screen
  useEffect(() => {
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  // Show loading screen while redirecting
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Loading...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Taking you to your dashboard
        </p>
      </div>
    </div>
  );
};

export default OnboardingPage;