import { motion } from "framer-motion";
import { CharacterSprite } from "./assets/character-sprite";

interface PlayerAvatarProps {
  x: number;
  y: number;
  isMoving: boolean;
}

export function PlayerAvatar({ x, y, isMoving }: PlayerAvatarProps) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        y: isMoving ? [0, -2, 0] : [0, -3, 0],
      }}
      transition={{
        duration: isMoving ? 0.3 : 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <CharacterSprite isMoving={isMoving} color="#8296d4" />
      
      {/* Movement sparkles */}
      {isMoving && (
        <>
          <motion.div
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            style={{ top: '50%', left: '-10px' }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            style={{ top: '50%', right: '-10px' }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
          />
        </>
      )}
    </motion.div>
  );
}
