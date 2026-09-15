import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export const HeroLanding = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date('2026-10-17T09:00:00+05:30').getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const radarBlips = [
    { label: 'AI/DS', top: '30%', left: '62%' },
    { label: 'MECH', top: '64%', left: '28%' },
    { label: 'E&TC', top: '22%', left: '24%' },
    { label: 'CIVIL', top: '70%', left: '66%' },
    { label: 'ROBOTICS', top: '48%', left: '82%' },
  ];

  return (
    <header className="hero relative min-h-screen flex flex-col justify-center pt-[120px] overflow-hidden border-b border-line" id="top"
      style={{
        background: `
          linear-gradient(var(--ink), var(--ink)) padding-box,
          repeating-linear-gradient(0deg, var(--line-soft) 0 1px, transparent 1px 88px),
          repeating-linear-gradient(90deg, var(--line-soft) 0 1px, transparent 1px 88px)
        `
      }}
    >
      {/* Radar */}
      <div className="absolute top-1/2 -right-[6%] -translate-y-1/2 z-0 opacity-90 max-md:opacity-35 max-md:-right-[30%]"
        style={{ width: 'min(58vw, 760px)', height: 'min(58vw, 760px)' }}
      >
        {[22, 44, 66, 88].map((size, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{
              width: `${size}%`, height: `${size}%`,
              borderColor: i === 3 ? 'var(--line-soft)' : 'var(--line)',
            }}
          />
        ))}
        <div
          className="absolute top-1/2 left-1/2 rounded-full radar-sweep"
          style={{
            width: '88%', height: '88%',
            transform: 'translate(-50%,-50%)',
            background: 'conic-gradient(from 0deg, rgba(61,107,255,0.55), rgba(61,107,255,0) 26%)',
            animation: 'sweep 6s linear infinite',
          }}
        />
        {radarBlips.map((blip) => (
          <div
            key={blip.label}
            className="absolute w-1.5 h-1.5 rounded-full bg-brass"
            style={{
              top: blip.top, left: blip.left,
              boxShadow: '0 0 0 6px rgba(232,185,35,0.14)',
            }}
          >
            <span className="absolute -top-[22px] left-1/2 -translate-x-1/2 font-mono text-[10.5px] tracking-[.06em] text-paper-dim whitespace-nowrap">
              {blip.label}
            </span>
          </div>
        ))}
      </div>

      {/* Hero inner */}
      <div className="wrap relative z-[2] pb-16 hero-inner">
        <div className="flex items-center gap-[18px] mb-[26px] flex-wrap hero-kicker">
          <div className="eyebrow"><span className="dot" />TRANSMISSION LIVE — REGISTRATIONS OPEN</div>
          <div className="font-mono text-[12.5px] tracking-[.1em] text-paper-mute border-l border-line pl-[18px] hero-coords">
            16.95°N · 74.40°E — ADCET, ASHTA
          </div>
        </div>

        <h1 className="font-display font-extrabold leading-[0.86] tracking-[-0.01em] text-paper hero-title" 
            style={{ fontSize: 'clamp(3.4rem, 10.5vw, 9.5rem)' }}>
          <span className="overflow-hidden block" data-line>
            <span className="inline-block">DISCOVERY</span>
          </span>
          <span className="overflow-hidden block" data-line>
            <span className="inline-block" style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--paper)' }}>20</span>
            <span className="inline-block text-brass" style={{ WebkitTextStroke: '0' }}>26</span>
          </span>
        </h1>

        <p className="max-w-[520px] mt-7 text-[17px] leading-[1.65] text-paper-dim hero-sub">
          One campus, one day, <b className="text-paper font-semibold">24+ competitions</b> run by every engineering department at ADCET. Built by students, judged by industry, open to every college that wants in.
        </p>

        <div className="flex items-center gap-[22px] mt-11 flex-wrap hero-actions">
          <a
            href="/register"
            onClick={(e) => { e.preventDefault(); navigate('/register'); }}
            className="btn-primary"
          >
            <span>Register a Team</span>
          </a>
          <a
            href="#tracks"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-ghost"
          >
            View All Events
          </a>
        </div>
      </div>

      {/* Countdown footer */}
      <div className="relative z-[2] border-t border-line hero-foot">
        <div className="wrap grid grid-cols-4 max-sm:grid-cols-2">
          {[
            { val: countdown.d, label: 'DAYS' },
            { val: countdown.h, label: 'HOURS' },
            { val: countdown.m, label: 'MINUTES' },
            { val: countdown.s, label: 'SECONDS' },
          ].map((cell, i) => (
            <div
              key={cell.label}
              className={`py-[22px] px-8 text-left countdown-cell ${i < 3 ? 'border-r border-line' : ''} ${i === 1 ? 'max-sm:border-r-0' : ''}`}
            >
              <div className="font-mono font-semibold text-paper tabular-nums countdown-num"
                style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)' }}>
                {pad(cell.val)}
              </div>
              <div className="font-mono text-[11px] tracking-[.12em] text-paper-mute mt-1">
                {cell.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};
