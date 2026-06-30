import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Cpu } from 'lucide-react';
import { useSidebar } from '../hooks/useSidebar';
import { THEME } from '../styles/theme';

export const TopNavbar: React.FC = () => {
  const { toggleMobileOpen } = useSidebar();
  const location = useLocation();

  // Map route paths to page titles
  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'System Overview';
      case '/dashboard/benchmark':
        return 'Launch Benchmark';
      case '/dashboard/results':
        return 'Benchmark Results';
      case '/dashboard/analytics':
        return 'Telemetry Analytics';
      case '/dashboard/security':
        return 'Security Analysis';
      case '/dashboard/recommendation':
        return 'Recommendations';
      case '/dashboard/hardware':
        return 'Hardware Clusters';
      case '/dashboard/attack-cost':
        return 'Attack Complexity Cost';
      case '/dashboard/export':
        return 'Generate Reports';
      default:
        return 'Hash Benchmarker';
    }
  };

  return (
    <header className={`sticky top-0 z-20 w-full ${THEME.layout.navbarHeight} ${THEME.glass.navbar} flex items-center justify-between px-6`}>
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileOpen}
          aria-label="Open navigation sidebar"
          className="lg:hidden p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <h2 className="text-lg font-bold text-slate-100 tracking-tight mb-0 hidden sm:block">
          {getPageTitle(location.pathname)}
        </h2>
      </div>

      {/* Right side: Status and Actions */}
      <div className="flex items-center gap-4">
        {/* System telemetry quick stats */}
        <div className="hidden md:flex items-center gap-3 bg-slate-950/40 border border-slate-800/50 rounded-xl px-3 py-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-semibold">Local Node:</span>
          </div>
          <span>GPU Temp: 68°C</span>
          <span className="text-slate-700">|</span>
          <span>Load: 84%</span>
        </div>

        {/* Alerts status indicator */}
        <button 
          aria-label="View system alerts"
          className="p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/40 border border-slate-800/50 hover:border-slate-700/50 text-slate-400 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 transition-all duration-200 cursor-pointer relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        </button>

        {/* User profile dropdown container */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800/50">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-200 leading-tight">Admin User</span>
            <span className="text-[10px] text-slate-500 font-medium">SecOps Team</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-500 p-[1px] shadow-[0_0_12px_rgba(168,85,247,0.2)]">
            <div className="w-full h-full bg-[#0b0e17] rounded-xl flex items-center justify-center text-slate-200 text-xs font-bold font-mono">
              AD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
