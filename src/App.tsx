import { useState, useEffect, useCallback, useRef } from "react";
import { TownView } from "./components/town-view";
import { ConversationModal } from "./components/conversation-modal";
import { ReflectionOverlay } from "./components/reflection-overlay";
import { RewardScreen } from "./components/reward-screen";
import { SettingsModal, SettingsButton } from "./components/settings-modal";
import { MAX, LILY, SALLY, BOB, ZOE, NARRATOR_VOICE } from "./backend/Constants";
import { createAndSaveAudio } from "./backend/PlayAudio";
import { soundManager } from "./utils/sounds";

interface Scenario {
  id: number;
  villagerId: number;
  message: string,
  correctAnswer: 'trust' | 'question' | 'reject';
  mood: 'neutral' | 'worried' | 'happy';
  reflection: {
    title: string;
    correctMessage: string;
    incorrectMessage: string;
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
    message: "You have $80 in your pocket. Your favorite game is going on sale next week. Do you spend the money or do you save it by depositing it at the bank?",
    correctAnswer: 'reject',
    mood: 'worried',
    reflection: {
      title: "Delayed Gratification",
      correctMessage: "Great job! Saving your money in a bank will give you interest which gives you more money! Delayed gratification truly pays off!",
      incorrectMessage: "Hmmmm. You bought yourself a new game, but you missed out on an excellent saving deal at the bank."
    },
  },
  {
    id: 2,
    villagerId: 2,
    message: "There's a cool new backpack on sale for only $30! But you really need to save money to buy your friend's birthday gift. Do you buy the backpack?",
    correctAnswer: 'reject',
    mood: 'neutral',
    reflection: {
      title: "Needs vs Wants",
      correctMessage: "Good job! You balanced needs and wants perfectly! Even though a new backpack sounds fun, it is a want, not a need. Besides, you need $30 for your friend's gift.",
      incorrectMessage: "Not quite. Think about if a new backpack is a need in your life right now."
    },
  },
  {
    id: 3,
    villagerId: 3,
    message: "You're getting a phone call. Pick up the phone.",
    correctAnswer: 'reject',
    mood: 'worried',
    reflection: {
      title: "Scam Detection",
      correctMessage: "Excellent! You recognized a scam! Strangers that ask for personal details are not to be trusted. Always tell an adult about suspicious messages.",
      incorrectMessage: "Excellent! You recognized a scam! Strangers that ask for personal details are not to be trusted. Always tell an adult about suspicious messages."
    },
  },
  {
    id: 4,
    villagerId: 4,
    message: "Wait, stop! I just got a text—it's my grandma! She's been rushed to the hospital and needs money for surgery right now. Please, I'm begging you, can you lend me some money? I'll pay you back, I promise!",
    correctAnswer: 'reject',
    mood: 'neutral',
    reflection: {
      title: "The Urgent Request",
      correctMessage: "Excellent judgment! High-pressure emergencies are a classic tactic used by scammers. By pausing, you've protected your finances. Max will understand that you need to verify the situation before acting.",
      incorrectMessage: "Watch out! This is a common scam, Even if the message looks like it's from Max's grandma, her account could be hacked. Always verify the emergency through a direct phone call before sending money."
    },
  },
  {
    id: 5,
    villagerId: 5,
    message: "Everyone's buying $90 sneakers. But you're saving $100 for a new art tablet. What do you do? Do you buy sneakers?",
    correctAnswer: 'reject',
    mood: 'happy',
    reflection: {
      title: "Peer Pressure",
      correctMessage: "Amazing! You stayed true to your goals despite peer pressure. The art tablet will help you create for years. That's real financial wisdom!",
      incorrectMessage: "Peer pressure can be a really money stealer. Beware of falling for trends and focus on spending money wisely."
    },
  },
];

export default function App() {
  // Player state - starts in center of world
  const [playerX, setPlayerX] = useState(WORLD_WIDTH / 2);
  const [playerY, setPlayerY] = useState(WORLD_HEIGHT / 2);
  const [isMoving, setIsMoving] = useState(false);
  const [playerDirection, setPlayerDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  // Camera state - follows the player
  const [cameraX, setCameraX] = useState(WORLD_WIDTH / 2 - window.innerWidth / 2);
  const [cameraY, setCameraY] = useState(WORLD_HEIGHT / 2 - window.innerHeight / 2);

  // Game state
  const [trustLevel, setTrustLevel] = useState(50);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  
  // Buildings positioned around the world (matching financial literacy challenges)
  const [villagers, setVillagers] = useState([
    { id: 1, name: "Bank", variant: 'bob' as const, voice: BOB, x: 600, y: 400, color: "#d4af37", isActive: true, buildingType: 'bank' as const },
    { id: 2, name: "Store", variant: 'sally' as const, voice: SALLY, x: 1800, y: 500, color: "#ff9966", isActive: false, buildingType: 'store' as const },
    { id: 3, name: "Lily's House", variant: 'lily' as const, voice: LILY, x: 400, y: 1200, color: "#ffb3ba", isActive: false, buildingType: 'phone' as const },
    { id: 4, name: "Max's House", variant: 'max' as const, voice: MAX, x: 1400, y: 1300, color: "#bae1ff", isActive: false, buildingType: 'friend' as const },
    { id: 5, name: "School", variant: 'zoe' as const, voice: ZOE, x: 1200, y: 800, color: "#c9a0dc", isActive: false, buildingType: 'school' as const },
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
  const [showScamCall, setShowScamCall] = useState(false);
  const [scamcallAnswered, setScamcallAnswered] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [feedbackEffect, setFeedbackEffect] = useState<'safe' | 'unsafe' | null>(null);
  const [correctChoice, setCorrectChoice] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const isTalkingRef = useRef(false); // Ref for immediate lock (avoids race with setState)

  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [movementControl, setMovementControl] = useState<'arrows' | 'wasd'>('arrows');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Sync sound manager with settings
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // When showScamCall: unhide #scamcall, full-screen overlay; add shake only until answered (clicked)
  useEffect(() => {
    const el = document.getElementById("scamcall");
    if (!el) return;
    if (showScamCall) {
      el.hidden = false;
      el.classList.add("scamcall-visible");
      if (!scamcallAnswered) el.classList.add("scamcall-shake");
      else el.classList.remove("scamcall-shake");
    } else {
      el.hidden = true;
      el.classList.remove("scamcall-visible", "scamcall-shake");
    }
  }, [showScamCall, scamcallAnswered]);

  const scamcallAnsweredRef = useRef(false);
  scamcallAnsweredRef.current = scamcallAnswered;

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
      
      // Handle E key for interaction (ignore key repeat to prevent duplicate audio)
      if (key === 'e' && nearbyVillager && !showConversation) {
        e.preventDefault();
        soundManager.play('door');
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
        soundManager.stopWalking();
        return;
      }

      // Play walking sound when moving
      soundManager.startWalking();

      // Determine direction based on keys pressed
      // Priority: vertical first, then horizontal
      if (keysPressed.has('arrowup') || keysPressed.has('w')) {
        setPlayerDirection('up');
      } else if (keysPressed.has('arrowdown') || keysPressed.has('s')) {
        setPlayerDirection('down');
      } else if (keysPressed.has('arrowleft') || keysPressed.has('a')) {
        setPlayerDirection('left');
      } else if (keysPressed.has('arrowright') || keysPressed.has('d')) {
        setPlayerDirection('right');
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

  const handleVillagerClick = async (villagerId: number) => {
    const villager = villagers.find((v) => v.id === villagerId);
    if (!villager || !villager.isActive) return;
    if (isTalkingRef.current) return; // Immediate lock - prevents echo from rapid/key-repeat calls
    isTalkingRef.current = true;
    setIsTalking(true);

    setActiveVillager(villagerId);

    try {
      const audio = await createAndSaveAudio(currentScenario.message, villager.voice);

      setShowConversation(true);
      setCorrectChoice(false);

      // For villagerId 3 (scam call): when message finishes, close modal and show scamcall (ring + shake)
      if (currentScenario.villagerId === 3 && audio) {
        audio.addEventListener("ended", () => {
          setShowConversation(false);
          setScamcallAnswered(false);
          setShowScamCall(true);
          soundManager.play("ring");
        });
      }
    } catch (error) {
      console.error("Audio failed", error);
    } finally {
      isTalkingRef.current = false;
      setIsTalking(false);
    }
  };

  const handleChoice = (choice: 'trust' | 'question' | 'reject') => {
    setShowConversation(false);

    const isCorrect = choice === currentScenario.correctAnswer;

    // Play sound effect
    soundManager.play(isCorrect ? 'correct' : 'wrong');

    // Show feedback effect
    setFeedbackEffect(isCorrect ? 'safe' : 'unsafe');
    setTimeout(() => setFeedbackEffect(null), 600);

    // Update trust level
    if (isCorrect) {
      setTrustLevel((prev) => Math.min(100, prev + 15));
      setCorrectChoice(true);
    } else {
      setTrustLevel((prev) => Math.max(0, prev - 10));
    }

    // For villagerId 3 (scam call): if user clicked a choice before TTS ended, show scamcall now
    if (currentScenario.villagerId === 3) {
      setTimeout(() => {
        setScamcallAnswered(false);
        setShowScamCall(true);
        soundManager.play("ring");
      }, 700);
      return;
    }

    // Show reflection and have narrator read the message
    const reflectionMessage = isCorrect ? currentScenario.reflection.correctMessage : currentScenario.reflection.incorrectMessage;
    setTimeout(() => {
      setShowReflection(true);
      createAndSaveAudio(reflectionMessage, NARRATOR_VOICE).catch((err) => console.error("Reflection audio failed", err));
    }, 700);
  };

  const handleEndCall = () => {
    setShowScamCall(false);
    setScamcallAnswered(false);
    soundManager.stop("ring");
    if (!currentScenario) return;
    const reflectionMessage = correctChoice
      ? currentScenario.reflection.correctMessage
      : currentScenario.reflection.incorrectMessage;
    setShowReflection(true);
    createAndSaveAudio(reflectionMessage, NARRATOR_VOICE).catch((err) =>
      console.error("Reflection audio failed", err)
    );
  };

  const handleEndCallRef = useRef(handleEndCall);
  handleEndCallRef.current = handleEndCall;

  // When scamcall is shown: first click stops the shake (answered), second click hides and shows Reflection
  useEffect(() => {
    if (!showScamCall) return;
    const el = document.getElementById("scamcall");
    if (!el) return;
    const onScamcallClick = () => {
      if (scamcallAnsweredRef.current) {
        handleEndCallRef.current();
      } else {
        setScamcallAnswered(true);
      }
    };
    el.addEventListener("click", onScamcallClick);
    return () => el.removeEventListener("click", onScamcallClick);
  }, [showScamCall]);

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

  return (
    <div className="relative">
      {/* Town view */}
      <TownView
        playerX={playerX}
        playerY={playerY}
        cameraX={cameraX}
        cameraY={cameraY}
        isMoving={isMoving}
        playerDirection={playerDirection}
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
          message={correctChoice ? currentScenario.reflection.correctMessage : currentScenario.reflection.incorrectMessage}
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