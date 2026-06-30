import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { SidebarProvider } from '../hooks/useSidebar';
import { THEME } from '../styles/theme';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className={`flex min-h-screen ${THEME.colors.bg.main} text-slate-300 font-sans`}>
        {/* Responsive Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative">
          {/* Decorative glowing gradient blobs */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] glow-purple opacity-40 pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] glow-cyan opacity-40 pointer-events-none -z-10" />

          {/* Top Navigation */}
          <TopNavbar />

          {/* Page content scroll area */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {/* Page transitions with AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={THEME.animations.pageTransition.initial}
                animate={THEME.animations.pageTransition.animate}
                exit={THEME.animations.pageTransition.exit}
                transition={THEME.animations.pageTransition.transition}
                className="w-full max-w-7xl mx-auto"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
