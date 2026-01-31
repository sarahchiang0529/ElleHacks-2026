import { motion } from "framer-motion";

import bankImg from "@/assets/bank.png";
import storeImg from "@/assets/market.png";
import phoneHouseImg from "@/assets/house.png";
import friendHouseImg from "@/assets/house2.png";
import schoolImg from "@/assets/school.png";


interface BuildingAssetProps {
  type: 'bank' | 'store' | 'phone' | 'friend' | 'school';
  isNearby?: boolean;
  onClick?: () => void;
}

const buildingImages = {
  bank: bankImg,
  store: storeImg,
  phone: phoneHouseImg,
  friend: friendHouseImg,
  school: schoolImg,
};

const buildingLabels = {
  bank: "🏦 Bank",
  store: "🏪 Store",
  phone: "📱 Lily's House",
  friend: "👫 Max's House",
  school: "🏫 School",
};

export function BuildingAsset({ type, isNearby, onClick }: BuildingAssetProps) {
  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      animate={isNearby ? { y: [0, -8, 0] } : {}}
      transition={isNearby ? { duration: 0.6, repeat: Infinity } : {}}
    >
      {/* Building Image - Scaled 2x larger */}
      <img
        src={buildingImages[type]}
        alt={buildingLabels[type]}
        className="w-auto h-auto max-w-none"
        style={{
          imageRendering: 'pixelated',
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))',
          transform: 'scale(2)',
        }}
      />

      {/* Label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="bg-white/90 px-3 py-1 rounded-full border-3 border-[#3a3a3a] text-sm font-bold shadow-lg">
          {buildingLabels[type]}
        </div>
      </div>

      {/* Interaction indicator */}
      {isNearby && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2"
        >
          <div className="bg-white/95 px-4 py-2 rounded-full border-3 border-[#3a3a3a] shadow-lg whitespace-nowrap">
            <span className="text-sm font-bold">Press E to enter</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
