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
  const SCALE = 3.5; // Scale up 3.5x for visibility (56x56 display size)
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
  
  // Dynamic shadow based on direction
  const getShadowStyle = () => {
    const baseWidth = displaySize * 0.5;
    const baseHeight = displaySize * 0.2;
    
    switch (direction) {
      case 'up':
        // Moving away - small shadow below
        return {
          position: 'bottom',
          width: `${baseWidth * 0.7}px`,
          height: `${baseHeight * 1.2}px`,
          transform: 'translateX(-50%) translateY(2px)',
        };
      case 'down':
        // Moving toward - small shadow above (same as up but at top)
        return {
          position: 'top',
          width: `${baseWidth * 0.7}px`,
          height: `${baseHeight * 1.2}px`,
          transform: 'translateX(-50%) translateY(-2px)',
        };
      case 'left':
        // Moving left - shadow offset right
        return {
          position: 'bottom',
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: 'translateX(-40%) skewX(10deg)',
        };
      case 'right':
        // Moving right - shadow offset left
        return {
          position: 'bottom',
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: 'translateX(-60%) skewX(-10deg)',
        };
      default:
        return {
          position: 'bottom',
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: 'translateX(-50%)',
        };
    }
  };
  
  const shadowStyle = getShadowStyle();
  const { position, ...shadowCSS } = shadowStyle;
  
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
        className="absolute left-1/2 bg-black/20 rounded-full transition-all duration-150"
        style={{
          [position as string]: 0,
          ...shadowCSS
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