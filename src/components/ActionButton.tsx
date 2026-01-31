import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  icon?: ReactNode;
}

export function ActionButton({
  children,
  onClick,
  variant = 'secondary',
  disabled = false,
  icon,
}: ActionButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-800 border-gray-300 hover:border-purple-400 hover:bg-purple-50',
    danger: 'bg-white text-red-600 border-red-300 hover:border-red-400 hover:bg-red-50',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 font-medium text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      {icon}
      {children}
    </motion.button>
  );
}
