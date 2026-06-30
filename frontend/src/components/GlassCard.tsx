import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../styles/theme';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  techCorners?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = true,
  techCorners = false,
}) => {
  const isClickable = !!onClick;

  return (
    <motion.div
      onClick={onClick}
      className={`
        ${THEME.glass.card}
        rounded-2xl p-6 relative overflow-hidden group
        ${isClickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      // Only apply hover scaling/elevating micro-animations if it is hoverable
      {...(hoverable
        ? {
            whileHover: {
              y: -5,
              borderColor: 'rgba(6, 182, 212, 0.25)', // Glow border color on hover
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(6, 182, 212, 0.15)',
            },
            transition: { type: 'spring', stiffness: 400, damping: 25 },
          }
        : {})}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
    >
      {/* Tech Corners */}
      {techCorners && (
        <>
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyan-500/35 pointer-events-none group-hover:border-cyan-400 transition-all duration-300" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyan-500/35 pointer-events-none group-hover:border-cyan-400 transition-all duration-300" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyan-500/35 pointer-events-none group-hover:border-cyan-400 transition-all duration-300" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyan-500/35 pointer-events-none group-hover:border-cyan-400 transition-all duration-300" />
        </>
      )}

      {/* Decorative top-right accent glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      {/* Decorative bottom-left accent glow */}
      <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
      
      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
