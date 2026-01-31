import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState } from '../types/game';

const defaultState: GameState = {
  xp: 0,
  completedScenarios: [],
  badges: [],
  soundOn: true,
  currentScenario: null,
};

interface GameContextType extends GameState {
  addXP: (amount: number) => void;
  completeScenario: (scenarioId: string) => void;
  unlockBadge: (badgeId: string) => void;
  toggleSound: () => void;
  setCurrentScenario: (scenarioId: string | null) => void;
  resetProgress: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vault-guardian-state');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return defaultState;
        }
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('vault-guardian-state', JSON.stringify(state));
  }, [state]);

  const addXP = (amount: number) => {
    setState(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const completeScenario = (scenarioId: string) => {
    setState(prev => ({
      ...prev,
      completedScenarios: prev.completedScenarios.includes(scenarioId)
        ? prev.completedScenarios
        : [...prev.completedScenarios, scenarioId],
    }));
  };

  const unlockBadge = (badgeId: string) => {
    setState(prev => ({
      ...prev,
      badges: prev.badges.includes(badgeId) ? prev.badges : [...prev.badges, badgeId],
    }));
  };

  const toggleSound = () => {
    setState(prev => ({ ...prev, soundOn: !prev.soundOn }));
  };

  const setCurrentScenario = (scenarioId: string | null) => {
    setState(prev => ({ ...prev, currentScenario: scenarioId }));
  };

  const resetProgress = () => {
    setState(defaultState);
  };

  return (
    <GameContext.Provider
      value={{
        ...state,
        addXP,
        completeScenario,
        unlockBadge,
        toggleSound,
        setCurrentScenario,
        resetProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider');
  }
  return context;
}
