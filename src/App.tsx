import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { NGOUpload } from './components/NGOUpload';
import { ValidationDashboard } from './components/ValidationDashboard';
import { BlockchainRegistry } from './components/BlockchainRegistry';
import { CarbonMarketplace } from './components/CarbonMarketplace';
import { AdminDashboard } from './components/AdminDashboard';

type ActiveView = 'home' | 'ngo-upload' | 'validation' | 'blockchain' | 'marketplace' | 'admin';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <Hero onNavigate={setActiveView} />;
      case 'ngo-upload':
        return <NGOUpload onNavigate={setActiveView} />;
      case 'validation':
        return <ValidationDashboard onNavigate={setActiveView} />;
      case 'blockchain':
        return <BlockchainRegistry onNavigate={setActiveView} />;
      case 'marketplace':
        return <CarbonMarketplace onNavigate={setActiveView} />;
      case 'admin':
        return <AdminDashboard onNavigate={setActiveView} />;
      default:
        return <Hero onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-300 relative selection:bg-cyan-500/30">
      <Navigation activeView={activeView} onNavigate={setActiveView} />
      <main className="relative z-10 transition-all duration-500">
        {renderActiveView()}
      </main>
    </div>
  );
}

export default App;