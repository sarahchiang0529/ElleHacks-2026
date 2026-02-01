import { motion } from "framer-motion";
import { NPCSprite } from "./assets/npc-sprite";

interface VillagerHouseProps {
  x: number;
  y: number;
  villagerName: string;
  villagerVariant: 'bob' | 'sally' | 'lily' | 'max' | 'zoe';
  isActive: boolean;
  isNearby: boolean;
  color: string;
  onClick: () => void;
}

export function VillagerHouse({
  x,
  y,
  villagerName,
  villagerVariant,
  isActive,
  isNearby,
  color,
  onClick,
}: VillagerHouseProps) {
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      {/* House structure */}
      <div className="relative">
        {/* Roof */}
        <div
          className="w-24 h-16 rounded-t-3xl border-4 border-[#3a3a3a]"
          style={{ backgroundColor: color }}
        ></div>
        {/* House body */}
        <div className="w-20 h-16 bg-[#fef6e4] rounded-b-2xl border-4 border-t-0 border-[#3a3a3a] mx-auto">
          {/* Window with glow */}
          <div className="w-10 h-10 rounded-lg border-3 border-[#3a3a3a] mx-auto mt-2 relative overflow-hidden"
            style={{ backgroundColor: isActive ? '#ffd89b' : '#a8c4e8' }}
          >
            {/* Glow effect (if active) */}
            {isActive && (
              <motion.div
                className="absolute -inset-1 bg-yellow-300/30 rounded-lg blur-sm"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ zIndex: -1 }}
              />
            )}
            {/* Window panes */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#3a3a3a] z-10"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#3a3a3a] z-10"></div>
          </div>
        </div>
        
        {/* Door */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-8 bg-[#8b4513] rounded-t-lg border-3 border-[#3a3a3a]"></div>
        
        {/* NPC Character standing outside when active */}
        {isActive && (
          <motion.div
            className="absolute -bottom-2 -right-8"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <NPCSprite variant={villagerVariant} mood="neutral" />
          </motion.div>
        )}
        
        {/* Tooltip when nearby */}
        {isNearby && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-[#3a3a3a] text-white px-3 py-2 rounded-full text-sm">
              Press E to talk to {villagerName}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
