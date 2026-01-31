import { motion } from "framer-motion";

export function TreeAsset({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizes = { small: 40, medium: 60, large: 80 };
  const s = sizes[size];
  
  return (
    <svg viewBox="0 0 60 80" style={{ width: s, height: s * 1.33 }}>
      {/* Trunk */}
      <rect x="24" y="50" width="12" height="30" rx="2" fill="#8b4513" stroke="#2c2c2c" strokeWidth="2" />
      
      {/* Leaves - three layers */}
      <ellipse cx="30" cy="45" rx="20" ry="15" fill="#4a7c59" stroke="#2c2c2c" strokeWidth="2" />
      <ellipse cx="30" cy="35" rx="18" ry="14" fill="#5a9c69" stroke="#2c2c2c" strokeWidth="2" />
      <ellipse cx="30" cy="25" rx="15" ry="12" fill="#6bbd79" stroke="#2c2c2c" strokeWidth="2" />
      
      {/* Highlight */}
      <ellipse cx="25" cy="28" rx="5" ry="4" fill="#8dd99d" opacity="0.6" />
    </svg>
  );
}

export function FlowerAsset({ color = '#ff69b4' }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      {/* Petals */}
      <circle cx="12" cy="8" r="3" fill={color} stroke="#2c2c2c" strokeWidth="1" />
      <circle cx="16" cy="12" r="3" fill={color} stroke="#2c2c2c" strokeWidth="1" />
      <circle cx="12" cy="16" r="3" fill={color} stroke="#2c2c2c" strokeWidth="1" />
      <circle cx="8" cy="12" r="3" fill={color} stroke="#2c2c2c" strokeWidth="1" />
      
      {/* Center */}
      <circle cx="12" cy="12" r="2.5" fill="#ffd700" stroke="#2c2c2c" strokeWidth="1" />
      
      {/* Stem */}
      <rect x="11" y="14" width="2" height="8" fill="#4a7c59" stroke="#2c2c2c" strokeWidth="1" />
    </svg>
  );
}

export function RockAsset({ variant = 1 }: { variant?: 1 | 2 | 3 }) {
  const shapes = {
    1: "M 10 20 L 5 15 L 8 8 L 16 5 L 24 8 L 27 15 L 22 20 Z",
    2: "M 8 20 L 4 14 L 6 7 L 14 4 L 22 7 L 26 14 L 20 20 Z",
    3: "M 12 20 L 6 16 L 7 9 L 15 6 L 23 9 L 25 16 L 18 20 Z",
  };

  return (
    <svg viewBox="0 0 32 24" className="w-8 h-6">
      <path d={shapes[variant]} fill="#9ca3af" stroke="#2c2c2c" strokeWidth="2" />
      <ellipse cx="14" cy="12" rx="4" ry="3" fill="#b8bfc7" opacity="0.5" />
    </svg>
  );
}

export function BushAsset() {
  return (
    <svg viewBox="0 0 48 32" className="w-12 h-8">
      <ellipse cx="12" cy="20" rx="10" ry="10" fill="#5a9c69" stroke="#2c2c2c" strokeWidth="2" />
      <ellipse cx="24" cy="16" rx="12" ry="12" fill="#6bbd79" stroke="#2c2c2c" strokeWidth="2" />
      <ellipse cx="36" cy="20" rx="10" ry="10" fill="#5a9c69" stroke="#2c2c2c" strokeWidth="2" />
      <ellipse cx="20" cy="22" rx="6" ry="4" fill="#8dd99d" opacity="0.6" />
    </svg>
  );
}

export function SignAsset({ text }: { text: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-16 h-16">
      {/* Post */}
      <rect x="28" y="20" width="8" height="44" rx="2" fill="#8b4513" stroke="#2c2c2c" strokeWidth="2" />
      
      {/* Sign board */}
      <rect x="8" y="8" width="48" height="20" rx="4" fill="#d4a574" stroke="#2c2c2c" strokeWidth="2" />
      
      {/* Text background */}
      <rect x="12" y="12" width="40" height="12" rx="2" fill="#f5deb3" />
      
      {/* Simple text representation */}
      <text x="32" y="21" fontSize="8" textAnchor="middle" fill="#2c2c2c" fontFamily="sans-serif" fontWeight="bold">
        {text}
      </text>
    </svg>
  );
}

export function BenchAsset() {
  return (
    <svg viewBox="0 0 64 32" className="w-16 h-8">
      {/* Seat */}
      <rect x="8" y="12" width="48" height="6" rx="2" fill="#8b4513" stroke="#2c2c2c" strokeWidth="2" />
      
      {/* Back */}
      <rect x="8" y="4" width="48" height="4" rx="2" fill="#8b4513" stroke="#2c2c2c" strokeWidth="2" />
      
      {/* Supports */}
      <rect x="12" y="8" width="3" height="8" fill="#6b3410" stroke="#2c2c2c" strokeWidth="1" />
      <rect x="49" y="8" width="3" height="8" fill="#6b3410" stroke="#2c2c2c" strokeWidth="1" />
      
      {/* Legs */}
      <rect x="12" y="18" width="3" height="14" fill="#6b3410" stroke="#2c2c2c" strokeWidth="1" />
      <rect x="49" y="18" width="3" height="14" fill="#6b3410" stroke="#2c2c2c" strokeWidth="1" />
    </svg>
  );
}

export function LampPostAsset({ isGlowing = true }: { isGlowing?: boolean }) {
  return (
    <svg viewBox="0 0 32 80" className="w-8 h-20">
      {/* Glow effect - simplified */}
      {isGlowing && (
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="#ffd89b"
          opacity="0.2"
        />
      )}
      
      {/* Lamp */}
      <path d="M 10 20 L 8 12 L 24 12 L 22 20 Z" fill="#2c2c2c" stroke="#2c2c2c" strokeWidth="2" />
      <rect x="12" y="14" width="8" height="6" fill={isGlowing ? "#fff9e6" : "#e0e0e0"} />
      
      {/* Pole */}
      <rect x="14" y="20" width="4" height="60" fill="#4a5568" stroke="#2c2c2c" strokeWidth="2" />
      
      {/* Base */}
      <rect x="10" y="76" width="12" height="4" rx="1" fill="#2c2c2c" />
    </svg>
  );
}

export function FountainAsset() {
  return (
    <svg viewBox="0 0 80 60" className="w-20 h-15">
      {/* Base pool */}
      <ellipse cx="40" cy="50" rx="35" ry="8" fill="#87ceeb" stroke="#2c2c2c" strokeWidth="2" />
      <ellipse cx="40" cy="48" rx="35" ry="6" fill="#a8d8f0" />
      
      {/* Center pillar */}
      <rect x="35" y="30" width="10" height="20" fill="#9ca3af" stroke="#2c2c2c" strokeWidth="2" />
      
      {/* Top bowl */}
      <ellipse cx="40" cy="30" rx="15" ry="6" fill="#87ceeb" stroke="#2c2c2c" strokeWidth="2" />
      <ellipse cx="40" cy="28" rx="15" ry="4" fill="#a8d8f0" />
      
      {/* Water drops */}
      <motion.circle cx="40" cy="22" r="2" fill="#87ceeb"
        animate={{ y: [22, 35], opacity: [1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.circle cx="35" cy="22" r="1.5" fill="#87ceeb"
        animate={{ y: [22, 35], opacity: [1, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
      />
      <motion.circle cx="45" cy="22" r="1.5" fill="#87ceeb"
        animate={{ y: [22, 35], opacity: [1, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
      />
    </svg>
  );
}
