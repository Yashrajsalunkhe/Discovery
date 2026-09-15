import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
    document.body.style.overflow = '';
  }, []);

  const openMobile = useCallback(() => {
    setIsMobileOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    closeMobile();
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [closeMobile]);

  const handleRegister = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    closeMobile();
    navigate('/register');
  }, [navigate, closeMobile]);

  const navLinks = [
    { label: 'Events', hash: 'tracks' },
    { label: 'About', hash: 'briefing' },
    { label: 'Schedule', hash: 'schedule' },
    { label: 'Why Attend', hash: 'why' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-[300ms] ease-out border-b ${isScrolled
            ? 'bg-[#0A0C10]/95 backdrop-blur-md border-[#262b35] py-3 shadow-lg'
            : 'bg-transparent border-transparent py-3.5 sm:py-6'
          }`}
      >
        <div className="wrap flex items-center justify-between gap-3">
          {/* Logo */}
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, 'top')}
            className="font-display font-extrabold text-base sm:text-xl tracking-[0.05em] text-[#EDEAE2] flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0"
          >
            {/* Logo Icon Motif */}
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff5e2b] transition-transform duration-300 group-hover:scale-110 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="6" cy="6" r="2" fill="currentColor" />
              <circle cx="18" cy="6" r="2" fill="currentColor" />
              <circle cx="6" cy="18" r="2" fill="currentColor" />
              <circle cx="18" cy="18" r="2" fill="currentColor" />
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="truncate">DISCOVERY<span className="text-[#ff5e2b] text-[10px] sm:text-xs align-super ml-0.5 font-mono">2K26</span></span>
          </a>

          {/* Desktop Nav Links - Clean & Minimalist */}
          <div className="hidden md:flex items-center gap-8 font-mono text-[13px] tracking-[0.05em] text-[#97a0ac]">
            {navLinks.map((link) => (
              <a
                key={link.hash}
                href={`#${link.hash}`}
                onClick={(e) => handleNavClick(e, link.hash)}
                className="transition-colors duration-200 hover:text-[#EDEAE2] py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Action Button - Hidden on Mobile */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a
              href="/register"
              onClick={handleRegister}
              className="btn-nav-orange hidden md:inline-flex"
            >
              <span>Register</span>
              <span className="text-sm font-semibold">↗</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              className="flex md:hidden items-center justify-center w-[40px] h-[40px] text-[#edeae2] bg-[#12151b]/80 border border-[#262b35] rounded-lg transition-colors active:scale-95"
              onClick={openMobile}
              aria-label="Open menu"
            >
              <span className="flex flex-col gap-[4.5px] w-[18px]">
                <span className="block h-[1.5px] bg-[#edeae2] w-full rounded-full" />
                <span className="block h-[1.5px] bg-[#edeae2] w-full rounded-full" />
                <span className="block h-[1.5px] bg-[#edeae2] w-full rounded-full" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-[#0A0C10]/98 backdrop-blur-xl z-[900] flex flex-col justify-between p-6 sm:p-8 transition-transform duration-400 ease-[cubic-bezier(.65,0,.35,1)] ${isMobileOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="flex items-center justify-between border-b border-[#262b35] pb-5">
          <div className="font-display font-bold text-lg text-[#EDEAE2] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#ff5e2b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="6" cy="6" r="2" fill="currentColor" />
              <circle cx="18" cy="6" r="2" fill="currentColor" />
              <circle cx="6" cy="18" r="2" fill="currentColor" />
              <circle cx="18" cy="18" r="2" fill="currentColor" />
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>DISCOVERY<span className="text-[#ff5e2b] text-xs align-super ml-0.5">2K26</span></span>
          </div>

          <button
            className="font-mono text-xs tracking-[.1em] text-[#97a0ac] hover:text-[#edeae2] py-2 px-3 border border-[#262b35] rounded-lg bg-[#12151b]"
            onClick={closeMobile}
          >
            CLOSE ✕
          </button>
        </div>

        <div className="flex flex-col space-y-2 my-auto py-6">
          {navLinks.map((link, i) => (
            <a
              key={link.hash}
              href={`#${link.hash}`}
              onClick={(e) => handleNavClick(e, link.hash)}
              className="font-display text-2xl sm:text-3xl font-bold py-3.5 border-b border-[#262b35]/60 text-[#edeae2] flex items-center justify-between transition-colors hover:text-[#E8B923]"
            >
              <span>{link.label}</span>
              <span className="font-mono text-xs text-[#E8B923]">0{i + 1}</span>
            </a>
          ))}
        </div>

        <div>
          <a
            href="/register"
            onClick={handleRegister}
            className="btn-hero-yellow w-full text-center justify-center min-h-[50px] text-sm"
          >
            <span>Register Now</span>
            <span>↗</span>
          </a>
          <p className="text-center font-mono text-[11px] text-[#97a0ac] mt-4 tracking-wider">
            ADCET ASHTA • 29TH SEPT 2026
          </p>
        </div>
      </div>
    </>
  );
};
