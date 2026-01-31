import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { ScenarioCard } from '../components/ScenarioCard';
import { ProgressBar } from '../components/ProgressBar';
import { scenarios } from '../data/scenarios';
import { useGameState } from '../hooks/useGameState';
import { useSound } from '../hooks/useSound';

interface ScenarioSelectPageProps {
  onSelectScenario: (scenarioId: string) => void;
  onBack: () => void;
}

export function ScenarioSelectPage({ onSelectScenario, onBack }: ScenarioSelectPageProps) {
  const { xp, completedScenarios } = useGameState();
  const { playSound } = useSound();

  const handleSelect = (scenarioId: string) => {
    playSound('click');
    onSelectScenario(scenarioId);
  };

  const totalXP = scenarios.reduce((sum, s) => sum + s.xpReward, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Choose Your Mission
          </h1>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md">
            <ProgressBar current={xp} max={totalXP} label="Total Progress" />
            <div className="mt-3 text-sm text-gray-600">
              Completed: {completedScenarios.length} / {scenarios.length} scenarios
            </div>
          </div>
        </motion.div>

        {/* Scenarios Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <ScenarioCard
                scenario={scenario}
                completed={completedScenarios.includes(scenario.id)}
                onClick={() => handleSelect(scenario.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Encouragement Message */}
        {completedScenarios.length === scenarios.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl text-center"
          >
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Training Complete!
            </h2>
            <p className="text-gray-600">
              You've mastered all scenarios! Feel free to replay them to sharpen your skills.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
