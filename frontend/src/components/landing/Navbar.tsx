import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const hash = location.state.scrollTo;
      window.history.replaceState({}, document.title);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.pathname, location.state]);

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
    if (location.pathname === '/') {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: hash } });
    }
  }, [location.pathname, navigate, closeMobile]);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    closeMobile();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  }, [location.pathname, navigate, closeMobile]);

  const handleRegister = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    closeMobile();
    if (location.pathname !== '/register') {
      navigate('/register');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, navigate, closeMobile]);

  const navLinks = [
    { label: 'Events', hash: 'tracks' },
    { label: 'About', hash: 'briefing' },
    { label: 'Schedule', hash: 'schedule' },
    { label: 'Why Attend', hash: 'why' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-300 ease-out border-b ${isScrolled
          ? 'bg-[#FAFAF8]/95 backdrop-blur-md border-[#0F1115] py-3 shadow-sm'
          : 'bg-[#FAFAF8] border-[#0F1115]/10 py-4 sm:py-5'
          }`}
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#0F1115] flex items-center gap-2 group shrink-0"
          >
            {/* Discovery Yellow Star Icon Motif */}
            <div className="w-7 h-7 bg-[#FFCC00] border-2 border-[#0F1115] flex items-center justify-center shadow-[2px_2px_0px_#0F1115] transition-transform group-hover:scale-110">
              <svg className="w-4 h-4 text-[#0F1115]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            </div>
            <span className="font-black text-[#0F1115] tracking-tight">
              DISCOVERY
              <span className="ml-1.5 inline-block bg-[#FFCC00] text-[#0F1115] font-mono text-[11px] font-bold px-1.5 py-0.5 border border-[#0F1115] align-super">
                2K26
              </span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-mono text-[13px] font-semibold tracking-wider text-[#0F1115]">
            {navLinks.map((link) => (
              <a
                key={link.hash}
                href={`#${link.hash}`}
                onClick={(e) => handleNavClick(e, link.hash)}
                className="relative py-1 transition-colors hover:text-[#0F1115] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#FFCC00] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Action Button - Desktop */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/register"
              onClick={handleRegister}
              className="hidden md:inline-flex items-center gap-2 font-mono text-xs font-bold uppercase bg-[#FFCC00] text-[#0F1115] px-5 py-2.5 border-2 border-[#0F1115] shadow-[3px_3px_0px_#0F1115] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#0F1115] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0F1115] transition-all"
            >
              <span>Register</span>
              <span className="text-sm font-black">↗</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              className="flex md:hidden items-center justify-center w-10 h-10 bg-[#FFCC00] border-2 border-[#0F1115] shadow-[2px_2px_0px_#0F1115] text-[#0F1115] active:translate-x-[1px] active:translate-y-[1px]"
              onClick={openMobile}
              aria-label="Open menu"
            >
              <span className="flex flex-col gap-1 w-4">
                <span className="block h-[2px] bg-[#0F1115] w-full" />
                <span className="block h-[2px] bg-[#0F1115] w-full" />
                <span className="block h-[2px] bg-[#0F1115] w-full" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-[#FAFAF8] z-[900] flex flex-col justify-between p-6 sm:p-8 transition-transform duration-300 ease-in-out border-b-4 border-[#0F1115] ${isMobileOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="flex items-center justify-between border-b-2 border-[#0F1115] pb-5">
          <a
            href="/"
            onClick={handleLogoClick}
            className="font-display font-black text-xl text-[#0F1115] flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-[#FFCC00] border-2 border-[#0F1115] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#0F1115]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            </div>
            <span>DISCOVERY <span className="bg-[#FFCC00] text-[#0F1115] font-mono text-xs px-1 border border-[#0F1115]">2K26</span></span>
          </a>

          <button
            className="font-mono text-xs font-bold tracking-widest text-[#0F1115] py-2 px-3 border-2 border-[#0F1115] bg-[#FFCC00] shadow-[2px_2px_0px_#0F1115]"
            onClick={closeMobile}
          >
            CLOSE ✕
          </button>
        </div>

        <div className="flex flex-col space-y-3 my-auto py-6">
          {navLinks.map((link, i) => (
            <a
              key={link.hash}
              href={`#${link.hash}`}
              onClick={(e) => handleNavClick(e, link.hash)}
              className="font-display text-2xl font-black py-3 border-b-2 border-[#0F1115]/10 text-[#0F1115] flex items-center justify-between hover:bg-[#FFCC00]/20 px-2 transition-colors"
            >
              <span>{link.label}</span>
              <span className="font-mono text-sm bg-[#0F1115] text-[#FFCC00] px-2 py-0.5 font-bold">0{i + 1}</span>
            </a>
          ))}
        </div>

        <div className="space-y-3">
          <a
            href="/register"
            onClick={handleRegister}
            className="w-full text-center justify-center font-mono font-bold uppercase text-sm bg-[#FFCC00] text-[#0F1115] py-3.5 border-2 border-[#0F1115] shadow-[4px_4px_0px_#0F1115] flex items-center gap-2"
          >
            <span>Register Now</span>
            <span>↗</span>
          </a>
          <p className="text-center font-mono text-xs text-[#0F1115] font-bold tracking-wider">
            ADCET ASHTA • 10TH OCTOBER 2026
          </p>
        </div>
      </div>
    </>
  );
};
