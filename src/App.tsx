<<<<<<< HEAD
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
=======
import { useState, useEffect, useCallback } from "react";
import { TownView } from "./components/town-view";
import { ConversationModal } from "./components/conversation-modal";
import { ReflectionOverlay } from "./components/reflection-overlay";
import { RewardScreen } from "./components/reward-screen";
import { SettingsModal, SettingsButton } from "./components/settings-modal";

interface Scenario {
  id: number;
  villagerId: number;
  message: {
    type: 'text' | 'voice';
    content: string;
    callerName?: string;
    duration?: number;
  };
  correctAnswer: 'trust' | 'question' | 'reject';
  mood: 'neutral' | 'worried' | 'happy';
  reflection: {
    title: string;
    message: string;
  };
}

// World dimensions - larger explorable map
const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1800;

// Game scenarios - Financial Literacy Challenges
const scenarios: Scenario[] = [
  {
    id: 1,
    villagerId: 1,
    message: {
      type: 'text',
      content: "You saved $50 for an $80 skateboard. Your favorite game is on sale for $30. What do you do?",
    },
    correctAnswer: 'reject',
    mood: 'worried',
    reflection: {
      title: "Delayed Gratification",
      message: "Great job! Staying focused on your goal will help you get the skateboard faster. Delayed gratification pays off!",
    },
  },
  {
    id: 2,
    villagerId: 2,
    message: {
      type: 'text',
      content: "Your backpack broke. Basic backpack: $20. Cool limited edition: $50. Your friend's birthday is next month (need $30 for gift). What do you buy?",
    },
    correctAnswer: 'reject',
    mood: 'neutral',
    reflection: {
      title: "Needs vs Wants",
      message: "Smart choice! The basic backpack meets your need and leaves you $30 for your friend's gift. You balanced needs and wants perfectly!",
    },
  },
  {
    id: 3,
    villagerId: 3,
    message: {
      type: 'text',
      content: "You got a text: 'WIN FREE Nintendo Switch! Click link and enter parent's credit card.' What do you do?",
    },
    correctAnswer: 'reject',
    mood: 'worried',
    reflection: {
      title: "Scam Detection",
      message: "Excellent! You recognized a scam! Real prizes never ask for credit card info. Always tell a trusted adult about suspicious messages.",
    },
  },
  {
    id: 4,
    villagerId: 4,
    message: {
      type: 'text',
      content: "Friend asks to borrow $15. You have $40 and concert tickets go on sale in 5 days ($50). What do you do?",
    },
    correctAnswer: 'reject',
    mood: 'neutral',
    reflection: {
      title: "Lending Money",
      message: "Good decision! It's okay to say no when lending money conflicts with your goals. True friends will understand. You're protecting your concert plans!",
    },
  },
  {
    id: 5,
    villagerId: 5,
    message: {
      type: 'text',
      content: "Everyone's buying $90 sneakers. You're saving $100 for art tablet ($120 total needed). What do you do?",
    },
    correctAnswer: 'reject',
    mood: 'happy',
    reflection: {
      title: "Peer Pressure",
      message: "Amazing! You stayed true to YOUR goals despite peer pressure. The art tablet will help you create for years. That's real financial wisdom!",
    },
  },
];

export default function App() {
  // Player state - starts in center of world
  const [playerX, setPlayerX] = useState(WORLD_WIDTH / 2);
  const [playerY, setPlayerY] = useState(WORLD_HEIGHT / 2);
  const [isMoving, setIsMoving] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  // Camera state - follows the player
  const [cameraX, setCameraX] = useState(WORLD_WIDTH / 2 - window.innerWidth / 2);
  const [cameraY, setCameraY] = useState(WORLD_HEIGHT / 2 - window.innerHeight / 2);

  // Game state
  const [trustLevel, setTrustLevel] = useState(50);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  
  // Buildings positioned around the world (matching financial literacy challenges)
  const [villagers, setVillagers] = useState([
    { id: 1, name: "Bank", variant: 'lily' as const, x: 600, y: 400, color: "#d4af37", isActive: true, buildingType: 'bank' as const },
    { id: 2, name: "Store", variant: 'max' as const, x: 1800, y: 500, color: "#ff9966", isActive: false, buildingType: 'store' as const },
    { id: 3, name: "Lily's House", variant: 'zoe' as const, x: 400, y: 1200, color: "#ffb3ba", isActive: false, buildingType: 'phone' as const },
    { id: 4, name: "Max's House", variant: 'lily' as const, x: 1400, y: 1300, color: "#bae1ff", isActive: false, buildingType: 'friend' as const },
    { id: 5, name: "School", variant: 'max' as const, x: 1200, y: 800, color: "#c9a0dc", isActive: false, buildingType: 'school' as const },
  ]);
  const [nearbyVillager, setNearbyVillager] = useState<number | null>(null);
  
  // Decorations with positions
  const [decorations, setDecorations] = useState<Array<{ x: number; y: number; emoji: string }>>([]);

  // Trees scattered around the world (scaled up to match buildings)
  const trees = [
    { x: 300, y: 300, variant: 0, scale: 2.4 },
    { x: 800, y: 200, variant: 1, scale: 2.0 },
    { x: 1200, y: 350, variant: 2, scale: 1.8 },
    { x: 1600, y: 300, variant: 3, scale: 2.2 },
    { x: 2000, y: 450, variant: 4, scale: 2.0 },
    { x: 200, y: 700, variant: 5, scale: 2.6 },
    { x: 900, y: 650, variant: 6, scale: 1.6 },
    { x: 1500, y: 600, variant: 7, scale: 2.2 },
    { x: 2100, y: 700, variant: 8, scale: 2.4 },
    { x: 350, y: 1000, variant: 0, scale: 2.0 },
    { x: 700, y: 1100, variant: 1, scale: 2.4 },
    { x: 1100, y: 1050, variant: 2, scale: 1.8 },
    { x: 1700, y: 1100, variant: 3, scale: 2.2 },
    { x: 2200, y: 900, variant: 4, scale: 2.0 },
    { x: 250, y: 1400, variant: 5, scale: 2.4 },
    { x: 600, y: 1500, variant: 6, scale: 1.8 },
    { x: 1000, y: 1450, variant: 7, scale: 2.0 },
    { x: 1600, y: 1500, variant: 8, scale: 2.6 },
    { x: 2050, y: 1350, variant: 0, scale: 2.2 },
    { x: 450, y: 600, variant: 1, scale: 1.6 },
    { x: 1900, y: 1200, variant: 2, scale: 2.4 },
    { x: 1300, y: 1650, variant: 3, scale: 2.0 },
    { x: 750, y: 800, variant: 4, scale: 1.8 },
    { x: 2150, y: 550, variant: 5, scale: 2.2 },
  ];

  // Modal states
  const [showConversation, setShowConversation] = useState(false);
  const [activeVillager, setActiveVillager] = useState<number | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [feedbackEffect, setFeedbackEffect] = useState<'safe' | 'unsafe' | null>(null);

  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [movementControl, setMovementControl] = useState<'arrows' | 'wasd'>('arrows');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Get current scenario
  const currentScenario = scenarios[currentScenarioIndex];

  // Update camera to follow player smoothly
  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Center camera on player
    let targetCameraX = playerX - screenWidth / 2;
    let targetCameraY = playerY - screenHeight / 2;

    // Keep camera within world bounds
    targetCameraX = Math.max(0, Math.min(WORLD_WIDTH - screenWidth, targetCameraX));
    targetCameraY = Math.max(0, Math.min(WORLD_HEIGHT - screenHeight, targetCameraY));

    setCameraX(targetCameraX);
    setCameraY(targetCameraY);
  }, [playerX, playerY]);

  // Keyboard movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Handle E key for interaction
      if (key === 'e' && nearbyVillager && !showConversation) {
        handleVillagerClick(nearbyVillager);
        return;
      }

      // Movement keys
      const movementKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'];
      if (movementKeys.includes(key)) {
        e.preventDefault();
        setKeysPressed((prev) => new Set(prev).add(key));
        setIsMoving(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeysPressed((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyVillager, showConversation]);

  // Update player position in world coordinates
  useEffect(() => {
    const moveSpeed = 5;
    const interval = setInterval(() => {
      if (keysPressed.size === 0) {
        setIsMoving(false);
        return;
      }

      setPlayerX((prevX) => {
        let newX = prevX;
        if (keysPressed.has('arrowleft') || keysPressed.has('a')) newX -= moveSpeed;
        if (keysPressed.has('arrowright') || keysPressed.has('d')) newX += moveSpeed;
        return Math.max(100, Math.min(WORLD_WIDTH - 100, newX));
      });

      setPlayerY((prevY) => {
        let newY = prevY;
        if (keysPressed.has('arrowup') || keysPressed.has('w')) newY -= moveSpeed;
        if (keysPressed.has('arrowdown') || keysPressed.has('s')) newY += moveSpeed;
        return Math.max(100, Math.min(WORLD_HEIGHT - 100, newY));
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [keysPressed]);

  // Check for nearby villagers
  useEffect(() => {
    const checkDistance = () => {
      let closest: number | null = null;
      let minDistance = Infinity;

      villagers.forEach((villager) => {
        if (!villager.isActive) return;
        const distance = Math.sqrt(
          Math.pow(playerX - villager.x, 2) + Math.pow(playerY - villager.y, 2)
        );
        if (distance < 150 && distance < minDistance) {
          minDistance = distance;
          closest = villager.id;
        }
      });

      setNearbyVillager(closest);
    };

    checkDistance();
  }, [playerX, playerY, villagers]);

  const handleVillagerClick = (villagerId: number) => {
    const villager = villagers.find((v) => v.id === villagerId);
    if (!villager || !villager.isActive) return;

    setActiveVillager(villagerId);
    setShowConversation(true);
  };

  const handleChoice = (choice: 'trust' | 'question' | 'reject') => {
    setShowConversation(false);

    const isCorrect = choice === currentScenario.correctAnswer;

    // Show feedback effect
    setFeedbackEffect(isCorrect ? 'safe' : 'unsafe');
    setTimeout(() => setFeedbackEffect(null), 600);

    // Update trust level
    if (isCorrect) {
      setTrustLevel((prev) => Math.min(100, prev + 15));
    } else {
      setTrustLevel((prev) => Math.max(0, prev - 10));
    }

    // Show reflection
    setTimeout(() => {
      setShowReflection(true);
    }, 700);
  };

  const handleReflectionClose = () => {
    setShowReflection(false);

    // Check if this was the last scenario
    if (currentScenarioIndex >= scenarios.length - 1) {
      // Show final reward
      setTimeout(() => {
        setShowReward(true);
      }, 300);
    } else {
      // Move to next scenario
      const nextIndex = currentScenarioIndex + 1;
      setCurrentScenarioIndex(nextIndex);
      
      // Activate next villager
      setVillagers((prev) =>
        prev.map((v) => ({
          ...v,
          isActive: v.id === scenarios[nextIndex].villagerId,
        }))
      );

      // Add decoration near the completed villager
      const completedVillager = villagers.find(v => v.id === currentScenario.villagerId);
      if (completedVillager) {
        const newDecorations = ['🌱', '🏮', '⛲', '🌳', '🌺'];
        setDecorations((prev) => [
          ...prev,
          {
            x: completedVillager.x + 80,
            y: completedVillager.y + 60,
            emoji: newDecorations[nextIndex % newDecorations.length]
          }
        ]);
      }
    }
  };

  const handleRewardClose = () => {
    setShowReward(false);
    // Reset to first scenario for demo purposes
    setCurrentScenarioIndex(0);
    setVillagers((prev) =>
      prev.map((v) => ({
        ...v,
        isActive: v.id === 1,
      }))
    );
  };

  const currentVillager = villagers.find((v) => v.id === activeVillager);
>>>>>>> 067f5c1a9966d68f6eb259eb75d063368ba6b7aa

  return (
    <div className="relative">
      {/* Town view */}
      <TownView
        playerX={playerX}
        playerY={playerY}
        cameraX={cameraX}
        cameraY={cameraY}
        isMoving={isMoving}
        villagers={villagers}
        nearbyVillager={nearbyVillager}
        trustLevel={trustLevel}
        onVillagerClick={handleVillagerClick}
        feedbackEffect={feedbackEffect}
        decorations={decorations}
        worldWidth={WORLD_WIDTH}
        worldHeight={WORLD_HEIGHT}
        trees={trees}
      />

      {/* Settings button */}
      <SettingsButton onClick={() => setShowSettings(true)} />

      {/* Conversation modal */}
      {currentVillager && currentScenario && (
        <ConversationModal
          isOpen={showConversation}
          villagerName={currentVillager.name}
          villagerVariant={currentVillager.variant}
          villagerMood={currentScenario.mood}
          message={currentScenario.message}
          onTrust={() => handleChoice('trust')}
          onQuestion={() => handleChoice('question')}
          onReject={() => handleChoice('reject')}
        />
      )}

      {/* Reflection overlay */}
      {currentScenario && (
        <ReflectionOverlay
          isOpen={showReflection}
          title={currentScenario.reflection.title}
          message={currentScenario.reflection.message}
          onClose={handleReflectionClose}
        />
      )}

      {/* Reward screen */}
      <RewardScreen
        isOpen={showReward}
        badgeName="Guardian of TrustTown"
        badgeEmoji="🛡️"
        xpGained={250}
        decoration="🎪 Town Festival Tent"
        onClose={handleRewardClose}
      />

      {/* Settings modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled(!soundEnabled)}
        movementControl={movementControl}
        onMovementControlChange={setMovementControl}
        reducedMotion={reducedMotion}
        onReducedMotionToggle={() => setReducedMotion(!reducedMotion)}
      />
    </div>
  );
}
