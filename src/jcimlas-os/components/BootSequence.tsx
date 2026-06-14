// ============================================================
// BootSequence — Linux-themed animated boot
// ============================================================

import { useEffect, useState, memo, useRef } from 'react';

const BOOT_LINES: string[] = [
  '[    0.000000] Booting jcimlasOS kernel 6.8.0-jcimlas-generic (gcc 13.2.0) ...',
  '[    0.012043] CPU: Quad-core virtual @ 3.20GHz',
  '[    0.024518] Memory: 16384MB / 16384MB available',
  '[    0.041290] Initializing cgroup subsys cpuset, cpu, memory',
  '[    0.058821] ACPI: Core revision 20240321',
  '[    0.073204] systemd[1]: Detected virtualization web.',
  '[    0.094730] systemd[1]: Set hostname to <jcimlas-os>',
  '[    0.118445] [  OK  ] Started Load Kernel Modules.',
  '[    0.142998] [  OK  ] Mounted /proc, /sys, /dev, /run.',
  '[    0.167221] [  OK  ] Reached target Local File Systems.',
  '[    0.198554] [  OK  ] Started Network Manager.',
  '[    0.221087] [  OK  ] Started D-Bus System Message Bus.',
  '[    0.254312] [  OK  ] Started User Login Management.',
  '[    0.281772] [  OK  ] Reached target Graphical Interface.',
  '[    0.310045] Starting jcimlas desktop session ...',
  '[    0.342118] Welcome to jcimlasOS — have a productive session.',
];

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01ABCDEF$#';

const MatrixRain = memo(function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array(columns).fill(1);
    let lastResize = canvas.width;
    const draw = () => {
      if (canvas.width !== lastResize) {
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
        lastResize = canvas.width;
      }
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#4ade80';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] || '0';
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.18, pointerEvents: 'none' }}
    />
  );
});

const BootSequence = memo(function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'logs' | 'fade'>('logs');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const total = BOOT_LINES.length;
    const interval = setInterval(() => {
      if (i < total) {
        const line = BOOT_LINES[i];
        if (typeof line === 'string') {
          setLines((prev) => [...prev, line]);
        }
        i++;
        setProgress(Math.min(100, Math.round((i / total) * 100)));
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('fade'), 600);
        setTimeout(() => onComplete(), 1300);
      }
    }, 130);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-black overflow-hidden"
      style={{
        opacity: phase === 'fade' ? 0 : 1,
        transition: 'opacity 800ms ease',
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
      }}
    >
      {/* Matrix rain background */}
      <MatrixRain />

      {/* CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(74,222,128,0.05) 0px, rgba(74,222,128,0.05) 1px, transparent 1px, transparent 3px)',
          mixBlendMode: 'overlay',
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.92) 100%)' }}
      />

      {/* Top brand */}
      <div className="relative z-10 flex items-center gap-4 px-6 md:px-10 pt-8">
        {/* Tux-style penguin glyph */}
        <div style={{ filter: 'drop-shadow(0 0 12px rgba(124,77,255,0.6))' }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <ellipse cx="32" cy="58" rx="22" ry="3" fill="rgba(0,0,0,0.5)" />
            <path d="M32 6 C22 6 18 14 18 24 C18 30 16 34 14 40 C12 46 14 54 22 56 L42 56 C50 54 52 46 50 40 C48 34 46 30 46 24 C46 14 42 6 32 6 Z" fill="#0f0f0f" stroke="#7C4DFF" strokeWidth="1.5"/>
            <path d="M22 16 C24 12 28 10 32 10 C36 10 40 12 42 16 C40 14 36 13 32 13 C28 13 24 14 22 16 Z" fill="#7C4DFF" opacity="0.4"/>
            <ellipse cx="26" cy="22" rx="4.5" ry="5.5" fill="white"/>
            <ellipse cx="38" cy="22" rx="4.5" ry="5.5" fill="white"/>
            <circle cx="26.5" cy="23" r="2.2" fill="#000"/>
            <circle cx="37.5" cy="23" r="2.2" fill="#000"/>
            <circle cx="27.2" cy="22.3" r="0.8" fill="#fff"/>
            <circle cx="38.2" cy="22.3" r="0.8" fill="#fff"/>
            <path d="M28 30 L32 34 L36 30 L34 32 L32 33 L30 32 Z" fill="#FF9800"/>
            <path d="M20 50 Q32 60 44 50 L42 56 L22 56 Z" fill="#FF9800"/>
            <ellipse cx="32" cy="40" rx="10" ry="8" fill="#1a1a1a"/>
          </svg>
        </div>
        <div className="flex-1">
          <div
            className="text-2xl md:text-3xl font-bold tracking-wider"
            style={{ color: '#7C4DFF', textShadow: '0 0 20px rgba(124,77,255,0.7)' }}
          >
            jcimlasOS
          </div>
          <div className="text-[#4ade80] text-[11px] md:text-xs tracking-[0.3em] opacity-80 mt-0.5">
            TTY1 — BOOT CONSOLE
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4ade80]" style={{ animation: 'pulse 1.5s infinite', boxShadow: '0 0 8px #4ade80' }} />
          <span className="text-[#4ade80] text-[10px] md:text-xs tracking-wider hidden sm:inline">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Boot log */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 px-6 md:px-10 py-6 overflow-hidden text-[12px] md:text-[13px] leading-[1.75]"
      >
        {lines.map((line, idx) => {
          if (typeof line !== 'string') return null;
          const hasOk = line.indexOf('[  OK  ]') !== -1;
          if (hasOk) {
            const parts = line.split('[  OK  ]');
            return (
              <div key={idx} style={{ animation: 'bootLineIn 220ms ease' }}>
                <span style={{ color: '#9CA3AF' }}>{parts[0] || ''}</span>
                <span style={{ color: '#4ade80', fontWeight: 600 }}>[  OK  ]</span>
                <span style={{ color: '#E5E7EB' }}>{parts[1] || ''}</span>
              </div>
            );
          }
          return (
            <div key={idx} style={{ animation: 'bootLineIn 220ms ease' }}>
              <span style={{ color: line.startsWith('[') ? '#9CA3AF' : '#a5f3a5' }}>{line}</span>
            </div>
          );
        })}
        <div className="inline-block w-2.5 h-4 bg-[#4ade80] align-middle ml-1" style={{ animation: 'blink 1s steps(2) infinite' }} />
      </div>

      {/* Progress bar */}
      <div className="relative z-10 px-6 md:px-10 pb-3">
        <div className="flex items-center justify-between text-[10px] mb-1.5" style={{ color: '#9CA3AF' }}>
          <span>LOADING SYSTEM</span>
          <span style={{ color: '#7C4DFF' }}>{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(124,77,255,0.15)' }}>
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #7C4DFF, #4ade80)',
              boxShadow: '0 0 12px rgba(124,77,255,0.8)',
            }}
          />
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="relative z-10 px-6 md:px-10 pb-8 pt-3 border-t border-[#7C4DFF]/20">
        <div className="text-center text-xs md:text-sm text-[#9CA3AF]">
          a web based Linux OS made by{' '}
          <a
            href="https://jcimlas.xo.je"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4 transition-colors"
            style={{ color: '#7C4DFF', textShadow: '0 0 10px rgba(124,77,255,0.7)' }}
          >
            jcimlas
          </a>
        </div>
      </div>

      <style>{`
        @keyframes bootLineIn {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
});

export default BootSequence;
