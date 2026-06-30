import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Cpu,
  HardDrive,
  Clock,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

export const Analytics: React.FC = () => {
  // Chart states for interactive tooltips
  const [hoveredLinePoint, setHoveredLinePoint] = useState<number | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Line Chart coordinates (average latency metrics over time)
  const linePoints = [
    { label: 'Jan', val: 142, x: 45, y: 130 },
    { label: 'Feb', val: 135, x: 125, y: 140 },
    { label: 'Mar', val: 148, x: 205, y: 120 },
    { label: 'Apr', val: 122, x: 285, y: 160 },
    { label: 'May', val: 130, x: 365, y: 150 },
    { label: 'Jun', val: 112, x: 445, y: 175 }
  ];

  // Map values to coordinates
  // Canvas width: 500, height: 200. Grid floor is at y=180, grid roof at y=20.
  const linePath = linePoints.map((p) => `${p.x},${p.y}`).join(' L ');
  const areaPath = `M 45,180 L ${linePath} L 445,180 Z`;

  // Bar Chart items (Algorithm efficiency comparisons, higher is better relative score)
  const barData = [
    { algo: 'bcrypt', val: 55, gradient: 'from-cyan-500 to-blue-500', color: '#06b6d4' },
    { algo: 'argon2id', val: 12, gradient: 'from-violet-500 to-fuchsia-500', color: '#a855f7' },
    { algo: 'pbkdf2', val: 45, gradient: 'from-sky-500 to-indigo-500', color: '#0ea5e9' },
    { algo: 'scrypt', val: 30, gradient: 'from-emerald-500 to-teal-500', color: '#10b981' },
    { algo: 'SHA-256', val: 98, gradient: 'from-amber-500 to-orange-500', color: '#f59e0b' }
  ];

  // Memory comparison data
  const memoryData = [
    { algo: 'Argon2id', val: 64, pct: 100, gradient: 'from-violet-500 to-fuchsia-500' },
    { algo: 'scrypt', val: 32, pct: 50, gradient: 'from-cyan-500 to-blue-500' },
    { algo: 'bcrypt', val: 18, pct: 28, gradient: 'from-emerald-500 to-teal-500' },
    { algo: 'PBKDF2', val: 12, pct: 18, gradient: 'from-amber-500 to-yellow-500' },
    { algo: 'SHA-256', val: 8, pct: 12, gradient: 'from-slate-600 to-slate-400' }
  ];

  // CPU rings data
  const cpuRings = [
    { name: 'Argon2id', load: 94, radius: 72, color: '#a855f7', track: 'rgba(168, 85, 247, 0.08)' },
    { name: 'scrypt', load: 88, radius: 56, color: '#06b6d4', track: 'rgba(6, 182, 212, 0.08)' },
    { name: 'bcrypt', load: 82, radius: 40, color: '#10b981', track: 'rgba(16, 185, 129, 0.08)' },
    { name: 'PBKDF2', load: 76, radius: 24, color: '#f59e0b', track: 'rgba(245, 158, 11, 0.08)' }
  ];

  return (
    <div className="space-y-6 relative cyber-grid py-2 px-1">
      {/* Dynamic CRT lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-repeat select-none z-0" />

      {/* Header */}
      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-3xl font-black tracking-wider text-slate-100 uppercase flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-cyan-400" />
          Analytics Suite
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Detailed cryptographic speed scaling, memory hardness allocations, core load benchmarks, and algorithm comparative diagnostics.
        </p>
      </div>

      {/* ========================================================
          TOP SECTION: Highlights Grid (3 Columns)
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Fastest Engine */}
        <GlassCard className="p-5 border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 relative group" hoverable={true}>
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/40" />
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">FASTEST ALGORITHM</span>
              <h3 className="text-lg font-black text-slate-200 uppercase tracking-wide">SHA-256 Speed</h3>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-mono font-black text-slate-100">22ms</span>
                <span className="text-[10px] font-mono text-slate-500">AVG RUN</span>
              </div>
            </div>
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl group-hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>DEPLOYED ON: LOCAL NODE ALPHA</span>
            <span className="text-cyan-400">STABLE</span>
          </div>
        </GlassCard>

        {/* Slowest Engine */}
        <GlassCard className="p-5 border-rose-500/10 hover:border-rose-500/30 transition-all duration-300 relative group" hoverable={true}>
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-rose-500/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-rose-500/40" />
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-rose-400 font-bold uppercase tracking-widest block">SLOWEST ALGORITHM</span>
              <h3 className="text-lg font-black text-slate-200 uppercase tracking-wide">Argon2id KDF</h3>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-mono font-black text-slate-100">1,842ms</span>
                <span className="text-[10px] font-mono text-slate-500">AVG RUN</span>
              </div>
            </div>
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl group-hover:shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-all">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>DEPLOYED ON: CLOUD-WEST-1</span>
            <span className="text-rose-400">HARDENED</span>
          </div>
        </GlassCard>

        {/* Most Secure */}
        <GlassCard className="p-5 border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 relative group" hoverable={true}>
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500/40" />
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">SECURITY STABILITY</span>
              <h3 className="text-lg font-black text-slate-200 uppercase tracking-wide">Argon2id (64MB)</h3>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-mono font-black text-slate-100">94/100</span>
                <span className="text-[10px] font-mono text-slate-500">INDEX</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl group-hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>PARAMETERS: OPTIMAL SPECS</span>
            <span className="text-emerald-400">MAX COMP</span>
          </div>
        </GlassCard>

      </div>

      {/* ========================================================
          CHARTS GRID SECTION
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* CHART 1: Average Execution Time (Bespoke Line Chart) */}
        <GlassCard className="p-6 border-slate-800/50" hoverable={false}>
          <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                Average Latency History (ms)
              </h2>
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase">LAST 6 MONTHS</span>
          </div>

          <div className="relative h-[220px] w-full flex items-center justify-center">
            {/* Native SVG Line Graph */}
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="45" y1="50" x2="445" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="45" y1="90" x2="445" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="45" y1="130" x2="445" y2="130" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="45" y1="170" x2="445" y2="170" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="15" y="53" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">180ms</text>
              <text x="15" y="93" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">140ms</text>
              <text x="15" y="133" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">100ms</text>
              <text x="15" y="173" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">60ms</text>

              {/* Gradient Area under line */}
              <motion.path
                d={areaPath}
                fill="url(#areaGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              />

              {/* Main Line path with draw-in animation */}
              <motion.path
                d={`M ${linePath}`}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />

              {/* Floating Interaction Nodes */}
              {linePoints.map((p, idx) => (
                <g key={idx}>
                  {/* Outer glow ring on hover */}
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r="9"
                    fill="rgba(168, 85, 247, 0.15)"
                    stroke="rgba(168, 85, 247, 0.3)"
                    strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredLinePoint === idx ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                  {/* Solid inner dot */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#ffffff"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredLinePoint(idx)}
                    onMouseLeave={() => setHoveredLinePoint(null)}
                  />
                  {/* X axis labels */}
                  <text x={p.x} y="195" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>

            {/* Custom Interactive Tooltip */}
            <AnimatePresence>
              {hoveredLinePoint !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bg-[#0f1420] border border-slate-800 p-2.5 rounded-lg shadow-xl font-mono text-[10px] text-slate-300 pointer-events-none"
                  style={{
                    left: `${(linePoints[hoveredLinePoint].x / 500) * 100}%`,
                    top: `${(linePoints[hoveredLinePoint].y / 200) * 100 - 30}%`,
                    transform: 'translate(-50%, -100%)'
                  }}
                >
                  <div className="text-cyan-400 font-bold uppercase">{linePoints[hoveredLinePoint].label} TELEMETRY</div>
                  <div className="text-slate-100 mt-0.5">LATENCY: <strong className="text-white">{linePoints[hoveredLinePoint].val} ms</strong></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* CHART 2: Algorithm Comparison (Bespoke Column Chart) */}
        <GlassCard className="p-6 border-slate-800/50" hoverable={false}>
          <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                Algorithm Efficiency Comparison
              </h2>
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase">NORMALIZED SCORE</span>
          </div>

          <div className="relative h-[220px] w-full flex items-center justify-center">
            {/* Native SVG Column Graph */}
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                {barData.map((item, idx) => (
                  <linearGradient key={idx} id={`barGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={item.color} stopOpacity="1" />
                    <stop offset="100%" stopColor={item.color} stopOpacity="0.25" />
                  </linearGradient>
                ))}
              </defs>

              {/* Grid Lines */}
              <line x1="45" y1="40" x2="455" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="45" y1="100" x2="455" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="45" y1="160" x2="455" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

              {/* X axis labels and pillars */}
              {barData.map((item, idx) => {
                const colWidth = 42;
                const colSpacing = 82;
                const x = 55 + idx * colSpacing;
                
                // Max score is 100 mapping to 130px height max
                const colHeight = (item.val / 100) * 125;
                const y = 160 - colHeight;

                return (
                  <g key={idx}>
                    {/* Background hover box */}
                    <rect
                      x={x - 10}
                      y="20"
                      width={colWidth + 20}
                      height="150"
                      fill="rgba(255, 255, 255, 0.01)"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    />

                    {/* Glowing highlight rect on hover */}
                    <motion.rect
                      x={x - 4}
                      y={y - 4}
                      width={colWidth + 8}
                      height={colHeight + 4}
                      rx="4"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="1.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredBarIndex === idx ? 0.35 : 0 }}
                      transition={{ duration: 0.15 }}
                    />

                    {/* Gradient filled column rect */}
                    <motion.rect
                      x={x}
                      y={y}
                      width={colWidth}
                      height={colHeight}
                      rx="4"
                      fill={`url(#barGrad-${idx})`}
                      stroke={item.color}
                      strokeWidth="1"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      style={{ originY: '160px' }}
                      transition={{ type: 'spring', stiffness: 100, damping: 15, delay: idx * 0.08 }}
                    />

                    {/* X axis label */}
                    <text x={x + colWidth / 2} y="182" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">
                      {item.algo}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Custom Tooltip */}
            <AnimatePresence>
              {hoveredBarIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bg-[#0f1420] border border-slate-800 p-2.5 rounded-lg shadow-xl font-mono text-[10px] text-slate-300 pointer-events-none"
                  style={{
                    left: `${((55 + hoveredBarIndex * 82 + 21) / 500) * 100}%`,
                    top: `${((160 - (barData[hoveredBarIndex].val / 100) * 125) / 200) * 100 - 30}%`,
                    transform: 'translate(-50%, -100%)'
                  }}
                >
                  <div className="font-bold uppercase" style={{ color: barData[hoveredBarIndex].color }}>
                    {barData[hoveredBarIndex].algo} Load
                  </div>
                  <div className="text-slate-100 mt-0.5">LOAD SCORE: <strong className="text-white">{barData[hoveredBarIndex].val} / 100</strong></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* CHART 3: Memory Saturation (Bespoke Horizontal Bar Chart) */}
        <GlassCard className="p-6 border-slate-800/50" hoverable={false}>
          <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-6">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                Memory Hardness Allocations
              </h2>
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase">RAM COST COMP</span>
          </div>

          <div className="space-y-4 py-2">
            {memoryData.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.gradient}`} />
                    {item.algo}
                  </span>
                  <span className="text-slate-400 font-bold">{item.val} MB</span>
                </div>
                <div className="h-3 w-full bg-slate-950 border border-slate-900/60 rounded-full p-[1px] overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${item.gradient} shadow-[inset_0_0_8px_rgba(255,255,255,0.05)]`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 1.2, delay: idx * 0.08, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* CHART 4: CPU Core Saturation (Multi-Ring Radial Gauge) */}
        <GlassCard className="p-6 border-slate-800/50" hoverable={false}>
          <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-6">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                Peak CPU Core Saturation (%)
              </h2>
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase">MULTI-THREAD</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Concentric rings chart SVG */}
            <div className="flex justify-center">
              <svg viewBox="0 0 200 200" className="w-[170px] h-[170px] rotate-[-90deg] overflow-visible">
                {cpuRings.map((ring, idx) => {
                  const circ = 2 * Math.PI * ring.radius; // Circumference
                  const offset = circ - (circ * ring.load) / 100;

                  return (
                    <g key={idx}>
                      {/* Background track circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r={ring.radius}
                        fill="transparent"
                        stroke={ring.track}
                        strokeWidth="8.5"
                      />
                      {/* Interactive active sweep arc */}
                      <motion.circle
                        cx="100"
                        cy="100"
                        r={ring.radius}
                        fill="transparent"
                        stroke={ring.color}
                        strokeWidth="8.5"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        initial={{ strokeDashoffset: circ }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, delay: idx * 0.12, ease: 'easeOut' }}
                        className="shadow-md"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legends list */}
            <div className="space-y-3 font-mono text-xs">
              {cpuRings.map((ring, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-slate-950/30 border border-slate-900 rounded-lg hover:border-slate-800/80 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ring.color }} />
                    <span className="text-slate-400">{ring.name}</span>
                  </div>
                  <strong className="text-slate-200 font-bold">{ring.load}% Load</strong>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Comparisons warning / recommendations */}
      <GlassCard className="p-4 border-cyan-500/10 flex items-start gap-4 relative z-10" hoverable={false}>
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase">Cryptographic Optimization Advice</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
            Bespoke graphs normalize relative performance thresholds. For password storage configurations, prioritize algorithms with memory-hard scaling (like Argon2id) to actively slow down attackers using massive GPU clusters. Keep execution latency under 500ms for user login paths to preserve interface responsiveness.
          </p>
        </div>
      </GlassCard>

    </div>
  );
};

export default Analytics;
