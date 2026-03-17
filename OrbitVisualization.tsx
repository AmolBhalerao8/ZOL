
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const NODES = [
  { id: 'quickbooks', label: 'QuickBooks', color: '#22c55e', startDeg: -90 },
  { id: 'crm',        label: 'CRM',        color: '#3b82f6', startDeg: -50 },
  { id: 'sheets',     label: 'Spreadsheets',color: '#f59e0b', startDeg: -10 },
  { id: 'pos',        label: 'POS',        color: '#ec4899', startDeg:  30 },
  { id: 'inventory',  label: 'Inventory',  color: '#8b5cf6', startDeg:  70 },
  { id: 'database',   label: 'Internal DB',color: '#06b6d4', startDeg: 110 },
  { id: 'email',      label: 'Email',      color: '#ef4444', startDeg: 150 },
  { id: 'calendar',   label: 'Calendar',   color: '#f97316', startDeg: 190 },
  { id: 'analytics',  label: 'Analytics',  color: '#a78bfa', startDeg: 230 },
];

const WORKFLOWS: Record<string, { steps: string[]; targets: number[] }> = {
  quickbooks: { steps: ['Order created', 'ZOL receives event', 'Invoice synced to CRM', 'Spreadsheet updated'], targets: [1, 2] },
  crm:        { steps: ['Lead captured', 'ZOL processes', 'Email triggered', 'Calendar follow-up'], targets: [6, 7] },
  sheets:     { steps: ['Data changed', 'ZOL detects update', 'QuickBooks synced', 'CRM refreshed'], targets: [0, 1] },
  pos:        { steps: ['Sale completed', 'ZOL syncs data', 'Inventory updated', 'Analytics logged'], targets: [4, 8] },
  inventory:  { steps: ['Stock low', 'ZOL triggers alert', 'POS notified', 'QB order created'], targets: [3, 0] },
  database:   { steps: ['Record updated', 'ZOL syncs', 'Analytics refreshed', 'Sheets updated'], targets: [8, 2] },
  email:      { steps: ['Campaign sent', 'ZOL tracks opens', 'CRM lead updated', 'Calendar booked'], targets: [1, 7] },
  calendar:   { steps: ['Meeting booked', 'ZOL notifies', 'CRM updated', 'Email confirmation'], targets: [1, 6] },
  analytics:  { steps: ['Report generated', 'ZOL distributes', 'Sheets updated', 'CRM synced'], targets: [2, 1] },
};

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Packet {
  id: number;
  nodeIdx: number;
  toZol: boolean;
  targetIdx: number;
  t: number;
  color: string;
  spawnedReturn: boolean;
}

let _pid = 0;

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function OrbitVisualization() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeElsRef   = useRef<(HTMLDivElement | null)[]>([]);

  // Animation refs — no React re-renders needed for these
  const anglesRef       = useRef(NODES.map(n => (n.startDeg * Math.PI) / 180));
  const lineProgRef     = useRef(new Array(NODES.length).fill(0));
  const packetsRef      = useRef<Packet[]>([]);
  const hoveredRef      = useRef(-1);
  const initializedRef  = useRef(false);
  const sizeRef         = useRef({ w: 800, h: 560, cx: 400, cy: 280, r: 200 });

  // React state — only for UI elements that need re-renders
  const [hoveredIdx,  setHoveredIdx]  = useState(-1);
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const [showHint,    setShowHint]    = useState(false);

  // ── Main animation loop ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let rafId: number;
    let t0 = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = w + 'px';
      canvas.style.height = h + 'px';
      const r = Math.min(w * 0.37, h * 0.41, 235);
      sizeRef.current = { w, h, cx: w / 2, cy: h / 2, r };
    };

    resize();
    window.addEventListener('resize', resize);

    const CARD_W = 92, CARD_H = 30;
    const ORBIT_SPEED = 0.00016; // rad / frame  ≈ 6° per second

    const frame = (ts: number) => {
      if (!t0) t0 = ts;
      const elapsed = (ts - t0) / 1000;

      const ctx = canvas.getContext('2d');
      if (!ctx) { rafId = requestAnimationFrame(frame); return; }

      const { w, h, cx, cy, r } = sizeRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // — Orbit angles
      anglesRef.current = anglesRef.current.map(a => a + ORBIT_SPEED);

      // — Line draw-in progress (staggered)
      const LINE_DELAY = 0.14, LINE_DUR = 0.85;
      lineProgRef.current = lineProgRef.current.map((_, i) =>
        Math.min(1, Math.max(0, (elapsed - i * LINE_DELAY) / LINE_DUR))
      );

      if (!initializedRef.current && lineProgRef.current.every(p => p >= 1)) {
        initializedRef.current = true;
        setShowHint(true);
      }

      // — Node positions
      const pos = anglesRef.current.map(a => ({
        x: cx + r * Math.cos(a),
        y: cy + r * Math.sin(a),
      }));

      // — Update DOM card positions (direct DOM, no re-render)
      nodeElsRef.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = `translate(${pos[i].x - CARD_W / 2}px, ${pos[i].y - CARD_H / 2}px)`;
      });

      // — Packet management
      const hIdx = hoveredRef.current;
      if (hIdx >= 0 && initializedRef.current) {
        const inboundCount = packetsRef.current.filter(pk => pk.nodeIdx === hIdx && pk.toZol).length;
        if (inboundCount === 0) {
          const targets = WORKFLOWS[NODES[hIdx].id]?.targets ?? [];
          packetsRef.current.push({
            id: _pid++, nodeIdx: hIdx, toZol: true,
            targetIdx: targets[0] ?? (hIdx + 1) % NODES.length,
            t: 0, color: NODES[hIdx].color, spawnedReturn: false,
          });
        }
        // Spawn return packets when inbound packet arrives at ZOL
        packetsRef.current.forEach(pk => {
          if (pk.nodeIdx === hIdx && pk.toZol && pk.t >= 0.96 && !pk.spawnedReturn) {
            pk.spawnedReturn = true;
            (WORKFLOWS[NODES[hIdx].id]?.targets ?? []).forEach(tIdx => {
              packetsRef.current.push({
                id: _pid++, nodeIdx: hIdx, toZol: false,
                targetIdx: tIdx, t: 0,
                color: NODES[tIdx].color, spawnedReturn: false,
              });
            });
          }
        });
      }

      // Advance & cull packets
      packetsRef.current = packetsRef.current
        .map(pk => ({ ...pk, t: pk.t + 0.013 }))
        .filter(pk => pk.t < 1.05);

      // ──────────────────── DRAW ─────────────────────────────────────────────

      // Faint orbit ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.035)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 10]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Connection lines
      NODES.forEach((node, i) => {
        const prog = lineProgRef.current[i];
        if (prog <= 0) return;
        const { x, y } = pos[i];
        const isH = i === hoveredRef.current;
        const ex = cx + (x - cx) * prog;
        const ey = cy + (y - cy) * prog;

        if (isH) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = node.color + '28';
          ctx.lineWidth = 10;
          ctx.stroke();
        }

        const grad = ctx.createLinearGradient(cx, cy, ex, ey);
        const a = isH ? 'bb' : '3a';
        grad.addColorStop(0, '#6366f1' + a);
        grad.addColorStop(1, node.color + a);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = grad;
        ctx.lineWidth = isH ? 1.6 : 0.75;
        ctx.stroke();
      });

      // Data packets
      packetsRef.current.forEach(pk => {
        const { x: nx, y: ny } = pos[pk.nodeIdx];
        const { x: tx, y: ty } = pos[pk.targetIdx];
        const t = Math.min(pk.t, 1);
        const px = pk.toZol ? nx + (cx - nx) * t : cx + (tx - cx) * t;
        const py = pk.toZol ? ny + (cy - ny) * t : cy + (ty - cy) * t;

        const glow = ctx.createRadialGradient(px, py, 0, px, py, 9);
        glow.addColorStop(0, pk.color + 'ee');
        glow.addColorStop(1, pk.color + '00');
        ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();

        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.fill();
      });

      // ZOL center ambient glow (pulsing)
      const pulse = 0.22 + 0.1 * Math.sin(elapsed * 1.8);
      const zg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 75);
      zg.addColorStop(0,   `rgba(99,102,241,${pulse})`);
      zg.addColorStop(0.55,`rgba(99,102,241,${pulse * 0.22})`);
      zg.addColorStop(1,   'rgba(99,102,241,0)');
      ctx.beginPath(); ctx.arc(cx, cy, 75, 0, Math.PI * 2);
      ctx.fillStyle = zg; ctx.fill();

      // Node halos
      pos.forEach(({ x, y }, i) => {
        const isH = i === hoveredRef.current;
        const pr  = isH ? 38 : 24 + 5 * Math.sin(elapsed * 1.4 + i * 0.8);
        const hg  = ctx.createRadialGradient(x, y, 0, x, y, pr);
        hg.addColorStop(0, NODES[i].color + (isH ? '38' : '1a'));
        hg.addColorStop(1, NODES[i].color + '00');
        ctx.beginPath(); ctx.arc(x, y, pr, 0, Math.PI * 2);
        ctx.fillStyle = hg; ctx.fill();
      });

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ── Mouse hit-testing ──────────────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !initializedRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { cx, cy, r } = sizeRef.current;

    let found = -1, best = 46;
    anglesRef.current.forEach((a, i) => {
      const d = Math.hypot(mx - (cx + r * Math.cos(a)), my - (cy + r * Math.sin(a)));
      if (d < best) { best = d; found = i; }
    });

    if (found !== hoveredRef.current) {
      hoveredRef.current = found;
      setHoveredIdx(found);
      if (found < 0) packetsRef.current = packetsRef.current.filter(pk => pk.t > 0.65);
    }
  };

  const handleMouseLeave = () => {
    hoveredRef.current = -1;
    setHoveredIdx(-1);
    packetsRef.current = packetsRef.current.filter(pk => pk.t > 0.65);
  };

  const flow           = clickedNode ? WORKFLOWS[clickedNode]          : null;
  const activeNodeData = clickedNode ? NODES.find(n => n.id === clickedNode) : null;
  const hNode          = hoveredIdx >= 0 ? NODES[hoveredIdx] : null;
  const hTarget        = hNode ? NODES[WORKFLOWS[hNode.id]?.targets[0] ?? 0] : null;

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030b18] via-[#020817] to-[#030b18] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(99,102,241,0.06) 0%, transparent 65%)' }} />

      <div className="max-w-5xl mx-auto relative">

        {/* Section header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-6"
          >
            Live System Network
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4"
          >
            Your business systems<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              shouldn't operate in isolation.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed"
          >
            ZOL connects your tools so workflows can move across them automatically.
          </motion.p>
        </div>

        {/* ── Canvas stage ─────────────────────────────────────────────────── */}
        <div
          ref={containerRef}
          className="relative w-full rounded-3xl overflow-hidden border border-white/[0.06] cursor-default"
          style={{
            height: 580,
            background: 'linear-gradient(135deg, #050e1d 0%, #020817 50%, #07051a 100%)',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* ── Node cards ─────────────────────────────────────────────────── */}
          {NODES.map((node, i) => (
            <div
              key={node.id}
              ref={el => { nodeElsRef.current[i] = el; }}
              className="absolute top-0 left-0 select-none cursor-pointer"
              style={{ width: 92, height: 30, willChange: 'transform' }}
              onClick={() => setClickedNode(prev => prev === node.id ? null : node.id)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.13 + 0.35, type: 'spring', stiffness: 180, damping: 14 }}
                className="w-full h-full flex items-center justify-center rounded-xl text-[11px] font-semibold backdrop-blur-sm border transition-all duration-150"
                style={{
                  color: node.color,
                  borderColor: (hoveredIdx === i || clickedNode === node.id)
                    ? node.color + '55'
                    : 'rgba(255,255,255,0.08)',
                  backgroundColor: (hoveredIdx === i || clickedNode === node.id)
                    ? node.color + '18'
                    : 'rgba(255,255,255,0.04)',
                  boxShadow: (hoveredIdx === i || clickedNode === node.id)
                    ? `0 0 16px ${node.color}30`
                    : 'none',
                }}
              >
                {node.label}
              </motion.div>
            </div>
          ))}

          {/* ── ZOL center node ────────────────────────────────────────────── */}
          <div
            className="absolute pointer-events-none z-10"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.9, type: 'spring', damping: 11 }}
              className="w-[76px] h-[76px] rounded-[18px] flex flex-col items-center justify-center gap-1"
              style={{
                border: '1px solid rgba(99,102,241,0.45)',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.18) 100%)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 0 48px rgba(99,102,241,0.38), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              <img
                src="/logo.png"
                alt="ZOL"
                className="w-9 h-9 object-contain"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.18em]">ZOL</span>
            </motion.div>
          </div>

          {/* ── Hint ───────────────────────────────────────────────────────── */}
          <AnimatePresence>
            {showHint && hoveredIdx < 0 && !clickedNode && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] text-slate-600 pointer-events-none whitespace-nowrap text-center"
              >
                Hover a node to see data flow · Click to explore its workflow
              </motion.p>
            )}
          </AnimatePresence>

          {/* ── Hover flow label ───────────────────────────────────────────── */}
          <AnimatePresence>
            {hNode && hTarget && !clickedNode && (
              <motion.div
                key={`hl-${hoveredIdx}`}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs pointer-events-none whitespace-nowrap"
              >
                <span className="font-bold" style={{ color: hNode.color }}>{hNode.label}</span>
                <span className="text-slate-600">→ ZOL →</span>
                <span className="font-bold" style={{ color: hTarget.color }}>{hTarget.label}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Workflow panel ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {clickedNode && flow && activeNodeData && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 p-6 rounded-2xl relative overflow-hidden"
              style={{
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.025)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Tinted background stripe */}
              <div
                className="absolute inset-0 opacity-5 pointer-events-none rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${activeNodeData.color}, transparent)` }}
              />

              <button
                onClick={() => setClickedNode(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: activeNodeData.color, boxShadow: `0 0 8px ${activeNodeData.color}` }}
                />
                <p className="text-[11px] text-slate-500 uppercase tracking-[0.15em] font-semibold">
                  {activeNodeData.label} Workflow
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {flow.steps.map((step, i) => (
                  <React.Fragment key={step}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.09, duration: 0.35 }}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium border"
                      style={{
                        borderColor: activeNodeData.color + '35',
                        backgroundColor: activeNodeData.color + '0f',
                        color: activeNodeData.color,
                      }}
                    >
                      {step}
                    </motion.div>
                    {i < flow.steps.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.09 + 0.05 }}
                        className="text-slate-600 flex-shrink-0"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
