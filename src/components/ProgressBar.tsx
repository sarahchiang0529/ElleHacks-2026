import { motion } from 'motion/react';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showValues?: boolean;
}

export function ProgressBar({ current, max, label, showValues = true }: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full">
      {(label || showValues) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-gray-600">{label}</span>}
          {showValues && (
            <span className="text-sm font-medium text-purple-600">
              {current} / {max} XP
            </span>
          )}
        </div>
      )}
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
