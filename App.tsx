
import React, { useEffect, useRef, useState } from 'react';
import OrbitVisualization from './OrbitVisualization';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Lock,
  Eye,
  ClipboardList,
  Menu,
  X,
  Zap,
  GitMerge,
  Database,
  RefreshCw,
} from 'lucide-react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const SYSTEM_NODES = [
  { label: 'QuickBooks', color: '#22c55e', angle: 0 },
  { label: 'CRM', color: '#3b82f6', angle: 45 },
  { label: 'Spreadsheets', color: '#f59e0b', angle: 90 },
  { label: 'POS', color: '#ec4899', angle: 135 },
  { label: 'Inventory', color: '#8b5cf6', angle: 180 },
  { label: 'Database', color: '#06b6d4', angle: 225 },
  { label: 'Email', color: '#ef4444', angle: 270 },
  { label: 'Calendar', color: '#f97316', angle: 315 },
];

const CX = 400, CY = 290, R = 210;

function polar(angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── FADE UP WRAPPER ──────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── HERO CANVAS ──────────────────────────────────────────────────────────────
function HeroCanvas() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      <svg viewBox="0 0 800 580" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <radialGradient id="zolGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#312e81" />
          </radialGradient>
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="lineBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background radial */}
        <circle cx={CX} cy={CY} r={260} fill="url(#bgGlow)" />

        {/* Connection lines */}
        {SYSTEM_NODES.map((node, i) => {
          const { x, y } = polar(node.angle);
          const len = Math.hypot(x - CX, y - CY);
          return (
            <line key={`l${i}`} x1={x} y1={y} x2={CX} y2={CY}
              stroke="url(#lineBlue)" strokeWidth={phase >= 2 ? 0.8 : 0}
              strokeDasharray={len}
              strokeDashoffset={phase >= 1 ? 0 : len}
              opacity={phase >= 1 ? 0.7 : 0}
              style={{ transition: `stroke-dashoffset 1s ease ${0.1 + i * 0.12}s, opacity 0.3s ease ${0.1 + i * 0.12}s` }}
            />
          );
        })}

        {/* Moving packets */}
        {phase >= 2 && SYSTEM_NODES.map((node, i) => {
          const { x, y } = polar(node.angle);
          return (
            <circle key={`pk${i}`} r={2.5} fill={node.color} filter="url(#softGlow)">
              <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
              <animateMotion dur="2.5s" begin={`${i * 0.35}s`} repeatCount="indefinite"
                path={`M ${x} ${y} L ${CX} ${CY}`} />
            </circle>
          );
        })}

        {/* System nodes */}
        {SYSTEM_NODES.map((node, i) => {
          const { x, y } = polar(node.angle);
          return (
            <g key={`n${i}`} filter="url(#softGlow)"
              style={{ opacity: phase >= 1 ? 1 : 0, transform: `scale(${phase >= 1 ? 1 : 0.6})`, transformOrigin: `${x}px ${y}px`, transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s` }}>
              <circle cx={x} cy={y} r={32} fill={node.color} opacity={0.08}>
                <animate attributeName="r" values="32;40;32" dur={`${2.5 + i * 0.15}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.08;0.04;0.08" dur={`${2.5 + i * 0.15}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r={22} fill="#0a0f1e" stroke={node.color} strokeWidth={1.2} opacity={0.95} />
              <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize={9} fontWeight={600} fontFamily="Inter, sans-serif">
                {node.label.length > 8 ? node.label.slice(0, 7) + '…' : node.label}
              </text>
            </g>
          );
        })}

        {/* ZOL center */}
        <g filter="url(#glow)">
          <circle cx={CX} cy={CY} r={52} fill="#1e1b4b" opacity={0.3}>
            <animate attributeName="r" values="52;62;52" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx={CX} cy={CY} r={38} fill="#1e1b4b" opacity={0.5}>
            <animate attributeName="r" values="38;44;38" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx={CX} cy={CY} r={28} fill="url(#zolGrad)" />
          <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
            fill="white" fontSize={16} fontWeight={900} fontFamily="Inter, sans-serif" letterSpacing={1}>
            ZOL
          </text>
        </g>
      </svg>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Solution', id: 'solution' },
    { label: 'Security', id: 'security' },
    { label: 'Early Access', id: 'early-access' },
  ];
  const DEMO_URL = 'https://calendar.app.google/e8AzVpEJQNiNTVSi6';
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#020817]/90 backdrop-blur-xl border-b border-white/5' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
          ZOL
        </button>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)}
              className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
              {l.label}
            </button>
          ))}
          <a href={DEMO_URL} target="_blank" rel="noopener noreferrer"
            className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 transition-opacity">
            Book Demo
          </a>
        </div>
        <button className="md:hidden text-slate-400" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#020817]/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 space-y-3">
          {links.map(l => (
            <button key={l.id} onClick={() => { scrollTo(l.id); setOpen(false); }}
              className="block w-full text-left text-slate-300 py-2 text-sm font-medium">
              {l.label}
            </button>
          ))}
          <a href={DEMO_URL} target="_blank" rel="noopener noreferrer"
            className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm mt-2">
            Book Demo
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-16">
      {/* Dot grid background */}
      <div className="absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />


      {/* Hero text */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Intelligent System Integration Layer
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
          <span className="text-white">Run your business</span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-300 bg-clip-text text-transparent">
            systems together.
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-4">
          ZOL connects the tools your company already uses — accounting software, CRM systems,
          spreadsheets, and internal databases — so teams can operate workflows across them from one intelligent layer.
        </motion.p>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
          className="text-sm text-slate-500 mb-10 italic">Like Cursor for business workflows.</motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://calendar.app.google/e8AzVpEJQNiNTVSi6" target="_blank" rel="noopener noreferrer"
            className="group px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] flex items-center gap-2">
            Book a Demo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <button onClick={() => scrollTo('how-it-works')}
            className="px-8 py-4 rounded-xl font-semibold text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm">
            See How It Works
          </button>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-slate-600 uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}

// ─── PROBLEM SECTION ──────────────────────────────────────────────────────────
function ProblemSection() {
  const fragmentedTools = ['CRM', 'QuickBooks', 'Spreadsheets', 'POS', 'Inventory', 'Internal Tools'];
  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold uppercase tracking-widest mb-6">
            The Problem
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
            Businesses run on<br />
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">fragmented systems.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            Most businesses operate across many disconnected tools. Data lives in silos, workflows break, and teams spend their days doing the integration work manually.
          </p>
        </FadeUp>

        {/* Floating disconnected tools */}
        <div className="relative h-64 mb-16">
          {fragmentedTools.map((tool, i) => {
            const positions = [
              { top: '10%', left: '5%' }, { top: '5%', left: '32%' }, { top: '0%', left: '62%' },
              { top: '55%', left: '18%' }, { top: '60%', left: '48%' }, { top: '50%', left: '78%' },
            ];
            const floatDelays = [0, 0.1, 0.2, 0.15, 0.25, 0.05];
            return (
              <motion.div
                key={tool}
                className="absolute"
                style={positions[i]}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: floatDelays[i] }}
                  className="px-4 py-2.5 rounded-xl border text-sm font-semibold backdrop-blur-sm whitespace-nowrap"
                  style={{ borderColor: `${colors[i]}40`, backgroundColor: `${colors[i]}10`, color: colors[i], boxShadow: `0 0 20px ${colors[i]}15` }}
                >
                  {tool}
                </motion.div>
              </motion.div>
            );
          })}
          {/* Dotted disconnection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 900 260">
            <line x1="120" y1="35" x2="310" y2="30" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 6" />
            <line x1="310" y1="30" x2="590" y2="15" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 6" />
            <line x1="220" y1="170" x2="460" y2="175" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 6" />
            <line x1="460" y1="175" x2="720" y2="155" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 6" />
          </svg>
        </div>

        {/* Pain point cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Copy data between systems', desc: 'Teams manually re-enter the same data across multiple tools every day.' },
            { title: 'Reconcile mismatched records', desc: 'Inconsistencies between databases create endless reconciliation work.' },
            { title: 'Update multiple tools manually', desc: 'Every change must be replicated across each system by hand.' },
            { title: 'Maintain fragile integrations', desc: 'Custom scripts and point solutions break constantly and require upkeep.' },
          ].map((item, i) => (
            <FadeUp key={item.title} delay={0.1 + i * 0.08}>
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <h4 className="font-semibold text-white mb-2 text-sm">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.4} className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            This creates <span className="text-white font-medium">operational friction</span> and <span className="text-white font-medium">wasted time</span> that compounds every single day.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── SOLUTION SECTION ─────────────────────────────────────────────────────────
function SolutionSection() {
  return (
    <section id="solution" className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6">
            The Solution
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
            One execution layer<br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">across your systems.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ZOL sits on top of your existing systems. It doesn't replace them. It connects them.
            Your team can run workflows across accounting, operations, CRM, and internal systems from a single layer.
          </p>
        </FadeUp>

        {/* Central connection visual */}
        <FadeUp delay={0.15}>
          <div className="relative max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-0">
              {/* Left systems */}
              <div className="flex flex-col gap-3 items-end">
                {['QuickBooks', 'CRM', 'Spreadsheets', 'POS'].map((s, i) => (
                  <motion.div key={s} animate={{ x: [0, 2, 0] }} transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                    className="px-3 py-2 rounded-lg border border-white/10 bg-white/[0.04] text-xs font-medium text-slate-300 w-28 text-center">
                    {s}
                  </motion.div>
                ))}
              </div>
              {/* Connecting lines SVG */}
              <div className="w-48 h-48 relative flex-shrink-0">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  {[28, 72, 116, 160].map((y, i) => (
                    <g key={i}>
                      <line x1="0" y1={y} x2="100" y2="100" stroke="url(#flowGrad)" strokeWidth="1.5" />
                      <circle r="3" fill="#818cf8" opacity="0.8">
                        <animateMotion dur={`${1.8 + i * 0.3}s`} begin={`${i * 0.4}s`} repeatCount="indefinite"
                          path={`M 0 ${y} L 100 100`} />
                        <animate attributeName="opacity" values="0;1;1;0" dur={`${1.8 + i * 0.3}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
                      </circle>
                    </g>
                  ))}
                  {[28, 72, 116, 160].map((y, i) => (
                    <g key={`r${i}`}>
                      <line x1="100" y1="100" x2="200" y2={y} stroke="url(#flowGrad)" strokeWidth="1.5" />
                      <circle r="3" fill="#34d399" opacity="0.8">
                        <animateMotion dur={`${1.8 + i * 0.3}s`} begin={`${0.9 + i * 0.4}s`} repeatCount="indefinite"
                          path={`M 100 100 L 200 ${y}`} />
                        <animate attributeName="opacity" values="0;1;1;0" dur={`${1.8 + i * 0.3}s`} begin={`${0.9 + i * 0.4}s`} repeatCount="indefinite" />
                      </circle>
                    </g>
                  ))}
                  {/* ZOL core */}
                  <circle cx="100" cy="100" r="28" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5">
                    <animate attributeName="r" values="28;32;28" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="100" cy="100" r="36" fill="none" stroke="#6366f1" strokeWidth="0.5" opacity="0.4">
                    <animate attributeName="r" values="36;44;36" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text x="100" y="104" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Inter">ZOL</text>
                </svg>
              </div>
              {/* Right systems */}
              <div className="flex flex-col gap-3 items-start">
                {['Inventory', 'Database', 'Email', 'Calendar'].map((s, i) => (
                  <motion.div key={s} animate={{ x: [0, -2, 0] }} transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                    className="px-3 py-2 rounded-lg border border-white/10 bg-white/[0.04] text-xs font-medium text-slate-300 w-28 text-center">
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Solution capability cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <RefreshCw className="w-5 h-5" />, title: 'Sync data across systems', color: 'blue' },
            { icon: <Zap className="w-5 h-5" />, title: 'Trigger workflows automatically', color: 'violet' },
            { icon: <CheckCircle2 className="w-5 h-5" />, title: 'Reconcile records instantly', color: 'emerald' },
            { icon: <GitMerge className="w-5 h-5" />, title: 'Operate tools through one interface', color: 'amber' },
          ].map((card, i) => {
            const colorMap: Record<string, string> = { blue: '#3b82f6', violet: '#8b5cf6', emerald: '#10b981', amber: '#f59e0b' };
            const c = colorMap[card.color];
            return (
              <FadeUp key={card.title} delay={0.1 + i * 0.08}>
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${c}15`, color: c }}>
                    {card.icon}
                  </div>
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── WORKFLOW SECTION ─────────────────────────────────────────────────────────
function WorkflowSection() {
  const steps = [
    { label: 'Order created', color: '#3b82f6' },
    { label: 'Financial data synced', color: '#8b5cf6' },
    { label: 'Records reconciled', color: '#10b981' },
  ];
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-400 text-xs font-semibold uppercase tracking-widest mb-6">
            Example Workflow
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Finance + internal systems
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">Watch data flow automatically across your stack — no manual steps, no errors.</p>
        </FadeUp>

        {/* Flow diagram */}
        <FadeUp delay={0.1}>
          <div className="relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 mb-12">
              {['Internal System', 'ZOL', 'QuickBooks'].map((node, i) => (
                <React.Fragment key={node}>
                  <div className="flex-1 text-center">
                    <div className={`inline-flex flex-col items-center justify-center w-32 h-20 rounded-2xl border font-bold text-sm
                      ${i === 1
                        ? 'border-blue-500/50 bg-gradient-to-br from-blue-600/20 to-violet-600/20 text-white shadow-[0_0_30px_rgba(99,102,241,0.2)]'
                        : 'border-white/10 bg-white/[0.04] text-slate-300'}`}>
                      {i === 1 && <span className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">Core</span>}
                      {node}
                    </div>
                  </div>
                  {i < 2 && (
                    <div className="flex-shrink-0 relative w-24 h-2">
                      <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                        <div className="w-full h-px bg-gradient-to-r from-blue-600/60 to-violet-600/60" />
                      </div>
                      <div className="absolute inset-0 flex items-center">
                        <motion.div animate={{ x: [0, 88, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6]" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Event cards */}
            <div className="grid grid-cols-3 gap-4">
              {steps.map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.6, duration: 0.5, repeat: Infinity, repeatDelay: 2.5, repeatType: 'reverse' }}
                  className="p-4 rounded-xl border text-xs font-semibold"
                  style={{ borderColor: `${s.color}30`, backgroundColor: `${s.color}10`, color: s.color }}>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS SECTION ─────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { n: '01', title: 'Connect your systems', desc: 'QuickBooks, CRM, spreadsheets, internal databases. ZOL integrates with the tools you already use.', color: '#3b82f6' },
    { n: '02', title: 'Define workflows', desc: 'Choose how your systems should communicate. Set rules, triggers, and approval flows without writing code.', color: '#8b5cf6' },
    { n: '03', title: 'Execute seamlessly', desc: 'ZOL coordinates actions across tools automatically, giving your team visibility and control at every step.', color: '#10b981' },
  ];
  return (
    <section id="how-it-works" className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6">
            How ZOL Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">Three steps to connected operations.</h2>
        </FadeUp>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[calc(50%-0.5px)] top-0 bottom-0 w-px bg-gradient-to-b from-blue-600/0 via-violet-600/30 to-emerald-600/0 hidden lg:block" />
          <div className="space-y-12">
            {steps.map((s, i) => (
              <FadeUp key={s.n} delay={i * 0.15}>
                <div className={`flex flex-col lg:flex-row items-center gap-8 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="flex-1 lg:text-right" style={{ textAlign: i % 2 === 1 ? 'left' : undefined }}>
                    <div className="inline-block">
                      <span className="text-6xl font-black opacity-10 text-white">{s.n}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 mt-1">{s.title}</h3>
                    <p className="text-slate-400 leading-relaxed max-w-sm" style={{ marginLeft: i % 2 === 1 ? 0 : 'auto' }}>{s.desc}</p>
                  </div>
                  {/* Center dot */}
                  <div className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full border-2 flex-shrink-0 z-10"
                    style={{ borderColor: s.color, backgroundColor: `${s.color}15`, boxShadow: `0 0 24px ${s.color}30` }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  </div>
                  <div className="flex-1" />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECURITY SECTION ─────────────────────────────────────────────────────────
function SecuritySection() {
  const cards = [
    { icon: <Shield className="w-5 h-5" />, title: 'Permissions', desc: 'Granular access controls so every action is authorized by the right person.', color: '#3b82f6' },
    { icon: <ClipboardList className="w-5 h-5" />, title: 'Audit Trails', desc: 'Full logs of every operation across every system — always queryable.', color: '#8b5cf6' },
    { icon: <Eye className="w-5 h-5" />, title: 'Approval Workflows', desc: 'Require human sign-off before any critical action executes.', color: '#10b981' },
    { icon: <Lock className="w-5 h-5" />, title: 'Secure Integrations', desc: 'Enterprise-grade encryption and credential management for all connections.', color: '#f59e0b' },
  ];
  return (
    <section id="security" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6">
            Security
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
            Built for controlled execution.
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            ZOL never blindly changes your systems. All actions can include approvals, previews, and logs.
          </p>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <FadeUp key={card.title} delay={0.1 + i * 0.08}>
              <div className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 h-full">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                  style={{ backgroundColor: `${card.color}15`, color: card.color, boxShadow: `0 0 20px ${card.color}10` }}>
                  {card.icon}
                </div>
                <h4 className="font-bold text-white mb-2">{card.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── EARLY ACCESS SECTION ─────────────────────────────────────────────────────
function EarlyAccessSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const DEMO_URL = 'https://calendar.app.google/e8AzVpEJQNiNTVSi6';
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };
  return (
    <section id="early-access" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-violet-950/20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-blue-600/40" />
      <div className="max-w-2xl mx-auto text-center relative">
        <FadeUp>
          <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6">
            Early Partners
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
            Working with early partners.
          </h2>
          <p className="text-lg text-slate-400 mb-12 leading-relaxed">
            We're collaborating with a small number of businesses to build ZOL around real operational workflows. If your company runs across multiple systems and wants them to work together seamlessly, we'd love to collaborate.
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">You're on the list.</h3>
                <p className="text-slate-400 mb-6">We'll reach out soon to discuss how ZOL can work with your systems.</p>
                <a href={DEMO_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 transition-opacity text-sm">
                  Book a Demo Now <ArrowRight className="w-4 h-4" />
                </a>
                <button onClick={() => setSubmitted(false)} className="block mt-4 mx-auto text-sm text-slate-600 hover:text-slate-400 transition-colors">
                  Submit another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input required type="text" placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all" />
                  <input required type="text" placeholder="Company"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all" />
                </div>
                <input required type="email" placeholder="Work email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all" />
                <textarea placeholder="What systems do you currently use?" rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all resize-none" />
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:shadow-[0_0_50px_rgba(99,102,241,0.4)] disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : <ArrowRight className="w-4 h-4" />}
                  {loading ? 'Submitting…' : 'Request Early Access'}
                </button>
              </form>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="ZOL" className="w-7 h-7 object-contain" />
          <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">ZOL</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-slate-500">
          <button onClick={() => scrollTo('solution')} className="hover:text-slate-300 transition-colors">Product</button>
          <button onClick={() => scrollTo('early-access')} className="hover:text-slate-300 transition-colors">Early Access</button>
          <a href="mailto:hello@zol.ai" className="hover:text-slate-300 transition-colors">Contact</a>
        </div>
        <p className="text-xs text-slate-700">© 2026 ZOL. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen bg-[#020817] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <HeroSection />
      <OrbitVisualization />
      <ProblemSection />
      <SolutionSection />
      <WorkflowSection />
      <HowItWorksSection />
      <SecuritySection />
      <EarlyAccessSection />
      <Footer />
    </div>
  );
}

