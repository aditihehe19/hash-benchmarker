import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Info,
  SlidersHorizontal,
  Lock,
  DollarSign,
  AlertTriangle,
  Clock
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

type AlgoType = 'bcrypt' | 'argon2id' | 'pbkdf2-sha256' | 'scrypt' | 'SHA-256';
type AttackerTier = 'standard' | 'syndicate' | 'state-sponsored';

export const AttackCost: React.FC = () => {
  // Wizard states
  const [dbSize, setDbSize] = useState<number>(1000000); // Record count
  const [algorithm, setAlgorithm] = useState<AlgoType>('bcrypt');
  const [attackerTier, setAttackerTier] = useState<AttackerTier>('syndicate');

  // Dynamic calculations logic
  const calculateTelemetry = () => {
    // Record multiplier factor
    const recordFactor = dbSize / 1000000;

    let baseCost = 0;
    let baseTimeSeconds = 0;
    let riskScore = 50; // 0 to 100 (0=secure, 100=critical)
    let difficulty = 'MODERATE';
    let riskLevel = 'WARNING';
    let riskColor = 'text-amber-400';
    let gaugeColor = '#f59e0b';
    let electricityCost = 0;
    let hardwareCost = 0;

    switch (algorithm) {
      case 'argon2id':
        baseCost = 15000000;
        baseTimeSeconds = 3600 * 24 * 365 * 10; // 10 Years
        riskScore = 12;
        difficulty = 'NIGHTMARE';
        riskLevel = 'SECURE LIMIT';
        riskColor = 'text-emerald-400';
        gaugeColor = '#10b981';
        break;
      case 'scrypt':
        baseCost = 8000000;
        baseTimeSeconds = 3600 * 24 * 365 * 6; // 6 Years
        riskScore = 20;
        difficulty = 'HIGH COMPLEXITY';
        riskLevel = 'STABLE DEFENSE';
        riskColor = 'text-emerald-400';
        gaugeColor = '#10b981';
        break;
      case 'bcrypt':
        baseCost = 1200000;
        baseTimeSeconds = 3600 * 24 * 365 * 2.5; // 2.5 Years
        riskScore = 32;
        difficulty = 'HIGH';
        riskLevel = 'STABLE DEFENSE';
        riskColor = 'text-cyan-400';
        gaugeColor = '#06b6d4';
        break;
      case 'pbkdf2-sha256':
        baseCost = 45000;
        baseTimeSeconds = 3600 * 24 * 12; // 12 Days
        riskScore = 78;
        difficulty = 'MODERATE';
        riskLevel = 'WARNING';
        riskColor = 'text-amber-400';
        gaugeColor = '#f59e0b';
        break;
      case 'SHA-256':
      default:
        baseCost = 150;
        baseTimeSeconds = 12; // 12 seconds
        riskScore = 98;
        difficulty = 'TRIVIAL';
        riskLevel = 'CRITICAL RISK';
        riskColor = 'text-rose-400';
        gaugeColor = '#f43f5e';
        break;
    }

    // Scale by attacker capabilities
    if (attackerTier === 'standard') {
      // Standard attacker has 1x GPU, taking longer but costing less capital
      baseCost = baseCost * 0.05 + 850;
      baseTimeSeconds = baseTimeSeconds * 50;
      riskScore = Math.max(5, riskScore - 15);
    } else if (attackerTier === 'state-sponsored') {
      // State-sponsored has ASIC farms. Time drops, capital cost rises
      baseCost = baseCost * 2.5 + 450000;
      baseTimeSeconds = baseTimeSeconds * 0.01;
      riskScore = Math.min(100, riskScore + 12);
    }

    // Apply record factor
    const totalCost = Math.round(baseCost * recordFactor);
    const timeSecs = baseTimeSeconds * recordFactor;
    electricityCost = Math.round(totalCost * 0.08);
    hardwareCost = Math.round(totalCost * 0.92);

    // Format time unit
    let timeString = '';
    if (timeSecs < 60) {
      timeString = `${timeSecs.toFixed(2)} seconds`;
    } else if (timeSecs < 3600) {
      timeString = `${Math.round(timeSecs / 60)} minutes`;
    } else if (timeSecs < 3600 * 24) {
      timeString = `${Math.round(timeSecs / 3600)} hours`;
    } else if (timeSecs < 3600 * 24 * 365) {
      timeString = `${Math.round(timeSecs / (3600 * 24))} days`;
    } else {
      timeString = `${(timeSecs / (3600 * 24 * 365)).toFixed(1)} years`;
    }

    // Double check risk categorizations
    if (riskScore < 25) {
      riskLevel = 'SECURE LIMIT';
      riskColor = 'text-emerald-400';
      gaugeColor = '#10b981';
    } else if (riskScore < 50) {
      riskLevel = 'STABLE DEFENSE';
      riskColor = 'text-cyan-400';
      gaugeColor = '#06b6d4';
    } else if (riskScore < 80) {
      riskLevel = 'WARNING';
      riskColor = 'text-amber-400';
      gaugeColor = '#f59e0b';
    } else {
      riskLevel = 'CRITICAL RISK';
      riskColor = 'text-rose-400';
      gaugeColor = '#f43f5e';
    }

    return {
      totalCost,
      timeString,
      difficulty,
      riskLevel,
      riskColor,
      riskScore,
      gaugeColor,
      electricityCost,
      hardwareCost
    };
  };

  const report = calculateTelemetry();

  // SVG Gauge calculations
  // Semicircle arc length = pi * radius = 3.14159 * 90 = 282.7
  const arcLength = 282.7;
  const dashOffset = arcLength - (arcLength * report.riskScore) / 100;

  // Semicircle center at (120, 120). Semicircle starts at angle 180 (left) and sweeps clockwise to angle 0 (right).
  // The needle line starts at (120, 120) and goes out to (120 - 75, 120) which is (45, 120) pointing left.
  // When rotating clockwise: 0 degrees points left (Secure), 180 degrees points right (Critical).
  const needleAngle = (report.riskScore / 100) * 180;

  return (
    <div className="space-y-6 relative cyber-grid py-2 px-1">
      {/* Decorative scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-repeat select-none z-0" />

      {/* Header */}
      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-3xl font-black tracking-wider text-slate-100 uppercase flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-rose-400 animate-pulse" />
          Threat Intelligence Dossier
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Evaluate attacker capital investments, loop cracking latencies, and physical electricity bills required to breach cryptographic payload databases.
        </p>
      </div>

      {/* Main Grid: Selector Panel & Intelligence Report */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 relative z-10">
        
        {/* LEFT COLUMN: Selector Configuration Panel (2 Cols) */}
        <div className="xl:col-span-2 space-y-6">
          <GlassCard className="p-6 border-slate-800/50 relative overflow-hidden h-full flex flex-col justify-between" hoverable={false}>
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/40" />

            <div className="space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/40">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-mono font-bold tracking-wider text-slate-200 uppercase">
                  Attack Scenario Matrix
                </h2>
              </div>

              <div className="space-y-5">
                {/* 1. Target Database Size */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest flex justify-between">
                    <span>1. Target Database Size</span>
                    <span className="text-cyan-400 font-bold font-mono">{(dbSize / 1000000).toFixed(1)}M Recs</span>
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="100000000"
                    step="10000"
                    value={dbSize}
                    onChange={(e) => setDbSize(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-600 mt-1">
                    <span>10K Records</span>
                    <span>100M Records</span>
                  </div>
                </div>

                {/* 2. Algorithm Dropdown */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                    2. Cryptographic Algorithm
                  </label>
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value as AlgoType)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
                  >
                    <option value="argon2id">Argon2id (PHC Winner)</option>
                    <option value="scrypt">scrypt (Memory-Hardened)</option>
                    <option value="bcrypt">bcrypt (Cost Factor: 10)</option>
                    <option value="pbkdf2-sha256">PBKDF2-SHA256 (Iterations: 600K)</option>
                    <option value="SHA-256">SHA-256 (Raw Compression)</option>
                  </select>
                </div>

                {/* 3. Attacker Capability Profile */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                    3. Attacker Capability Tier
                  </label>
                  <select
                    value={attackerTier}
                    onChange={(e) => setAttackerTier(e.target.value as AttackerTier)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
                  >
                    <option value="standard">Standard Hacker (Local RTX 4090 GPU)</option>
                    <option value="syndicate">Cloud GPU Syndicate (Hired 256x RTX 4090s)</option>
                    <option value="state-sponsored">State-Sponsored (ASIC Fabricated Array)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-600 text-center mt-8 pt-3 border-t border-slate-900/60 leading-relaxed uppercase">
              Estimator scales dictionary sweeps mathematically // Calculations synched
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Large Intelligence Card & SVG Gauge (3 Cols) */}
        <div className="xl:col-span-3">
          <GlassCard className="p-6 border-slate-800/60 relative overflow-hidden h-full flex flex-col justify-between group" hoverable={false}>
            {/* Tech accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-slate-700/30 pointer-events-none group-hover:border-cyan-500/40" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-slate-700/30 pointer-events-none group-hover:border-cyan-500/40" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-slate-700/30 pointer-events-none group-hover:border-cyan-500/40" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-slate-700/30 pointer-events-none group-hover:border-cyan-500/40" />

            <div className="space-y-6">
              
              {/* Header row */}
              <div className="pb-4 border-b border-slate-900 flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono text-rose-400 font-bold tracking-widest bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded uppercase">
                    CONFIDENTIAL // ACCESS restricted
                  </span>
                  <h2 className="text-xl font-black text-slate-200 mt-2 uppercase tracking-wide">
                    Threat Assessment Report
                  </h2>
                </div>
                
                {/* Risk Badge */}
                <div className="flex flex-col items-end text-right">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2.5 py-1 border rounded-full uppercase shadow-md ${report.riskColor}`}>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {report.riskLevel}
                  </span>
                </div>
              </div>

              {/* Grid content: Gauge left, metrics right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2">
                
                {/* SVG Gauge Dial Semicircle */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-[180px] h-[120px] overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 240 140" className="w-full h-full overflow-visible">
                      {/* Background arc */}
                      <path
                        d="M 30,120 A 90,90 0 0,1 210,120"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.04)"
                        strokeWidth="16"
                        strokeLinecap="round"
                      />
                      {/* Color threat gradient arc */}
                      <motion.path
                        d="M 30,120 A 90,90 0 0,1 210,120"
                        fill="none"
                        stroke={report.gaugeColor}
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={arcLength}
                        initial={{ strokeDashoffset: arcLength }}
                        animate={{ strokeDashoffset: dashOffset }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />

                      {/* Needle Dial indicator */}
                      <g transform="translate(120, 120)">
                        <motion.g
                          initial={{ rotate: 0 }}
                          animate={{ rotate: needleAngle }}
                          style={{ originX: '0px', originY: '0px' }}
                          transition={{ type: 'spring', stiffness: 70, damping: 15 }}
                        >
                          {/* Needle Line pointing left initially */}
                          <line
                            x1="0"
                            y1="0"
                            x2="-75"
                            y2="0"
                            stroke="#ffffff"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="shadow-md"
                          />
                          <polygon points="-75,0 -68,-4 -68,4" fill="#ffffff" />
                        </motion.g>
                        {/* Center Pin */}
                        <circle cx="0" cy="0" r="7" fill="#0f1420" stroke="#ffffff" strokeWidth="2.5" />
                      </g>
                    </svg>

                    <div className="absolute bottom-1 font-mono text-[10px] text-slate-500 font-bold">
                      RISK SCORE: <strong className="text-slate-100">{report.riskScore}%</strong>
                    </div>
                  </div>
                  
                  {/* Gauge indices mapping */}
                  <div className="flex justify-between w-[200px] text-[8px] font-mono text-slate-600 mt-2 px-2">
                    <span>0% SECURE</span>
                    <span>100% CRITICAL</span>
                  </div>
                </div>

                {/* Metrics Tickers Block */}
                <div className="space-y-4 font-mono text-xs text-slate-400">
                  {/* Estimated Cost */}
                  <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                    <span className="text-[9px] text-slate-500 block uppercase">ESTIMATED CAPITAL OVERHEAD</span>
                    <strong className="text-xl font-bold text-slate-200 block flex items-center">
                      <DollarSign className="w-4 h-4 text-cyan-400" />
                      {report.totalCost.toLocaleString()}
                    </strong>
                  </div>

                  {/* Time Estimate */}
                  <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                    <span className="text-[9px] text-slate-500 block uppercase">TIME ESTIMATE (TO CRACK)</span>
                    <strong className="text-sm font-bold text-slate-200 block flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-violet-400" />
                      {report.timeString}
                    </strong>
                  </div>

                  {/* Attack Difficulty */}
                  <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                    <span className="text-[9px] text-slate-500 block uppercase">ATTACK DIFFICULTY LEVEL</span>
                    <strong className="text-sm font-bold text-slate-200 block uppercase">
                      {report.difficulty}
                    </strong>
                  </div>
                </div>

              </div>

              {/* Cost break-down indices */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-900 font-mono text-xs text-slate-500">
                <div className="space-y-0.5">
                  <span className="text-[8px] uppercase">EST. EQUIPMENT (HARDWARE)</span>
                  <strong className="text-slate-300 block">${report.hardwareCost.toLocaleString()}</strong>
                </div>
                <div className="space-y-0.5 text-right">
                  <span className="text-[8px] uppercase">EST. ENERGY CONSUMPTION (ELECTRICITY)</span>
                  <strong className="text-slate-300 block">${report.electricityCost.toLocaleString()}</strong>
                </div>
              </div>

            </div>
          </GlassCard>
        </div>

      </div>

      {/* Explanatory Intelligence Assessment Section */}
      <GlassCard className="p-6 border-slate-800/50 relative z-10" hoverable={false}>
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/40" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/40" />

        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-900">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              Tactical Assessment Logs & Directive
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400 leading-relaxed font-sans">
            <div className="space-y-1.5 p-3.5 bg-slate-950/20 border border-slate-900/60 rounded-xl">
              <h4 className="font-mono font-bold text-slate-200 uppercase text-[10px]">Cloud GPU Rental Attack</h4>
              <p>
                Assumes the attacker leases virtual machines containing NVIDIA H100 or A100 Tensor Core GPUs from cloud providers. The rental overhead runs continuously. The attack cost equals cumulative rental fees.
              </p>
            </div>
            
            <div className="space-y-1.5 p-3.5 bg-slate-950/20 border border-slate-900/60 rounded-xl">
              <h4 className="font-mono font-bold text-slate-200 uppercase text-[10px]">Custom ASIC fabrication</h4>
              <p>
                For high-value corporate or financial databases, attackers will design custom semiconductor integrated circuits (ASICs) optimized purely for the algorithm loop. ASIC setups have huge initial development overhead but run at near-zero execution costs.
              </p>
            </div>
            
            <div className="space-y-1.5 p-3.5 bg-slate-950/20 border border-slate-900/60 rounded-xl">
              <h4 className="font-mono font-bold text-slate-200 uppercase text-[10px]">Energy Load constraints</h4>
              <p>
                Calculates power draw requirements in kilowatt-hours (kWh) based on average regional electricity grids. Hashing computations saturate core stress lines, generating thermal loads that require ventilation cooling overhead.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-900/60 text-xs text-slate-500 flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Defense Mandate:</strong> Upgrading from legacy SHA-256 to memory-hard Argon2id increases hardware fabrication overheads exponentially. To maintain an acceptable safety margin, ensure database brute force costs exceed the theoretical target information asset valuation.
            </span>
          </div>
        </div>
      </GlassCard>

    </div>
  );
};

export default AttackCost;
