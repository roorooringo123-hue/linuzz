// ============================================================
// BootSequence — Linux-themed animated boot
// ============================================================

import { useEffect, useState, memo, useRef } from 'react';

const BOOT_LINES = [
  '[    0.000000] Booting jcimlasOS kernel 6.8.0-jcimlas ...',
  '[    0.012043] CPU: Quad-core virtual @ 3.20GHz',
  '[    0.024518] Memory: 16384MB available',
  '[    0.041290] Initializing cgroup subsys cpuset',
  '[    0.058821] ACPI: Core revision 20240321',
  '[    0.073204] systemd[1]: Detected virtualization web.',
  '[    0.094730] systemd[1]: Set hostname to <jcimlas-os>',
  '[    0.118445] [  OK  ] Started Load Kernel Modules.',
  '[    0.142998] [  OK  ] Mounted /proc, /sys, /dev.',
  '[    0.167221] [  OK  ] Reached target Local File Systems.',
  '[    0.198554] [  OK  ] Started Network Manager.',
  '[    0.221087] [  OK  ] Started D-Bus System Message Bus.',
  '[    0.254312] [  OK  ] Started User Login Management.',
  '[    0.281772] [  OK  ] Reached target Graphical Interface.',
  '[    0.310045] Starting jcimlas desktop session ...',
  '[    0.342118] Welcome to jcimlasOS.',
];

const BootSequence = memo(function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<'logs' | 'fade'>('logs');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('fade'), 500);
        setTimeout(() => onComplete(), 1200);
      }
    }, 140);
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
        transition: 'opacity 700ms ease',
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
      }}
    >
      {/* CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,255,120,0.04) 0px, rgba(0,255,120,0.04) 1px, transparent 1px, transparent 3px)',
          mixBlendMode: 'overlay',
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)' }}
      />

      {/* Top brand */}
      <div className="relative z-10 flex items-center gap-4 px-8 pt-8">
        {/* Tux-style penguin glyph */}
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="58" rx="20" ry="3" fill="rgba(0,0,0,0.5)" />
          <path d="M32 6 C22 6 18 14 18 24 C18 30 16 34 14 40 C12 46 14 54 22 56 L42 56 C50 54 52 46 50 40 C48 34 46 30 46 24 C46 14 42 6 32 6 Z" fill="#1a1a1a" stroke="#7C4DFF" strokeWidth="1.5"/>
          <ellipse cx="26" cy="22" rx="4" ry="5" fill="white"/>
          <ellipse cx="38" cy="22" rx="4" ry="5" fill="white"/>
          <circle cx="26" cy="23" r="2" fill="#000"/>
          <circle cx="38" cy="23" r="2" fill="#000"/>
          <path d="M28 30 L32 34 L36 30 Z" fill="#FF9800"/>
          <path d="M20 50 Q32 58 44 50 L42 56 L22 56 Z" fill="#FF9800"/>
        </svg>
        <div>
          <div className="text-[#7C4DFF] text-2xl font-bold tracking-wider">jcimlasOS</div>
          <div className="text-[#4ade80] text-xs tracking-widest opacity-80">tty1 — boot console</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
          <span className="text-[#4ade80] text-xs">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Boot log */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 px-8 py-6 overflow-hidden text-[13px] leading-[1.7]"
        style={{ color: '#a5f3a5' }}
      >
        {lines.map((line, idx) => {
          const isOk = line.includes('[  OK  ]');
          return (
            <div key={idx} style={{ animation: 'bootLineIn 200ms ease' }}>
              {isOk ? (
                <>
                  <span style={{ color: '#9CA3AF' }}>{line.split('[  OK  ]')[0]}</span>
                  <span style={{ color: '#4ade80', fontWeight: 600 }}>[  OK  ]</span>
                  <span style={{ color: '#E5E7EB' }}>{line.split('[  OK  ]')[1]}</span>
                </>
              ) : (
                <span style={{ color: line.startsWith('[') ? '#9CA3AF' : '#a5f3a5' }}>{line}</span>
              )}
            </div>
          );
        })}
        <div className="inline-block w-2.5 h-4 bg-[#4ade80] align-middle ml-1" style={{ animation: 'blink 1s steps(2) infinite' }} />
      </div>

      {/* Bottom tagline */}
      <div className="relative z-10 px-8 pb-8 pt-4 border-t border-[#7C4DFF]/20">
        <div className="text-center text-sm text-[#9CA3AF]">
          a web based Linux OS made by{' '}
          <a
            href="https://jcimlas.xo.je"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7C4DFF] hover:text-[#9575FF] font-semibold underline underline-offset-4 transition-colors"
            style={{ textShadow: '0 0 8px rgba(124,77,255,0.6)' }}
          >
            jcimlas
          </a>
        </div>
      </div>

      <style>{`
        @keyframes bootLineIn {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
});

export default BootSequence;
