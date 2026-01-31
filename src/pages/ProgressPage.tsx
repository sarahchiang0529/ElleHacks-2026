import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Target, Award } from 'lucide-react';
import { BadgeCard } from '../components/BadgeCard';
import { ProgressBar } from '../components/ProgressBar';
import { useGameState } from '../hooks/useGameState';
import { scenarios, badges } from '../data/scenarios';

interface ProgressPageProps {
  onBack: () => void;
}

export function ProgressPage({ onBack }: ProgressPageProps) {
  const { xp, completedScenarios, badges: unlockedBadges } = useGameState();

  const totalXP = scenarios.reduce((sum, s) => sum + s.xpReward, 0);
  const completionRate = Math.round((completedScenarios.length / scenarios.length) * 100);

  // Skills learned based on completed scenarios
  const skillsLearned = scenarios
    .filter((s) => completedScenarios.includes(s.id))
    .map((s) => s.skill);
  const uniqueSkills = [...new Set(skillsLearned)];

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
            <span>Back</span>
          </button>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your Progress
          </h1>
          <p className="text-gray-600">Keep up the great work! 🌟</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-3xl font-bold text-gray-800">{xp}</span>
            </div>
            <p className="text-sm text-gray-600">Total XP Earned</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-gray-800">{completionRate}%</span>
            </div>
            <p className="text-sm text-gray-600">Scenarios Complete</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-8 h-8 text-purple-500" />
              <span className="text-3xl font-bold text-gray-800">{unlockedBadges.length}</span>
            </div>
            <p className="text-sm text-gray-600">Badges Earned</p>
          </div>
        </motion.div>

        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">XP Progress</h2>
          <ProgressBar current={xp} max={totalXP} showValues />
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                unlocked={unlockedBadges.includes(badge.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Skills Learned */}
        {uniqueSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills Mastered</h2>
            <div className="flex flex-wrap gap-3">
              {uniqueSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-full"
                >
                  <span className="text-sm font-medium text-purple-700">✓ {skill}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Encouragement */}
        {completedScenarios.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-2xl text-center"
          >
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Ready to Start?
            </h3>
            <p className="text-gray-600">
              Complete scenarios to earn XP, unlock badges, and master scam-spotting skills!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
