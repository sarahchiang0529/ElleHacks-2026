import { useState } from 'react';
import { GameStateProvider } from './hooks/useGameState';
import { SoundToggle } from './components/SoundToggle';
import { LandingPage } from './pages/LandingPage';
import { ScenarioSelectPage } from './pages/ScenarioSelectPage';
import { ScenarioPlayPage } from './pages/ScenarioPlayPage';
import { ProgressPage } from './pages/ProgressPage';
import { Trophy } from 'lucide-react';
import { useGameState } from './hooks/useGameState';

type Page = 'landing' | 'select' | 'play' | 'progress';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const { xp } = useGameState();

  const handleStart = () => {
    setCurrentPage('select');
  };

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setCurrentPage('play');
  };

  const handleScenarioComplete = () => {
    setSelectedScenario(null);
    setCurrentPage('select');
  };

  const handleBackToHome = () => {
    setCurrentPage('landing');
    setSelectedScenario(null);
  };

  const handleBackToSelect = () => {
    setCurrentPage('select');
    setSelectedScenario(null);
  };

  return (
    <div className="relative min-h-screen">
      <SoundToggle />

      {/* XP Badge - Shows on all pages except landing */}
      {currentPage !== 'landing' && (
        <button
          onClick={() => setCurrentPage('progress')}
          className="fixed top-4 left-4 z-40 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
        >
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-purple-600">{xp} XP</span>
        </button>
      )}

      {/* Pages */}
      {currentPage === 'landing' && <LandingPage onStart={handleStart} />}
      
      {currentPage === 'select' && (
        <ScenarioSelectPage
          onSelectScenario={handleSelectScenario}
          onBack={handleBackToHome}
        />
      )}
      
      {currentPage === 'play' && selectedScenario && (
        <ScenarioPlayPage
          scenarioId={selectedScenario}
          onComplete={handleScenarioComplete}
          onBack={handleBackToSelect}
        />
      )}
      
      {currentPage === 'progress' && (
        <ProgressPage onBack={handleBackToSelect} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <GameStateProvider>
      <AppContent />
    </GameStateProvider>
  );
}
