import { motion } from "framer-motion";
import { PlayerAvatar } from "./player-avatar";
import { BuildingAsset } from "./building-asset";
import { TrustMeter } from "./trust-meter";
import { TreeDecoration } from "./tree-decoration";
import {
  PathSystem,
  createHorizontalPath,
  createVerticalPath,
} from "./path-system";

interface Building {
  id: number;
  name: string;
  variant: 'bob' | 'sally' | 'lily' | 'max' | 'zoe';
  voice: string;
  x: number;
  y: number;
  color: string;
  isActive: boolean;
  buildingType: "bank" | "store" | "phone" | "friend" | "school";
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
  playerDirection: "up" | "down" | "left" | "right";
  villagers: Building[];
  nearbyVillager: number | null;
  trustLevel: number;
  onVillagerClick: (id: number) => void;
  feedbackEffect: "safe" | "unsafe" | null;
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
  playerDirection,
  villagers,
  nearbyVillager,
  trustLevel,
  onVillagerClick,
  feedbackEffect,
  worldWidth,
  worldHeight,
  trees,
}: TownViewProps) {
  // Path network (paths only)
  const pathTiles = [
    ...createHorizontalPath(600, 500, 38),
    ...createVerticalPath(1200, 500, 10),
    ...createHorizontalPath(400, 800, 26),
    ...createVerticalPath(400, 800, 13),
    ...createHorizontalPath(400, 1300, 32),
    ...createVerticalPath(1200, 300, 35),
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#87CEEB]">
      <TrustMeter value={trustLevel} />

      {/* Feedback effects */}
      {feedbackEffect === "safe" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-green-400 pointer-events-none z-30"
        />
      )}

      {feedbackEffect === "unsafe" && (
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

      {/* World container */}
      <div
        className="absolute"
        style={{
          width: `${worldWidth}px`,
          height: `${worldHeight}px`,
          transform: `translate(${-cameraX}px, ${-cameraY}px)`,
        }}
      >
        {/* Grass */}
        <div className="absolute inset-0 bg-[#7EC850]" />

        {/* Paths only (no fences) */}
        <PathSystem paths={pathTiles} />

        {/* Trees behind player */}
        {trees
          .filter((tree) => tree.y < playerY)
          .map((tree, index) => (
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

        {/* Player */}
        <div
          className="absolute"
          style={{ left: playerX - 30, top: playerY - 30, zIndex: 10 }}
        >
          <PlayerAvatar
            x={30}
            y={30}
            isMoving={isMoving}
            direction={playerDirection}
          />
        </div>

        {/* Trees in front of player */}
        {trees
          .filter((tree) => tree.y >= playerY)
          .map((tree, index) => (
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

      {/* Mini-map */}
      <div className="absolute top-24 right-8 z-40">
        <div className="bg-white/90 rounded-2xl border-4 border-[#3a3a3a] p-3 shadow-lg">
          <div className="text-xs mb-1 text-center font-bold">Map</div>
          <div
            className="relative bg-[#e8f4f8] rounded-lg border-2 border-[#3a3a3a]"
            style={{ width: "120px", height: "120px" }}
          >
            <div
              className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white"
              style={{
                left: `${(playerX / worldWidth) * 120 - 6}px`,
                top: `${(playerY / worldHeight) * 120 - 6}px`,
              }}
            />
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