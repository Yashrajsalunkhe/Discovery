import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const countdownTarget = new Date('2026-10-10T00:00:00+05:30').getTime();

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getCountdown = (): CountdownValues => {
  const remaining = Math.max(0, countdownTarget - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};

export const HeroLanding: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<CountdownValues>(getCountdown);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const isLive = countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0;

  const radarBlips = [
    { label: 'AI/DS', top: '30%', left: '62%' },
    { label: 'MECH', top: '64%', left: '28%' },
    { label: 'CSE', top: '22%', left: '24%' },
    { label: 'Electrical', top: '40%', left: '40%' },
    { label: 'Food Technology', top: '50%', left: '50%' },
    { label: 'Aeronautical', top: '60%', left: '60%' },
    { label: 'BCA & BBA', top: '70%', left: '70%' },
    { label: 'CIVIL', top: '80%', left: '66%' },
    { label: 'ROBOTICS In AI ', top: '48%', left: '12%' },
  ];

  return (
    <header
      className="hero relative min-h-[85vh] md:min-h-[90vh] flex items-center pt-[85px] sm:pt-[100px] pb-12 sm:pb-16 overflow-hidden border-b border-slate-200 bg-white"
      id="top"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_28%)]" />
      <div
        className="absolute top-1/2 -right-[5%] -translate-y-1/2 z-0 opacity-80 max-md:opacity-35 max-md:-right-[30%] max-sm:-right-[50%] max-sm:opacity-20 pointer-events-none"
        style={{ width: 'min(58vw, 760px)', height: 'min(58vw, 760px)' }}
      >
        {[22, 44, 66, 88].map((size, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{
              width: `${size}%`, height: `${size}%`,
              borderColor: i === 3 ? 'rgba(148,163,184,0.2)' : 'rgba(148,163,184,0.45)',
            }}
          />
        ))}

        <div
          className="absolute top-1/2 left-1/2 rounded-full radar-sweep"
          style={{
            width: '88%', height: '88%',
            transform: 'translate(-50%,-50%)',
            background: 'conic-gradient(from 0deg, rgba(79,70,229,0.28), rgba(79,70,229,0) 28%)',
            animation: 'sweep 6s linear infinite',
          }}
        />

        {radarBlips.map((blip) => (
          <div
            key={blip.label}
            className="absolute w-2.5 h-2.5 rounded-full bg-indigo-600"
            style={{
              top: blip.top, left: blip.left,
              boxShadow: '0 0 0 7px rgba(79, 70, 229, 0.12)',
            }}
          >
            <span className="absolute -top-[22px] left-1/2 -translate-x-1/2 font-mono text-[10.5px] tracking-[.06em] text-slate-500 whitespace-nowrap">
              {blip.label}
            </span>
          </div>
        ))}
      </div>

      <div className="wrap relative z-10 w-full">
        <div className="max-w-[920px] flex flex-col justify-center">
          <h1
            className="font-display font-black leading-[0.88] tracking-[-0.02em] text-slate-900 mb-3 sm:mb-4 uppercase select-none max-w-full"
            style={{ fontSize: 'clamp(2rem, 7.2vw, 6.5rem)' }}
          >
            <span className="block text-slate-900">
              DISCOVERY
            </span>
            <span className="block">
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1.5px #0f172a'
                }}
              >
                20
              </span>
              <span className="text-indigo-600">
                26
              </span>
            </span>
          </h1>

          <div className="font-mono text-[11px] sm:text-[13px] tracking-[0.16em] sm:tracking-[0.26em] text-indigo-600 uppercase font-semibold mb-5 sm:mb-6">
            Annasaheb Dange College of Engineering and Technology (ADCET), Ashta
          </div>

          <div className="space-y-1 text-slate-600 text-[14px] sm:text-[17px] font-normal leading-[1.6] max-w-[480px] mb-7 sm:mb-10">
            <p className="text-slate-900 font-medium text-[15px] sm:text-[17px]">Code it. Create it. Play for it.</p>
            <p className="text-slate-500 text-[13px] sm:text-[14px]">National Level Event • 10th October 2026</p>
          </div>

          <div className="mb-7 sm:mb-10" aria-live="polite">
            <p className="font-mono text-[11px] sm:text-xs tracking-[.16em] text-[#2563EB] font-semibold mb-3">
              {isLive ? 'EVENT IS LIVE' : 'EVENT STARTS IN'}
            </p>
            {!isLive && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-[480px]">
                {[
                  ['days', countdown.days, 'DAYS'],
                  ['hours', countdown.hours, 'HOURS'],
                  ['minutes', countdown.minutes, 'MINUTES'],
                  ['seconds', countdown.seconds, 'SECONDS'],
                ].map(([key, value, label]) => (
                  <div
                    key={key}
                    className="min-w-0 rounded-xl border border-[#E2E8F0] bg-white px-2 py-3 sm:px-3 sm:py-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                  >
                    <div className="text-[#0F172A] font-display font-bold text-xl sm:text-2xl leading-none">
                      {String(value).padStart(2, '0')}
                    </div>
                    <div className="mt-2 font-mono text-[9px] sm:text-[10px] tracking-[.08em] text-[#64748B] truncate">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href="#tracks"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-hero-yellow w-full sm:w-auto sm:min-w-[170px]"
            >
              <span>Explore events</span>
              <span className="text-base leading-none">↗</span>
            </a>

            <a
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
              className="btn-hero-dark w-full sm:w-auto sm:min-w-[150px]"
            >
              <span>Register</span>
              <span className="text-base leading-none text-indigo-600">↗</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
