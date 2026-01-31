import { motion } from "framer-motion";

// Import building assets
import bankImg from "@/assets/bank.png";
import storeImg "@/assets/market.png";
import phoneHouseImg from "@/assets/house.png";
import friendHouseImg from "@/assets//house2.png";
import schoolImg from "@/assets/school.png";
interface BuildingProps {
  type: 'bank' | 'store' | 'phone' | 'friend' | 'school';
  isActive: boolean;
  isNearby: boolean;
  onClick: () => void;
  label: string;
}

const buildingImages = {
  bank: bankImg,
  store: storesImg,
  phone: phoneHouseImg,
  friend: friendHouseImg,
  school: schoolImg,
};

export function Building({ type, isActive, isNearby, onClick, label }: BuildingProps) {
  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      animate={{
        y: isNearby ? [0, -8, 0] : 0,
      }}
      transition={{
        y: { duration: 0.6, repeat: isNearby ? Infinity : 0 },
      }}
    >
      {/* Building image */}
      <div className="relative">
        <img
          src={buildingImages[type]}
          alt={label}
          className="w-auto h-32 object-contain"
          style={{
            filter: isActive ? 'none' : 'grayscale(100%) brightness(0.7)',
          }}
        />
        
        {/* Glow effect when nearby */}
        {isNearby && isActive && (
          <motion.div
            className="absolute inset-0 bg-yellow-300/30 rounded-2xl blur-xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ transform: 'translateZ(0)' }}
          />
        )}
        
        {/* Lock icon for inactive buildings */}
        {!isActive && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-gray-800/80 rounded-full p-3 border-3 border-white">
              <span className="text-3xl">🔒</span>
            </div>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="text-center mt-2">
        <div className="bg-white/90 px-3 py-1 rounded-full border-2 border-[#3a3a3a] shadow-md inline-block">
          <span className="text-sm font-bold">{label}</span>
        </div>
      </div>

      {/* Interaction prompt */}
      {isNearby && isActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#3a3a3a] text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shadow-lg"
        >
          Press E to enter
        </motion.div>
      )}
    </motion.div>
  );
}
