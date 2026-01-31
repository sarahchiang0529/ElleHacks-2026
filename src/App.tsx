import React, { useMemo, useState } from "react";
import { GameStateProvider } from "./hooks/useGameState";
import { SoundToggle } from "./components/SoundToggle";
import { LandingPage } from "./pages/LandingPage";
import { ScenarioPlayPage } from "./pages/ScenarioPlayPage";
import { ProgressPage } from "./pages/ProgressPage";
import { Trophy } from "lucide-react";
import { useGameState } from "./hooks/useGameState";
import type { Scenario } from "./types/game";
import { scenarios } from "./data/scenarios";

type Page = "landing" | "town" | "progress";

type Difficulty = "easy" | "medium" | "hard";

function difficultyForLevel(level: number): Difficulty {
  if (level <= 1) return "easy";
  if (level === 2) return "medium";
  return "hard";
}

function pickRandom<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function TownPage(props: {
  level: number;
  onWalk: () => void;
  moves: number;
  challengeRatePercent: number;
}) {
  const { level, onWalk, moves, challengeRatePercent } = props;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold text-purple-700">TrustTown</h1>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg px-6 py-4 w-full max-w-md">
        <p className="text-lg font-semibold text-gray-800">Level: {level}</p>
        <p className="text-sm text-gray-600 mt-1">Moves: {moves}</p>
        <p className="text-sm text-gray-600 mt-1">
          Challenge chance per move: {challengeRatePercent}%
        </p>
      </div>

      <button
        onClick={onWalk}
        className="px-12 py-6 rounded-2xl bg-purple-600 text-white font-bold text-2xl hover:opacity-90 active:scale-[0.99] transition shadow-xl"
      >
        Walk
      </button>

      <p className="text-sm text-gray-600 max-w-md">
        Click “Walk” to explore the town. Sometimes a challenge will pop up. If you
        handle it safely, you level up.
      </p>
    </div>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");

  // "Town loop" state
  const [level, setLevel] = useState<number>(1);
  const [moves, setMoves] = useState<number>(0);

  // Active scenario being played (null means you're just walking in town)
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  // Used to infer correct vs wrong without changing ScenarioPlayPage:
  // if XP increased during the scenario, we treat it as a "correct" completion.
  const [xpAtScenarioStart, setXpAtScenarioStart] = useState<number>(0);

  // Global state: XP for correctness inference; completedScenarios for "prefer unplayed"
  const { xp, completedScenarios } = useGameState();

  // Tweak these safely
  const CHALLENGE_RATE = 0.33; // ~33% chance per move
  const COOLDOWN_MOVES = 1; // guarantee at least 1 move between challenges

  const [movesSinceLastChallenge, setMovesSinceLastChallenge] = useState<number>(
    COOLDOWN_MOVES
  );

  const difficulty = difficultyForLevel(level);

  const scenarioPool = useMemo(() => {
    // Filter by difficulty for level-based progression (level 1 = easy, 2 = medium, 3+ = hard)
    const pool = scenarios.filter((s: Scenario) => s.difficulty === difficulty);

    // Prefer unplayed scenarios; allow repeats if none remain
    const unplayed = pool.filter((s: Scenario) => !completedScenarios.includes(s.id));

    return {
      pool,
      usable: unplayed.length > 0 ? unplayed : pool
    };
  }, [difficulty, completedScenarios]);

  const handleStart = () => {
    setCurrentPage("town");
  };

  const handleBackToHome = () => {
    setCurrentPage("landing");
    setActiveScenarioId(null);
  };

  const handleOpenProgress = () => {
    setCurrentPage("progress");
  };

  const handleBackFromProgress = () => {
    setCurrentPage("town");
  };

  const startRandomChallenge = () => {
    const picked = pickRandom<Scenario>(scenarioPool.usable);
    if (!picked) return;

    setActiveScenarioId(picked.id);
    setXpAtScenarioStart(xp);
    setMovesSinceLastChallenge(0);
  };

  const handleWalk = () => {
    // Update "walking" count
    setMoves((m) => m + 1);

    // If a challenge is currently open, don't trigger another
    if (activeScenarioId) return;

    // Cooldown: ensure at least COOLDOWN_MOVES moves between challenges
    if (movesSinceLastChallenge < COOLDOWN_MOVES) {
      setMovesSinceLastChallenge((v) => v + 1);
      return;
    }

    // Random encounter
    const roll = Math.random(); // 0..1
    const shouldTrigger = roll < CHALLENGE_RATE;

    if (shouldTrigger) {
      startRandomChallenge();
    } else {
      setMovesSinceLastChallenge((v) => v + 1);
    }
  };

  const handleScenarioComplete = () => {
    if (!activeScenarioId) return;

    // Infer correctness by XP change (ScenarioPlayPage adds XP only on correct answer)
    const isCorrect = xp > xpAtScenarioStart;

    // Progression rule: correct => level up, incorrect => stay at same level
    if (isCorrect) {
      setLevel((lvl) => clamp(lvl + 1, 1, 99));
    }

    // Return to town; cooldown resets so next encounter is after 1 move
    setActiveScenarioId(null);
    setMovesSinceLastChallenge(0);
  };

  return (
    <div className="relative min-h-screen">
      <SoundToggle />

      {/* XP Badge - Shows on all pages except landing */}
      {currentPage !== "landing" && (
        <button
          onClick={handleOpenProgress}
          className="fixed top-4 left-4 z-40 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
        >
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-purple-600">{xp} XP</span>
        </button>
      )}

      {/* Pages */}
      {currentPage === "landing" && <LandingPage onStart={handleStart} />}

      {currentPage === "town" && (
        <TownPage
          level={level}
          onWalk={handleWalk}
          moves={moves}
          challengeRatePercent={Math.round(CHALLENGE_RATE * 100)}
        />
      )}

      {currentPage === "progress" && <ProgressPage onBack={handleBackFromProgress} />}

      {/* Challenge overlay (reuses existing ScenarioPlayPage) */}
      {currentPage === "town" && activeScenarioId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
              <ScenarioPlayPage
                scenarioId={activeScenarioId}
                onComplete={handleScenarioComplete}
                onBack={() => {
                  // Back out: return to town without leveling; cooldown still applies
                  setActiveScenarioId(null);
                  setMovesSinceLastChallenge(0);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Optional home button (only visible outside landing) */}
      {currentPage !== "landing" && (
        <button
          onClick={handleBackToHome}
          className="fixed top-4 right-4 z-40 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          Home
        </button>
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
