import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { ChatWidget } from './components/ChatWidget';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Results from './pages/Results';

type AppView = 'home' | 'login' | 'signup' | 'dashboard' | 'assessment' | 'results';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string>('');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && (currentView === 'dashboard' || currentView === 'assessment' || currentView === 'results')) {
    setCurrentView('home');
  }

  if (user && (currentView === 'home' || currentView === 'login' || currentView === 'signup')) {
    setCurrentView('dashboard');
  }

  const handleStartAssessment = () => {
    setCurrentView('assessment');
  };

  const handleAssessmentComplete = (assessmentId: string) => {
    setCurrentAssessmentId(assessmentId);
    setCurrentView('results');
  };

  const handleViewResults = (assessmentId: string) => {
    setCurrentAssessmentId(assessmentId);
    setCurrentView('results');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  return (
    <>
      {currentView === 'home' && <Home onNavigateToLogin={() => setCurrentView('login')} />}
      {currentView === 'login' && (
        <Login
          onToggleMode={() => setCurrentView('signup')}
          onBack={() => setCurrentView('home')}
        />
      )}
      {currentView === 'signup' && <Signup onToggleMode={() => setCurrentView('login')} />}
      {currentView === 'dashboard' && (
        <Dashboard onStartAssessment={handleStartAssessment} onViewResults={handleViewResults} />
      )}
      {currentView === 'assessment' && (
        <Assessment
          onComplete={handleAssessmentComplete}
          onBack={handleBackToDashboard}
        />
      )}
      {currentView === 'results' && (
        <Results assessmentId={currentAssessmentId} onBack={handleBackToDashboard} />
      )}
      <ChatWidget />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
