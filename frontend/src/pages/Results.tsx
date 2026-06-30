import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Clock,
  Cpu,
  HardDrive,
  Calendar,
  X,
  Server,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Maximize2,
  ArrowUpDown
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

interface BenchmarkResult {
  id: string;
  algorithm: string;
  executionTime: number; // ms
  cpu: number; // %
  memory: number; // MB
  config: {
    workFactor?: number;
    memoryCost?: number;
    timeCost?: number;
    parallelism?: number;
    iterations?: number;
    payloadLength: number;
  };
  node: string;
  createdTime: string;
  status: 'SUCCESS' | 'OPTIMIZED' | 'STABLE';
  hash: string;
  securityRating: 'STRONG' | 'ADEQUATE' | 'WEAK';
  securityAdvice: string;
}

const MOCK_RESULTS: BenchmarkResult[] = [
  {
    id: 'HB-9082',
    algorithm: 'bcrypt',
    executionTime: 425,
    cpu: 82,
    memory: 18,
    config: { workFactor: 10, payloadLength: 20 },
    node: 'GPU Cluster 0',
    createdTime: '2026-06-26 14:15',
    status: 'SUCCESS',
    hash: '$2b$10$c29tZXNhbHQxMjM0NTY3OeVg2c7n2w8z9y4v5c6x7b8n9m0a1s2d',
    securityRating: 'STRONG',
    securityAdvice: 'Work factor cost is set to 10. Excellent resistance to offline brute-force cracking. Complies with industry security standards.'
  },
  {
    id: 'HB-9081',
    algorithm: 'argon2id',
    executionTime: 1842,
    cpu: 94,
    memory: 64,
    config: { memoryCost: 65536, timeCost: 3, parallelism: 4, payloadLength: 20 },
    node: 'Cloud-Node-West-1',
    createdTime: '2026-06-26 11:32',
    status: 'OPTIMIZED',
    hash: '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$R01hOTBhMXMyZDNmNGc1aDZqN2s4bDlvMHAx',
    securityRating: 'STRONG',
    securityAdvice: 'High memory usage parameter (64MB) restricts GPU cracking efficiency. Highly optimized configurations.'
  },
  {
    id: 'HB-9079',
    algorithm: 'pbkdf2-sha256',
    executionTime: 840,
    cpu: 76,
    memory: 12,
    config: { iterations: 600000, payloadLength: 16 },
    node: 'Thread Cluster',
    createdTime: '2026-06-25 18:22',
    status: 'SUCCESS',
    hash: 'pbkdf2_sha256$600000$c29tZXNhbHQ$4f5g6h7j8k9l0p1o2i3u4y5t6r7e8w9q',
    securityRating: 'ADEQUATE',
    securityAdvice: '600,000 iterations comply with standard OWASP guidelines. Standard defensive parameters.'
  },
  {
    id: 'HB-9076',
    algorithm: 'scrypt',
    executionTime: 620,
    cpu: 88,
    memory: 32,
    config: { payloadLength: 18 },
    node: 'GPU Cluster 0',
    createdTime: '2026-06-25 09:12',
    status: 'STABLE',
    hash: '$scrypt$ln=14,r=8,p=1$c29tZXNhbHQ$bTkweDFjM2I0djVjNng3YjhuOW0wYTFzMmQzZg',
    securityRating: 'STRONG',
    securityAdvice: 'N=16384 memory factor blocks ASIC cracking strategies successfully. High-grade cryptographic protection.'
  },
  {
    id: 'HB-9072',
    algorithm: 'SHA-256',
    executionTime: 22,
    cpu: 45,
    memory: 8,
    config: { payloadLength: 22 },
    node: 'Local Node Alpha',
    createdTime: '2026-06-24 15:40',
    status: 'SUCCESS',
    hash: 'a5f82c4d9e034a72fbc41029c4174ea839401ab38fc284d9fce10294b0cde194',
    securityRating: 'WEAK',
    securityAdvice: 'Extremely high speed execution. SHA-256 is vulnerable to high-speed hardware dictionary attacks. Avoid storing raw user password digests.'
  },
  {
    id: 'HB-9069',
    algorithm: 'bcrypt',
    executionTime: 54,
    cpu: 80,
    memory: 18,
    config: { workFactor: 6, payloadLength: 12 },
    node: 'Local Node Alpha',
    createdTime: '2026-06-23 10:05',
    status: 'STABLE',
    hash: '$2b$06$c29tZXNhbHQxMjM0NTY3OeTk5MDFjM2I0djVjNng3YjhuOW0wYTFz',
    securityRating: 'WEAK',
    securityAdvice: 'Work factor cost parameter is too low (cost: 6). Modern GPUs crack this cost in milliseconds. Minimum recommended cost factor is 10.'
  },
  {
    id: 'HB-9065',
    algorithm: 'argon2id',
    executionTime: 480,
    cpu: 90,
    memory: 16,
    config: { memoryCost: 16384, timeCost: 2, parallelism: 2, payloadLength: 14 },
    node: 'Cloud-Node-West-1',
    createdTime: '2026-06-22 17:15',
    status: 'SUCCESS',
    hash: '$argon2id$v=19$m=16384,t=2,p=2$c29tZXNhbHQ$dTNpN3U4aTlvMHAxczJkM2Y0ZzVoNmpr',
    securityRating: 'ADEQUATE',
    securityAdvice: 'Slightly low memory cost allocation (16MB). Consider upgrading to 64MB memory cost for stronger memory hardening.'
  },
  {
    id: 'HB-9060',
    algorithm: 'pbkdf2-sha256',
    executionTime: 150,
    cpu: 72,
    memory: 12,
    config: { iterations: 100000, payloadLength: 15 },
    node: 'Thread Cluster',
    createdTime: '2026-06-20 11:20',
    status: 'SUCCESS',
    hash: 'pbkdf2_sha256$100000$c29tZXNhbHQ$Mm4zYjR2NWM2eDdiOG45bTBhMXMyZDNmNGc1aDZq',
    securityRating: 'WEAK',
    securityAdvice: '100,000 iteration cycles are below modern standards. Upgrade iteration counts to 600,000+ loops.'
  }
];

export const Results: React.FC = () => {
  // Query states
  const [search, setSearch] = useState<string>('');
  const [algorithmFilter, setAlgorithmFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  // Modal states
  const [selectedResult, setSelectedResult] = useState<BenchmarkResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Copying hash digest utility
  const handleCopyHash = (hashText: string) => {
    navigator.clipboard.writeText(hashText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Search & Filter & Sort implementation
  const filteredResults = MOCK_RESULTS.filter((item) => {
    const query = search.toLowerCase();
    const matchSearch =
      item.id.toLowerCase().includes(query) ||
      item.algorithm.toLowerCase().includes(query) ||
      item.node.toLowerCase().includes(query);

    const matchAlgo = algorithmFilter === 'ALL' || item.algorithm.toLowerCase() === algorithmFilter.toLowerCase();

    return matchSearch && matchAlgo;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime();
      case 'time-asc':
        return a.executionTime - b.executionTime;
      case 'time-desc':
        return b.executionTime - a.executionTime;
      case 'cpu-desc':
        return b.cpu - a.cpu;
      case 'memory-desc':
        return b.memory - a.memory;
      case 'date-desc':
      default:
        return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
    }
  });

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 350, damping: 25 }
    }
  };

  return (
    <div className="space-y-6 relative cyber-grid py-2 px-1">
      {/* Decorative scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-repeat select-none z-0" />

      {/* Title */}
      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-3xl font-black tracking-wider text-slate-100 uppercase flex items-center gap-3">
          <Server className="w-8 h-8 text-cyan-400" />
          Benchmark Logs Archive
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Historical registry of benchmark telemetry runs. Review hardware loads, iteration costs, and compare cryptographic complexity configurations.
        </p>
      </div>

      {/* Controls / Filter Bar */}
      <GlassCard className="p-4 border-slate-800/50 relative z-10" hoverable={false}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search Input */}
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by ID, algorithm, node..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Algorithm Filter */}
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-slate-500">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <select
              value={algorithmFilter}
              onChange={(e) => setAlgorithmFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer appearance-none"
            >
              <option value="ALL">All Algorithms</option>
              <option value="bcrypt">bcrypt</option>
              <option value="argon2id">Argon2id</option>
              <option value="pbkdf2-sha256">PBKDF2</option>
              <option value="scrypt">scrypt</option>
              <option value="SHA-256">SHA-256</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-slate-500">
              <ArrowUpDown className="w-4 h-4" />
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer appearance-none"
            >
              <option value="date-desc">Date Completed (Newest)</option>
              <option value="date-asc">Date Completed (Oldest)</option>
              <option value="time-asc">Execution Latency (Fastest)</option>
              <option value="time-desc">Execution Latency (Slowest)</option>
              <option value="cpu-desc">CPU Utilization (Highest)</option>
              <option value="memory-desc">Memory Cost (Highest)</option>
            </select>
          </div>

        </div>
      </GlassCard>

      {/* Grid of Results Glass Cards */}
      <AnimatePresence mode="popLayout">
        {filteredResults.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 bg-slate-950/20 border border-slate-900 rounded-2xl relative z-10"
          >
            <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-mono font-bold text-slate-400 uppercase">No Telemetry Matches Found</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto mt-1">
              Adjust search filters or deployment parameters to view recorded historic benchmarks.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10"
          >
            {filteredResults.map((result) => {
              // Set border glow style based on security index
              let cardBorder = 'border-slate-800/40 hover:border-cyan-500/20';
              let badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
              if (result.securityRating === 'WEAK') {
                cardBorder = 'border-slate-800/40 hover:border-rose-500/20';
                badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
              } else if (result.securityRating === 'STRONG') {
                cardBorder = 'border-slate-800/40 hover:border-emerald-500/20';
                badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
              }

              return (
                <motion.div
                  key={result.id}
                  variants={cardVariants}
                  layoutId={`card-${result.id}`}
                  onClick={() => setSelectedResult(result)}
                  className="cursor-pointer h-full"
                >
                  <GlassCard className={`p-5 flex flex-col justify-between h-full relative group transition-all duration-300 glow-on-hover ${cardBorder}`} hoverable={true}>
                    
                    {/* Brackets */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-slate-700/30 group-hover:border-cyan-500/40 transition-colors" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-slate-700/30 group-hover:border-cyan-500/40 transition-colors" />

                    <div className="space-y-4">
                      {/* Top Header */}
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono text-cyan-400/80 font-bold tracking-widest bg-slate-950/60 border border-slate-900 px-2 py-0.5 rounded">
                          {result.id}
                        </span>
                        <span className={`text-[8px] font-mono font-bold px-2 py-0.5 border rounded uppercase ${badgeColor}`}>
                          {result.securityRating}
                        </span>
                      </div>

                      {/* Main Title / Algorithm */}
                      <div>
                        <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors uppercase">
                          {result.algorithm}
                        </h3>
                        <p className="text-[10px] font-mono text-slate-500 truncate mt-1">
                          Node: {result.node}
                        </p>
                      </div>

                      {/* Grid Metrics */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-800/40 text-center font-mono">
                        <div className="space-y-0.5">
                          <span className="text-[8px] text-slate-500 uppercase block">Time</span>
                          <span className="text-[11px] text-slate-300 font-bold block flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" /> {result.executionTime}ms
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[8px] text-slate-500 uppercase block">CPU Load</span>
                          <span className="text-[11px] text-slate-300 font-bold block flex items-center justify-center gap-1">
                            <Cpu className="w-3 h-3 text-violet-400" /> {result.cpu}%
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[8px] text-slate-500 uppercase block">Memory</span>
                          <span className="text-[11px] text-slate-300 font-bold block flex items-center justify-center gap-1">
                            <HardDrive className="w-3 h-3 text-emerald-400" /> {result.memory}MB
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-4 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {result.createdTime}
                      </span>
                      <span className="flex items-center gap-1 text-cyan-400 font-bold group-hover:translate-x-0.5 transition-transform">
                        DIAGNOSTICS <Maximize2 className="w-2.5 h-2.5" />
                      </span>
                    </div>

                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          DIAGNOSTIC DETAIL OVERLAY MODAL
          ======================================================== */}
      <AnimatePresence>
        {selectedResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResult(null)}
              className="absolute inset-0 bg-[#040609]/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              layoutId={`card-${selectedResult.id}`}
              className="bg-[#0f1420]/95 border border-white/[0.08] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative p-6 z-10 flex flex-col justify-between"
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            >
              {/* Tech corner accents */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/40 pointer-events-none" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/40 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/40 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/40 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedResult(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                
                {/* Header info */}
                <div className="pb-4 border-b border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded uppercase">
                      {selectedResult.id}
                    </span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {selectedResult.createdTime}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-100 tracking-wide mt-2 uppercase">
                    {selectedResult.algorithm} Engine Run Details
                  </h2>
                </div>

                {/* Grid stats layout */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1 text-center font-mono">
                    <span className="block text-[9px] text-slate-500 uppercase">EXECUTION SPEED</span>
                    <span className="block text-base text-slate-200 font-bold">{selectedResult.executionTime}ms</span>
                  </div>
                  <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1 text-center font-mono">
                    <span className="block text-[9px] text-slate-500 uppercase">TELEMETRY CPU</span>
                    <span className="block text-base text-cyan-400 font-bold">{selectedResult.cpu}%</span>
                  </div>
                  <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1 text-center font-mono">
                    <span className="block text-[9px] text-slate-500 uppercase">MEMORY HARDNESS</span>
                    <span className="block text-base text-violet-400 font-bold">{selectedResult.memory}MB</span>
                  </div>
                </div>

                {/* Configuration Breakdown list */}
                <div className="space-y-2">
                  <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    Coefficient Settings Matrix
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-950/40 p-4 border border-slate-900 rounded-xl font-mono text-xs text-slate-400">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-600 block uppercase">NODE NODE</span>
                      <strong className="text-slate-300 font-bold block">{selectedResult.node}</strong>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-600 block uppercase">PAYLOAD STRING</span>
                      <strong className="text-slate-300 font-bold block">{selectedResult.config.payloadLength} Chars</strong>
                    </div>
                    {selectedResult.config.workFactor && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-600 block uppercase">WORK FACTOR</span>
                        <strong className="text-slate-300 font-bold block">{selectedResult.config.workFactor} (Cost)</strong>
                      </div>
                    )}
                    {selectedResult.config.memoryCost && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-600 block uppercase">ARGON MEMORY</span>
                        <strong className="text-slate-300 font-bold block">{selectedResult.config.memoryCost} KB</strong>
                      </div>
                    )}
                    {selectedResult.config.timeCost && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-600 block uppercase">ARGON TIME</span>
                        <strong className="text-slate-300 font-bold block">{selectedResult.config.timeCost}</strong>
                      </div>
                    )}
                    {selectedResult.config.parallelism && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-600 block uppercase">PARALLELISM</span>
                        <strong className="text-slate-300 font-bold block">{selectedResult.config.parallelism} Cores</strong>
                      </div>
                    )}
                    {selectedResult.config.iterations && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-600 block uppercase">PBKDF2 LOOPS</span>
                        <strong className="text-slate-300 font-bold block">{selectedResult.config.iterations.toLocaleString()}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Security assessment */}
                <div className="space-y-2">
                  <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    Security Integrity Advisory
                  </span>
                  <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                    selectedResult.securityRating === 'STRONG'
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                      : selectedResult.securityRating === 'WEAK'
                        ? 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                        : 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400'
                  }`}>
                    {selectedResult.securityRating === 'STRONG' ? (
                      <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                    )}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono tracking-widest font-bold uppercase">
                        {selectedResult.securityRating} STABILITY INDEX
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {selectedResult.securityAdvice}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Output hash */}
                <div className="space-y-2">
                  <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    Recorded Cryptographic Signature (Hash)
                  </span>
                  <div className="relative">
                    <div className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-4 pr-12 py-3 font-mono text-[11px] text-slate-300 break-all select-all min-h-[46px] flex items-center">
                      {selectedResult.hash}
                    </div>
                    <button
                      onClick={() => handleCopyHash(selectedResult.hash)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 font-mono text-[9px]"
                      title="Copy hash to clipboard"
                    >
                      {copied ? (
                        <span className="text-emerald-400 font-bold uppercase">COPIED</span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Results;
