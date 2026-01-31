import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Scenario } from '../types/game';

interface ScenarioCardProps {
  scenario: Scenario;
  completed: boolean;
  onClick: () => void;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-700 border-green-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  hard: 'bg-red-100 text-red-700 border-red-300',
};

const difficultyEmojis = {
  easy: '🟢',
  medium: '🟡',
  hard: '🔴',
};

export function ScenarioCard({ scenario, completed, onClick }: ScenarioCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-full p-6 bg-white rounded-2xl border-2 border-gray-200 shadow-md text-left transition-all hover:shadow-xl hover:border-purple-300"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {completed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-lg"
        >
          <CheckCircle2 className="w-5 h-5 text-white" />
        </motion.div>
      )}

      <div className="flex items-start gap-4">
        <div className="text-5xl">{scenario.emoji}</div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-2">
            {scenario.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3">
            {scenario.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${difficultyColors[scenario.difficulty]}`}>
              {difficultyEmojis[scenario.difficulty]} {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
            </span>
            
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-300">
              💡 {scenario.skill}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
