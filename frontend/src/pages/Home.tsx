import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, BarChart2, Shield, Activity, Cpu } from 'lucide-react';

// --- BACKGROUND CANVAS COMPONENT ---
// Renders glowing particles and drifting hash strings
const CyberCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle definitions
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }

    interface FloatingHash {
      x: number;
      y: number;
      vy: number;
      text: string;
      size: number;
      alpha: number;
      decay: number;
    }

    const particles: Particle[] = [];
    const hashes: FloatingHash[] = [];

    // Initialize background dots
    const numParticles = 45;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '6, 182, 212' : '139, 92, 246', // cyan / purple
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    // Mock hashes to choose from
    const hashPool = [
      'SHA-256',
      'bcrypt',
      'argon2id',
      'MD5',
      '0x7F2C99A0',
      '$2b$12$K89...',
      '8c637c35',
      'scrypt',
      'PBKDF2',
      '0x410FA392',
    ];

    const createHash = () => {
      if (hashes.length < 8 && Math.random() < 0.02) {
        hashes.push({
          x: Math.random() * width,
          y: height + 20,
          vy: -(Math.random() * 0.5 + 0.3),
          text: hashPool[Math.floor(Math.random() * hashPool.length)],
          size: Math.floor(Math.random() * 10) + 11,
          alpha: 0,
          decay: Math.random() * 0.005 + 0.002,
        });
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.color}, 0.5)`;
        ctx.fill();
      });

      // Update & Draw floating hashes
      createHash();
      hashes.forEach((h, index) => {
        h.y += h.vy;
        
        // Fade in slowly, then fade out as they rise
        if (h.y > height - 100) {
          h.alpha = Math.min(0.25, h.alpha + 0.01);
        } else if (h.y < 200) {
          h.alpha = Math.max(0, h.alpha - h.decay * 3);
        } else {
          h.alpha = 0.25;
        }

        ctx.shadowBlur = 0;
        ctx.font = `bold ${h.size}px monospace`;
        ctx.fillStyle = `rgba(148, 163, 184, ${h.alpha})`;
        ctx.fillText(h.text, h.x, h.y);

        // Delete out of screen or faded out
        if (h.y < -50 || h.alpha <= 0) {
          hashes.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

// --- DYNAMIC COMPARISON VISUALIZATION COMPONENT ---
const SpeedVisualizer: React.FC = () => {
  const [md5Count, setMd5Count] = useState(0);
  const [shaCount, setShaCount] = useState(0);
  
  // bcrypt variables
  const [bcryptProgress, setBcryptProgress] = useState(0);
  const [bcryptRounds, setBcryptRounds] = useState(0);
  
  // argon variables
  const [argonProgress, setArgonProgress] = useState(0);
  const [argonMem, setArgonMem] = useState(0);

  useEffect(() => {
    // Fast hash incrementers
    const fastTimer = setInterval(() => {
      setMd5Count((prev) => (prev + Math.floor(Math.random() * 1250000)) % 100000000);
      setShaCount((prev) => (prev + Math.floor(Math.random() * 650000)) % 100000000);
    }, 45);

    // Slow hashes progress simulation
    const slowTimer = setInterval(() => {
      // bcrypt simulation
      setBcryptProgress((prev) => {
        if (prev >= 100) {
          setBcryptRounds(0);
          return 0;
        }
        const next = prev + 6.5;
        setBcryptRounds(Math.min(10, Math.floor(next / 10)));
        return next;
      });

      // Argon2 simulation
      setArgonProgress((prev) => {
        if (prev >= 100) {
          setArgonMem(0);
          return 0;
        }
        const next = prev + 3.8;
        // Allocate memory steps up to 64MB
        setArgonMem(Math.min(64, Math.floor((next / 100) * 64)));
        return next;
      });
    }, 80);

    return () => {
      clearInterval(fastTimer);
      clearInterval(slowTimer);
    };
  }, []);

  // Format large values
  const formatHashes = (val: number) => {
    return val.toLocaleString('en-US');
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase">Live Speed Simulation</span>
        <span className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
          <Activity className="w-3 h-3 animate-pulse" /> Core Clock Active
        </span>
      </div>

      {/* MD5 (FAST) */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold">MD5</span>
          <span className="text-cyan-400">4.8 GH/s (Fast / Insecure)</span>
        </div>
        <div className="relative h-7 bg-[#0b0e17] rounded-lg border border-slate-800 overflow-hidden flex items-center px-3 justify-between">
          <div className="absolute inset-y-0 left-0 bg-cyan-500/10 w-full animate-pulse" />
          <span className="text-[10px] font-mono text-slate-500 relative z-10">Ticking hashes:</span>
          <span className="text-xs font-mono font-bold text-cyan-300 relative z-10">{formatHashes(md5Count)} H</span>
        </div>
      </div>

      {/* SHA-256 (FAST) */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold">SHA-256</span>
          <span className="text-cyan-400">2.1 GH/s (Fast / Medium Security)</span>
        </div>
        <div className="relative h-7 bg-[#0b0e17] rounded-lg border border-slate-800 overflow-hidden flex items-center px-3 justify-between">
          <div className="absolute inset-y-0 left-0 bg-cyan-500/10 w-full animate-pulse" />
          <span className="text-[10px] font-mono text-slate-500 relative z-10">Ticking hashes:</span>
          <span className="text-xs font-mono font-bold text-cyan-300 relative z-10">{formatHashes(shaCount)} H</span>
        </div>
      </div>

      {/* bcrypt (SLOW / SECURE) */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold">bcrypt</span>
          <span className="text-violet-400">12,400 H/s (Adaptive / High Security)</span>
        </div>
        <div className="relative h-7 bg-[#0b0e17] rounded-lg border border-slate-800 overflow-hidden flex items-center px-3">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-violet-500/20"
            style={{ width: `${bcryptProgress}%` }}
          />
          <div className="flex justify-between w-full relative z-10 text-[10px] font-mono text-slate-400">
            <span>Rounds: <b className="text-violet-300">{bcryptRounds}/10</b></span>
            <span>Progress: {Math.floor(bcryptProgress)}%</span>
          </div>
        </div>
      </div>

      {/* Argon2id (SLOW / ULTRA-SECURE) */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold">Argon2id</span>
          <span className="text-violet-400">420 H/s (Memory Hard / Optimal)</span>
        </div>
        <div className="relative h-7 bg-[#0b0e17] rounded-lg border border-slate-800 overflow-hidden flex items-center px-3">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-violet-500/20"
            style={{ width: `${argonProgress}%` }}
          />
          <div className="flex justify-between w-full relative z-10 text-[10px] font-mono text-slate-400">
            <span>RAM Allocation: <b className="text-violet-300">{argonMem}MB / 64MB</b></span>
            <span>Progress: {Math.floor(argonProgress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN LANDING PAGE COMPONENT ---
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  // Parallax tracker: trace mouse positions to shift background grids slightly
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) * 0.015;
      const y = (e.clientY - window.innerHeight / 2) * 0.015;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3D centerpiece card tilt effect
  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Calculate rotation angles (degrees)
    const rotateX = (yc - y) / 12;
    const rotateY = (x - xc) / 12;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`,
      boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6), 0 0 25px -5px rgba(6, 182, 212, 0.25)',
      borderColor: 'rgba(6, 182, 212, 0.3)',
      transition: 'transform 0.08s ease-out, box-shadow 0.2s ease, border-color 0.2s ease',
    });
  };

  const handleCardLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.4)',
      borderColor: 'rgba(255, 255, 255, 0.06)',
      transition: 'all 0.5s ease-in-out',
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden gradient-mesh">
      {/* Dynamic Cyber-Grid backdrop with subtle parallax offset */}
      <div 
        className="absolute inset-0 cyber-grid z-0 opacity-40 transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${-mouseOffset.x}px, ${-mouseOffset.y}px, 0) scale(1.05)`,
        }}
      />

      {/* Decorative glowing gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] glow-purple opacity-30 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] glow-cyan opacity-25 pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Cybernetic Particles and Hashes Canvas */}
      <CyberCanvas />

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl px-6 md:px-8 py-16 flex flex-col items-center">
        {/* Top Header Logo */}
        <div className="flex items-center gap-2 mb-12 animate-float">
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-violet-500 rounded-xl text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Zap className="w-5 h-5 fill-slate-950" />
          </div>
          <span className="font-mono font-bold tracking-widest text-slate-200">HASHBENCH CORE v1.0</span>
        </div>

        {/* Center Grid containing centerpiece + dynamic visualization */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT SIDE: Centerpiece 3D Card (7/12 width) */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
              style={tiltStyle}
              className="w-full max-w-xl backdrop-blur-md bg-[#0f1420]/50 border border-white/[0.06] rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden transition-all duration-300"
            >
              {/* Corner tech details decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-bl-3xl" />
              <div className="absolute bottom-3 left-4 text-[9px] font-mono text-slate-600">SYS_AUTH: SUCCESSFUL // BENCHMARKING_NODE_CONNECTED</div>
              
              <div className="space-y-6">
                {/* Micro-badge */}
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full w-fit">
                  <Shield className="w-3.5 h-3.5" /> NIST Compliance Cryptography
                </span>

                {/* Primary titles */}
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
                    Hash Benchmark Platform
                  </h1>
                  <p className="text-base text-slate-400 leading-relaxed">
                    Enterprise-grade Password Hash Security Benchmarking Platform. Evaluate algorithm speeds, memory allocations, CPU/GPU loads, and attack complexity estimates live.
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 cursor-pointer text-sm"
                  >
                    <Cpu className="w-4 h-4 fill-slate-950" />
                    Launch Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/analytics')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-slate-100 font-semibold rounded-xl transition-all duration-200 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 cursor-pointer text-sm"
                  >
                    <BarChart2 className="w-4 h-4" />
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Dynamic live simulation card (5/12 width) */}
          <div className="lg:col-span-5">
            <div className="w-full backdrop-blur-sm bg-[#0c101b]/40 border border-slate-800/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <SpeedVisualizer />
            </div>
          </div>

        </div>

        {/* Footer Technical Indicators */}
        <div className="w-full mt-16 pt-6 border-t border-slate-900/60 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-slate-500 gap-4">
          <span>SECURE PROTOCOL SHA256 // AES256-GCM</span>
          <span>© 2026 HASHBENCH INC. ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
