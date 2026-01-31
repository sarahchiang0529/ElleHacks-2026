import { motion } from "motion/react";
import { PlayerAvatar } from "./player-avatar";
import { BuildingAsset } from "./building-asset";
import { TrustMeter } from "./trust-meter";
import { TreeDecoration } from "./tree-decoration";
import { PathSystem, createHorizontalPath, createVerticalPath } from "./path-system";

interface Building {
  id: number;
  name: string;
  variant: 'lily' | 'max' | 'zoe';
  x: number;
  y: number;
  color: string;
  isActive: boolean;
  buildingType: 'bank' | 'store' | 'phone' | 'friend' | 'school';
}

interface Tree {
  x: number;
  y: number;
  variant: number;
  scale: number;
}

interface TownViewProps {
  playerX: number;
  playerY: number;
  cameraX: number;
  cameraY: number;
  isMoving: boolean;
  villagers: Building[];
  nearbyVillager: number | null;
  trustLevel: number;
  onVillagerClick: (id: number) => void;
  feedbackEffect: 'safe' | 'unsafe' | null;
  decorations: Array<{ x: number; y: number; emoji: string }>;
  worldWidth: number;
  worldHeight: number;
  trees: Tree[];
}

export function TownView({
  playerX,
  playerY,
  cameraX,
  cameraY,
  isMoving,
  villagers,
  nearbyVillager,
  trustLevel,
  onVillagerClick,
  feedbackEffect,
  worldWidth,
  worldHeight,
  trees,
}: TownViewProps) {
  // Create path network connecting buildings
  // Bank (600, 400) -> Store (1800, 500) -> School (1200, 800) -> Lily's House (400, 1200) -> Max's House (1400, 1300)
  const pathTiles = [
    // Main horizontal path from Bank to Store
    ...createHorizontalPath(600, 500, 38),
    // Vertical path from Store down to School
    ...createVerticalPath(1200, 500, 10),
    // Path from School to Lily's House
    ...createHorizontalPath(400, 800, 26),
    ...createVerticalPath(400, 800, 13),
    // Path from Lily's House to Max's House
    ...createHorizontalPath(400, 1300, 32),
    // Central vertical spine
    ...createVerticalPath(1200, 300, 35),
  ];

  const fencePieces = [
    // Fences around Bank area
    { x: 550, y: 350, type: 'corner' as const },
    { x: 750, y: 350, type: 'horizontal' as const },
    // Fences around Store
    { x: 1750, y: 450, type: 'vertical' as const },
    { x: 1850, y: 450, type: 'vertical' as const },
  ];
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#87CEEB]">
      {/* Trust meter - fixed to screen */}
      <TrustMeter value={trustLevel} />

      {/* Feedback effects - fixed to screen */}
      {feedbackEffect === 'safe' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-green-400 pointer-events-none z-30"
        />
      )}
      {feedbackEffect === 'unsafe' && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-red-400 pointer-events-none z-30"
          />
          <motion.div
            animate={{ x: [-5, 5, -5, 5, 0], y: [-5, 5, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20"
          />
        </>
      )}

      {/* World container - this moves with the camera */}
      <div
        className="absolute"
        style={{
          width: `${worldWidth}px`,
          height: `${worldHeight}px`,
          transform: `translate(${-cameraX}px, ${-cameraY}px)`,
        }}
      >
        {/* Simple grass ground */}
        <div className="absolute inset-0 bg-[#7EC850]"></div>

        {/* Dirt path system */}
        <PathSystem paths={pathTiles} fences={fencePieces} />

        {/* Trees - background layer */}
        {trees.filter(tree => tree.y < playerY).map((tree, index) => (
          <div 
            key={`tree-bg-${index}`} 
            className="absolute" 
            style={{ 
              left: tree.x - 40, 
              top: tree.y - 80,
              zIndex: 1,
            }}
          >
            <TreeDecoration variant={tree.variant} scale={tree.scale} />
          </div>
        ))}

        {/* Buildings */}
        {villagers.map((building) => (
          <div 
            key={building.id} 
            className="absolute" 
            style={{ 
              left: building.x - 100, 
              top: building.y - 120,
              zIndex: 5,
            }}
          >
            <BuildingAsset
              type={building.buildingType}
              isNearby={nearbyVillager === building.id}
              onClick={() => onVillagerClick(building.id)}
            />
          </div>
        ))}

        {/* Player avatar - positioned in world coordinates */}
        <div className="absolute" style={{ left: playerX - 30, top: playerY - 30, zIndex: 10 }}>
          <PlayerAvatar x={30} y={30} isMoving={isMoving} />
        </div>

        {/* Trees - foreground layer (in front of player) */}
        {trees.filter(tree => tree.y >= playerY).map((tree, index) => (
          <div 
            key={`tree-fg-${index}`} 
            className="absolute" 
            style={{ 
              left: tree.x - 40, 
              top: tree.y - 80,
              zIndex: 20,
            }}
          >
            <TreeDecoration variant={tree.variant} scale={tree.scale} />
          </div>
        ))}
      </div>

      {/* Instructions - fixed to screen */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-40">
        <div className="bg-white/90 px-6 py-3 rounded-full border-3 border-[#3a3a3a] shadow-lg">
          <span className="text-sm">
            Use <span className="font-bold">Arrow Keys</span> or <span className="font-bold">WASD</span> to explore • Press <span className="font-bold">E</span> to talk
          </span>
        </div>
      </div>

      {/* Mini-map */}
      <div className="absolute top-24 right-8 z-40">
        <div className="bg-white/90 rounded-2xl border-4 border-[#3a3a3a] p-3 shadow-lg">
          <div className="text-xs mb-1 text-center font-bold">Map</div>
          <div
            className="relative bg-[#e8f4f8] rounded-lg border-2 border-[#3a3a3a]"
            style={{ width: '120px', height: '120px' }}
          >
            {/* Player position on minimap */}
            <div
              className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white"
              style={{
                left: `${(playerX / worldWidth) * 120 - 6}px`,
                top: `${(playerY / worldHeight) * 120 - 6}px`,
              }}
            />
            {/* Building positions on minimap */}
            {villagers.map((v) => (
              <div
                key={v.id}
                className="absolute w-2 h-2 rounded-full border border-[#3a3a3a]"
                style={{
                  backgroundColor: v.color,
                  left: `${(v.x / worldWidth) * 120 - 4}px`,
                  top: `${(v.y / worldHeight) * 120 - 4}px`,
                  opacity: v.isActive ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
