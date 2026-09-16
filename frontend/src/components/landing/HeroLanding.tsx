import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HeroLanding: React.FC = () => {
  const navigate = useNavigate();

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
      className="hero relative min-h-[85vh] md:min-h-[90vh] flex items-center pt-[85px] sm:pt-[100px] pb-12 sm:pb-16 overflow-hidden border-b border-[#262b35] bg-[#0A0C10]"
      id="top"
    >
      {/* Background Radar Animation (Restored) */}
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
              borderColor: i === 3 ? 'rgba(237,234,226,0.06)' : 'rgba(38,43,53,0.8)',
            }}
          />
        ))}

        {/* Radar Sweep */}
        <div
          className="absolute top-1/2 left-1/2 rounded-full radar-sweep"
          style={{
            width: '88%', height: '88%',
            transform: 'translate(-50%,-50%)',
            background: 'conic-gradient(from 0deg, rgba(61,107,255,0.45), rgba(61,107,255,0) 28%)',
            animation: 'sweep 6s linear infinite',
          }}
        />

        {/* Department Radar Blips */}
        {radarBlips.map((blip) => (
          <div
            key={blip.label}
            className="absolute w-2 h-2 rounded-full bg-[#e8b923]"
            style={{
              top: blip.top, left: blip.left,
              boxShadow: '0 0 0 6px rgba(232,185,35,0.18)',
            }}
          >
            <span className="absolute -top-[22px] left-1/2 -translate-x-1/2 font-mono text-[10.5px] tracking-[.06em] text-[#97a0ac] whitespace-nowrap">
              {blip.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Hero Content */}
      <div className="wrap relative z-10 w-full">
        <div className="max-w-[920px] flex flex-col justify-center">

          {/* Main Title */}
          <h1
            className="font-display font-black leading-[0.88] tracking-[-0.02em] text-[#EDEAE2] mb-3 sm:mb-4 uppercase select-none max-w-full"
            style={{ fontSize: 'clamp(2rem, 7.2vw, 6.5rem)' }}
          >
            <span className="block text-[#EDEAE2]">
              DISCOVERY
            </span>
            <span className="block">
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1.5px #EDEAE2'
                }}
              >
                20
              </span>
              <span className="text-[#E8B923]">
                26
              </span>
            </span>
          </h1>

          {/* Sub-brand / Tag */}
          <div className="font-mono text-[11px] sm:text-[13px] tracking-[0.16em] sm:tracking-[0.26em] text-[#E8B923] uppercase font-semibold mb-5 sm:mb-6">
            Annasaheb Dange College of Engineering and Technology (ADCET), Ashta
          </div>

          {/* Minimalist Subtitle Paragraph */}
          <div className="space-y-1 text-[#97a0ac] text-[14px] sm:text-[17px] font-normal leading-[1.6] max-w-[480px] mb-7 sm:mb-10">
            <p className="text-[#edeae2] font-medium text-[15px] sm:text-[17px]">Code it. Create it. Play for it.</p>
            <p className="text-[#7e8794] text-[13px] sm:text-[14px]">National Level Event • 10th October 2026</p>
          </div>

          {/* Action Buttons */}
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
              <span className="text-base leading-none text-[#E8B923]">↗</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};
