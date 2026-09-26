import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Trophy } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const HeroLanding: React.FC = () => {
  const navigate = useNavigate();

  // Target event date: October 10, 2026 09:00:00 IST
  const targetDate = new Date('2026-10-10T09:00:00').getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  return (
    <>
    <header
      className="hero-editorial-bg relative min-h-[92vh] lg:min-h-[94vh] pt-[92px] sm:pt-[125px] pb-10 sm:pb-20 flex flex-col items-center justify-center overflow-hidden border-b-2 border-[#0F1115] text-[#0F1115] select-none text-center hidden md:flex"
      id="top"
    >
      {/* Background Grid & Accents */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Dynamic Glow Accents */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FFCC00]/15 rounded-full filter blur-3xl pointer-events-none" />
      </div>

      {/* Main Centered Content Container */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 w-full z-10 flex flex-col items-center justify-center my-auto space-y-6 sm:space-y-9">

        {/* Eyebrow Tag Header */}
        <div className="inline-flex items-center justify-center gap-3">
          <span className="bg-[#0F1115] text-[#FFCC00] font-mono text-[11px] sm:text-xs font-bold px-3.5 py-1 border border-[#0F1115] flex items-center gap-2 shadow-[3px_3px_0px_#FFCC00]">
            <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-ping" />
            NATIONAL LEVEL ENGINEERING FESTIVAL
          </span>
        </div>

        {/* MAIN TITLE: DISCOVERY 2026 in Ethnocentric Font */}
        <div className="space-y-3 w-full flex flex-col items-center">
          <h1
            className="font-ethnocentric uppercase text-[#0F1115] leading-[0.9] tracking-tight text-center drop-shadow-sm transition-all"
            style={{ fontSize: 'clamp(3.1rem, 9.5vw, 8rem)' }}
          >
            DISCOVERY 2026
          </h1>

          {/* Sub-brand / College Name Banner */}
          <div className="font-mono text-xs sm:text-sm font-bold tracking-[0.12em] text-[#0F1115] uppercase bg-[#FFCC00]/25 border-y-2 border-x border-[#0F1115] px-4 py-2 max-w-3xl shadow-[3px_3px_0px_#0F1115]">
            ANNASAHEB DANGE COLLEGE OF ENGINEERING AND TECHNOLOGY (ADCET), ASHTA
          </div>
        </div>

        {/* Tagline Slogan */}
        <p className="font-display font-extrabold text-xl sm:text-3xl text-[#0F1115] tracking-tight">
          Code it. Create it. Play for it.
        </p>

        {/* STREAMLINED CENTERED LIVE COUNTDOWN TIMER */}
        <div className="w-full max-w-[570px] bg-[#FFFFFF] border-3 border-[#0F1115] p-3.5 sm:p-5 shadow-[6px_6px_0px_#0F1115] relative">
          
          <div className="flex items-center justify-center gap-2 font-mono text-[10px] sm:text-xs font-bold tracking-widest text-[#0F1115]/70 uppercase mb-3 sm:mb-4">
            <span className="w-2 h-2 rounded-full bg-[#0F1115] animate-ping" />
            <span>EVENT STARTS IN (OCT 10, 2026)</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
            {/* DAYS */}
            <div className="bg-[#0F1115] text-[#FFCC00] p-2 sm:p-3 text-center border-2 border-[#0F1115] shadow-[2px_2px_0px_#FFCC00]">
              <div className="font-display font-black text-xl sm:text-3xl tracking-tight">
                {formatNumber(timeLeft.days)}
              </div>
              <div className="font-mono text-[8px] sm:text-[10px] font-bold tracking-wider uppercase mt-1 text-[#FAFAF8]/80">
                DAYS
              </div>
            </div>

            {/* HOURS */}
            <div className="bg-[#0F1115] text-[#FFCC00] p-2 sm:p-3 text-center border-2 border-[#0F1115] shadow-[2px_2px_0px_#FFCC00]">
              <div className="font-display font-black text-xl sm:text-3xl tracking-tight">
                {formatNumber(timeLeft.hours)}
              </div>
              <div className="font-mono text-[8px] sm:text-[10px] font-bold tracking-wider uppercase mt-1 text-[#FAFAF8]/80">
                HOURS
              </div>
            </div>

            {/* MINUTES */}
            <div className="bg-[#0F1115] text-[#FFCC00] p-2 sm:p-3 text-center border-2 border-[#0F1115] shadow-[2px_2px_0px_#FFCC00]">
              <div className="font-display font-black text-xl sm:text-3xl tracking-tight">
                {formatNumber(timeLeft.minutes)}
              </div>
              <div className="font-mono text-[8px] sm:text-[10px] font-bold tracking-wider uppercase mt-1 text-[#FAFAF8]/80">
                MINUTES
              </div>
            </div>

            {/* SECONDS */}
            <div className="bg-[#FFCC00] text-[#0F1115] p-2 sm:p-3 text-center border-2 border-[#0F1115] shadow-[2px_2px_0px_#0F1115]">
              <div className="font-display font-black text-xl sm:text-3xl tracking-tight animate-pulse">
                {formatNumber(timeLeft.seconds)}
              </div>
              <div className="font-mono text-[8px] sm:text-[10px] font-black tracking-wider uppercase mt-1 text-[#0F1115]/90">
                SECONDS
              </div>
            </div>
          </div>

        </div>

        {/* Key Event Metadata Info Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1 font-mono text-xs sm:text-sm font-bold text-[#0F1115]">
          <div className="flex items-center gap-2 bg-[#FFFFFF] px-3.5 py-1.5 border border-[#0F1115] shadow-[3px_3px_0px_#0F1115]">
            <Calendar className="w-4 h-4 text-[#0F1115]" />
            <span>10th Oct 2026</span>
          </div>

          <div className="flex items-center gap-2 bg-[#FFFFFF] px-3.5 py-1.5 border border-[#0F1115] shadow-[3px_3px_0px_#0F1115]">
            <MapPin className="w-4 h-4 text-[#0F1115]" />
            <span>ADCET Campus, Ashta</span>
          </div>

          <div className="flex items-center gap-2 bg-[#FFCC00] px-3.5 py-1.5 border border-[#0F1115] shadow-[3px_3px_0px_#0F1115]">
            <Trophy className="w-4 h-4 text-[#0F1115]" />
            <span>28 Events • ₹1.5L Cash Prizes</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
          <a
            href="#tracks"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-hero-editorial-yellow group w-full sm:w-auto"
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
            className="btn-hero-editorial-dark group w-full sm:w-auto"
          >
            <span>Register Now</span>
            <span className="text-lg text-[#FFCC00] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </a>
        </div>

      </div>

    </header>

    <section className="mobile-reference-hero md:hidden" id="top-mobile" aria-label="Discovery 2K26 hero">
      <div className="mobile-reference-hero__texture" aria-hidden="true" />
      <div className="mobile-reference-hero__technical-mark mobile-reference-hero__technical-mark--top" aria-hidden="true">17.241° N / 74.412° E</div>
      <div className="mobile-reference-hero__content">
        <div className="mobile-reference-hero__eyebrow">
          <span />
          ADCET PRESENTS
        </div>

        <h1 className="mobile-reference-hero__title">
          <span>DISCOVERY</span>
          <span className="mobile-reference-hero__title-accent">2K26</span>
        </h1>

        <p className="mobile-reference-hero__subtitle">
          NATIONAL LEVEL TECHNICAL FEST
        </p>

        <div className="mobile-reference-hero__rule" />

        <div className="mobile-reference-hero__details">
          <span><Calendar aria-hidden="true" />10 OCTOBER 2026</span>
          <span><MapPin aria-hidden="true" />ADCET, ASHTA</span>
        </div>

        <div className="mobile-reference-hero__countdown" aria-label="Countdown to Discovery 2K26">
          <span className="mobile-reference-hero__countdown-label">EVENT STARTS IN</span>
          <span><strong>{formatNumber(timeLeft.days)}</strong><small>DAYS</small></span>
          <span><strong>{formatNumber(timeLeft.hours)}</strong><small>HRS</small></span>
          <span><strong>{formatNumber(timeLeft.minutes)}</strong><small>MIN</small></span>
          <span><strong>{formatNumber(timeLeft.seconds)}</strong><small>SEC</small></span>
        </div>

        <div className="mobile-reference-hero__actions">
          <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }} className="mobile-reference-hero__register">
            <span>REGISTRATION</span>
            <span aria-hidden="true">→</span>
          </a>
          <a href="#tracks" onClick={(e) => { e.preventDefault(); document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' }); }} className="mobile-reference-hero__cta">
            <span>EXPLORE EVENTS</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
    </>
  );
};
