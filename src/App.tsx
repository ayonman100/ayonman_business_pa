import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { StatsProvider } from './contexts/StatsContext';
import LoadingScreen from './pages/LoadingScreen';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import AssistantConsolePage from './pages/AssistantConsolePage';
import SchedulerDashboard from './pages/SchedulerDashboard';
import BusinessAdvicePage from './pages/BusinessAdvicePage';
import SettingsPage from './pages/SettingsPage';
import Pricing from './pages/Pricing';
import Roadmap from './pages/Roadmap';
import FridayFeaturesPage from './pages/FridayFeaturesPage';
import ProPage from './pages/ProPage';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <StatsProvider>
              <Router>
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                  <Routes>
                    <Route path="/" element={<LoadingScreen />} />
                    <Route path="/home" element={<LandingPage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/roadmap" element={<Roadmap />} />
                    <Route path="/pro" element={<ProPage />} />
                    <Route path="/friday-features" element={<FridayFeaturesPage />} />

                    {/* Previously protected routes — now publicly accessible */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/console" element={<AssistantConsolePage />} />
                    <Route path="/scheduler" element={<SchedulerDashboard />} />
                    <Route path="/advice" element={<BusinessAdvicePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </div>
              </Router>
            </StatsProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
