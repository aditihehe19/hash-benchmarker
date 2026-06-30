import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import GlassCard from './GlassCard';

interface ErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const Error: React.FC<ErrorProps> = ({
  title = 'System Error Occurred',
  message = 'Failed to fetch benchmark details. Please verify your connection and try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-lg mx-auto ${className}`}>
      <GlassCard className="border-rose-500/20 hover:border-rose-500/30" hoverable={false}>
        <div className="flex flex-col items-center text-center p-4">
          {/* Icon Container with glowing background */}
          <div className="relative p-4 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 mb-4">
            <AlertCircle className="w-8 h-8" />
            <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-md -z-10" />
          </div>

          {/* Text Content */}
          <h4 className="text-lg font-semibold text-slate-100 mb-2">{title}</h4>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-sm">
            {message}
          </p>

          {/* Retry Button */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-all duration-200 cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Operation
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default Error;
