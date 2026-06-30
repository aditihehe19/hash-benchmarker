import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  Info,
  SlidersHorizontal,
  Lock,
  Cpu
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

interface SecurityMetrics {
  securityScore: number;
  gpuResistance: number;
  memoryHardness: number;
  rainbowResistance: number;
  recommendedConfig: string;
  vulnerabilities: string;
  grade: string;
  gradeColor: string;
  color: string;
}

const ALGO_DATA: Record<string, SecurityMetrics> = {
  argon2id: {
    securityScore: 98,
    gpuResistance: 95,
    memoryHardness: 98,
    rainbowResistance: 99,
    recommendedConfig: 'Memory Cost: 65,536 KB (64MB), Time Cost: 3 iterations, Parallelism: 4 threads. Utilizes modern cryptographically secure salts (minimum 16 bytes).',
    vulnerabilities: 'Highly secure. No known significant vulnerabilities when parameters are configured to standard thresholds.',
    grade: 'A+',
    gradeColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    color: '#a855f7' // purple
  },
  bcrypt: {
    securityScore: 85,
    gpuResistance: 70,
    memoryHardness: 25,
    rainbowResistance: 99,
    recommendedConfig: 'Work Factor Cost: 10 or greater (increases iteration cycles exponentially). Integrates standard auto-salting structures.',
    vulnerabilities: 'Vulnerable to parallel GPU/FPGA cracking rings if work factor cost is configured below 10. Maximum input length is capped at 72 bytes.',
    grade: 'A-',
    gradeColor: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10',
    color: '#06b6d4' // cyan
  },
  scrypt: {
    securityScore: 88,
    gpuResistance: 82,
    memoryHardness: 80,
    rainbowResistance: 99,
    recommendedConfig: 'N=16384 (Memory factor), r=8 (Block size), p=1 (Parallelism). Requires sufficient memory buffer size.',
    vulnerabilities: 'Memory usage scales linearly, but lacks the defense-in-depth thread safety and GPU resistance features found in Argon2id.',
    grade: 'A',
    gradeColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    color: '#10b981' // emerald
  },
  'pbkdf2-sha256': {
    securityScore: 68,
    gpuResistance: 22,
    memoryHardness: 5,
    rainbowResistance: 99,
    recommendedConfig: 'Iterations: 600,000 cycles or greater. Comply with modern OWASP guidelines.',
    vulnerabilities: 'Very low memory footprint. Highly vulnerable to custom ASIC and FPGA parallel crack rigs which bypass loop iterations easily.',
    grade: 'B',
    gradeColor: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
    color: '#f59e0b' // amber
  },
  'SHA-256': {
    securityScore: 10,
    gpuResistance: 0,
    memoryHardness: 0,
    rainbowResistance: 10,
    recommendedConfig: 'Do not use for user password storage. Highly insecure. Only acceptable for fast, non-sensitive integrity hash calculations.',
    vulnerabilities: 'Extremely fast raw speeds make it open to parallel GPU/ASIC brute-force cracking or pre-computed Rainbow Table database lookups.',
    grade: 'F',
    gradeColor: 'text-rose-400 border-rose-500/20 bg-rose-500/10',
    color: '#f43f5e' // rose
  }
};

export const SecurityAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('argon2id');
  const [hoveredAlgo, setHoveredAlgo] = useState<string | null>(null);

  // Radar chart helper to generate polygon coordinates
  const getRadarCoordinates = (algoName: string) => {
    const data = ALGO_DATA[algoName];
    const cx = 150;
    const cy = 150;
    const maxR = 90; // maximum radius for 100 score

    const p1 = { x: cx, y: cy - (data.securityScore / 100) * maxR };
    const p2 = { x: cx + (data.gpuResistance / 100) * maxR, y: cy };
    const p3 = { x: cx, y: cy + (data.memoryHardness / 100) * maxR };
    const p4 = { x: cx - (data.rainbowResistance / 100) * maxR, y: cy };

    return `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`;
  };

  const activeMetrics = ALGO_DATA[activeTab];

  return (
    <div className="space-y-6 relative cyber-grid py-2 px-1">
      {/* Decorative scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-repeat select-none z-0" />

      {/* Header */}
      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-3xl font-black tracking-wider text-slate-100 uppercase flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-cyan-400 animate-pulse" />
          Security Analysis Report
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Audit password hashing algorithms against cracking simulations, memory hardware thresholds, and NIST SP 800-63B standards.
        </p>
      </div>

      {/* ========================================================
          UPPER PANEL: Radar Chart & Audit Summary
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
        
        {/* Left Side: Audit Overview & Radar Legend */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <GlassCard className="p-6 border-slate-800/50 h-full flex flex-col justify-between relative overflow-hidden" hoverable={false}>
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/40" />

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-900">
                <Info className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                  NIST Cryptographic Audit
                </h2>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Modern security compliance requires algorithms configured with memory-hard work factors to resist massive GPU parallel computing. Pre-computation table defenses are established using secure salts.
              </p>
            </div>

            {/* Radar Legend selector */}
            <div className="space-y-2 mt-6">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2">
                Concentric Grid Overlay Focus
              </span>
              <div className="space-y-2 font-mono text-xs">
                {Object.keys(ALGO_DATA).map((key) => {
                  const isActive = hoveredAlgo === key || (hoveredAlgo === null && activeTab === key);
                  return (
                    <div
                      key={key}
                      onMouseEnter={() => setHoveredAlgo(key)}
                      onMouseLeave={() => setHoveredAlgo(null)}
                      onClick={() => setActiveTab(key)}
                      className={`flex justify-between items-center p-2 bg-slate-950/40 border rounded-lg cursor-pointer transition-all duration-200 ${
                        isActive
                          ? 'border-cyan-500/30 bg-cyan-500/5 text-slate-100 shadow-sm'
                          : 'border-slate-900/60 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: ALGO_DATA[key].color }}
                        />
                        <span className="uppercase">{key}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${ALGO_DATA[key].gradeColor}`}>
                        GRADE {ALGO_DATA[key].grade}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </GlassCard>
        </div>

        {/* Right Side: Interactive SVG Radar Chart */}
        <div className="lg:col-span-3">
          <GlassCard className="p-6 border-slate-800/50 flex flex-col items-center justify-center relative overflow-hidden" hoverable={false}>
            {/* Corner ticks */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-violet-500/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-violet-500/40" />
            
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-3 text-center">
              MULTI-DIMENSIONAL CRACKING RESISTANCE VECTOR
            </span>

            {/* Radar SVG container */}
            <div className="relative w-[280px] h-[280px] flex items-center justify-center">
              <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
                {/* Concentric diamond grid rings (100%, 75%, 50%, 25%) */}
                <polygon points="150,60 240,150 150,240 60,150" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                <polygon points="150,82.5 217.5,150 150,217.5 82.5,150" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                <polygon points="150,105 195,150 150,195 105,150" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                <polygon points="150,127.5 172.5,150 150,172.5 127.5,150" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />

                {/* Axes Lines */}
                <line x1="150" y1="60" x2="150" y2="240" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                <line x1="60" y1="150" x2="240" y2="150" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />

                {/* Axes Labels */}
                <text x="150" y="48" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace" fontWeight="bold">SECURITY</text>
                <text x="248" y="153" textAnchor="start" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace" fontWeight="bold">GPU RESIST</text>
                <text x="150" y="258" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace" fontWeight="bold">MEMORY HARD</text>
                <text x="52" y="153" textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace" fontWeight="bold">RAINBOW TBL</text>

                {/* Render Polygons for all algorithms */}
                {Object.keys(ALGO_DATA).map((key) => {
                  const points = getRadarCoordinates(key);
                  const isHovered = hoveredAlgo === key;
                  const isTabActive = activeTab === key;
                  
                  // Set opacity based on focus state
                  let opacity = 0.35;
                  let strokeWidth = 1.5;
                  if (hoveredAlgo !== null) {
                    opacity = isHovered ? 0.7 : 0.1;
                    strokeWidth = isHovered ? 2.5 : 1;
                  } else {
                    opacity = isTabActive ? 0.6 : 0.2;
                    strokeWidth = isTabActive ? 2.5 : 1.2;
                  }

                  return (
                    <motion.polygon
                      key={key}
                      points={points}
                      fill={ALGO_DATA[key].color}
                      stroke={ALGO_DATA[key].color}
                      strokeWidth={strokeWidth}
                      initial={{ opacity: 0.1 }}
                      animate={{ opacity }}
                      transition={{ duration: 0.25 }}
                      className="cursor-pointer"
                      onClick={() => setActiveTab(key)}
                    />
                  );
                })}
              </svg>
            </div>

          </GlassCard>
        </div>

      </div>

      {/* ========================================================
          LOWER SECTION: Tabbed Diagnostic Report Console
          ======================================================== */}
      <GlassCard className="p-6 border-slate-800/50 relative z-10" hoverable={false}>
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-violet-500/40" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-violet-500/40" />

        {/* Tab buttons bar */}
        <div className="flex border-b border-slate-900 pb-3 gap-2 overflow-x-auto">
          {Object.keys(ALGO_DATA).map((key) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2.5 font-mono text-xs uppercase rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-400 border border-cyan-500/20 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>

        {/* Report Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
          
          {/* Left / Center Grid: Radial Progress Indicators (4 Indicators) */}
          <div className="xl:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                Verification Telemetry Gauges
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {/* Radial 1: Security Score */}
              <div className="flex flex-col items-center text-center space-y-3 bg-slate-950/30 p-4 border border-slate-900/60 rounded-2xl relative">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Security index</span>
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full rotate-[-90deg]">
                    <circle cx="40" cy="40" r="32" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="transparent"
                      stroke={activeMetrics.color}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="201"
                      initial={{ strokeDashoffset: 201 }}
                      animate={{ strokeDashoffset: 201 - (201 * activeMetrics.securityScore) / 100 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                  <span className="absolute font-mono text-sm font-black text-slate-200">{activeMetrics.securityScore}%</span>
                </div>
                <p className="text-[10px] text-slate-500 font-sans leading-relaxed">Overall complexity grade</p>
              </div>

              {/* Radial 2: GPU Resistance */}
              <div className="flex flex-col items-center text-center space-y-3 bg-slate-950/30 p-4 border border-slate-900/60 rounded-2xl relative">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">GPU Resistance</span>
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full rotate-[-90deg]">
                    <circle cx="40" cy="40" r="32" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="transparent"
                      stroke={activeMetrics.color}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="201"
                      initial={{ strokeDashoffset: 201 }}
                      animate={{ strokeDashoffset: 201 - (201 * activeMetrics.gpuResistance) / 100 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                  <span className="absolute font-mono text-sm font-black text-slate-200">{activeMetrics.gpuResistance}%</span>
                </div>
                <p className="text-[10px] text-slate-500 font-sans leading-relaxed">Parallel hack blocking</p>
              </div>

              {/* Radial 3: Memory Hardness */}
              <div className="flex flex-col items-center text-center space-y-3 bg-slate-950/30 p-4 border border-slate-900/60 rounded-2xl relative">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Memory Hardness</span>
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full rotate-[-90deg]">
                    <circle cx="40" cy="40" r="32" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="transparent"
                      stroke={activeMetrics.color}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="201"
                      initial={{ strokeDashoffset: 201 }}
                      animate={{ strokeDashoffset: 201 - (201 * activeMetrics.memoryHardness) / 100 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                  <span className="absolute font-mono text-sm font-black text-slate-200">{activeMetrics.memoryHardness}%</span>
                </div>
                <p className="text-[10px] text-slate-500 font-sans leading-relaxed">Required RAM cost factor</p>
              </div>

              {/* Radial 4: Rainbow Table Resistance */}
              <div className="flex flex-col items-center text-center space-y-3 bg-slate-950/30 p-4 border border-slate-900/60 rounded-2xl relative">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Precomput defense</span>
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full rotate-[-90deg]">
                    <circle cx="40" cy="40" r="32" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="transparent"
                      stroke={activeMetrics.color}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="201"
                      initial={{ strokeDashoffset: 201 }}
                      animate={{ strokeDashoffset: 201 - (201 * activeMetrics.rainbowResistance) / 100 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                  <span className="absolute font-mono text-sm font-black text-slate-200">{activeMetrics.rainbowResistance}%</span>
                </div>
                <p className="text-[10px] text-slate-500 font-sans leading-relaxed">Salting entropy index</p>
              </div>
            </div>
          </div>

          {/* Right Side: Usage Advisory Reports */}
          <div className="space-y-6">
            
            {/* Recommended Usage Config */}
            <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-2xl space-y-2">
              <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                RECOMMENDED CONFIGURATION
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeMetrics.recommendedConfig}
              </p>
            </div>

            {/* Vulnerabilities warnings */}
            <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-2xl space-y-2">
              <span className="text-[9px] font-mono text-rose-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                VULNERABILITIES LOGS
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {activeMetrics.vulnerabilities}
              </p>
            </div>

          </div>

        </div>

      </GlassCard>

      {/* bottom comparison tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <GlassCard className="p-4 border-emerald-500/10 flex items-start gap-4" hoverable={false}>
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase">Entropy Salting Matrix</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Always use cryptographically secure random salts (CSPRNG) of at least 16 bytes. Never reuse salts across logins. This neutralizes precomputed rainbow table attacks completely.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-violet-500/10 flex items-start gap-4" hoverable={false}>
          <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase">Work Factor Hardness scaling</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adjust work factors (iterations, threads, memory) every two years to account for hardware cracking speeds (Moore's law for cracking). Secure thresholds keep authentication costs high for crackers while fast for users.
            </p>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};

export default SecurityAnalysis;
