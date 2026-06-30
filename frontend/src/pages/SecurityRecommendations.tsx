import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Terminal,
  SlidersHorizontal,
  Cpu
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

type ProjectType = 'saas' | 'edge' | 'legacy' | 'ledger';
type MemoryCap = 'allocated' | 'limited';
type ThreatLevel = 'standard' | 'critical';

interface RecommendationProfile {
  algoName: string;
  grade: string;
  securityLevel: string;
  trustBadge: string;
  reasons: string[];
  configDetails: {
    label: string;
    value: string;
  }[];
  alternatives: {
    name: string;
    grade: string;
    description: string;
  }[];
}

const RECOMMENDATIONS: Record<string, RecommendationProfile> = {
  argon2id: {
    algoName: 'Argon2id',
    grade: 'A+',
    securityLevel: 'MAXIMUM COLLISION RESISTANCE',
    trustBadge: 'NIST SP 800-63B COMPLIANT',
    reasons: [
      'Memory-hard design isolates and defeats GPU/ASIC parallel cracking clusters.',
      'Configurable multi-thread parallelism utilizes multicore server nodes efficiently.',
      'Supports high-entropy salting parameters to prevent rainbow table precomputation.'
    ],
    configDetails: [
      { label: 'Recommended Algorithm', value: 'Argon2id (m=65536, t=3, p=4)' },
      { label: 'Memory Cost', value: '65,536 KB (64 MB)' },
      { label: 'Time (Iterations)', value: '3 passes' },
      { label: 'Parallelism (Threads)', value: '4 CPU threads' },
      { label: 'Salt Length', value: '16 bytes (CSPRNG)' }
    ],
    alternatives: [
      { name: 'scrypt', grade: 'A', description: 'Memory-hard backup. Requires static RAM block buffer configurations.' },
      { name: 'bcrypt', grade: 'A-', description: 'CPU-bound standard. Safe alternative when memory blocks are volatile.' }
    ]
  },
  bcrypt: {
    algoName: 'bcrypt',
    grade: 'A-',
    securityLevel: 'OPTIMIZED RESOURCE DEFENSE',
    trustBadge: 'OWASP SECURE COMPLIANT',
    reasons: [
      'Zero memory foot-print guarantees protection against server out-of-memory crash loops.',
      'Adjustable work factor work costs scale processing complexity as hardware speed increases.',
      'Decades of cryptoanalysis testing establish it as the most stable web standard.'
    ],
    configDetails: [
      { label: 'Recommended Algorithm', value: 'bcrypt (Cost: 10)' },
      { label: 'Work Factor Cost', value: '10 (1024 hashing rounds)' },
      { label: 'Memory Alloc', value: '0 KB (Safe concurrent logins)' },
      { label: 'Max Payload Limit', value: '72 bytes input cap' },
      { label: 'Salt Length', value: '16 bytes (Auto-integrated)' }
    ],
    alternatives: [
      { name: 'scrypt', grade: 'A', description: 'Memory-hard variant. Set memory parameter N to lower block sizes.' },
      { name: 'PBKDF2', grade: 'B', description: 'FIPS compliant standard. Safe for embedded nodes with strict memory limits.' }
    ]
  },
  bcryptWrapper: {
    algoName: 'bcrypt Wrapper Layer',
    grade: 'A',
    securityLevel: 'LEGACY DATABASE SHIELD',
    trustBadge: 'OWASP HYBRID VERIFIED',
    reasons: [
      'Envelopes legacy digests (like MD5 / SHA-1) inside a secure Blowfish loop.',
      'Prevents massive database migration scripts during initial system transitions.',
      'Protects legacy tables from offline dictionary hash cracking runs.'
    ],
    configDetails: [
      { label: 'Recommended Algorithm', value: 'bcrypt Wrapper (SHA-256 + Cost: 10)' },
      { label: 'Wrapping Configuration', value: 'bcrypt(sha256(password))' },
      { label: 'Work Factor Cost', value: '10' },
      { label: 'Memory Allocation', value: '0 KB' },
      { label: 'Salt length', value: '16 bytes CSPRNG' }
    ],
    alternatives: [
      { name: 'Argon2id Wrapper', grade: 'A+', description: 'Maximum envelope hardening. Evaluates wrapped hash inside memory bounds.' }
    ]
  }
};

export const Recommendation: React.FC = () => {
  // Wizard input states
  const [projectType, setProjectType] = useState<ProjectType>('saas');
  const [memoryCapacity, setMemoryCapacity] = useState<MemoryCap>('allocated');
  const [threatIndex, setThreatIndex] = useState<ThreatLevel>('standard');

  // Synthesis states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [recommendedKey, setRecommendedKey] = useState<string>('argon2id');
  const [showRecommendation, setShowRecommendation] = useState<boolean>(true);

  // Simulated AI logs
  const logs = [
    'INITIALIZING ADVISORY PARAMETER WIZARD...',
    'EVALUATING ENVIRONMENT PLATFORM COEFFICIENTS...',
    'CALCULATING HOST MEMORY SATURATION TOLERANCE...',
    'MODELLING THREAT VECTOR COLLISION RESISTANCE...',
    'SYNTHESIZING CRYPTOGRAPHIC PROTOCOLS COMPILATION...'
  ];

  // AI Recommendation resolver logic
  const getRecommendationKey = (type: ProjectType, mem: MemoryCap): string => {
    if (type === 'legacy') {
      return 'bcryptWrapper';
    }
    if (type === 'edge' || mem === 'limited') {
      return 'bcrypt';
    }
    // High-security ledger or dedicated allocated memory
    return 'argon2id';
  };

  const handleSynthesize = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setShowRecommendation(false);

    // Increment analysis logs step-by-step
    const interval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < logs.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          const nextKey = getRecommendationKey(projectType, memoryCapacity);
          setRecommendedKey(nextKey);
          setIsAnalyzing(false);
          setShowRecommendation(true);
          return prev;
        }
      });
    }, 4500 / logs.length); // Total 4.5s simulation
  };

  const currentProfile = RECOMMENDATIONS[recommendedKey];

  return (
    <div className="space-y-6 relative cyber-grid py-2 px-1">
      {/* Decorative scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-repeat select-none z-0" />

      {/* Title */}
      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-3xl font-black tracking-wider text-slate-100 uppercase flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-cyan-400" />
          AI Cryptographic Advisor
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Input environment parameters, host specifications, and threat vectors to synthesize optimized password-hashing setups.
        </p>
      </div>

      {/* Main Grid: Selector Panel & Recommendation Output */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 relative z-10">
        
        {/* LEFT COLUMN: Environment Selector Panel (2 Cols) */}
        <div className="xl:col-span-2 space-y-6">
          <GlassCard className="p-6 border-slate-800/50 relative overflow-hidden h-full flex flex-col justify-between" hoverable={false}>
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/40" />

            <div className="space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/40">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-mono font-bold tracking-wider text-slate-200 uppercase">
                  Profile Environment Matrix
                </h2>
              </div>

              <div className="space-y-5">
                {/* 1. Project Type */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                    1. Target Project Environment
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as ProjectType)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
                  >
                    <option value="saas">SaaS Portal / standard web app</option>
                    <option value="edge">Edge IoT / Mobile Device (limited RAM)</option>
                    <option value="legacy">Legacy Wrap (Upgrade existing DB hashes)</option>
                    <option value="ledger">Financial Ledger / High-Value Target</option>
                  </select>
                </div>

                {/* 2. Host RAM limitations */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                    2. Host RAM Threshold Capacity
                  </label>
                  <select
                    value={memoryCapacity}
                    onChange={(e) => setMemoryCapacity(e.target.value as MemoryCap)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
                  >
                    <option value="allocated">Dedicated Host memory (64MB+ allocated per query)</option>
                    <option value="limited">Restricted memory (Serverless AWS Lambda / low RAM)</option>
                  </select>
                </div>

                {/* 3. Threat Index level */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                    3. Target Threat Profile Index
                  </label>
                  <select
                    value={threatIndex}
                    onChange={(e) => setThreatIndex(e.target.value as ThreatLevel)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
                  >
                    <option value="standard">Standard Level (Dictionary brute force defenses)</option>
                    <option value="critical">Critical Level (Saturate massive GPU/ASIC rigs)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleSynthesize}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-slate-950 font-black text-xs uppercase rounded-xl tracking-wider shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.01] transition-all duration-200 active:scale-[0.99] disabled:opacity-50 cursor-pointer mt-8"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              Synthesize AI Optimization
            </button>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Holographic Scanner / advisory Card (3 Cols) */}
        <div className="xl:col-span-3 flex flex-col justify-center min-h-[400px]">
          
          <AnimatePresence mode="wait">
            
            {/* 1. Processing Scanner Overlay */}
            {isAnalyzing && (
              <motion.div
                key="scanner"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full h-full"
              >
                <GlassCard className="p-8 h-full flex flex-col justify-between items-center text-center cyber-scanline relative border-cyan-500/20" hoverable={false}>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/40" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/40" />

                  <div className="flex-1 flex flex-col items-center justify-center space-y-6 my-10">
                    {/* Spinning loader ring */}
                    <div className="relative w-20 h-20 rounded-full border border-slate-900 flex items-center justify-center bg-slate-950/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                      <div className="absolute inset-1 rounded-full border border-dashed border-cyan-500/50 animate-spin-slow" />
                      <Cpu className="w-7 h-7 text-cyan-400 animate-pulse" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-mono font-bold tracking-widest text-slate-200 uppercase">
                        AI CRYPTO PARAMETER SCANNING...
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                        Evaluating entropy factors, hardware saturation points, and memory hard coefficients.
                      </p>
                    </div>
                  </div>

                  {/* Terminal output logs */}
                  <div className="w-full bg-slate-950 p-4 border border-slate-900 rounded-xl font-mono text-[10px] leading-relaxed text-cyan-400/90 text-left space-y-1 h-[80px]">
                    <div className="text-slate-600 flex items-center gap-1.5 pb-1 border-b border-slate-900/60 mb-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>ENGINE COGNIZANCE TELEMETRY</span>
                    </div>
                    <div className="truncate">
                      {logs[analysisStep]}
                    </div>
                    {analysisStep > 0 && (
                      <div className="text-slate-600 truncate">
                        &gt;&gt; {logs[analysisStep - 1]}
                      </div>
                    )}
                  </div>

                </GlassCard>
              </motion.div>
            )}

            {/* 2. Bespoke Recommendation Card */}
            {showRecommendation && (
              <motion.div
                key="recommendation-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                className="w-full h-full"
              >
                <GlassCard className="p-6 border-slate-800/60 relative overflow-hidden h-full flex flex-col justify-between group" hoverable={false}>
                  {/* Decorative outer glow spot */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Glowing corner bracket tech accents */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-violet-400/40 rounded-tl-sm pointer-events-none group-hover:border-violet-400/80 transition-colors" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-violet-400/40 rounded-tr-sm pointer-events-none group-hover:border-violet-400/80 transition-colors" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-violet-400/40 rounded-bl-sm pointer-events-none group-hover:border-violet-400/80 transition-colors" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-violet-400/40 rounded-tr-sm pointer-events-none group-hover:border-violet-400/80 transition-colors" />

                  <div className="space-y-6">
                    {/* Header Row: Title, score, and Trust Badge */}
                    <div className="pb-4 border-b border-slate-900 flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono text-violet-400 font-bold tracking-widest bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded uppercase">
                          AI Recommended Protocol
                        </span>
                        <h2 className="text-3xl font-black text-slate-100 tracking-wide mt-2 uppercase">
                          {currentProfile.algoName}
                        </h2>
                      </div>
                      
                      {/* Trust Badge */}
                      <div className="flex flex-col items-end text-right space-y-1">
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.15)] animate-pulse">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {currentProfile.trustBadge}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block mt-1">
                          SECURITY GRADE: <strong className="text-violet-400 font-bold">{currentProfile.grade}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Sub title / Security Level */}
                    <div className="flex justify-between items-center bg-slate-950/40 p-2 px-3 border border-slate-900 rounded-lg text-[10px] font-mono">
                      <span className="text-slate-500">PROTECTION LEVEL</span>
                      <strong className="text-violet-400 font-bold tracking-wider">{currentProfile.securityLevel}</strong>
                    </div>

                    {/* Reasoning list */}
                    <div className="space-y-2.5">
                      <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        ADVISORY ARCHITECTURE REASONINGS
                      </span>
                      <ul className="space-y-2 text-xs text-slate-400">
                        {currentProfile.reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-violet-400 font-bold font-mono">0{idx + 1}.</span>
                            <span className="leading-relaxed">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Configuration Parameter recommendations */}
                    <div className="space-y-2">
                      <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        OPTIMAL CONFIGURATION MATRIX
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950/40 p-4 border border-slate-900 rounded-xl font-mono text-xs">
                        {currentProfile.configDetails.map((cfg, idx) => (
                          <div key={idx} className="space-y-1">
                            <span className="text-[9px] text-slate-600 block uppercase">{cfg.label}</span>
                            <strong className="text-slate-200 font-bold block">{cfg.value}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Alternatives */}
                    <div className="space-y-2 pt-2">
                      <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        SECONDARY LEGACY OPTIONS
                      </span>
                      <div className="grid grid-cols-2 gap-4">
                        {currentProfile.alternatives.map((alt, idx) => (
                          <div key={idx} className="p-3 bg-slate-950/20 border border-slate-900/60 rounded-xl space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-slate-300 uppercase font-bold">{alt.name}</span>
                              <span className="text-slate-500">GRADE {alt.grade}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-normal font-sans">
                              {alt.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </GlassCard>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

      {/* AI recommendation details box */}
      <GlassCard className="p-4 border-cyan-500/10 flex items-start gap-4 relative z-10" hoverable={false}>
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
          <Award className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase">Automated Cryptographic Auditing</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
            This synthesizer recommends settings matching OWASP Secure Hashing and NIST SP 800-63B guidelines. As computational speeds double, periodically trigger AI re-optimization routines to adjust work factor costs and ensure maximum resistance profiles.
          </p>
        </div>
      </GlassCard>

    </div>
  );
};

export default Recommendation;
