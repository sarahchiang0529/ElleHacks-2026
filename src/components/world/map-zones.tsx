import { motion } from "framer-motion";
import { 
  TreeAsset, 
  FlowerAsset, 
  RockAsset, 
  BushAsset, 
  SignAsset, 
  BenchAsset, 
  LampPostAsset,
  FountainAsset 
} from "../assets/prop-assets";

interface MapZonesProps {
  worldWidth: number;
  worldHeight: number;
}

export function MapZones({ worldWidth, worldHeight }: MapZonesProps) {
  // Define zones
  const zones = {
    forest: { x: 200, y: 200, width: 800, height: 600, color: '#4a7c59' },
    plaza: { x: worldWidth / 2 - 300, y: worldHeight / 2 - 300, width: 600, height: 600, color: '#d4c5a0' },
    garden: { x: worldWidth - 900, y: 400, width: 700, height: 800, color: '#b8d4a8' },
    beach: { x: 400, y: worldHeight - 700, width: 1000, height: 500, color: '#f4e4c1' },
  };

  return (
    <>
      {/* Zone backgrounds (subtle) */}
      <div className="absolute inset-0 pointer-events-none" style={{ isolation: 'isolate' }}>
        {Object.entries(zones).map(([name, zone]) => (
          <div
            key={name}
            className="absolute rounded-3xl opacity-20"
            style={{
              left: zone.x,
              top: zone.y,
              width: zone.width,
              height: zone.height,
              backgroundColor: zone.color,
              transform: 'translateZ(0)', // Force GPU acceleration
            }}
          />
        ))}
      </div>

      {/* FOREST ZONE - Dense trees */}
      {[...Array(25)].map((_, i) => (
        <div
          key={`forest-tree-${i}`}
          className="absolute"
          style={{
            left: zones.forest.x + (i % 5) * 150 + Math.random() * 50,
            top: zones.forest.y + Math.floor(i / 5) * 120 + Math.random() * 40,
          }}
        >
          <TreeAsset size={i % 3 === 0 ? 'large' : 'medium'} />
        </div>
      ))}

      {/* Forest flowers */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`forest-flower-${i}`}
          className="absolute"
          style={{
            left: zones.forest.x + Math.random() * zones.forest.width,
            top: zones.forest.y + Math.random() * zones.forest.height,
          }}
        >
          <FlowerAsset color={['#ff69b4', '#9b59b6', '#ffffff'][i % 3]} />
        </div>
      ))}

      {/* Forest sign */}
      <div
        className="absolute"
        style={{ left: zones.forest.x + 20, top: zones.forest.y - 30 }}
      >
        <SignAsset text="FOREST" />
      </div>

      {/* PLAZA ZONE - Central gathering area */}
      <div
        className="absolute"
        style={{
          left: zones.plaza.x + zones.plaza.width / 2 - 40,
          top: zones.plaza.y + zones.plaza.height / 2 - 30,
        }}
      >
        <FountainAsset />
      </div>

      {/* Plaza benches */}
      {[
        { x: zones.plaza.x + 100, y: zones.plaza.y + 200 },
        { x: zones.plaza.x + zones.plaza.width - 150, y: zones.plaza.y + 200 },
        { x: zones.plaza.x + 100, y: zones.plaza.y + zones.plaza.height - 240 },
        { x: zones.plaza.x + zones.plaza.width - 150, y: zones.plaza.y + zones.plaza.height - 240 },
      ].map((pos, i) => (
        <div key={`bench-${i}`} className="absolute" style={{ left: pos.x, top: pos.y }}>
          <BenchAsset />
        </div>
      ))}

      {/* Plaza lamp posts */}
      {[
        { x: zones.plaza.x + 50, y: zones.plaza.y + 50 },
        { x: zones.plaza.x + zones.plaza.width - 70, y: zones.plaza.y + 50 },
        { x: zones.plaza.x + 50, y: zones.plaza.y + zones.plaza.height - 70 },
        { x: zones.plaza.x + zones.plaza.width - 70, y: zones.plaza.y + zones.plaza.height - 70 },
      ].map((pos, i) => (
        <div key={`lamp-${i}`} className="absolute" style={{ left: pos.x, top: pos.y }}>
          <LampPostAsset isGlowing={true} />
        </div>
      ))}

      {/* Plaza sign */}
      <div
        className="absolute"
        style={{ left: zones.plaza.x + 250, top: zones.plaza.y - 30 }}
      >
        <SignAsset text="TOWN PLAZA" />
      </div>

      {/* GARDEN ZONE - Flowers and bushes */}
      {[...Array(30)].map((_, i) => (
        <div
          key={`garden-flower-${i}`}
          className="absolute"
          style={{
            left: zones.garden.x + (i % 6) * 100 + Math.random() * 50,
            top: zones.garden.y + Math.floor(i / 6) * 120 + Math.random() * 50,
          }}
        >
          <FlowerAsset color={['#ff1493', '#ffd700', '#ff6b9d', '#98fb98', '#dda0dd'][i % 5]} />
        </div>
      ))}

      {/* Garden bushes */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`garden-bush-${i}`}
          className="absolute"
          style={{
            left: zones.garden.x + Math.random() * zones.garden.width,
            top: zones.garden.y + Math.random() * zones.garden.height,
          }}
        >
          <BushAsset />
        </div>
      ))}

      {/* Garden trees (sparse) */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`garden-tree-${i}`}
          className="absolute"
          style={{
            left: zones.garden.x + (i * 140),
            top: zones.garden.y + (i % 2) * 300 + 100,
          }}
        >
          <TreeAsset size="small" />
        </div>
      ))}

      {/* Garden sign */}
      <div
        className="absolute"
        style={{ left: zones.garden.x + 20, top: zones.garden.y - 30 }}
      >
        <SignAsset text="GARDEN" />
      </div>

      {/* BEACH ZONE - Sandy area */}
      {/* Beach rocks */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`beach-rock-${i}`}
          className="absolute"
          style={{
            left: zones.beach.x + Math.random() * zones.beach.width,
            top: zones.beach.y + Math.random() * zones.beach.height,
          }}
        >
          <RockAsset variant={((i % 3) + 1) as 1 | 2 | 3} />
        </div>
      ))}

      {/* Beach sign */}
      <div
        className="absolute"
        style={{ left: zones.beach.x + 400, top: zones.beach.y - 30 }}
      >
        <SignAsset text="BEACH" />
      </div>

      {/* Scattered trees around the world */}
      {[...Array(40)].map((_, i) => {
        const x = (i * 237) % (worldWidth - 200) + 100;
        const y = (i * 457) % (worldHeight - 200) + 100;
        
        // Don't place in zones
        const inZone = Object.values(zones).some(
          zone => x > zone.x && x < zone.x + zone.width && y > zone.y && y < zone.y + zone.height
        );
        
        if (inZone) return null;

        return (
          <div
            key={`scattered-tree-${i}`}
            className="absolute"
            style={{ left: x, top: y }}
          >
            <TreeAsset size={i % 4 === 0 ? 'large' : i % 2 === 0 ? 'medium' : 'small'} />
          </div>
        );
      })}

      {/* Scattered flowers */}
      {[...Array(60)].map((_, i) => {
        const x = (i * 347) % (worldWidth - 100) + 50;
        const y = (i * 521) % (worldHeight - 100) + 50;
        
        return (
          <div
            key={`scattered-flower-${i}`}
            className="absolute"
            style={{ left: x, top: y }}
          >
            <FlowerAsset color={['#ff69b4', '#ffd700', '#98fb98', '#dda0dd', '#ffffff'][i % 5]} />
          </div>
        );
      })}
    </>
  );
}
