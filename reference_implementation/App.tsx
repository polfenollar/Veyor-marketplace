import React, { useState } from 'react';
import { Header } from './components/Header';
import { Stepper } from './components/Stepper';
import { Home } from './views/Home';
import { RecommendedServices } from './views/RecommendedServices';
import { Results } from './views/Results';
import { Booking } from './views/Booking';
import { Quote, ViewState } from './types';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const handleSearch = () => {
    setCurrentView('RECOMMENDED_SERVICES');
    window.scrollTo(0, 0);
  };

  const handleConfirmServices = () => {
    setCurrentView('RESULTS');
    window.scrollTo(0, 0);
  };

  const handleSelectQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setCurrentView('BOOKING');
    window.scrollTo(0, 0);
  };

  const handleBackToResults = () => {
    setSelectedQuote(null);
    setCurrentView('RESULTS');
    window.scrollTo(0, 0);
  };
  
  const handleBackToHome = () => {
    setCurrentView('HOME');
    window.scrollTo(0, 0);
  };

  // Helper to determine active step for stepper
  const getStepNumber = () => {
    switch (currentView) {
      case 'HOME': return 1;
      case 'RECOMMENDED_SERVICES': return 2;
      case 'RESULTS': return 3;
      case 'BOOKING': return 4;
      default: return 1;
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen flex flex-col">
      <Header />

      {/* Show Stepper on all pages except Home, but technically search is step 1 so maybe we show it after home? 
          Actually usually stepper is visible once you start the flow. 
          Let's show it on all views except HOME for cleaner look, or if user wants it on search, 
          but usually 'Home' is the landing page.
      */}
      {currentView !== 'HOME' && (
        <Stepper currentStep={getStepNumber()} />
      )}

      <main className="flex-1">
        {currentView === 'HOME' && <Home onSearch={handleSearch} />}
        
        {currentView === 'RECOMMENDED_SERVICES' && (
          <RecommendedServices onConfirm={handleConfirmServices} />
        )}

        {currentView === 'RESULTS' && (
          <Results 
            onSelectQuote={handleSelectQuote} 
            onBack={handleBackToHome}
          />
        )}
        
        {currentView === 'BOOKING' && selectedQuote && (
          <Booking 
            quote={selectedQuote} 
            onBack={handleBackToResults} 
          />
        )}
      </main>

      {/* Global Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="w-14 h-14 bg-purple-700 hover:bg-purple-800 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
          <MessageCircle className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}