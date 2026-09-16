import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const HeroLanding: React.FC = () => {
  const navigate = useNavigate();

  // Target event date: Sept 29, 2026 08:00:00 IST
  const targetDate = new Date('2026-09-29T08:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, targetDate - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const quickStats = [
    { value: '₹1.5L+', label: 'Prize Purse', badge: 'Same Day Payout' },
    { value: '28+', label: 'Competitions', badge: '11 Streams' },
    { value: '50+', label: 'Colleges', badge: 'National Talent' },
  ];

  return (
    <header className="hero relative min-h-[92vh] flex items-center pt-[110px] pb-16 sm:pb-24 border-b border-[#E6E6E6] overflow-hidden" id="top">
      {/* Background Radial Canvas Lights */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-[#F1F5EE] to-[#EEF2EB] blur-[100px] pointer-events-none -z-10" />

      <div className="wrap relative z-10 w-full">
        {/* Asymmetric Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            {/* Live Campus Pill & Social Proof */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#F1F5EE] border border-[#BAC8B1] text-[#404E3B] font-mono text-xs font-bold tracking-wide shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7B9669] animate-pulse" />
                <span>ADCET ASHTA • 29TH SEPT 2026</span>
              </div>
              <span className="font-mono text-xs font-bold text-[#6C8480] bg-white border border-[#E6E6E6] px-3 py-1 rounded-full">
                🎓 2,500+ Scholars Expected
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-black leading-[0.96] tracking-tight mb-6 uppercase text-[#404E3B]" style={{ fontSize: 'clamp(2.6rem, 6.8vw, 5.8rem)' }}>
              DISCOVERY <br />
              <span className="gradient-text-jade">2026</span>
            </h1>

            {/* Subheading */}
            <p className="font-display text-xl sm:text-2xl font-bold text-[#404E3B] mb-3">
              National Engineering & Technology Festival.
            </p>
            <p className="text-[#2E382A] text-base sm:text-lg leading-relaxed max-w-[580px] mb-8">
              Join over 2,500 innovators across 11 specialized engineering streams for an extraordinary day of competitive hackathons, robotics, CAD design, and research showcases.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <a
                href="#tracks"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-jade-primary text-base py-3.5 px-8"
              >
                <span>Explore All Competitions</span>
                <span className="text-lg">↗</span>
              </a>

              <a
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/register');
                }}
                className="btn-jade-dark text-base py-3.5 px-8"
              >
                <span>Register Your Team</span>
                <span className="text-lg">⚡</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#E6E6E6]">
              {quickStats.map((stat, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-display font-black text-xl sm:text-2xl text-[#404E3B]">
                    {stat.value}
                  </div>
                  <div className="font-mono text-xs font-bold text-[#7B9669]">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-[#6C8480]">
                    {stat.badge}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Floating Interactive Spotlight Bento Box */}
          <div className="lg:col-span-5">
            <div className="jade-card p-6 sm:p-8 space-y-6 relative border-[#BAC8B1] shadow-xl bg-white/95 backdrop-blur-md">

              {/* Card Header Badge */}
              <div className="flex items-center justify-between border-b border-[#E6E6E6] pb-4">
                <span className="font-mono text-xs font-bold text-[#7B9669] bg-[#F1F5EE] border border-[#BAC8B1] px-3 py-1 rounded-full">
                  ⏱️ EVENT COUNTDOWN
                </span>
                <span className="font-mono text-xs font-semibold text-[#6C8480]">
                  ONE-DAY FORMAT
                </span>
              </div>

              {/* Real-Time Live Countdown Clock Grid */}
              <div className="grid grid-cols-4 gap-2 text-center bg-[#F9FBF8] p-3.5 rounded-xl border border-[#BAC8B1]">
                <div>
                  <div className="font-display font-black text-2xl text-[#404E3B]">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="font-mono text-[10px] font-bold text-[#7B9669] uppercase">Days</div>
                </div>

                <div>
                  <div className="font-display font-black text-2xl text-[#404E3B]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="font-mono text-[10px] font-bold text-[#7B9669] uppercase">Hours</div>
                </div>

                <div>
                  <div className="font-display font-black text-2xl text-[#404E3B]">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="font-mono text-[10px] font-bold text-[#7B9669] uppercase">Mins</div>
                </div>

                <div>
                  <div className="font-display font-black text-2xl text-[#7B9669]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="font-mono text-[10px] font-bold text-[#7B9669] uppercase">Secs</div>
                </div>
              </div>

              {/* Spotlight Event Highlights */}
              <div className="space-y-3">
                <h3 className="font-display font-extrabold text-2xl text-[#404E3B]">
                  Code, Build & Pitch Live
                </h3>
                <p className="text-[#2E382A] text-sm leading-relaxed">
                  Competitions run simultaneously across 11 department labs with live evaluation from senior industry engineers and research scientists.
                </p>
              </div>

              {/* Mini Interactive Bento Cards Stack */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#F6F8F5] p-4 rounded-xl border border-[#BAC8B1]">
                  <div className="font-mono text-xs text-[#6C8480]">TOP PRIZE</div>
                  <div className="font-display font-bold text-lg text-[#7B9669] mt-0.5">₹1.5 Lakhs</div>
                  <div className="text-[11px] text-[#6C8480] mt-1">Total Pool</div>
                </div>

                <div className="bg-[#F6F8F5] p-4 rounded-xl border border-[#BAC8B1]">
                  <div className="font-mono text-xs text-[#6C8480]">RECOGNITION</div>
                  <div className="font-display font-bold text-lg text-[#404E3B] mt-0.5">100% Certified</div>
                  <div className="text-[11px] text-[#6C8480] mt-1">For All Attendees</div>
                </div>
              </div>

              {/* Live Status Footnote */}
              <div className="p-3.5 rounded-xl bg-[#F1F5EE] border border-[#BAC8B1] flex items-center justify-between text-xs font-mono text-[#7B9669]">
                <span className="flex items-center gap-2 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#7B9669] animate-ping" />
                  Registrations Open
                </span>
                <span className="font-semibold text-[#404E3B]">Limited Seats</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
