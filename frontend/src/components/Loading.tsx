import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  message?: string;
  fullPage?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading dashboard analytics...',
  fullPage = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Pulsing ring spinner */}
      <div className="relative w-16 h-16 mb-4">
        {/* Outer glowing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-500/10 border-t-cyan-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner reverse-spinning ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-violet-500/10 border-b-violet-400"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
        />
        {/* Center glowing core */}
        <div className="absolute inset-5 rounded-full bg-cyan-500/25 blur-[4px] animate-pulse" />
      </div>

      {/* Message */}
      <motion.p
        className="text-sm font-medium text-slate-400 tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080b11]/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full min-h-[300px] flex items-center justify-center rounded-2xl bg-[#0f1420]/20 border border-white/[0.03] backdrop-blur-sm">
      {content}
    </div>
  );
};

export default Loading;
