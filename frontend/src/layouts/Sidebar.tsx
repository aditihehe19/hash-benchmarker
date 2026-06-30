import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  PlayCircle,
  FileSpreadsheet,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Cpu,
  DollarSign,
  Share2,
  ChevronLeft,
  ChevronRight,
  Zap,
  X
} from 'lucide-react';
import { useSidebar } from '../hooks/useSidebar';
import { THEME } from '../styles/theme';

export const Sidebar: React.FC = () => {
  const { isCollapsed, toggleCollapsed, isMobileOpen, setMobileOpen } = useSidebar();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Benchmark', path: '/dashboard/benchmark', icon: PlayCircle },
    { name: 'Results', path: '/dashboard/results', icon: FileSpreadsheet },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Security Analysis', path: '/dashboard/security', icon: ShieldCheck },
    { name: 'Recommendation', path: '/dashboard/recommendation', icon: Sparkles },
    { name: 'Hardware', path: '/dashboard/hardware', icon: Cpu },
    { name: 'Attack Cost', path: '/dashboard/attack-cost', icon: DollarSign },
    { name: 'Export Report', path: '/dashboard/export', icon: Share2 },
  ];


  const sidebarContent = (
    <div className={`h-full flex flex-col ${THEME.colors.bg.sidebar} border-r ${THEME.colors.border.subtle} text-slate-300 relative z-30`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-violet-500 rounded-xl text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Zap className="w-5 h-5 fill-slate-950" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-lg tracking-wider text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300"
            >
              HASHBENCH
            </motion.span>
          )}
        </div>
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group cursor-pointer relative
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40
              ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-400 border border-cyan-500/20 shadow-[inset_0_0_12px_rgba(6,182,212,0.05)]'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-900/40 hover:border-white/[0.02]'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
                
                {/* Collapsed Sidebar Item Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-[#0f1420] border border-slate-800 text-slate-200 text-xs font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Desktop Collapse Toggle Footer */}
      <div className="hidden lg:flex p-4 border-t border-slate-800/40 justify-center">
        <button
          onClick={toggleCollapsed}
          className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700/80 text-slate-400 hover:text-slate-100 transition-all duration-200 cursor-pointer shadow-md"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={THEME.animations.sidebarTransition}
        className={`hidden lg:block shrink-0 h-screen sticky top-0`}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Drawer (sliding drawer overlay) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-[#040609] z-40 backdrop-blur-sm"
            />
            {/* Sidebar drawer body */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 z-50 h-screen"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
