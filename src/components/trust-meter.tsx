import { motion } from "motion/react";

interface TrustMeterProps {
  value: number; // 0-100
}

export function TrustMeter({ value }: TrustMeterProps) {
  const getColor = () => {
    if (value < 40) return 'var(--trust-low)';
    if (value < 70) return 'var(--trust-medium)';
    return 'var(--trust-high)';
  };

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        className="bg-white rounded-3xl px-6 py-4 shadow-lg border-4 border-[#3a3a3a]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="text-center mb-2">
          <span className="text-sm uppercase tracking-wider">Town Trust</span>
        </div>
        <div className="relative w-64 h-6 bg-gray-200 rounded-full overflow-hidden border-3 border-[#3a3a3a]">
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ backgroundColor: getColor() }}
            initial={{ width: '50%' }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
        <div className="text-center mt-2">
          <span className="font-bold">{value}%</span>
        </div>
      </motion.div>
    </div>
  );
}
