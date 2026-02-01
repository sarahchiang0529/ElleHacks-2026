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
  bank: "Bank",
  store: "Store",
  phone: "Lily's House",
  friend: "Max's House",
  school: "School",
};

export function BuildingAsset({ type, isNearby, onClick }: BuildingAssetProps) {
  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      animate={isNearby ? { y: [0, -6, 0] } : {}}
      transition={isNearby ? { duration: 1, repeat: Infinity } : {}}
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
      {!isNearby && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="bg-black/70 text-white px-4 py-1.5 rounded-md text-[11px] font-semibold shadow-sm backdrop-blur-sm">
            {buildingLabels[type]}
          </div>
        </div>
      )}

      {/* Interaction indicator */}
      {isNearby && (
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs backdrop-blur-sm">
            <span className="opacity-80">Press</span>
            <span className="border border-white/40 rounded px-2 py-0.5 text-[10px] font-bold bg-black/30 leading-none">
              E
            </span>
            <span className="opacity-80">to enter</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
