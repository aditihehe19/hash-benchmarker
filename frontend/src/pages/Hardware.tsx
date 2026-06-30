import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  HardDrive,
  Activity,
  Thermometer,
  Wind,
  Server,
  Zap,
  Clock,
  Radio,
  Settings
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

export const Hardware: React.FC = () => {
  // --- Simulated Live Telemetry States ---
  const [ramUsage, setRamUsage] = useState<number>(42.8); // GB
  const [cpuTemp, setCpuTemp] = useState<number>(48); // °C
  const [gpuTemp, setGpuTemp] = useState<number>(54); // °C
  const [vramUsage, setVramUsage] = useState<number>(68.4); // GB
  const [fanSpeed, setFanSpeed] = useState<number>(62); // %
  const [coreClock, setCoreClock] = useState<number>(2520); // MHz
  const [coreLoads, setCoreLoads] = useState<number[]>(Array.from({ length: 96 }, () => Math.random() * 100));

  // --- Telemetry updates loops ---
  useEffect(() => {
    const timer = setInterval(() => {
      // Oscillate RAM
      setRamUsage((prev) => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.max(210, Math.min(235, parseFloat((prev + delta).toFixed(1))));
      });
      // Oscillate CPU temperature
      setCpuTemp((prev) => {
        const delta = (Math.random() - 0.5) * 4;
        return Math.max(45, Math.min(58, Math.round(prev + delta)));
      });
      // Oscillate GPU temperature
      setGpuTemp((prev) => {
        const delta = (Math.random() - 0.5) * 3;
        return Math.max(50, Math.min(64, Math.round(prev + delta)));
      });
      // Oscillate VRAM usage
      setVramUsage((prev) => {
        const delta = (Math.random() - 0.5) * 3.5;
        return Math.max(120, Math.min(148, parseFloat((prev + delta).toFixed(1))));
      });
      // Oscillate Fan speed
      setFanSpeed((prev) => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.max(58, Math.min(66, Math.round(prev + delta)));
      });
      // Oscillate Core Clock
      setCoreClock((prev) => {
        const delta = (Math.random() - 0.5) * 20;
        return Math.max(2480, Math.min(2560, Math.round(prev + delta)));
      });
      // Update 96 physical core loads
      setCoreLoads(Array.from({ length: 96 }, () => Math.random() * 100));
    }, 1600);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 relative cyber-grid py-2 px-1">
      {/* Decorative scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-repeat select-none z-0" />

      {/* Header */}
      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-3xl font-black tracking-wider text-slate-100 uppercase flex items-center gap-3">
          <Server className="w-8 h-8 text-cyan-400 animate-pulse" />
          Hardware Telemetry Console
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Monitor system processor architectures, connected GPU graphics clusters, physical RAM speed allocations, and live multi-core thread load grids.
        </p>
      </div>

      {/* ========================================================
          UPPER GRID: Core Specifications Cards (4 Columns)
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        
        {/* Processor Card */}
        <GlassCard className="p-5 border-slate-800/50 hover:border-cyan-500/20 transition-all duration-300 relative group flex flex-col justify-between min-h-[145px]" hoverable={true}>
          {/* Tech ticks */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-slate-800 group-hover:border-cyan-500/40" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-slate-800 group-hover:border-cyan-500/40" />
          
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-cyan-400/80 font-bold uppercase tracking-widest block">PROCESSOR SOCKET</span>
              <h3 className="text-lg font-black text-slate-200 uppercase tracking-wide">AMD EPYC 9654</h3>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="p-2.5 bg-slate-900 border border-slate-800 text-cyan-400 rounded-xl"
            >
              <Cpu className="w-5 h-5" />
            </motion.div>
          </div>

          <div className="pt-2 border-t border-slate-900/60 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>ARCH: x86_64 (64-BIT)</span>
            <span className="text-cyan-400 font-semibold">TEMP: {cpuTemp}°C</span>
          </div>
        </GlassCard>

        {/* Operating System Card */}
        <GlassCard className="p-5 border-slate-800/50 hover:border-violet-500/20 transition-all duration-300 relative group flex flex-col justify-between min-h-[145px]" hoverable={true}>
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-slate-800 group-hover:border-violet-500/40" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-slate-800 group-hover:border-violet-500/40" />

          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-violet-400/80 font-bold uppercase tracking-widest block">PLATFORM OPERATING SYSTEM</span>
              <h3 className="text-lg font-black text-slate-200 uppercase tracking-wide">Windows 11 Ent</h3>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 text-violet-400 rounded-xl relative">
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <Radio className="w-5 h-5" />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900/60 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>NODE: HASH-CLUSTER-09</span>
            <span className="text-violet-400">ONLINE</span>
          </div>
        </GlassCard>

        {/* RAM Memory Card */}
        <GlassCard className="p-5 border-slate-800/50 hover:border-emerald-500/20 transition-all duration-300 relative group flex flex-col justify-between min-h-[145px]" hoverable={true}>
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-slate-800 group-hover:border-emerald-500/40" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-slate-800 group-hover:border-emerald-500/40" />

          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-emerald-400/80 font-bold uppercase tracking-widest block">PHYSICAL RAM</span>
                <h3 className="text-lg font-black text-slate-200 uppercase tracking-wide">512 GB DDR5</h3>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 text-emerald-400 rounded-xl">
                <HardDrive className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            
            {/* Live Progress loading bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>ACTIVE SYSTEM ALLOC</span>
                <span className="text-emerald-400 font-bold">{Math.round((ramUsage / 512) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 border border-slate-900 rounded-full overflow-hidden p-[0.5px]">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  animate={{ width: `${(ramUsage / 512) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 80 }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900/60 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>MEM CLOCK: 4800 MHz</span>
            <span className="text-slate-400 font-semibold">{ramUsage.toFixed(1)} GB USED</span>
          </div>
        </GlassCard>

        {/* Cores & Threads Card */}
        <GlassCard className="p-5 border-slate-800/50 hover:border-amber-500/20 transition-all duration-300 relative group flex flex-col justify-between min-h-[145px]" hoverable={true}>
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-slate-800 group-hover:border-amber-500/40" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-slate-800 group-hover:border-amber-500/40" />

          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-amber-400/80 font-bold uppercase tracking-widest block">CPU CORE TOPOLOGY</span>
              <h3 className="text-lg font-black text-slate-200 uppercase tracking-wide">96 Cores / 192 Th</h3>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 text-amber-400 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900/60 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>SOCKETS: 1 DUAL NODE</span>
            <span className="text-amber-400 font-semibold">192 LOGICAL</span>
          </div>
        </GlassCard>

      </div>

      {/* ========================================================
          LOWER GRID: GPU Diagnostics & Thread Load Matrix
          ======================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Side: GPU Cluster Telemetry Stats (2 Cols) */}
        <div className="xl:col-span-2 space-y-6">
          <GlassCard className="p-6 border-slate-800/50 relative overflow-hidden h-full flex flex-col justify-between" hoverable={false}>
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/40" />

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-mono font-bold tracking-wider text-slate-200 uppercase">
                    GPU Hashing Node Telemetry
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  8x NODES STABLE
                </span>
              </div>

              {/* Graphics cluster specs details */}
              <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-tr from-cyan-500 to-violet-500 rounded-xl text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                    <Zap className="w-4 h-4 fill-slate-950" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-black text-slate-200 uppercase">GPU Array: 8x NVIDIA RTX 4090</h3>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">16,384 CUDA Cores per Node | 131,072 aggregate cores</span>
                  </div>
                </div>

                {/* Sub gauges sliders */}
                <div className="grid grid-cols-2 gap-6 pt-3 border-t border-slate-900 font-mono text-xs">
                  
                  {/* GPU Temperature */}
                  <div className="space-y-1">
                    <span className="text-slate-500 flex items-center gap-1 uppercase text-[9px]">
                      <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Array Temp
                    </span>
                    <strong className="text-base text-slate-200 block">{gpuTemp}°C</strong>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden p-[0.5px]">
                      <motion.div
                        className="h-full bg-rose-500 rounded-full"
                        animate={{ width: `${(gpuTemp / 90) * 100}%` }}
                        transition={{ type: 'spring' }}
                      />
                    </div>
                  </div>

                  {/* VRAM allocation */}
                  <div className="space-y-1">
                    <span className="text-slate-500 flex items-center gap-1 uppercase text-[9px]">
                      <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Agg VRAM Alloc
                    </span>
                    <strong className="text-base text-slate-200 block">{vramUsage.toFixed(1)} GB</strong>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden p-[0.5px]">
                      <motion.div
                        className="h-full bg-cyan-500 rounded-full"
                        animate={{ width: `${(vramUsage / 192) * 100}%` }}
                        transition={{ type: 'spring' }}
                      />
                    </div>
                  </div>

                  {/* Fan Speed */}
                  <div className="space-y-1">
                    <span className="text-slate-500 flex items-center gap-1 uppercase text-[9px]">
                      <Wind className="w-3.5 h-3.5 text-violet-400 animate-spin-slow" /> Ventilator Load
                    </span>
                    <strong className="text-base text-slate-200 block">{fanSpeed}% Speed</strong>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden p-[0.5px]">
                      <motion.div
                        className="h-full bg-violet-500 rounded-full"
                        animate={{ width: `${fanSpeed}%` }}
                        transition={{ type: 'spring' }}
                      />
                    </div>
                  </div>

                  {/* Core Clock speed */}
                  <div className="space-y-1">
                    <span className="text-slate-500 flex items-center gap-1 uppercase text-[9px]">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Core Clock
                    </span>
                    <strong className="text-base text-slate-200 block">{coreClock} MHz</strong>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden p-[0.5px]">
                      <motion.div
                        className="h-full bg-amber-500 rounded-full"
                        animate={{ width: `${(coreClock / 2800) * 100}%` }}
                        transition={{ type: 'spring' }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Cluster nodes status boxes */}
              <div className="grid grid-cols-4 gap-3 font-mono text-[9px] text-center pt-2">
                {Array.from({ length: 8 }).map((_, idx) => {
                  const nodeTemp = Math.round(gpuTemp + (idx % 3) * 1.5 - 2);
                  let stateColor = 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5';
                  if (nodeTemp > 56) stateColor = 'border-amber-500/20 text-amber-400 bg-amber-500/5';
                  return (
                    <div key={idx} className={`p-2 border rounded-lg ${stateColor}`}>
                      <span className="block font-bold">NODE-0{idx}</span>
                      <strong className="block text-slate-200 mt-1">{nodeTemp}°C</strong>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-500 text-center mt-5 pt-3 border-t border-slate-900/60">
              PCI-E COUPLING GEN 5 x16 // DIRECT INTERCONNECT BANDWIDTH: 128 GB/s
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Live Thread Load Grid Matrix (1 Col) */}
        <div>
          <GlassCard className="p-6 border-slate-800/50 relative overflow-hidden h-full flex flex-col justify-between" hoverable={false}>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-violet-500/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-violet-500/40" />

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-900">
                <Activity className="w-4 h-4 text-violet-400 animate-pulse" />
                <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                  Physical Cores Telemetry Load (96 Cores)
                </h2>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal font-sans">
                Real-time workload distribution mapped across the 96 AMD Zen 4 hardware cores. Color indicates thermal stress.
              </p>

              {/* Grid of 96 block nodes */}
              <div className="grid grid-cols-8 gap-1 bg-slate-950/40 p-2.5 border border-slate-900 rounded-xl select-none">
                {coreLoads.map((load, idx) => {
                  let colorClass = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400/80';
                  if (load > 80) {
                    colorClass = 'bg-violet-500/35 border-violet-500/50 text-violet-300';
                  } else if (load > 45) {
                    colorClass = 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300/80';
                  }
                  return (
                    <motion.div
                      key={idx}
                      className={`aspect-square rounded border flex items-center justify-center text-[7px] font-mono ${colorClass}`}
                      animate={{ opacity: [0.65, 1, 0.65] }}
                      transition={{ duration: 1.2 + (idx % 4) * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                      title={`Core ${idx + 1}: ${Math.round(load)}%`}
                    >
                      {Math.floor(load / 10)}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Core Load Index guide */}
            <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 pt-3 border-t border-slate-900/60 mt-4">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> &lt;45% Idle
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> 45-80% Active
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> &gt;80% High Load
              </span>
            </div>

          </GlassCard>
        </div>

      </div>

      {/* Audit compliance notes */}
      <GlassCard className="p-4 border-cyan-500/10 flex items-start gap-4 relative z-10" hoverable={false}>
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
          <Zap className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase">Hardware Coupling Bandwidth</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
            CPU thread scheduling works in harmony with GPU hashing pipelines. Thermal indices are monitored continuously. Avoid runs exceeding 85°C to protect cluster integrity and prevent execution scaling drop-offs.
          </p>
        </div>
      </GlassCard>

    </div>
  );
};

export default Hardware;
