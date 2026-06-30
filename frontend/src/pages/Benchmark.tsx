import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Layers,
  Lock,
  Cpu,
  Activity,
  Terminal,
  Database,
  Hash,
  ChevronDown,
  ChevronUp,
  Settings
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

type AlgoType = 'bcrypt' | 'argon2id' | 'pbkdf2-sha256' | 'scrypt' | 'SHA-256';

interface ConsoleLog {
  time: string;
  message: string;
  type: 'info' | 'warn' | 'success';
}

export const Benchmark: React.FC = () => {
  // Form states
  const [algorithm, setAlgorithm] = useState<AlgoType>('bcrypt');
  const [password, setPassword] = useState<string>('CommandOverlord_2026');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(true);

  // Parameter states
  const [bcryptWorkFactor, setBcryptWorkFactor] = useState<number>(10);
  const [argonMemoryCost, setArgonMemoryCost] = useState<number>(65536);
  const [argonTimeCost, setArgonTimeCost] = useState<number>(3);
  const [argonParallelism, setArgonParallelism] = useState<number>(4);

  // Execution states
  const [runMode, setRunMode] = useState<'IDLE' | 'SYNC_RUNNING' | 'ASYNC_RUNNING' | 'FINISHED'>('IDLE');
  const [asyncStep, setAsyncStep] = useState<'QUEUED' | 'PROCESSING' | 'COMPUTING' | 'VERIFYING' | 'SUCCESS'>('QUEUED');
  const [asyncProgress, setAsyncProgress] = useState<number>(0);
  const [taskId, setTaskId] = useState<string>('');
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [ramUsage, setRamUsage] = useState<number>(0);
  const [hashOutput, setHashOutput] = useState<string>('');
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);

  // Refs for tracking animation loops
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Dynamic values helper
  const isBcrypt = algorithm === 'bcrypt';
  const isArgon = algorithm === 'argon2id';

  // Realistic Hash Output Generator
  const generateMockHash = (algo: AlgoType, passStr: string): string => {
    const saltB64 = 'c29tZXNhbHQxMjM0NTY3OQ';
    const passLen = passStr.length;
    switch (algo) {
      case 'bcrypt':
        return `$2b$${bcryptWorkFactor}$${saltB64.slice(0, 22)}${Array.from({ length: 31 }, (_, i) => String.fromCharCode(97 + ((passLen + i) % 26))).join('')}`;
      case 'argon2id':
        return `$argon2id$v=19$m=${argonMemoryCost},t=${argonTimeCost},p=${argonParallelism}$${saltB64}$${Array.from({ length: 32 }, (_, i) => String.fromCharCode(65 + ((passLen + i) % 26))).join('')}`;
      case 'pbkdf2-sha256':
        return `pbkdf2_sha256$600000$${saltB64.slice(0, 16)}$${Array.from({ length: 44 }, (_, i) => String.fromCharCode(48 + ((passLen + i) % 10))).join('')}`;
      case 'scrypt':
        return `$scrypt$ln=14,r=8,p=1$${saltB64.slice(0, 16)}$${Array.from({ length: 40 }, (_, i) => String.fromCharCode(97 + ((passLen + i) % 26))).join('')}`;
      case 'SHA-256':
      default:
        // A simulated hex digest of 64 characters
        return Array.from({ length: 64 }, (_, i) => ((passLen + i) % 16).toString(16)).join('');
    }
  };

  // Helper to add console logs
  const addLog = (message: string, type: 'info' | 'warn' | 'success' = 'info') => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    setConsoleLogs((prev) => [...prev, { time: timeStr, message, type }]);
  };

  // --- SYNC BENCHMARK RUN ---
  const handleRunSync = () => {
    if (runMode !== 'IDLE' && runMode !== 'FINISHED') return;
    
    setRunMode('SYNC_RUNNING');
    setExecutionTime(0);
    setCpuUsage(20);
    setRamUsage(18);
    setHashOutput('');
    setConsoleLogs([]);

    addLog(`Initializing local benchmark on node Alpha...`, 'info');
    addLog(`Targeting algorithm: ${algorithm.toUpperCase()}`, 'info');
    addLog(`Parameters synced. Hashing engine spin-up initialized.`, 'info');

    const duration = isBcrypt ? 2200 : isArgon ? 2800 : 1600; // ms
    startTimeRef.current = Date.now();

    // Fluctuating metric interval
    const statsInterval = setInterval(() => {
      setCpuUsage(() => Math.floor(75 + Math.random() * 15));
      setRamUsage(() => {
        const base = isArgon ? Math.min(95, 30 + (argonMemoryCost / 262144) * 50) : 25;
        return parseFloat((base + Math.random() * 4).toFixed(1));
      });
    }, 150);

    // Latency counter
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed < duration) {
        setExecutionTime(elapsed);
        timerRef.current = requestAnimationFrame(tick);
      } else {
        clearInterval(statsInterval);
        setExecutionTime(duration);
        setCpuUsage(0);
        setRamUsage(0);
        setHashOutput(generateMockHash(algorithm, password));
        setRunMode('FINISHED');
        addLog(`Workload cycle complete. Cryptographic check passed.`, 'success');
        addLog(`Resulting digest generated successfully. Output printed to console.`, 'success');
      }
    };
    timerRef.current = requestAnimationFrame(tick);
  };

  // --- ASYNC BENCHMARK RUN ---
  const handleRunAsync = () => {
    if (runMode !== 'IDLE' && runMode !== 'FINISHED') return;

    setRunMode('ASYNC_RUNNING');
    setAsyncStep('QUEUED');
    setAsyncProgress(0);
    setExecutionTime(0);
    setCpuUsage(5);
    setRamUsage(8);
    setHashOutput('');
    setConsoleLogs([]);

    const randId = `TASK-HB-${Math.floor(10000 + Math.random() * 90000)}`;
    setTaskId(randId);

    addLog(`Background runner spawned. Assigned unique Task ID: ${randId}`, 'info');
    addLog(`Pushing parameters to cluster registry queue...`, 'info');

    let currentStep: 'QUEUED' | 'PROCESSING' | 'COMPUTING' | 'VERIFYING' | 'SUCCESS' = 'QUEUED';
    startTimeRef.current = Date.now();

    // Async execution ticks count-up timer
    const timeInterval = setInterval(() => {
      setExecutionTime(Date.now() - startTimeRef.current);
    }, 50);

    // Polling step timeline simulation
    const steps = [
      {
        name: 'QUEUED' as const,
        duration: 900,
        run: () => {
          setAsyncProgress(12);
          setCpuUsage(12);
          setRamUsage(15);
          addLog(`Scheduler response: Registered successfully. Position: 1 in queue.`, 'info');
        }
      },
      {
        name: 'PROCESSING' as const,
        duration: 1400,
        run: () => {
          setAsyncProgress(38);
          setCpuUsage(55);
          setRamUsage(isArgon ? 45 : 22);
          addLog(`Resource lock acquired on node Cloud-West-1. Loading payloads...`, 'info');
        }
      },
      {
        name: 'COMPUTING' as const,
        duration: 1800,
        run: () => {
          setAsyncProgress(72);
          setCpuUsage(92);
          setRamUsage(isArgon ? Math.min(95, 35 + (argonMemoryCost / 262144) * 55) : 32);
          addLog(`Sat saturation computing limit active. Benchmarking hashing rounds...`, 'warn');
        }
      },
      {
        name: 'VERIFYING' as const,
        duration: 1000,
        run: () => {
          setAsyncProgress(94);
          setCpuUsage(30);
          setRamUsage(isArgon ? 28 : 12);
          addLog(`Validating cryptographic complexity coefficients...`, 'info');
        }
      },
      {
        name: 'SUCCESS' as const,
        duration: 0,
        run: () => {
          setAsyncProgress(100);
          setCpuUsage(0);
          setRamUsage(0);
          setHashOutput(generateMockHash(algorithm, password));
          setRunMode('FINISHED');
          clearInterval(timeInterval);
          addLog(`Task successfully completed by worker cluster. Uptime sync closed.`, 'success');
          addLog(`Cryptographic digest registered in node memory logs.`, 'success');
        }
      }
    ];

    let currentIdx = 0;
    const processSteps = () => {
      const stepConfig = steps[currentIdx];
      currentStep = stepConfig.name;
      setAsyncStep(currentStep);
      stepConfig.run();

      if (currentStep !== 'SUCCESS') {
        currentIdx++;
        setTimeout(processSteps, steps[currentIdx - 1].duration);
      }
    };

    processSteps();
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6 relative cyber-grid py-2 px-1">
      {/* Decorative scanning overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-repeat select-none z-0" />

      {/* Header */}
      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-3xl font-black tracking-wider text-slate-100 uppercase flex items-center gap-3">
          <Layers className="w-8 h-8 text-cyan-400 animate-pulse" />
          Benchmark Console
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Configure cryptographic hash parameters, fire up core thread engines, and analyze live simulation speeds, memory indices, and generated digests.
        </p>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* ========================================================
            LEFT PANE: Configuration Form
            ======================================================== */}
        <div className="space-y-6">
          <GlassCard className="p-6 border-slate-800/50 relative overflow-hidden h-full flex flex-col justify-between" hoverable={false}>
            {/* Tech Corner ticks */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/40" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/40" />

            <div className="space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/40">
                <Settings className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-mono font-bold tracking-wider text-slate-200 uppercase">
                  Engine Parameters Sync
                </h2>
              </div>

              {/* Form Controls */}
              <div className="space-y-5">
                
                {/* Algorithm Selection */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                    Target Cryptographic Algorithm
                  </label>
                  <div className="relative">
                    <select
                      value={algorithm}
                      onChange={(e) => setAlgorithm(e.target.value as AlgoType)}
                      disabled={runMode !== 'IDLE' && runMode !== 'FINISHED'}
                      className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="bcrypt">bcrypt (Blowfish Hashing)</option>
                      <option value="argon2id">Argon2id (Memory Hard KDF)</option>
                      <option value="pbkdf2-sha256">PBKDF2 (SHA-256 Iterations)</option>
                      <option value="scrypt">scrypt (Memory-Time hard)</option>
                      <option value="SHA-256">SHA-256 (Raw Compression Speed)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Password / Payload string */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest flex justify-between">
                    <span>Input String (Payload)</span>
                    <span className="text-slate-500 font-normal">{password.length} chars</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-600">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={runMode !== 'IDLE' && runMode !== 'FINISHED'}
                      placeholder="Enter string to hash..."
                      className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Collapsible Advanced Settings Accordion */}
                <div className="border border-slate-800/60 rounded-xl overflow-hidden bg-slate-950/20">
                  <button
                    type="button"
                    onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/40 hover:bg-slate-900/60 transition-colors border-b border-slate-800/40 text-xs font-mono text-slate-300"
                  >
                    <span className="flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-violet-400" />
                      ADVANCED CRYPTOGRAPHIC COEFFICIENTS
                    </span>
                    {isAdvancedOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isAdvancedOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-4 text-xs">
                          {/* bcrypt work factor */}
                          <div className={`space-y-2 p-3 rounded-lg border transition-all ${
                            isBcrypt
                              ? 'bg-slate-900/30 border-cyan-500/20'
                              : 'bg-slate-950/20 border-slate-900/40 opacity-40'
                          }`}>
                            <div className="flex justify-between font-mono">
                              <span className="text-slate-400 uppercase tracking-wider font-bold">bcrypt Work Factor (Cost)</span>
                              <span className={isBcrypt ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                                {isBcrypt ? bcryptWorkFactor : '10'} (2^{isBcrypt ? bcryptWorkFactor : '10'} rounds)
                              </span>
                            </div>
                            <input
                              type="range"
                              min="4"
                              max="16" // Reduced max slider limit to keep local runs snappy
                              value={bcryptWorkFactor}
                              onChange={(e) => setBcryptWorkFactor(Number(e.target.value))}
                              disabled={!isBcrypt || (runMode !== 'IDLE' && runMode !== 'FINISHED')}
                              className="w-full accent-cyan-400 disabled:opacity-50 cursor-pointer"
                            />
                            {!isBcrypt && (
                              <span className="text-[9px] text-slate-600 italic block mt-1">
                                Requires Bcrypt algorithm selection
                              </span>
                            )}
                          </div>

                          {/* Argon2 parameters */}
                          <div className={`space-y-4 p-3 rounded-lg border transition-all ${
                            isArgon
                              ? 'bg-slate-900/30 border-violet-500/20'
                              : 'bg-slate-950/20 border-slate-900/40 opacity-40'
                          }`}>
                            {/* Memory cost */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between font-mono">
                                <span className="text-slate-400 uppercase tracking-wider font-bold">Argon2 Memory Cost</span>
                                <span className={isArgon ? 'text-violet-400 font-bold' : 'text-slate-500'}>
                                  {argonMemoryCost.toLocaleString()} KB
                                </span>
                              </div>
                              <input
                                type="range"
                                min="1024"
                                max="262144"
                                step="1024"
                                value={argonMemoryCost}
                                onChange={(e) => setArgonMemoryCost(Number(e.target.value))}
                                disabled={!isArgon || (runMode !== 'IDLE' && runMode !== 'FINISHED')}
                                className="w-full accent-violet-400 disabled:opacity-50 cursor-pointer"
                              />
                            </div>

                            {/* Time Cost */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <div className="flex justify-between font-mono">
                                  <span className="text-slate-400 uppercase tracking-wider font-bold">Argon2 Time</span>
                                  <span className={isArgon ? 'text-violet-400 font-bold' : 'text-slate-500'}>
                                    {argonTimeCost}
                                  </span>
                                </div>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={argonTimeCost}
                                  onChange={(e) => setArgonTimeCost(Math.max(1, Number(e.target.value)))}
                                  disabled={!isArgon || (runMode !== 'IDLE' && runMode !== 'FINISHED')}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-center text-slate-200 focus:outline-none focus:border-violet-500 disabled:opacity-50"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex justify-between font-mono">
                                  <span className="text-slate-400 uppercase tracking-wider font-bold">Argon2 Threads</span>
                                  <span className={isArgon ? 'text-violet-400 font-bold' : 'text-slate-500'}>
                                    {argonParallelism}
                                  </span>
                                </div>
                                <input
                                  type="number"
                                  min="1"
                                  max="16"
                                  value={argonParallelism}
                                  onChange={(e) => setArgonParallelism(Math.max(1, Number(e.target.value)))}
                                  disabled={!isArgon || (runMode !== 'IDLE' && runMode !== 'FINISHED')}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-center text-slate-200 focus:outline-none focus:border-violet-500 disabled:opacity-50"
                                />
                              </div>
                            </div>

                            {!isArgon && (
                              <span className="text-[9px] text-slate-600 italic block mt-1">
                                Requires Argon2id algorithm selection
                              </span>
                            )}
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-800/40 relative z-10">
              <button
                type="button"
                onClick={handleRunSync}
                disabled={runMode !== 'IDLE' && runMode !== 'FINISHED'}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-black text-xs uppercase rounded-xl tracking-wider shadow-lg hover:from-cyan-400 hover:to-cyan-500 hover:shadow-cyan-500/10 hover:scale-[1.01] transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                Run Benchmark
              </button>

              <button
                type="button"
                onClick={handleRunAsync}
                disabled={runMode !== 'IDLE' && runMode !== 'FINISHED'}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 font-bold text-xs uppercase rounded-xl tracking-wider shadow-lg hover:bg-slate-800/80 hover:border-cyan-500/30 hover:scale-[1.01] transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Run Async
              </button>
            </div>
          </GlassCard>
        </div>

        {/* ========================================================
            RIGHT PANE: Live Telemetry & Pipeline
            ======================================================== */}
        <div className="space-y-6">
          <GlassCard className="p-6 border-slate-800/50 relative overflow-hidden h-full flex flex-col justify-between" hoverable={false}>
            {/* Tech Corner ticks */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-violet-500/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-violet-500/40" />

            {/* Title / Diagnostic Info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-violet-400" />
                <h2 className="text-sm font-mono font-bold tracking-wider text-slate-200 uppercase">
                  Engine Visual Telemetry
                </h2>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                runMode === 'IDLE'
                  ? 'bg-slate-800 text-slate-400'
                  : runMode === 'FINISHED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse'
              }`}>
                {runMode}
              </span>
            </div>

            {/* Inner Dashboard Viewports */}
            <div className="flex-1 flex flex-col justify-center my-6 gap-6 relative min-h-[350px]">
              
              {/* Conditional rendering based on RunMode */}
              {runMode === 'IDLE' ? (
                <div className="text-center space-y-4 py-8 relative">
                  <div className="flex justify-center">
                    <div className="relative w-20 h-20 rounded-full border border-slate-800 flex items-center justify-center bg-slate-950/40">
                      <div className="absolute inset-2 rounded-full border border-dashed border-slate-700/50 animate-spin-slow" />
                      <Lock className="w-6 h-6 text-slate-500 animate-float" />
                    </div>
                  </div>
                  <div className="space-y-1.5 max-w-sm mx-auto">
                    <h3 className="text-sm font-mono font-bold text-slate-300 uppercase">
                      Holographic Engine Static
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Awaiting algorithm deployment protocols. Trigger execution to initialize active telemetry pipelines.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 w-full">
                  {/* Particle Pipeline Animation */}
                  <div className="bg-slate-950/50 border border-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-28">
                    {/* Pipeline Grid underlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-repeat cyber-grid" />
                    
                    {/* Flowing SVG Particle Pipeline */}
                    <svg viewBox="0 0 500 120" className="w-full h-20 overflow-visible z-10">
                      {/* Grid Path lines */}
                      <path
                        d="M 20 60 L 150 60 L 200 90 L 300 90 L 350 60 L 480 60"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.04)"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 20 60 L 150 60 L 200 30 L 300 30 L 350 60 L 480 60"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.04)"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />

                      {/* Glowing pipe pathways when active */}
                      {(runMode === 'SYNC_RUNNING' || runMode === 'ASYNC_RUNNING') && (
                        <>
                          <motion.path
                            d="M 20 60 L 150 60 L 200 90 L 300 90 L 350 60 L 480 60"
                            fill="none"
                            stroke="rgba(6, 182, 212, 0.25)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            animate={{ strokeDasharray: ["0, 500", "500, 0"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          />
                          <motion.path
                            d="M 20 60 L 150 60 L 200 30 L 300 30 L 350 60 L 480 60"
                            fill="none"
                            stroke="rgba(168, 85, 247, 0.25)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            animate={{ strokeDasharray: ["0, 500", "500, 0"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          />

                          {/* Render flowing circles using offsetPath */}
                          {Array.from({ length: 4 }).map((_, idx) => (
                            <motion.circle
                              key={`p1-${idx}`}
                              r="4.5"
                              fill="#22d3ee"
                              className="shadow-[0_0_10px_#06b6d4]"
                              initial={{ offsetDistance: "0%" }}
                              animate={{ offsetDistance: "100%" }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: idx * 0.38,
                                ease: "linear"
                              }}
                              style={{
                                offsetPath: "path('M 20 60 L 150 60 L 200 90 L 300 90 L 350 60 L 480 60')",
                                position: 'absolute'
                              } as React.CSSProperties}
                            />
                          ))}

                          {Array.from({ length: 4 }).map((_, idx) => (
                            <motion.circle
                              key={`p2-${idx}`}
                              r="4.5"
                              fill="#c084fc"
                              className="shadow-[0_0_10px_#a855f7]"
                              initial={{ offsetDistance: "0%" }}
                              animate={{ offsetDistance: "100%" }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: idx * 0.38 + 0.19,
                                ease: "linear"
                              }}
                              style={{
                                offsetPath: "path('M 20 60 L 150 60 L 200 30 L 300 30 L 350 60 L 480 60')",
                                position: 'absolute'
                              } as React.CSSProperties}
                            />
                          ))}
                        </>
                      )}

                      {/* Connection Ports */}
                      <circle cx="20" cy="60" r="7" fill="#080b11" stroke="#06b6d4" strokeWidth="2.5" />
                      <circle cx="480" cy="60" r="7" fill="#080b11" stroke="#a855f7" strokeWidth="2.5" />
                      
                      {/* Port Labelings */}
                      <text x="15" y="42" fill="#06b6d4" fontSize="8" fontFamily="monospace" fontWeight="bold">INPUT</text>
                      <text x="450" y="42" fill="#a855f7" fontSize="8" fontFamily="monospace" fontWeight="bold">DIGEST</text>
                    </svg>
                  </div>

                  {/* Diagnostic stats row */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Execution Latency */}
                    <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1 text-center">
                      <span className="block text-[9px] font-mono text-slate-500 uppercase">EXECUTION TIME</span>
                      <span className="block font-mono text-base text-slate-200 font-bold">
                        {executionTime > 1000 ? `${(executionTime / 1000).toFixed(2)}s` : `${executionTime}ms`}
                      </span>
                    </div>

                    {/* Memory usage */}
                    <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1 text-center">
                      <span className="block text-[9px] font-mono text-slate-500 uppercase">MEMORY SAT</span>
                      <span className="block font-mono text-base text-violet-400 font-bold">
                        {ramUsage}%
                      </span>
                    </div>

                    {/* CPU integrity */}
                    <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1 text-center">
                      <span className="block text-[9px] font-mono text-slate-500 uppercase">CPU INTEGRITY</span>
                      <span className="block font-mono text-base text-cyan-400 font-bold">
                        {cpuUsage}%
                      </span>
                    </div>
                  </div>

                  {/* Async Status indicators */}
                  {runMode === 'ASYNC_RUNNING' && (
                    <div className="p-4 bg-slate-950/60 border border-cyan-500/10 rounded-xl space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                        <span className="text-slate-500">TASK ID: <strong className="text-slate-300 font-bold">{taskId}</strong></span>
                        <span className="text-cyan-400 font-semibold uppercase animate-pulse">{asyncStep}</span>
                      </div>
                      
                      {/* Async Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>POLLING WORKER COGNIZANCE</span>
                          <span>{asyncProgress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-900 border border-slate-800 rounded-full p-[1px] overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              asyncStep === 'SUCCESS' ? 'bg-emerald-500' : 'bg-cyan-500'
                            }`}
                            animate={{ width: `${asyncProgress}%` }}
                            transition={{ ease: 'easeOut', duration: 0.3 }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactive Terminal log */}
                  <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl font-mono text-[10px] leading-relaxed max-h-[140px] overflow-y-auto space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500 pb-1.5 border-b border-slate-900/60 mb-2">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>TELEMETRY LOGGER MODULE</span>
                    </div>
                    {consoleLogs.map((log, idx) => {
                      let col = 'text-slate-400';
                      if (log.type === 'warn') col = 'text-amber-400';
                      if (log.type === 'success') col = 'text-emerald-400';
                      return (
                        <div key={idx} className={col}>
                          <span className="text-slate-600">[{log.time}]</span> {log.message}
                        </div>
                      );
                    })}
                    {runMode === 'ASYNC_RUNNING' && asyncStep !== 'SUCCESS' && (
                      <div className="text-cyan-500/70 flex items-center gap-1.5 animate-pulse">
                        <span className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" /> Polling cluster nodes for task status...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cryptographic Hash Digest Output */}
            <div className="pt-4 border-t border-slate-800/40 relative z-10">
              <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Hash className="w-3 h-3 text-violet-400" />
                Resulting Cryptographic Digest Output
              </span>
              <div className="relative">
                <div className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 font-mono text-[11px] text-slate-400 break-all select-all min-h-[46px] flex items-center">
                  {hashOutput ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-emerald-400 font-bold"
                    >
                      {hashOutput}
                    </motion.span>
                  ) : (
                    <span className="text-slate-600 italic">
                      {runMode === 'SYNC_RUNNING' || runMode === 'ASYNC_RUNNING'
                        ? 'Computing digest calculations...'
                        : 'Awaiting execution trigger...'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Info Warning Message */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <GlassCard className="p-4 border-cyan-500/10 flex items-start gap-3.5" hoverable={false}>
          <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 h-fit">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase">Synchronous Engine Latency</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Synchronous runs lock the UI execution queue during the benchmark run. Ideal for brief, high-precision latency testing.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-violet-500/10 flex items-start gap-3.5" hoverable={false}>
          <div className="p-2.5 bg-violet-500/10 rounded-xl text-violet-400 h-fit">
            <Layers className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase">Asynchronous Workload Delegation</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Asynchronous runs delegate computation to background threads on server clusters. Best for resource-heavy computations (like Argon2id with high costs).
            </p>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};

export default Benchmark;
