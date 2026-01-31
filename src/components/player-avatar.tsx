import { CharacterSprite } from "./assets/character-sprite";

interface PlayerAvatarProps {
  x: number;
  y: number;
  isMoving: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function PlayerAvatar({ x, y, isMoving, direction = 'down' }: PlayerAvatarProps) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: Math.floor(y), // Dynamic z-index based on Y position for proper layering
      }}
    >
      <CharacterSprite isMoving={isMoving} direction={direction} />
    </div>
  );
}
