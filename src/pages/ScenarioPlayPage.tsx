import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { MessageBubble } from '../components/MessageBubble';
import { ActionButton } from '../components/ActionButton';
import { FeedbackModal } from '../components/FeedbackModal';
import { scenarios, badges } from '../data/scenarios';
import { useGameState } from '../hooks/useGameState';
import { useSound } from '../hooks/useSound';

interface ScenarioPlayPageProps {
  scenarioId: string;
  onComplete: () => void;
  onBack: () => void;
}

export function ScenarioPlayPage({ scenarioId, onComplete, onBack }: ScenarioPlayPageProps) {
  const scenario = scenarios.find((s) => s.id === scenarioId);
  const { addXP, completeScenario, unlockBadge, badges: unlockedBadges } = useGameState();
  const { playSound } = useSound();
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    playSound('notification');
  }, []);

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Scenario not found</p>
          <button onClick={onBack} className="mt-4 text-purple-600 hover:text-purple-700">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const handleAction = (actionId: string) => {
    const action = scenario.actions.find((a) => a.id === actionId);
    if (!action) return;

    setSelectedAction(actionId);
    setIsCorrect(action.isCorrect);

    if (action.isCorrect) {
      playSound('correct');
      addXP(scenario.xpReward);
      completeScenario(scenario.id);
      
      // Unlock badge if applicable
      if (scenario.badgeId && !unlockedBadges.includes(scenario.badgeId)) {
        unlockBadge(scenario.badgeId);
        setTimeout(() => playSound('badge'), 500);
      }
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      setShowFeedback(true);
    }, 300);
  };

  const handleRetry = () => {
    setShowFeedback(false);
    setSelectedAction(null);
    setIsCorrect(false);
    playSound('click');
  };

  const handleNext = () => {
    playSound('transition');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Scenarios</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{scenario.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {scenario.title}
              </h1>
              <p className="text-sm text-gray-600">{scenario.skill}</p>
            </div>
          </div>
        </motion.div>

        {/* Phone UI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-[3rem] p-4 shadow-2xl mb-6"
        >
          {/* Phone Screen */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden">
            {/* Status Bar */}
            <div className="bg-gray-100 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-600">Incoming Message</span>
              </div>
              <div className="text-xs text-gray-600">9:41 AM</div>
            </div>

            {/* Messages Area */}
            <div className="p-6 min-h-[400px] bg-gradient-to-b from-blue-50 to-white space-y-4">
              {scenario.messages.map((message, index) => (
                <MessageBubble key={index} message={message} index={index} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <div className="text-center mb-4">
            <p className="text-lg font-semibold text-gray-800">What do you do?</p>
          </div>

          {scenario.actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <ActionButton
                onClick={() => handleAction(action.id)}
                variant={selectedAction === action.id ? 'primary' : 'secondary'}
                disabled={selectedAction !== null}
              >
                {action.label}
              </ActionButton>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        isCorrect={isCorrect}
        feedback={isCorrect ? scenario.correctFeedback : scenario.wrongFeedback}
        scamSignals={scenario.scamSignals}
        xpEarned={isCorrect ? scenario.xpReward : 0}
        onNext={handleNext}
        onRetry={handleRetry}
      />
    </div>
  );
}
