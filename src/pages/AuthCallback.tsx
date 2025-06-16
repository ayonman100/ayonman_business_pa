import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting to dashboard...');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
        } else {
          throw new Error('No session found');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
        
        // Redirect to sign in page after error
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'loading' && (
              <Loader className="h-16 w-16 text-primary-500 mx-auto animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            )}
            {status === 'error' && (
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            )}
          </div>

          {/* Status Message */}
          <h1 className={`text-2xl font-bold mb-4 ${
            status === 'success' ? 'text-green-600 dark:text-green-400' :
            status === 'error' ? 'text-red-600 dark:text-red-400' :
            'text-gray-900 dark:text-white'
          }`}>
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Welcome to Ayonman!'}
            {status === 'error' && 'Authentication Failed'}
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {message}
          </p>

          {/* Loading indicator */}
          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="animate-pulse flex space-x-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {/* Error Actions */}
          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={() => navigate('/signin')}
                className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Back to Sign In
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;