import * as React from "react";
import { motion } from 'motion/react';
import { ScenarioMessage } from '../types/game';

interface MessageBubbleProps {
  message: ScenarioMessage;
  index: number;
  key?: React.Key;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isScammer = message.sender === 'scammer';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.3, type: 'spring' }}
      className={`flex ${isScammer ? 'justify-start' : 'justify-center'}`}
    >
      <div
        className={`max-w-[85%] p-4 rounded-2xl shadow-md ${
          isScammer
            ? 'bg-white border-2 border-gray-200'
            : 'bg-red-50 border-2 border-red-200'
        }`}
      >
        <p className="text-base leading-relaxed whitespace-pre-line text-gray-800">
          {message.text}
        </p>
      </div>
    </motion.div>
  );
}
