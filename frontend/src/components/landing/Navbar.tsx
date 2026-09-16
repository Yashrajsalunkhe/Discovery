import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    { label: 'FAQ', hash: 'faq' },
    { label: 'Venue', hash: 'venue' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#404E3B] text-white font-mono text-xs py-2 px-4 text-center border-b border-[#2F3B2B] flex items-center justify-center gap-3">
        <span className="bg-[#7B9669] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
          LIVE ANNOUNCEMENT
        </span>
        <span className="truncate">
          🎉 Early Bird Registrations Open • 100% Verifiable Certificates for All Attendees • ₹1.5L+ Cash Prize Pool
        </span>
      </div>

      {/* Main Glass Navbar */}
      <nav
        className={`fixed top-[32px] left-0 right-0 z-[500] transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-[#F6F8F5]/90 backdrop-blur-xl border-b border-[#E6E6E6] py-3 shadow-xs'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="wrap flex items-center justify-between gap-4">
          {/* Logo & Live Badge */}
          <div className="flex items-center gap-3">
            <a
              href="#top"
              onClick={(e) => handleNavClick(e, 'top')}
              className="font-display font-black text-lg sm:text-2xl tracking-tight text-[#404E3B] flex items-center gap-2.5 group shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#7B9669] p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#FFFFFF] rounded-[10px] flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#7B9669]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
              <span>
                DISCOVERY<span className="text-[#7B9669] font-mono text-xs sm:text-sm ml-1">2K26</span>
              </span>
            </a>

            {/* Morning Sage Date Badge */}
            <span className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5EE] border border-[#BAC8B1] text-[#404E3B] font-mono text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#7B9669] animate-pulse" />
              29th Sept 2026
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7 font-medium text-[14.5px] text-[#2E382A]">
            {navLinks.map((link) => (
              <a
                key={link.hash}
                href={`#${link.hash}`}
                onClick={(e) => handleNavClick(e, link.hash)}
                className="transition-colors duration-200 hover:text-[#7B9669] py-1 relative group font-semibold"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#7B9669] transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/register"
              onClick={handleRegister}
              className="btn-jade-primary text-xs sm:text-sm py-2.5 px-5 sm:px-6"
            >
              <span>Register Now</span>
              <span className="text-sm">↗</span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              className="flex lg:hidden items-center justify-center w-10 h-10 text-[#404E3B] bg-[#FFFFFF] border border-[#E6E6E6] rounded-xl shadow-xs transition-transform active:scale-95"
              onClick={openMobile}
              aria-label="Open menu"
            >
              <span className="flex flex-col gap-1 w-4">
                <span className="block h-0.5 bg-[#404E3B] w-full rounded-full" />
                <span className="block h-0.5 bg-[#404E3B] w-full rounded-full" />
                <span className="block h-0.5 bg-[#404E3B] w-full rounded-full" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 bg-[#F6F8F5]/98 backdrop-blur-2xl z-[900] flex flex-col justify-between p-6 sm:p-8 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#E6E6E6] pb-5">
          <div className="font-display font-black text-xl text-[#404E3B] flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#7B9669] text-white flex items-center justify-center font-bold text-sm">
              D
            </div>
            <span>DISCOVERY<span className="text-[#7B9669] font-mono text-xs ml-0.5">2K26</span></span>
          </div>

          <button
            className="font-mono text-xs font-semibold text-[#6C8480] hover:text-[#404E3B] py-2 px-3 border border-[#E6E6E6] rounded-xl bg-[#EEF2EB]"
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
              className="font-display text-2xl sm:text-3xl font-extrabold py-3 border-b border-[#E6E6E6] text-[#404E3B] flex items-center justify-between hover:text-[#7B9669] transition-colors"
            >
              <span>{link.label}</span>
              <span className="font-mono text-xs text-[#7B9669] bg-[#F1F5EE] px-2.5 py-1 rounded-full">0{i + 1}</span>
            </a>
          ))}
        </div>

        <div className="space-y-4">
          <a
            href="/register"
            onClick={handleRegister}
            className="w-full btn-jade-primary text-base min-h-[50px] shadow-md"
          >
            <span>Register Now</span>
            <span>↗</span>
          </a>
          <p className="text-center font-mono text-[11px] text-[#6C8480] tracking-wider">
            ADCET ASHTA • NATIONAL TECH SYMPOSIUM
          </p>
        </div>
      </div>
    </>
  );
};
