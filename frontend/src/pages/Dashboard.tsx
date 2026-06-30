import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircle,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Cpu,
  Award,
  Activity,
  Terminal,
  Clock,
  Server,
  RefreshCw,
  TrendingUp,
  Settings,
  HardDrive
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import PageHeader from '../components/PageHeader';

interface LogItem {
  id: string;
  time: string;
  algo: string;
  node: string;
  speed: string;
  status: 'COMPLETED' | 'RUNNING' | 'OPTIMIZED';
}

const ALGORITHMS = ['argon2id', 'bcrypt', 'pbkdf2', 'scrypt', 'SHA-256'];
const NODES = ['GPU Cluster 0', 'Cloud-Node-West', 'Thread Cluster', 'Local Node Alpha'];
const SPEEDS = {
  argon2id: ['62.4 MH/s', '65.1 MH/s', '60.8 MH/s'],
  bcrypt: ['4.2 KH/s', '4.5 KH/s', '4.1 KH/s'],
  pbkdf2: ['845.2 KH/s', '860.0 KH/s', '830.4 KH/s'],
  scrypt: ['8.1 MH/s', '8.4 MH/s', '7.9 MH/s'],
  'SHA-256': ['12.8 GH/s', '13.1 GH/s', '12.5 GH/s'],
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // --- Real-time Simulated Telemetry States ---
  const [currentTime, setCurrentTime] = useState<string>('');
  const [cpuUsage, setCpuUsage] = useState<number>(68);
  const [ramUsage, setRamUsage] = useState<number>(54.2);
  const [totalBenchmarks, setTotalBenchmarks] = useState<number>(12842);
  const [latencyHistory, setLatencyHistory] = useState<number[]>([142, 138, 145, 141, 148, 139, 144, 140, 142, 145, 143, 141]);
  const [coreLoads, setCoreLoads] = useState<number[]>(Array.from({ length: 16 }, () => Math.random() * 100));
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(1232540); // Initial uptime seconds

  // Event stream state
  const [logs, setLogs] = useState<LogItem[]>([
    { id: '1', time: '20:01:45', algo: 'argon2id', node: 'Cloud-Node-West', speed: '62.4 MH/s', status: 'COMPLETED' },
    { id: '2', time: '20:03:12', algo: 'bcrypt', node: 'GPU Cluster 0', speed: '4.2 KH/s', status: 'COMPLETED' },
    { id: '3', time: '20:04:55', algo: 'SHA-256', node: 'Thread Cluster', speed: '12.8 GH/s', status: 'OPTIMIZED' },
    { id: '4', time: '20:05:30', algo: 'scrypt', node: 'GPU Cluster 0', speed: '8.1 MH/s', status: 'COMPLETED' },
  ]);

  // --- Clock & Uptime loop ---
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (num: number) => String(num).padStart(2, '0');
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Telemetry Fluctuation loops ---
  useEffect(() => {
    // Fluctuate CPU & RAM loading metrics
    const timer = setInterval(() => {
      setCpuUsage((prev) => {
        const change = (Math.random() - 0.5) * 8; // Change by up to 4%
        const next = prev + change;
        return Math.max(30, Math.min(95, parseFloat(next.toFixed(1))));
      });
      setRamUsage((prev) => {
        const change = (Math.random() - 0.5) * 1.2; // Change by up to 0.6%
        const next = prev + change;
        return Math.max(50, Math.min(65, parseFloat(next.toFixed(1))));
      });
      // Fluctuate CPU Core block loads
      setCoreLoads(Array.from({ length: 16 }, () => Math.random() * 100));
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  // --- Latency Sparkline loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      setLatencyHistory((prev) => {
        const currentVal = prev[prev.length - 1];
        const dev = (Math.random() - 0.5) * 10;
        const nextVal = Math.max(120, Math.min(165, Math.round(currentVal + dev)));
        return [...prev.slice(1), nextVal];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- Ticking total benchmarks up ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setTotalBenchmarks((prev) => prev + Math.floor(Math.random() * 2) + 1);
      }
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // --- Simulating live incoming benchmark logs ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const pad = (num: number) => String(num).padStart(2, '0');
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      const randomAlgo = ALGORITHMS[Math.floor(Math.random() * ALGORITHMS.length)];
      const randomNode = NODES[Math.floor(Math.random() * NODES.length)];
      const speedList = SPEEDS[randomAlgo as keyof typeof SPEEDS];
      const randomSpeed = speedList[Math.floor(Math.random() * speedList.length)];
      const randomStatus = Math.random() > 0.85 ? 'OPTIMIZED' : 'COMPLETED';

      const newLog: LogItem = {
        id: String(Date.now()),
        time: timeStr,
        algo: randomAlgo,
        node: randomNode,
        speed: randomSpeed,
        status: randomStatus as 'COMPLETED' | 'OPTIMIZED',
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 4)]);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  // Format uptime: dd:hh:mm:ss
  const formatUptime = (totalSecs: number) => {
    const d = Math.floor(totalSecs / (3600 * 24));
    const h = Math.floor((totalSecs % (3600 * 24)) / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  };

  // Sparkline SVG path calculations
  const sparkWidth = 140;
  const sparkHeight = 36;
  const maxLat = 170;
  const minLat = 110;
  const points = latencyHistory
    .map((val, idx) => {
      const x = (idx / (latencyHistory.length - 1)) * sparkWidth;
      const y = sparkHeight - ((val - minLat) / (maxLat - minLat)) * sparkHeight;
      return `${x},${y}`;
    })
    .join(' L ');
  const sparkPath = `M ${points}`;

  // Quick Action navigation helper
  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6 relative cyber-grid py-2 px-1">
      {/* Dynamic scanlines for full cybernetic effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-repeat select-none z-0" />

      {/* Page header for layout consistency */}
      <PageHeader
        title="Mission Control Telemetry"
        description="Coordinate password hash audits, monitor live AMD Epyc server load vectors, and inspect real-time queue tasks."
        icon={<Activity className="w-8 h-8 text-cyan-400" />}
      />

      {/* ========================================================
          TOP SECTION: Welcome Card & System Status
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Welcome / Commander Cockpit Card */}
        <div className="lg:col-span-2 relative overflow-hidden group">
          <GlassCard 
            className="p-6 h-full flex flex-col justify-between cyber-scanline relative border-cyan-500/10 glow-on-hover transition-all duration-300" 
            hoverable={false}
            techCorners={true}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 border border-cyan-400/30 rounded-xl text-cyan-400 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2" aria-live="polite">
                    <span className="text-[10px] tracking-[0.25em] font-mono text-cyan-400/70 font-semibold uppercase">Terminal Session: Active</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                  <h1 className="text-2xl font-black text-slate-100 tracking-wide uppercase mt-0.5 font-sans">
                    Mission Control Cockpit
                  </h1>
                </div>
              </div>

              <p className="text-slate-400 text-sm max-w-xl leading-relaxed font-normal">
                Welcome back, Operator. Cluster hashing speeds, cryptographic security protocols, and attack vector cost estimations are synchronized. Systems primed for performance evaluation.
              </p>
            </div>

            {/* Futuristic Telemetry Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800/60 font-mono text-xs">
              <div className="p-2.5 bg-slate-950/40 border border-slate-800/40 rounded-lg">
                <span className="block text-[10px] text-slate-500 uppercase">SYS AUTHORIZATION</span>
                <span className="font-semibold text-cyan-400 mt-1 block">LEVEL-OVERLORD</span>
              </div>
              <div className="p-2.5 bg-slate-950/40 border border-slate-800/40 rounded-lg">
                <span className="block text-[10px] text-slate-500 uppercase">TIME COORD</span>
                <span className="font-semibold text-slate-300 mt-1 block tracking-wider">{currentTime || '--:--:--'}</span>
              </div>
              <div className="p-2.5 bg-slate-950/40 border border-slate-800/40 rounded-lg">
                <span className="font-semibold text-violet-400 mt-1 block">HB-8492-X9</span>
                <span className="block text-[10px] text-slate-500 uppercase mt-0.5">SESSION ID</span>
              </div>
              <div className="p-2.5 bg-slate-950/40 border border-slate-800/40 rounded-lg">
                <span className="font-semibold text-emerald-400 mt-1 block">99.86% STABLE</span>
                <span className="block text-[10px] text-slate-500 uppercase mt-0.5">INTEGRITY MATRIX</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* System Status / Radar Sweep Card */}
        <div className="relative group">
          <GlassCard 
            className="p-6 h-full flex flex-col justify-between border-violet-500/10 glow-on-hover-purple transition-all duration-300 relative" 
            hoverable={false}
            techCorners={true}
          >

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-violet-400/80 font-bold uppercase">DIAGNOSTIC RADAR</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> OPERATIONAL
              </span>
            </div>

            {/* Conic Gradient Radar Simulation */}
            <div className="my-4 flex justify-center">
              <div className="relative w-28 h-28 rounded-full border border-violet-500/25 flex items-center justify-center bg-slate-950/50 shadow-[0_0_20px_rgba(168,85,247,0.05)] overflow-hidden">
                {/* Sweep element */}
                <div className="absolute inset-0 rounded-full radar-sweep-element pointer-events-none" />
                
                {/* Rings */}
                <div className="absolute w-20 h-20 rounded-full border border-violet-500/15" />
                <div className="absolute w-12 h-12 rounded-full border border-violet-500/10" />
                
                {/* Axis lines */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-violet-500/10" />
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-violet-500/10" />

                {/* Target blips */}
                <span className="absolute top-6 left-8 w-2 h-2 rounded-full bg-cyan-400/80 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
                <span className="absolute bottom-8 right-6 w-1.5 h-1.5 rounded-full bg-violet-400/80 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-ping" />
                
                <span className="text-[9px] font-mono font-bold text-slate-300 z-10 bg-slate-950/80 px-1 py-0.5 rounded border border-slate-800/40">
                  48°C
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/40">
              <div className="flex justify-between">
                <span>ACTIVE CLUSTERS</span>
                <span className="text-slate-200">18/18 NODES</span>
              </div>
              <div className="flex justify-between">
                <span>VENTILATION LOAD</span>
                <span className="text-slate-200">62% SPEED</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ========================================================
          METRIC CARDS SECTION (4 Columns with Animations)
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {/* Metric 1: Algorithms Tested */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="flex flex-col justify-between h-[135px] border-slate-800/40 hover:border-cyan-500/30 p-5 group" hoverable={true}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">ALGORITHMS TESTED</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2 font-mono flex items-baseline gap-1">
                  5 <span className="text-xs font-normal text-slate-500 font-sans">/ 5 Total</span>
                </h3>
              </div>
              <div className="p-2 bg-slate-800/50 border border-slate-700/30 rounded-xl text-cyan-400 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-all duration-300">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="truncate max-w-[150px] text-cyan-400/80">bcrypt, argon2id, scrypt...</span>
              <span className="text-emerald-400 font-semibold">ALL SYNCED</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Metric 2: Average Execution Time */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <GlassCard className="flex flex-col justify-between h-[135px] border-slate-800/40 hover:border-violet-500/30 p-5 group" hoverable={true}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">AVG LATENCY TIME</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2 font-mono">
                  {latencyHistory[latencyHistory.length - 1]}ms
                </h3>
              </div>
              <div className="p-2 bg-slate-800/50 border border-slate-700/30 rounded-xl text-violet-400 group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-all duration-300">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            {/* Mini SVG Sparkline Animation */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/40">
              <svg width={sparkWidth} height={sparkHeight} className="overflow-visible opacity-80 group-hover:opacity-100 transition-opacity">
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area path */}
                <path
                  d={`${sparkPath} L ${sparkWidth} ${sparkHeight} L 0 ${sparkHeight} Z`}
                  fill="url(#sparkGrad)"
                />
                {/* Line path */}
                <path
                  d={sparkPath}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Flashing Endpoint circle */}
                <circle
                  cx={sparkWidth}
                  cy={sparkHeight - ((latencyHistory[latencyHistory.length - 1] - minLat) / (maxLat - minLat)) * sparkHeight}
                  r="2.5"
                  fill="#ffffff"
                  className="animate-ping"
                />
              </svg>
              <div className="text-[9px] font-mono text-right text-slate-500 leading-none">
                <span>LATENCY</span>
                <span className="block text-violet-400 mt-0.5">LIVE</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Metric 3: Security Score */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="flex flex-col justify-between h-[135px] border-slate-800/40 hover:border-emerald-500/30 p-5 group" hoverable={true}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">SECURITY INDEX</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2 font-mono">
                  94 <span className="text-xs font-normal text-slate-500">/ 100</span>
                </h3>
              </div>
              <div className="p-2 bg-slate-800/50 border border-slate-700/30 rounded-xl text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            
            {/* Animated Ring Segment */}
            <div className="mt-3 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] font-mono">
              <span className="text-emerald-400 font-semibold">OPTIMAL CONFIG</span>
              <div className="flex items-center gap-1.5">
                <svg width="18" height="18" className="rotate-[-90deg]">
                  <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" fill="transparent" />
                  <motion.circle
                    cx="9"
                    cy="9"
                    r="7"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    fill="transparent"
                    strokeDasharray="44"
                    initial={{ strokeDashoffset: 44 }}
                    animate={{ strokeDashoffset: 44 - (44 * 94) / 100 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <span className="text-slate-300">94%</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Metric 4: Total Benchmarks */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard className="flex flex-col justify-between h-[135px] border-slate-800/40 hover:border-amber-500/30 p-5 group" hoverable={true}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">TOTAL RUNS DETECTED</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2 font-mono tracking-tight">
                  {totalBenchmarks.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 bg-slate-800/50 border border-slate-700/30 rounded-xl text-amber-400 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all duration-300">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <TrendingUp className="w-3 h-3" /> +12.4%
              </span>
              <span>vs last week</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ========================================================
          MAIN CONSOLE CONTENT: Quick Actions (Left) & Telemetry (Right)
          ======================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        
        {/* LEFT COLUMN: Quick Actions */}
        <div className="xl:col-span-2 space-y-6">
          <GlassCard className="p-6 border-slate-800/50 relative overflow-hidden h-full flex flex-col justify-between" hoverable={false}>
            {/* Corner styling */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400/60" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/60" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400/60" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400/60" />

            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800/40">
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-mono font-bold tracking-wider text-slate-200 uppercase">
                    Mission System Console Directory
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">4 ACTIVE SUITES</span>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Run Benchmark */}
                <motion.div
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleQuickAction('/dashboard/benchmark')}
                  className="flex flex-col justify-between p-5 bg-gradient-to-br from-[#0f1420]/80 to-[#141b2b]/60 border border-slate-800 hover:border-cyan-500/30 rounded-xl cursor-pointer transition-all duration-300 relative group/btn shadow-md glow-on-hover overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover/btn:bg-cyan-500/10 transition-colors duration-500 pointer-events-none" />
                  
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 group-hover/btn:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-400 font-bold uppercase tracking-wider">
                      CONSOLE
                    </span>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-bold text-slate-200 group-hover/btn:text-cyan-400 transition-colors">Run Benchmark</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Deploy hashing performance routines to connected GPU nodes. Evaluates hashes/sec and workload stability.
                    </p>
                  </div>
                </motion.div>

                {/* Analytics */}
                <motion.div
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleQuickAction('/dashboard/analytics')}
                  className="flex flex-col justify-between p-5 bg-gradient-to-br from-[#0f1420]/80 to-[#141b2b]/60 border border-slate-800 hover:border-violet-500/30 rounded-xl cursor-pointer transition-all duration-300 relative group/btn shadow-md glow-on-hover-purple overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl group-hover/btn:bg-violet-500/10 transition-colors duration-500 pointer-events-none" />
                  
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400 group-hover/btn:shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded text-violet-400 font-bold uppercase tracking-wider">
                      TELEMETRY
                    </span>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-bold text-slate-200 group-hover/btn:text-violet-400 transition-colors">Analytics Suite</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Inspect performance metrics, core scaling stats, memory allocations, and telemetry histories.
                    </p>
                  </div>
                </motion.div>

                {/* Recommendations */}
                <motion.div
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleQuickAction('/dashboard/recommendation')}
                  className="flex flex-col justify-between p-5 bg-gradient-to-br from-[#0f1420]/80 to-[#141b2b]/60 border border-slate-800 hover:border-emerald-500/30 rounded-xl cursor-pointer transition-all duration-300 relative group/btn shadow-md glow-on-hover overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover/btn:bg-emerald-500/10 transition-colors duration-500 pointer-events-none" />
                  
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 group-hover/btn:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 font-bold uppercase tracking-wider">
                      ADVISORY
                    </span>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-bold text-slate-200 group-hover/btn:text-emerald-400 transition-colors">Recommendations</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Examine parameter tuning guides and optimization suggestions to maximize cluster speed safety scores.
                    </p>
                  </div>
                </motion.div>

                {/* Security Analysis */}
                <motion.div
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleQuickAction('/dashboard/security')}
                  className="flex flex-col justify-between p-5 bg-gradient-to-br from-[#0f1420]/80 to-[#141b2b]/60 border border-slate-800 hover:border-amber-500/30 rounded-xl cursor-pointer transition-all duration-300 relative group/btn shadow-md glow-on-hover overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover/btn:bg-amber-500/10 transition-colors duration-500 pointer-events-none" />
                  
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 group-hover/btn:shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 font-bold uppercase tracking-wider">
                      SHIELD
                    </span>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-bold text-slate-200 group-hover/btn:text-amber-400 transition-colors">Security Analysis</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Evaluate system attack vectors, crack time estimations, and optimize algorithm complexity levels.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-500 text-center mt-5 pt-3 border-t border-slate-800/40">
              HASHBENCH DEPLOYMENT SUITES // SECURE NODE CLUSTERS INTEGRATED // VERSION 1.4.0
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Live Hardware Overview & Recent Activity */}
        <div className="space-y-6">
          
          {/* Live Hardware Overview */}
          <GlassCard className="p-6 border-slate-800/50 relative overflow-hidden" hoverable={false}>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400/40" />
            
            <div className="flex items-center gap-2 mb-5 pb-2.5 border-b border-slate-800/40">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                Live Hardware Telemetry
              </h2>
            </div>

            <div className="space-y-5">
              {/* CPU load */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" /> AMD EPYC 9654
                  </span>
                  <span className="text-cyan-400 font-semibold">{cpuUsage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-[1px]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
                    animate={{ width: `${cpuUsage}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                  />
                </div>
              </div>

              {/* RAM allocation */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-violet-400" /> System RAM
                  </span>
                  <span className="text-violet-400 font-semibold">{ramUsage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-[1px]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                    animate={{ width: `${ramUsage}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                  <span>ALLOC: 277.5 GB</span>
                  <span>LIMIT: 512.0 GB</span>
                </div>
              </div>

              {/* Thread Core Load Blocks */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                  Cores Telemetry Load Grid (16 Blocks)
                </span>
                <div className="grid grid-cols-8 gap-1 bg-slate-950/40 p-2 border border-slate-800/40 rounded-lg">
                  {coreLoads.map((load, idx) => {
                    let color = 'bg-emerald-500/25 border-emerald-500/40 text-emerald-400/80';
                    if (load > 75) {
                      color = 'bg-violet-500/35 border-violet-500/50 text-violet-400';
                    } else if (load > 40) {
                      color = 'bg-cyan-500/25 border-cyan-500/40 text-cyan-400/80';
                    }
                    return (
                      <motion.div
                        key={idx}
                        className={`aspect-square rounded border flex items-center justify-center text-[8px] font-mono ${color}`}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5 + (idx % 3) * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                        title={`Core ${idx + 1}: ${Math.round(load)}%`}
                      >
                        {Math.floor(load / 10)}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* OS info */}
              <div className="pt-3 border-t border-slate-800/40 space-y-2 text-[11px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>OPERATING SYSTEM:</span>
                  <span className="text-slate-200">Windows 11 Ent (x64)</span>
                </div>
                <div className="flex justify-between">
                  <span>CLUSTER NODE:</span>
                  <span className="text-slate-200">HASH-CLUSTER-09</span>
                </div>
                <div className="flex justify-between">
                  <span>SYSTEM UPTIME:</span>
                  <span className="text-cyan-400 font-semibold">{formatUptime(uptimeSeconds)}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Recent Activity / Event log */}
          <GlassCard className="p-6 border-slate-800/50 relative overflow-hidden" hoverable={false}>
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-violet-400/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-violet-400/40" />

            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/40">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-violet-400" />
                <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                  Telemetry Event Log
                </h2>
              </div>
              <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin-slow" />
            </div>

            {/* List with Animations */}
            <div className="space-y-3 font-mono text-xs max-h-[220px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="p-2.5 bg-slate-950/40 hover:bg-slate-900/40 border border-slate-800/40 hover:border-slate-800 rounded-lg flex flex-col gap-1.5 transition-colors"
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-600" /> {log.time}
                      </span>
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                          log.status === 'OPTIMIZED'
                            ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 font-sans flex items-center justify-between">
                      <span>
                        Run: <strong className="text-slate-100 font-mono">{log.algo}</strong> on {log.node}
                      </span>
                      <span className="text-emerald-400 font-mono font-semibold shrink-0 ml-1">{log.speed}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
