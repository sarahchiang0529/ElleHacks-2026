import { motion } from "motion/react";

interface CharacterSpriteProps {
  isMoving: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  color?: string;
}

export function CharacterSprite({ isMoving, direction = 'down', color = '#8296d4' }: CharacterSpriteProps) {
  return (
    <div className="relative w-12 h-16">
      {/* Shadow */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/20 rounded-full"
        animate={{ scale: isMoving ? [1, 0.8, 1] : 1 }}
        transition={{ duration: 0.3, repeat: isMoving ? Infinity : 0 }}
      />
      
      {/* Body */}
      <svg viewBox="0 0 48 64" className="w-full h-full">
        {/* Head */}
        <circle cx="24" cy="16" r="10" fill="#ffd4a8" stroke="#2c2c2c" strokeWidth="2" />
        
        {/* Eyes */}
        <circle cx="20" cy="15" r="1.5" fill="#2c2c2c" />
        <circle cx="28" cy="15" r="1.5" fill="#2c2c2c" />
        
        {/* Smile */}
        <path d="M 19 18 Q 24 20 29 18" stroke="#2c2c2c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        
        {/* Body */}
        <rect x="16" y="26" width="16" height="20" rx="8" fill={color} stroke="#2c2c2c" strokeWidth="2" />
        
        {/* Arms */}
        <motion.rect
          x="10"
          y="28"
          width="5"
          height="12"
          rx="2.5"
          fill={color}
          stroke="#2c2c2c"
          strokeWidth="2"
          animate={isMoving ? { rotate: [0, -15, 0, 15, 0] } : {}}
          transition={{ duration: 0.6, repeat: isMoving ? Infinity : 0 }}
          style={{ transformOrigin: '12px 28px' }}
        />
        <motion.rect
          x="33"
          y="28"
          width="5"
          height="12"
          rx="2.5"
          fill={color}
          stroke="#2c2c2c"
          strokeWidth="2"
          animate={isMoving ? { rotate: [0, 15, 0, -15, 0] } : {}}
          transition={{ duration: 0.6, repeat: isMoving ? Infinity : 0 }}
          style={{ transformOrigin: '36px 28px' }}
        />
        
        {/* Legs */}
        <motion.rect
          x="18"
          y="46"
          width="5"
          height="14"
          rx="2.5"
          fill="#6b4423"
          stroke="#2c2c2c"
          strokeWidth="2"
          animate={isMoving ? { y: [46, 48, 46] } : {}}
          transition={{ duration: 0.3, repeat: isMoving ? Infinity : 0 }}
        />
        <motion.rect
          x="25"
          y="46"
          width="5"
          height="14"
          rx="2.5"
          fill="#6b4423"
          stroke="#2c2c2c"
          strokeWidth="2"
          animate={isMoving ? { y: [46, 44, 46] } : {}}
          transition={{ duration: 0.3, repeat: isMoving ? Infinity : 0 }}
        />
      </svg>
    </div>
  );
}
