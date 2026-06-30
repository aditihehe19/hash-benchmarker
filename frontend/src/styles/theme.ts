/**
 * Theme constants and design system tokens for Hash Benchmarker.
 * Standardizes styling across the application for a cohesive, premium look.
 */

export const THEME = {
  // Brand colors & gradients
  colors: {
    bg: {
      main: 'bg-[#080b11]',
      sidebar: 'bg-[#0b0e17]',
      navbar: 'bg-[#080b11]/80',
      card: 'bg-[#0f1420]/60',
      glass: 'bg-[#0f1420]/40',
      hover: 'hover:bg-[#161d2f]/60',
    },
    border: {
      subtle: 'border-slate-800/50',
      light: 'border-slate-700/30',
      glass: 'border-white/[0.06]',
      glassHover: 'hover:border-cyan-500/20',
      active: 'border-cyan-500/50',
    },
    accent: {
      primary: 'text-cyan-400',
      primaryBg: 'bg-cyan-500/10',
      secondary: 'text-violet-400',
      secondaryBg: 'bg-violet-500/10',
      success: 'text-emerald-400',
      successBg: 'bg-emerald-500/10',
      warning: 'text-amber-400',
      warningBg: 'bg-amber-500/10',
      danger: 'text-rose-400',
      dangerBg: 'bg-rose-500/10',
      info: 'text-sky-400',
      infoBg: 'bg-sky-500/10',
    },
    text: {
      title: 'text-slate-100',
      body: 'text-slate-400',
      muted: 'text-slate-500',
      highlight: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400',
    }
  },

  // Premium Glassmorphism presets
  glass: {
    panel: 'backdrop-blur-md bg-[#0f1420]/45 border border-white/[0.06] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]',
    card: 'backdrop-blur-sm bg-[#0f1420]/40 border border-white/[0.05] hover:border-cyan-500/20 transition-all duration-300 shadow-lg',
    navbar: 'backdrop-blur-lg bg-[#080b11]/70 border-b border-white/[0.04]',
  },

  // Dimensions
  layout: {
    sidebarWidthExpanded: 'w-64',
    sidebarWidthCollapsed: 'w-20',
    navbarHeight: 'h-16',
  },

  // Micro-animations (Framer Motion variants)
  animations: {
    pageTransition: {
      initial: { opacity: 0, y: 15 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -15 },
      transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] as const }
    },
    sidebarTransition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30
    },
    hoverScale: {
      hover: { y: -4, transition: { duration: 0.2, ease: 'easeOut' } },
      tap: { scale: 0.98 }
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 }
    }
  }
};
