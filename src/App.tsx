import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { ChatAssistant } from './components/ChatAssistant';
import { MoodTracker } from './components/MoodTracker';
import { SurveyModule } from './components/SurveyModule';
import { ResourcesHub } from './components/ResourcesHub';
import { PeerForum } from './components/PeerForum';
import { BookingPage } from './components/BookingPage';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { Login } from './components/auth/Login';
import { SignUp } from './components/auth/SignUp';
import { AccessibilityVoiceAssistant } from './components/AccessibilityVoiceAssistant';
import { MediaCapabilitiesDemo } from './components/MediaCapabilitiesDemo';
import { Button } from './components/ui/button';
import { Accessibility, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type PageType = 'home' | 'chat' | 'mood' | 'survey' | 'resources' | 'forum' | 'booking' | 'dashboard' | 'profile' | 'media-demo';
export type AuthModalType = 'login' | 'signup' | null;

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [authModal, setAuthModal] = useState<AuthModalType>(null);
  const [showAccessibilityAssistant, setShowAccessibilityAssistant] = useState(false);
  const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);

  // Check for accessibility preferences on load
  useEffect(() => {
    const accessibilitySettings = localStorage.getItem('accessibilitySettings');
    const shouldShowAssistant = localStorage.getItem('showAccessibilityAssistant') === 'true';
    
    if (accessibilitySettings || shouldShowAssistant) {
      setAccessibilityEnabled(true);
      setShowAccessibilityAssistant(shouldShowAssistant);
    }

    // Listen for voice navigation commands
    const handleVoiceNavigation = (event: CustomEvent) => {
      const { page } = event.detail;
      setCurrentPage(page as PageType);
    };

    window.addEventListener('voice-navigate', handleVoiceNavigation as EventListener);
    
    return () => {
      window.removeEventListener('voice-navigate', handleVoiceNavigation as EventListener);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'chat':
        return <ChatAssistant />;
      case 'mood':
        return <MoodTracker />;
      case 'survey':
        return <SurveyModule />;
      case 'resources':
        return <ResourcesHub />;
      case 'forum':
        return <PeerForum />;
      case 'booking':
        return <BookingPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'media-demo':
        return <MediaCapabilitiesDemo />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  const toggleAccessibilityAssistant = () => {
    const newState = !showAccessibilityAssistant;
    setShowAccessibilityAssistant(newState);
    localStorage.setItem('showAccessibilityAssistant', newState.toString());
    
    if (newState) {
      setAccessibilityEnabled(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onShowAuth={setAuthModal}
      />
      
      {/* Accessibility Toggle Button */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={toggleAccessibilityAssistant}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full w-12 h-12 p-0"
          aria-label="Toggle Accessibility Voice Assistant"
          title="Voice Assistant for Accessibility"
        >
          <Accessibility className="h-6 w-6" />
        </Button>
      </div>

      {/* Accessibility Voice Assistant */}
      <AnimatePresence>
        {showAccessibilityAssistant && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-20 right-20 z-40 w-96 max-w-[calc(100vw-2rem)]"
          >
            <div className="relative">
              <Button
                onClick={() => setShowAccessibilityAssistant(false)}
                className="absolute -top-2 -right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 p-0"
                aria-label="Close Accessibility Assistant"
              >
                <X className="h-4 w-4" />
              </Button>
              <AccessibilityVoiceAssistant />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`pt-16 ${showAccessibilityAssistant ? 'pr-[420px]' : ''} transition-all duration-300`}>
        {renderPage()}
      </main>

      {/* Authentication Modals */}
      {authModal === 'login' && (
        <Login
          onSwitchToSignup={() => setAuthModal('signup')}
          onClose={() => setAuthModal(null)}
        />
      )}
      
      {authModal === 'signup' && (
        <SignUp
          onSwitchToLogin={() => setAuthModal('login')}
          onClose={() => setAuthModal(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}