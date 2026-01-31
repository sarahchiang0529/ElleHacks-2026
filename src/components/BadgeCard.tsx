import * as React from "react";
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { Badge } from '../types/game';

interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
  animate?: boolean;
  key?: React.Key;
}

export function BadgeCard({ badge, unlocked, animate = false }: BadgeCardProps) {
  return (
    <motion.div
      className={`relative p-4 rounded-xl border-2 transition-all ${
        unlocked
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
          : 'bg-gray-50 border-gray-200 opacity-60'
      }`}
      initial={animate ? { scale: 0, rotate: -180 } : false}
      animate={animate ? { scale: 1, rotate: 0 } : {}}
      transition={{ type: 'spring', duration: 0.8 }}
      whileHover={unlocked ? { scale: 1.05, y: -5 } : {}}
    >
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 rounded-xl backdrop-blur-[1px]">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>
      )}
      
      <div className="text-center">
        <div className="text-4xl mb-2">{badge.emoji}</div>
        <h3 className="font-semibold text-gray-800 mb-1">{badge.name}</h3>
        <p className="text-xs text-gray-600">{badge.description}</p>
      </div>

      {animate && unlocked && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={{ boxShadow: '0 0 0 0 rgba(251, 191, 36, 0.7)' }}
          animate={{ boxShadow: '0 0 0 20px rgba(251, 191, 36, 0)' }}
          transition={{ duration: 1 }}
        />
      )}
    </motion.div>
  );
}
