import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import GlassCard from './GlassCard';

interface TrendProps {
  value: string | number;
  isPositive: boolean;
  label?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: TrendProps;
  className?: string;
  accentClass?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className = '',
  accentClass = 'text-cyan-400',
}) => {
  return (
    <GlassCard className={`flex flex-col justify-between ${className}`} hoverable={true}>
      <div className="flex items-start justify-between mb-4" role="status" aria-label={`${title}: ${value}`}>
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-slate-100 mt-2 tracking-tight font-mono">
            {value}
          </h3>
        </div>
        <div className={`p-3 bg-slate-800/40 border border-white/[0.05] rounded-xl ${accentClass}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/40">
        {trend ? (
          <div className="flex items-center gap-1.5" aria-label={`Trend: ${trend.value}`}>
            <span
              className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                trend.isPositive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </span>
            {trend.label && (
              <span className="text-xs text-slate-500">{trend.label}</span>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-500">{description || 'No trend data'}</span>
        )}
      </div>
    </GlassCard>
  );
};

export default MetricCard;
