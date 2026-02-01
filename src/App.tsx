import { useState, useEffect } from "react";
import { TownView } from "./components/town-view";
import { ConversationModal } from "./components/conversation-modal";
import { ReflectionOverlay } from "./components/reflection-overlay";
import { RewardScreen } from "./components/reward-screen";
import { SettingsModal, SettingsButton } from "./components/settings-modal";
import { useGameApi } from "./hooks/useGameApi";
import type { Choice } from "./services/api";

// World dimensions - larger explorable map
const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1800;

// Villager configurations matching backend locations
const VILLAGER_CONFIG: Record<string, {
  id: number;
  name: string;
  variant: 'lily' | 'max' | 'zoe';
  x: number;
  y: number;
  color: string;
  buildingType: 'bank' | 'store' | 'phone' | 'friend' | 'school';
}> = {
  Bank: { id: 1, name: "Bank", variant: 'lily', x: 600, y: 400, color: "#d4af37", buildingType: 'bank' },
  Store: { id: 2, name: "Store", variant: 'max', x: 1800, y: 500, color: "#ff9966", buildingType: 'store' },
  Phone: { id: 3, name: "Lily's House", variant: 'zoe', x: 400, y: 1200, color: "#ffb3ba", buildingType: 'phone' },
  Friend: { id: 4, name: "Max's House", variant: 'lily', x: 1400, y: 1300, color: "#bae1ff", buildingType: 'friend' },
  School: { id: 5, name: "School", variant: 'max', x: 1200, y: 800, color: "#c9a0dc", buildingType: 'school' },
};

// Trees scattered around the world
const TREES = [
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

export default function App() {
  // API integration
  const {
    challenges,
    userProgress,
    currentChallenge,
    isLoading,
    error,
    submitChoice,
    resetGame,
  } = useGameApi();

  // Player state - starts in center of world
  const [playerX, setPlayerX] = useState(WORLD_WIDTH / 2);
  const [playerY, setPlayerY] = useState(WORLD_HEIGHT / 2);
  const [isMoving, setIsMoving] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  // Camera state - follows the player
  const [cameraX, setCameraX] = useState(WORLD_WIDTH / 2 - window.innerWidth / 2);
  const [cameraY, setCameraY] = useState(WORLD_HEIGHT / 2 - window.innerHeight / 2);

  // Trust level based on score (convert score to 0-100 scale)
  const trustLevel = userProgress ? Math.min(100, 50 + userProgress.total_score) : 50;

  // Build villagers array from challenges and config
  const villagers = challenges.map((challenge) => {
    const config = VILLAGER_CONFIG[challenge.location];
    if (!config) return null;

    const isActive = currentChallenge?.level === challenge.level;
    return {
      id: config.id,
      name: config.name,
      variant: config.variant,
      x: config.x,
      y: config.y,
      color: config.color,
      isActive,
      buildingType: config.buildingType,
    };
  }).filter((v): v is NonNullable<typeof v> => v !== null);

  const [nearbyVillager, setNearbyVillager] = useState<number | null>(null);

  // Decorations with positions
  const [decorations, setDecorations] = useState<Array<{ x: number; y: number; emoji: string }>>([]);

  // Modal states
  const [showConversation, setShowConversation] = useState(false);
  const [activeVillager, setActiveVillager] = useState<number | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [feedbackEffect, setFeedbackEffect] = useState<'safe' | 'unsafe' | null>(null);

  // Last answer result for reflection
  const [lastAnswerResult, setLastAnswerResult] = useState<{
    correct: boolean;
    feedback: string;
    topic: string;
  } | null>(null);

  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [movementControl, setMovementControl] = useState<'arrows' | 'wasd'>('arrows');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Update camera to follow player smoothly
  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let targetCameraX = playerX - screenWidth / 2;
    let targetCameraY = playerY - screenHeight / 2;

    targetCameraX = Math.max(0, Math.min(WORLD_WIDTH - screenWidth, targetCameraX));
    targetCameraY = Math.max(0, Math.min(WORLD_HEIGHT - screenHeight, targetCameraY));

    setCameraX(targetCameraX);
    setCameraY(targetCameraY);
  }, [playerX, playerY]);

  // Keyboard movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === 'e' && nearbyVillager && !showConversation) {
        handleVillagerClick(nearbyVillager);
        return;
      }

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

  // Update player position
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

  // Handle choice - directly use trust/question/reject
  const handleChoice = async (choice: Choice) => {
    setShowConversation(false);

    if (!currentChallenge) return;

    const result = await submitChoice(choice);

    if (result) {
      const isCorrect = result.correct;

      // Show feedback effect
      setFeedbackEffect(isCorrect ? 'safe' : 'unsafe');
      setTimeout(() => setFeedbackEffect(null), 600);

      // Store result for reflection
      setLastAnswerResult({
        correct: isCorrect,
        feedback: result.feedback,
        topic: result.topic,
      });

      // Show reflection
      setTimeout(() => {
        setShowReflection(true);
      }, 700);
    }
  };

  const handleReflectionClose = () => {
    setShowReflection(false);

    // Check if game is completed
    const totalLevels = userProgress?.total_levels || challenges.length;
    const isGameComplete = userProgress && userProgress.current_level > totalLevels;

    if (isGameComplete) {
      setTimeout(() => {
        setShowReward(true);
      }, 300);
    } else {
      // Add decoration near the completed villager
      const completedVillager = villagers.find(v => v.isActive);
      if (completedVillager && lastAnswerResult?.correct) {
        const decorationEmojis = ['🌱', '🏮', '⛲', '🌳', '🌺'];
        const level = userProgress?.current_level || 1;
        setDecorations((prev) => [
          ...prev,
          {
            x: completedVillager.x + 80,
            y: completedVillager.y + 60,
            emoji: decorationEmojis[(level - 1) % decorationEmojis.length]
          }
        ]);
      }
    }
  };

  const handleRewardClose = async () => {
    setShowReward(false);
    await resetGame();
    setDecorations([]);
  };

  // Get current villager for modals
  const currentVillager = villagers.find((v) => v.id === activeVillager);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-sky-300 to-green-400">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🏰</div>
          <p className="text-xl text-white font-semibold">Loading TrustTown...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-sky-300 to-green-400">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-xl text-red-600 font-semibold mb-4">Connection Error</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Make sure the backend server is running on port 5000</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        trees={TREES}
      />

      {/* Settings button */}
      <SettingsButton onClick={() => setShowSettings(true)} />

      {/* Conversation modal */}
      {currentVillager && currentChallenge && (
        <ConversationModal
          isOpen={showConversation}
          villagerName={currentVillager.name}
          villagerVariant={currentVillager.variant}
          villagerMood={currentChallenge.mood}
          message={{
            type: 'text',
            content: currentChallenge.question,
          }}
          choices={currentChallenge.choices}
          onTrust={() => handleChoice('trust')}
          onQuestion={() => handleChoice('question')}
          onReject={() => handleChoice('reject')}
        />
      )}

      {/* Reflection overlay */}
      {lastAnswerResult && (
        <ReflectionOverlay
          isOpen={showReflection}
          title={lastAnswerResult.topic}
          message={lastAnswerResult.feedback}
          onClose={handleReflectionClose}
        />
      )}

      {/* Reward screen */}
      <RewardScreen
        isOpen={showReward}
        badgeName="Guardian of TrustTown"
        badgeEmoji="🛡️"
        xpGained={userProgress?.total_score || 0}
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
