import { useState, useEffect } from 'react';
import playerSprite from "@/assets/playerSprite.png";


interface CharacterSpriteProps {
  isMoving: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  color?: string; // Kept for compatibility but not used
}

/**
 * CharacterSprite - Pixel-perfect sprite sheet animation
 * 
 * Sprite sheet layout (16x16 tiles):
 * - Row 0: Walk Down (6 frames)
 * - Row 1: Walk Down-Right (6 frames)
 * - Row 2: Walk Right (6 frames)
 * - Row 3: Walk Up-Right (6 frames)
 * - Row 4: Walk Up (6 frames)
 * - Row 5: Walk Up-Left (6 frames)
 * - Row 6: Walk Left (6 frames)
 * - Row 7: Walk Down-Left (6 frames)
 */
export function CharacterSprite({ 
  isMoving, 
  direction = 'down',
}: CharacterSpriteProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  
  // Sprite configuration
  const SPRITE_SIZE = 16; // Each sprite tile is 16x16 pixels
  const SCALE = 3; // Scale up 3x for visibility (48x48 display size)
  const FRAMES_PER_ROW = 6; // 6 animation frames per direction
  const FPS = 8; // Animation speed
  
  // Map directions to sprite sheet rows (corrected based on actual sprite sheet)
  const directionToRow: Record<string, number> = {
    'down': 0,  // Row 0 - confirmed working
    'up': 2,    // Row 2 - swapped from right
    'right': 4, // Row 4 - swapped from up
    'left': 4,  // Row 4 - same as right, but will be flipped
  };
  
  const row = directionToRow[direction];
  const shouldFlip = direction === 'left'; // Flip horizontally for left movement
  
  // Animate frames when moving
  useEffect(() => {
    if (!isMoving) {
      setCurrentFrame(0); // Idle frame
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % FRAMES_PER_ROW);
    }, 1000 / FPS);
    
    return () => clearInterval(interval);
  }, [isMoving]);
  
  const displaySize = SPRITE_SIZE * SCALE;
  
  return (
    <div 
      className="relative" 
      style={{ 
        width: `${displaySize}px`, 
        height: `${displaySize}px` 
      }}
    >
      {/* Shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/20 rounded-full transition-transform"
        style={{
          width: `${displaySize * 0.5}px`,
          height: `${displaySize * 0.2}px`,
          transform: `translateX(-50%) scale(${isMoving ? 0.9 : 1})`,
        }}
      />
      
      {/* Sprite */}
      <div
        style={{
          width: `${displaySize}px`,
          height: `${displaySize}px`,
          backgroundImage: `url(${playerSprite})`,
          backgroundPosition: `-${currentFrame * displaySize}px -${row * displaySize}px`,
          backgroundSize: `${FRAMES_PER_ROW * displaySize}px auto`,
          imageRendering: 'pixelated',
          position: 'relative',
          transform: shouldFlip ? 'scaleX(-1)' : 'none',
        }}
      />
    </div>
  );
}