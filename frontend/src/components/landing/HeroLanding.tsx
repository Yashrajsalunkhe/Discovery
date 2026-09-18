import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const HeroLanding: React.FC = () => {
  const navigate = useNavigate();
  const [activeDept, setActiveDept] = useState<string | null>(null);

  const radarBlips = [
    { label: 'CSE', top: '22%', left: '26%', color: '#FFCC00' },
    { label: 'AI/DS', top: '18%', left: '74%', color: '#FFCC00' },
    { label: 'Electrical', top: '34%', left: '50%', color: '#FFCC00' },
    { label: 'Robotics In AI', top: '48%', left: '16%', color: '#FFCC00' },
    { label: 'Food Technology', top: '44%', left: '78%', color: '#FFCC00' },
    { label: 'Aeronautical', top: '64%', left: '84%', color: '#FFCC00' },
    { label: 'MECH', top: '72%', left: '32%', color: '#FFCC00' },
    { label: 'BCA & BBA', top: '82%', left: '72%', color: '#FFCC00' },
    { label: 'CIVIL', top: '86%', left: '52%', color: '#FFCC00' },
  ];

  return (
    <header
      className="hero-editorial-bg relative min-h-[92vh] pt-[95px] sm:pt-[115px] pb-10 sm:pb-16 flex flex-col justify-between overflow-hidden border-b-2 border-[#0F1115] text-[#0F1115] select-none"
      id="top"
    >
      {/* Background Architectural Grid Lines & Crosshairs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-24 left-6 font-mono text-[10px] text-[#0F1115]/30 tracking-widest hidden md:block">
          [ FIG 01. — HERO COMPOSITION // NATL-FEST-2026 ]
        </div>
        <div className="absolute top-24 right-6 font-mono text-[10px] text-[#0F1115]/30 tracking-widest hidden md:block">
          COORDINATES: 16.9463° N, 74.4092° E
        </div>

        {/* Editorial Crosshairs */}
        <div className="absolute top-20 left-4 text-[#0F1115]/20 font-mono text-xs">+</div>
        <div className="absolute top-20 right-4 text-[#0F1115]/20 font-mono text-xs">+</div>
        <div className="absolute bottom-4 left-4 text-[#0F1115]/20 font-mono text-xs">+</div>
        <div className="absolute bottom-4 right-4 text-[#0F1115]/20 font-mono text-xs">+</div>
      </div>

      {/* Main Hero Grid */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center my-auto">

        {/* LEFT COLUMN: Typographic Presentation */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-7">

          {/* Eyebrow Header Tag */}
          <div className="flex items-center gap-3">
            <span className="bg-[#0F1115] text-[#FFCC00] font-mono text-[11px] font-bold px-2 py-0.5 border border-[#0F1115]">
              IDEAS / PEOPLE / POSSIBILITIES
            </span>
            <div className="h-[2px] w-16 sm:w-24 bg-[#0F1115]" />
          </div>

          {/* Main Title: DISCOVERY 2K26 */}
          <div className="space-y-1">
            <h1
              className="font-display font-black text-[#0F1115] uppercase leading-[0.86] tracking-tighter"
              style={{ fontSize: 'clamp(3rem, 8.5vw, 6.8rem)' }}
            >
              DISCOVERY
            </h1>

            {/* 2K26 Distinct Visual Treatment */}
            <div className="flex items-center gap-4 pt-1">
              <div className="relative inline-block">
                <span className="bg-[#FFCC00] text-[#0F1115] font-display font-black px-4 py-1.5 sm:px-6 sm:py-2 text-3xl sm:text-5xl lg:text-6xl border-3 border-[#0F1115] shadow-[6px_6px_0px_#0F1115] block tracking-wider">
                  2K26
                </span>
              </div>
              <div className="hidden sm:flex flex-col text-xs font-mono font-bold tracking-widest text-[#0F1115] border-l-2 border-[#0F1115] pl-3 py-1">
                <span>NATIONAL LEVEL</span>
                <span>ENGINEERING FESTIVAL</span>
              </div>
            </div>
          </div>

          {/* Sub-brand / College Name */}
          <div className="font-mono text-xs sm:text-sm font-bold tracking-[0.14em] text-[#0F1115] uppercase bg-[#FFCC00]/20 border-l-4 border-[#FFCC00] p-3 border-y border-r border-[#0F1115]/10 max-w-2xl">
            ANNASAHEB DANGE COLLEGE OF ENGINEERING AND TECHNOLOGY (ADCET), ASHTA
          </div>

          {/* Slogan & Event Details Box */}
          <div className="space-y-4 max-w-xl">
            <p className="font-display font-bold text-xl sm:text-2xl text-[#0F1115] tracking-tight">
              Code it. Create it. Play for it.
            </p>

            {/* Event Info Metadata Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#FFFFFF] border-2 border-[#0F1115] shadow-[4px_4px_0px_#0F1115]">
              <div className="flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-[#0F1115]/20 pb-2 sm:pb-0 sm:pr-2">
                <div className="w-8 h-8 bg-[#FFCC00] border border-[#0F1115] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#0F1115]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-[10px] font-bold text-[#0F1115]/60 uppercase">Event Type & Date</div>
                  <div className="font-mono text-xs font-bold text-[#0F1115]">National Level Event • 10th Oct 2026</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FFCC00] border border-[#0F1115] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#0F1115]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-[10px] font-bold text-[#0F1115]/60 uppercase">Venue Location</div>
                  <div className="font-mono text-xs font-bold text-[#0F1115]">ADCET, Ashta • Maharashtra, India</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <a
              href="#tracks"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-hero-editorial-yellow group"
            >
              <span>Explore Events</span>
              <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
            </a>

            <a
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
              className="btn-hero-editorial-dark group"
            >
              <span>Register Now</span>
              <span className="text-lg text-[#FFCC00] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
          </div>

          {/* Bottom Left Editorial Line */}
          <div className="font-mono text-[11px] font-bold text-[#0F1115]/60 tracking-widest uppercase flex items-center gap-2 pt-1">
            <div className="w-8 h-[2px] bg-[#0F1115]" />
            <span>MORE THAN JUST AN EVENT</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Visual Centerpiece (Campus Photo + Editorial Radar Dial) */}
        <div className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0">

          {/* Main Visual Frame Wrapper */}
          <div className="relative w-full max-w-[500px] lg:max-w-none aspect-square sm:aspect-[5/6] max-h-[580px] flex items-center justify-center">

            {/* Yellow Graphic Backdrop Brush Layer */}
            <div className="absolute inset-4 bg-[#FFCC00] border-3 border-[#0F1115] shadow-[10px_10px_0px_#0F1115] pointer-events-none" />

            {/* Circular Department Vinyl / Radar Disk (Background of Photo) */}
            <div className="absolute top-4 right-2 w-[280px] sm:w-[360px] h-[280px] sm:h-[360px] rounded-full bg-[#0F1115] border-4 border-[#0F1115] overflow-hidden z-0 shadow-xl opacity-95">
              {/* Radar Rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[85%] h-[85%] rounded-full border border-white/10" />
                <div className="w-[65%] h-[65%] rounded-full border border-white/20" />
                <div className="w-[45%] h-[45%] rounded-full border border-[#FFCC00]/40" />
                <div className="w-[25%] h-[25%] rounded-full border border-white/20" />
              </div>

              {/* Department Radar Sweep */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full opacity-40 pointer-events-none">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(255,204,0,0.6), transparent 30%)',
                    animation: 'sweep 8s linear infinite',
                  }}
                />
              </div>

              {/* Interactive Department Blips */}
              {radarBlips.map((blip) => (
                <div
                  key={blip.label}
                  onMouseEnter={() => setActiveDept(blip.label)}
                  onMouseLeave={() => setActiveDept(null)}
                  className="absolute z-10 cursor-pointer group"
                  style={{ top: blip.top, left: blip.left }}
                >
                  <div className="w-3 h-3 rounded-full bg-[#FFCC00] border-2 border-[#0F1115] shadow-[0_0_8px_#FFCC00] transition-transform group-hover:scale-150 animate-pulse" />
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[9.5px] font-bold tracking-wider text-[#FFFFFF] bg-[#0F1115] px-1.5 py-0.5 border border-[#FFCC00]/40 whitespace-nowrap shadow-sm">
                    {blip.label}
                  </span>
                </div>
              ))}
            </div>

            {/* ADCET Campus Photo Overlay */}
            <div className="relative z-10 w-[85%] h-[82%] border-3 border-[#0F1115] overflow-hidden bg-white shadow-[6px_6px_0px_#0F1115] transition-transform duration-300">
              <img
                src="/hero-campus.png"
                alt="ADCET Campus Students & Engineering Building"
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
              />

              {/* Photo Overlay Technical Badge */}
              <div className="absolute top-3 left-3 bg-[#0F1115] text-[#FFCC00] font-mono text-[10px] font-bold px-2.5 py-1 border border-[#FFCC00]">
                ADCET CAMPUS // ASHTA
              </div>

              {/* Active Department Indicator Overlay */}
              {activeDept && (
                <div className="absolute bottom-3 left-3 right-3 bg-[#FFCC00] text-[#0F1115] font-mono text-xs font-black p-2 border-2 border-[#0F1115] text-center shadow-md animate-fade-in">
                  DEPARTMENT: {activeDept}
                </div>
              )}
            </div>

            {/* Editorial Handwritten Annotation 1 (Top Left) */}
            <div className="absolute top-2 left-0 sm:-left-4 z-20 pointer-events-none">
              <div className="font-handwritten text-2xl sm:text-3xl font-extrabold text-[#0F1115] bg-[#FFFFFF] px-3 py-1 border-2 border-[#0F1115] shadow-[3px_3px_0px_#FFCC00] whitespace-nowrap">
                Different Departments One Stage
              </div>
              <svg className="w-12 h-8 text-[#0F1115] ml-auto -mt-1" viewBox="0 0 50 30" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 25 C 20 5, 35 25, 45 10" />
                <path d="M38 8 L 45 10 L 43 18" />
              </svg>
            </div>

            {/* Editorial Stamp Annotation 2 (Bottom Right) */}
            <div className="absolute -bottom-4 right-0 sm:-right-4 z-20">
              <div className="editorial-stamp font-handwritten text-lg sm:text-xl font-bold px-4 py-2 text-[#0F1115] border-2 border-[#0F1115] rounded-sm">
                28 Events • 11 Departments • 1 Discovery
              </div>
            </div>

          </div>

        </div>

      </div>

    </header>
  );
};
