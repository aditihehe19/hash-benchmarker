import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  FileText,
  FileCode,
  CheckCircle2,
  SlidersHorizontal,
  ShieldCheck,
  Cpu,
  DollarSign,
  AlertTriangle,
  Info,
  Loader2,
  Trash2,
  Calendar,
  Hash,
  Layers,
  Settings,
  X
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

type ExportFormat = 'pdf' | 'json' | 'csv';
type WatermarkType = 'CONFIDENTIAL' | 'RESTRICTED' | 'TOP SECRET' | 'UNCLASSIFIED';

interface HistoryItem {
  id: string;
  title: string;
  format: ExportFormat;
  watermark: WatermarkType;
  size: string;
  hash: string;
  date: string;
}

interface Toast {
  id: number;
  message: string;
  format: ExportFormat;
}

// Compile process steps simulation - declared statically outside the component
const BUILD_STEPS = [
  'Initializing report generation buffers...',
  'Loading benchmarking telemetry variables...',
  'Rendering performance comparison curves...',
  'Querying cluster hardware profiles...',
  'Compiling cryptographic threat calculations...',
  'Generating secure SHA-256 document checksum...',
  'Signing report digest with node private keys...',
  'Assembling final download binaries...'
];

// Generate dynamic checksum hash based on state values - declared statically outside
const getDynamicHash = (
  title: string,
  watermark: WatermarkType,
  format: ExportFormat,
  includeScores: boolean,
  includeCharts: boolean,
  includeHardware: boolean,
  includeCosts: boolean
) => {
  const raw = `${title}-${watermark}-${format}-${includeScores}-${includeCharts}-${includeHardware}-${includeCosts}`;
  let hashVal = 0;
  for (let i = 0; i < raw.length; i++) {
    hashVal = (hashVal << 5) - hashVal + raw.charCodeAt(i);
    hashVal |= 0; // Convert to 32bit integer
  }
  const absHex = Math.abs(hashVal).toString(16).padEnd(8, 'f');
  return `sha256-${absHex}d8a4f91b72e6c5a083ef2b1cde40ff99a18d27b9c6f2e10`;
};

// Handle triggered downloads for custom formatting structures - declared statically outside
const triggerBrowserDownload = (
  title: string,
  fileFormat: ExportFormat,
  fileHash: string,
  watermark: WatermarkType
) => {
  let content = '';
  const dateStr = new Date().toISOString();

  if (fileFormat === 'json') {
    content = JSON.stringify({
      report: title,
      timestamp: dateStr,
      securityCompliance: '94%',
      classification: watermark,
      cryptographicSignature: fileHash,
      telemetry: {
        algorithms: ['Argon2id', 'bcrypt', 'scrypt', 'PBKDF2-SHA256', 'SHA-256'],
        complianceScore: 94,
        hostNodes: 18,
        averageLatencyMs: 486
      },
      hardware: {
        cores: 96,
        ram: '256GB ECC',
        gpu: '8x NVIDIA RTX 4090 Cluster'
      }
    }, null, 2);
  } else if (fileFormat === 'csv') {
    content = `Algorithm,Speed (ms),GPU Acceleration,Memory Cost,Security Grade,Risk Index\nArgon2id,1842.0,Yes,64MB,A+,12%\nbcrypt,1250.0,No,16KB,A,32%\nscrypt,800.0,Yes,32MB,A-,20%\nPBKDF2-SHA256,45.0,Yes,0,B-,78%\nSHA-256,0.012,Yes,0,F,98%\n`;
  } else {
    // PDF simulation layout (saved as printable plain text telemetry overview)
    content = `========================================================================
HASHBENCH SYSTEMS EXECUTIVE CRYPTOGRAPHIC AUDIT REPORT
========================================================================
TITLE: ${title.toUpperCase()}
CLASSIFICATION: ${watermark}
DATE GENERATED: ${dateStr}
AUDIT COMPLIANCE GRADE: A (94%)
VERIFIED BY: NIST SP 800-63B ALIGNMENT ENGINE
SIGNATURE CHECKSUM: ${fileHash}

SUMMARY:
------------------------------------------------------------------------
Security compliance indexes show stable posture across primary user databases.
Upgrades from raw compression algorithms (SHA-256) to memory-hard schemas
(Argon2id) are strongly advised to secure payloads against syndicate GPU cluster brute forcing.

HARDWARE ENVIRONMENT:
- Host Processors: AMD EPYC 96-Thread Server Cluster
- Core Memory: 256GB ECC DDR5 VRAM Nodes
- Secondary Cluster: 8x NVIDIA RTX 4090 GPU Array

========================================================================
REPORT AUTHENTICITY CONFIRMED // END OF DOCUMENT
========================================================================`;
  }

  const blob = new Blob([content], {
    type: fileFormat === 'json' ? 'application/json' : fileFormat === 'csv' ? 'text/csv' : 'text/plain'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_export.${fileFormat}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const ExportReport: React.FC = () => {
  // Config states
  const [reportTitle, setReportTitle] = useState('Cryptographic Telemetry Audit');
  const [watermark, setWatermark] = useState<WatermarkType>('CONFIDENTIAL');
  const [format, setFormat] = useState<ExportFormat>('pdf');
  
  // Section toggle states
  const [includeScores, setIncludeScores] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeHardware, setIncludeHardware] = useState(true);
  const [includeCosts, setIncludeCosts] = useState(true);

  // Generator build simulation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'rpt-1',
      title: 'Q2 Security Threat Assessment',
      format: 'pdf',
      watermark: 'TOP SECRET',
      size: '2.4 MB',
      hash: 'f8e2b5c0882f8a55d17a8c9e0f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8',
      date: '2026-06-25 14:32'
    },
    {
      id: 'rpt-2',
      title: 'Raw Telemetry Dump',
      format: 'json',
      watermark: 'UNCLASSIFIED',
      size: '4.8 MB',
      hash: 'c90da381771feab301ff2a5f1e8a937a0db238a2e1d0f8ac741b12ce0ff5',
      date: '2026-06-24 09:15'
    },
    {
      id: 'rpt-3',
      title: 'Performance Latency Matrix',
      format: 'csv',
      watermark: 'RESTRICTED',
      size: '840 KB',
      hash: 'e92cb832145fa82de70f2a41d9e23b7e0df39a2f1b0a8cd642b12cf0ff3',
      date: '2026-06-23 18:45'
    }
  ]);

  const dynamicHash = getDynamicHash(
    reportTitle,
    watermark,
    format,
    includeScores,
    includeCharts,
    includeHardware,
    includeCosts
  );

  const handleGenerateReport = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setBuildStep(0);
    setBuildLogs([`[INFO] Starting report compilation for "${reportTitle}"`]);
  };

  useEffect(() => {
    if (!isGenerating) return;

    if (buildStep < BUILD_STEPS.length) {
      const timer = setTimeout(() => {
        setBuildLogs((prev) => [...prev, `[OK] ${BUILD_STEPS[buildStep]}`]);
        setBuildStep((prev) => prev + 1);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsGenerating(false);
        
        // Add to history
        const newId = `rpt-${Date.now()}`;
        const newReport: HistoryItem = {
          id: newId,
          title: reportTitle,
          format: format,
          watermark: watermark,
          size: format === 'pdf' ? '2.4 MB' : format === 'json' ? '42 KB' : '1.2 KB',
          hash: dynamicHash.replace('sha256-', ''),
          date: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };

        setHistory((prev) => [newReport, ...prev]);

        // Add toast success
        const toastId = Date.now();
        setToasts((prev) => [
          ...prev,
          {
            id: toastId,
            message: `"${reportTitle}" generated successfully.`,
            format: format
          }
        ]);

        // Auto remove toast
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toastId));
        }, 4000);

        // Download the file
        triggerBrowserDownload(reportTitle, format, dynamicHash, watermark);

      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, buildStep, reportTitle, format, watermark, dynamicHash]);

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 relative py-2 px-1">
      {/* Decorative background grid and laser coordinates */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-repeat select-none z-0" />

      {/* Header */}
      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-3xl font-black tracking-wider text-slate-100 uppercase flex items-center gap-3">
          <Layers className="w-8 h-8 text-cyan-400" />
          Audit Export Center
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Compile cryptographic performance indicators, node configurations, and brute-force cost projections into downloadable files.
        </p>
      </div>

      {/* Toast Alert Stack */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm pointer-events-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 50, transition: { duration: 0.2 } }}
              className="bg-slate-950/90 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md rounded-xl p-4 flex gap-3 items-start relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-1 bg-emerald-500 w-full animate-[shrink_4s_linear_forwards]" />
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <span className="text-xs font-mono font-bold text-slate-200 block uppercase tracking-wider">Report Generated</span>
                <p className="text-[11px] text-slate-400 leading-normal">{toast.message}</p>
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 inline-block mt-1">
                  Format: {toast.format.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-slate-500 hover:text-slate-300 p-0.5 hover:bg-slate-900 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Row: Controller on Left, Document Preview on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 relative z-10">

        {/* LEFT COLUMN: Report Designer & Settings (2 Cols) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Settings Customizer Card */}
          <GlassCard className="p-6 border-slate-800/50 relative overflow-hidden" hoverable={false}>
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/40" />

            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800/40">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-mono font-bold tracking-wider text-slate-200 uppercase">
                  Report Configuration
                </h2>
              </div>

              {/* Input: Report Title */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                  Report Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  disabled={isGenerating}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter audit title..."
                />
              </div>

              {/* Selector: Watermark Classification */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                  Security Classification
                </label>
                <select
                  value={watermark}
                  disabled={isGenerating}
                  onChange={(e) => setWatermark(e.target.value as WatermarkType)}
                  className="w-full bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-800 hover:border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
                >
                  <option value="CONFIDENTIAL">CONFIDENTIAL // INTERNAL USE ONLY</option>
                  <option value="RESTRICTED">RESTRICTED // DEPT AUDIT ONLY</option>
                  <option value="TOP SECRET">TOP SECRET // PRIORITY CLASSIFIED</option>
                  <option value="UNCLASSIFIED">UNCLASSIFIED // PUBLIC RELEASE</option>
                </select>
              </div>

              {/* Selector: Export format */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                  Target Export Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['pdf', 'json', 'csv'] as ExportFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      disabled={isGenerating}
                      onClick={() => setFormat(fmt)}
                      className={`py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider border cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5 uppercase ${
                        format === fmt
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]'
                          : 'bg-slate-950/40 text-slate-500 border-slate-900 hover:border-slate-800 hover:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {fmt === 'pdf' && <FileText className="w-3.5 h-3.5" />}
                      {fmt === 'json' && <FileCode className="w-3.5 h-3.5" />}
                      {fmt === 'csv' && <FileCode className="w-3.5 h-3.5" />}
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checklist: Included sections */}
              <div className="space-y-3 pt-2">
                <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-900/60">
                  Included Data Modules
                </label>
                
                {/* 1. Telemetry Security Scores */}
                <label className={`flex items-center gap-3 text-xs font-mono select-none ${isGenerating ? 'opacity-50 cursor-not-allowed text-slate-500' : 'cursor-pointer text-slate-300 group'}`}>
                  <input
                    type="checkbox"
                    checked={includeScores}
                    disabled={isGenerating}
                    onChange={(e) => setIncludeScores(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0 accent-cyan-500 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span className={isGenerating ? '' : 'group-hover:text-slate-100 transition-colors'}>Telemetry Security Overview</span>
                </label>

                {/* 2. Performance Comparison Charts */}
                <label className={`flex items-center gap-3 text-xs font-mono select-none ${isGenerating ? 'opacity-50 cursor-not-allowed text-slate-500' : 'cursor-pointer text-slate-300 group'}`}>
                  <input
                    type="checkbox"
                    checked={includeCharts}
                    disabled={isGenerating}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0 accent-cyan-500 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span className={isGenerating ? '' : 'group-hover:text-slate-100 transition-colors'}>Algorithm Speed Charts</span>
                </label>

                {/* 3. Hardware Configuration profile */}
                <label className={`flex items-center gap-3 text-xs font-mono select-none ${isGenerating ? 'opacity-50 cursor-not-allowed text-slate-500' : 'cursor-pointer text-slate-300 group'}`}>
                  <input
                    type="checkbox"
                    checked={includeHardware}
                    disabled={isGenerating}
                    onChange={(e) => setIncludeHardware(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0 accent-cyan-500 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span className={isGenerating ? '' : 'group-hover:text-slate-100 transition-colors'}>Hardware Infrastructure profile</span>
                </label>

                {/* 4. Threat Cost Cracking estimation */}
                <label className={`flex items-center gap-3 text-xs font-mono select-none ${isGenerating ? 'opacity-50 cursor-not-allowed text-slate-500' : 'cursor-pointer text-slate-300 group'}`}>
                  <input
                    type="checkbox"
                    checked={includeCosts}
                    disabled={isGenerating}
                    onChange={(e) => setIncludeCosts(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0 accent-cyan-500 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span className={isGenerating ? '' : 'group-hover:text-slate-100 transition-colors'}>Threat cracking cost assessment</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <button
                  disabled={isGenerating}
                  onClick={handleGenerateReport}
                  className={`w-full py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                    isGenerating
                      ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] border-none'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                      Compiling Audit Data...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Generate & Export {format.toUpperCase()}
                    </>
                  )}
                </button>
              </div>

            </div>
          </GlassCard>

          {/* Compilation Logs Console Terminal */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <GlassCard className="p-4 border-slate-800 bg-slate-950/90 font-mono text-[10px]" hoverable={false}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-900 mb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      Build Engine Output
                    </span>
                    <span className="text-cyan-400 font-bold">{Math.round((buildStep / BUILD_STEPS.length) * 100)}%</span>
                  </div>
                  
                  {/* Console logs */}
                  <div className="space-y-1 max-h-[140px] overflow-y-auto custom-scrollbar text-slate-500">
                    {buildLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`${
                          log.startsWith('[OK]')
                            ? 'text-cyan-400/90'
                            : log.startsWith('[SUCCESS]')
                            ? 'text-emerald-400 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                    <div className="w-1.5 h-3 bg-cyan-400 animate-pulse inline-block mt-0.5" />
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Holographic Document Preview (3 Cols) */}
        <div className="xl:col-span-3">
          <div className="relative group">
            
            {/* Tech boundary corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-slate-700/30 pointer-events-none group-hover:border-cyan-500/40 z-20" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-slate-700/30 pointer-events-none group-hover:border-cyan-500/40 z-20" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-slate-700/30 pointer-events-none group-hover:border-cyan-500/40 z-20" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-slate-700/30 pointer-events-none group-hover:border-cyan-500/40 z-20" />

            <div className="absolute -top-3 left-6 font-mono text-[9px] text-slate-500 bg-slate-950 px-2 py-0.5 border border-slate-900 rounded uppercase tracking-widest z-20">
              Live Document Frame Preview
            </div>

            {/* Document sheet A4 style layout container */}
            <div className="relative bg-slate-950/80 border border-slate-900 shadow-2xl rounded-2xl p-8 overflow-hidden min-h-[720px] backdrop-blur-md flex flex-col justify-between select-none">
              
              {/* Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-repeat opacity-5 cyber-scanline select-none z-10" />

              {/* Watermark Diagonal Text in background */}
              <div className="select-none pointer-events-none absolute inset-0 flex items-center justify-center text-7xl md:text-8xl font-black text-slate-800/10 tracking-[0.25em] rotate-[-30deg] uppercase z-0 font-mono">
                {watermark}
              </div>

              {/* Document Inner Wrapper */}
              <div className="space-y-6 relative z-10">
                
                {/* Header row */}
                <div className="pb-4 border-b border-slate-900 flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      HASHBENCH SECURITY LABS
                    </div>
                    <h3 className="text-lg font-black text-slate-100 uppercase tracking-wide">
                      {reportTitle || 'Untitled Telemetry Audit'}
                    </h3>
                  </div>

                  {/* Watermark Classification Stamp */}
                  <div className="text-right flex flex-col items-end">
                    <span className="border-2 border-cyan-500/30 text-cyan-400/80 rounded px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase bg-cyan-500/5">
                      {watermark}
                    </span>
                    <span className="text-[8px] font-mono text-slate-600 mt-1 uppercase">LEVEL 4 SEC CLEARANCE</span>
                  </div>
                </div>

                {/* Subtitle details */}
                <div className="grid grid-cols-2 gap-4 text-[9px] font-mono text-slate-500 pb-3 border-b border-slate-950">
                  <div>
                    SYSTEM COORDINATES: <span className="text-slate-300">HB-NODE-AUDIT-PRIME</span>
                  </div>
                  <div className="text-right">
                    GENERATED DATE: <span className="text-slate-300">{new Date().toISOString().slice(0, 10)}</span>
                  </div>
                </div>

                {/* Main dynamic report contents */}
                <div className="space-y-6">

                  {/* SECTION 1: Telemetry security scores */}
                  {includeScores && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block pb-1 border-b border-slate-900/60">
                        I. Telemetry Security Compliance
                      </span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-950/40 p-4 border border-slate-900 rounded-xl">
                        
                        {/* Circular Progress Gauge */}
                        <div className="flex flex-col items-center justify-center md:col-span-1 border-r border-slate-900/60 pr-2">
                          <div className="relative w-16 h-16">
                            <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
                              <path
                                className="text-slate-900"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-cyan-500"
                                strokeDasharray="94, 100"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-slate-100 text-xs">
                              94%
                            </div>
                          </div>
                          <span className="text-[7px] font-mono text-slate-500 mt-1 tracking-widest uppercase">Compliance</span>
                        </div>

                        {/* Summary Metrics stats */}
                        <div className="md:col-span-2 space-y-1.5 text-[10px] font-mono text-slate-400 pl-2">
                          <div className="flex justify-between">
                            <span>ALGORITHMS ANALYZED:</span>
                            <span className="text-slate-200 font-bold">5 Suites</span>
                          </div>
                          <div className="flex justify-between">
                            <span>COMPLIANCE INDEX:</span>
                            <span className="text-emerald-400 font-bold">HIGH POSTURE</span>
                          </div>
                          <div className="flex justify-between">
                            <span>VERIFICATION CODE:</span>
                            <span className="text-slate-200">HB-800-63B</span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* SECTION 2: Custom Speed Performance Chart */}
                  {includeCharts && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block pb-1 border-b border-slate-900/60">
                        II. Algorithm Performance Index
                      </span>
                      
                      {/* Interactive Custom SVG Chart */}
                      <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl space-y-3">
                        <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-widest">
                          EXECUTION LATENCY INDEX (HIGHER SECURE / LOWER FASTER)
                        </span>

                        <div className="space-y-2 font-mono">
                          {/* 1. Argon2id */}
                          <div className="space-y-0.5">
                            <div className="flex justify-between text-[9px] text-slate-400">
                              <span>Argon2id (PHC Winner)</span>
                              <span className="text-cyan-400 font-bold">1842ms</span>
                            </div>
                            <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-cyan-500 h-full rounded-full" style={{ width: '95%' }} />
                            </div>
                          </div>

                          {/* 2. Bcrypt */}
                          <div className="space-y-0.5">
                            <div className="flex justify-between text-[9px] text-slate-400">
                              <span>Bcrypt (Work Factor 10)</span>
                              <span className="text-cyan-400 font-bold">1250ms</span>
                            </div>
                            <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-cyan-500 h-full rounded-full" style={{ width: '70%' }} />
                            </div>
                          </div>

                          {/* 3. SHA-256 */}
                          <div className="space-y-0.5">
                            <div className="flex justify-between text-[9px] text-slate-400">
                              <span>SHA-256 (Raw Comp)</span>
                              <span className="text-rose-400 font-bold">0.01ms</span>
                            </div>
                            <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-rose-500 h-full rounded-full" style={{ width: '1%' }} />
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* SECTION 3: Hardware specs telemetry */}
                  {includeHardware && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block pb-1 border-b border-slate-900/60">
                        III. Infrastructure Specs Overview
                      </span>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-950/40 p-2.5 border border-slate-900 rounded-xl space-y-1 font-mono text-[9px]">
                          <span className="text-slate-500 block uppercase text-[8px] flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-cyan-400" /> AMD EPYC CORE
                          </span>
                          <strong className="text-slate-300 block">96 Cores (Thread)</strong>
                        </div>
                        <div className="bg-slate-950/40 p-2.5 border border-slate-900 rounded-xl space-y-1 font-mono text-[9px]">
                          <span className="text-slate-500 block uppercase text-[8px] flex items-center gap-1">
                            <Info className="w-3 h-3 text-violet-400" /> MEMORY ECC
                          </span>
                          <strong className="text-slate-300 block">256GB ECC RAM</strong>
                        </div>
                        <div className="bg-slate-950/40 p-2.5 border border-slate-900 rounded-xl space-y-1 font-mono text-[9px]">
                          <span className="text-slate-500 block uppercase text-[8px] flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-emerald-400" /> GPU RACK
                          </span>
                          <strong className="text-slate-300 block">8x RTX 4090 Array</strong>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SECTION 4: Threat costs cracking index */}
                  {includeCosts && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block pb-1 border-b border-slate-900/60">
                        IV. Threat Cracking Cost Indexes
                      </span>
                      
                      <div className="bg-slate-950/40 p-3.5 border border-slate-900 rounded-xl flex justify-between gap-4 font-mono text-[10px] text-slate-400">
                        <div className="space-y-1">
                          <span className="text-[8px] text-slate-500 block uppercase">SYNDICATE CRACK OVERHEAD</span>
                          <strong className="text-slate-200 block flex items-center gap-0.5">
                            <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                            1,200,000 USD
                          </strong>
                        </div>

                        <div className="space-y-1 text-right">
                          <span className="text-[8px] text-slate-500 block uppercase">COMPUTE DURATION (EST)</span>
                          <strong className="text-slate-200 block flex items-center justify-end gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            2.5 Years Time
                          </strong>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </div>
              </div>

              {/* Document footer checksum */}
              <div className="pt-6 border-t border-slate-900/60 mt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-[8.5px] font-mono text-slate-600 relative z-10 uppercase">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3 h-3 text-slate-600" />
                  <span>CHECKSUM:</span>
                  <span className="text-slate-500 select-all font-bold tracking-wider">{dynamicHash.slice(0, 36)}...</span>
                </div>
                <div>
                  SYSTEM SECURITY STATUS: <strong className="text-cyan-500">SIGNED VALID</strong>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* LOWER SECTION: Export History Archive */}
      <GlassCard className="p-6 border-slate-800/50 relative z-10" hoverable={false}>
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/40" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/40" />

        <div className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                Document Signature Archive
              </h2>
            </div>
            <span className="text-[9px] font-mono text-slate-600 uppercase">
              Total historical hashes: {history.length}
            </span>
          </div>

          {/* History Grid list */}
          <div className="space-y-3.5">
            <AnimatePresence initial={false}>
              {history.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-6 text-xs text-slate-500 font-mono"
                >
                  No history records archived. Generate a new report to register payload signatures.
                </motion.div>
              ) : (
                history.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, transition: { duration: 0.2 } }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-950/40 border border-slate-900 hover:border-slate-800/60 rounded-xl transition-all duration-200 font-mono text-xs group"
                  >
                    
                    {/* Left: icon, name and date */}
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        item.format === 'pdf'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : item.format === 'json'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      
                      <div className="space-y-1">
                        <strong className="text-slate-300 font-semibold group-hover:text-slate-100 transition-colors">
                          {item.title}
                        </strong>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {item.date}
                          </span>
                          <span>•</span>
                          <span>{item.size}</span>
                          <span>•</span>
                          <span className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded uppercase font-bold text-slate-400">
                            {item.format.toUpperCase()}
                          </span>
                          <span>•</span>
                          <span className="text-[9px] bg-cyan-950/20 border border-cyan-900/30 text-cyan-400 px-1.5 py-0.5 rounded font-semibold uppercase">
                            {item.watermark}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: cryptographic hash & action icons */}
                    <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t border-slate-950 md:border-none">
                      <div className="hidden lg:flex flex-col text-right space-y-0.5 max-w-[200px]">
                        <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest flex items-center justify-end gap-1">
                          <Hash className="w-3 h-3" /> SHA-256 HASH CHECKSUM
                        </span>
                        <span className="text-[9.5px] text-slate-500 font-bold select-all truncate">
                          {item.hash.slice(0, 16)}...{item.hash.slice(-8)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Download copy button */}
                        <button
                          onClick={() => triggerBrowserDownload(item.title, item.format, `sha256-${item.hash}`, item.watermark)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 rounded-lg cursor-pointer transition-all duration-200"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>

                        {/* Delete history button */}
                        <button
                          onClick={() => handleDeleteHistory(item.id)}
                          className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg cursor-pointer transition-all duration-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

        </div>
      </GlassCard>

    </div>
  );
};

export default ExportReport;
