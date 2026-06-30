import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  classification?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  classification,
}) => {
  return (
    <div className="flex flex-col gap-2 relative z-10 pb-2 border-b border-slate-900/60 mb-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-cyan-400 shrink-0 animate-pulse">
              {icon}
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-slate-100 uppercase font-sans">
            {title}
          </h1>
        </div>
        
        {classification && (
          <div className="shrink-0 flex items-center">
            <span className="text-[9px] font-mono font-bold text-rose-400 tracking-widest bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full uppercase shadow-lg shadow-rose-950/20 animate-pulse">
              {classification}
            </span>
          </div>
        )}
      </div>
      <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed font-normal">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;
