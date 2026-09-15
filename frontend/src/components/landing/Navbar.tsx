import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

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
    { label: '01 · Briefing', hash: 'briefing' },
    { label: '02 · Tracks', hash: 'tracks' },
    { label: '03 · Schedule', hash: 'schedule' },
    { label: '04 · Why Attend', hash: 'why' },
    { label: '05 · Register', hash: 'register' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-[350ms] ease-out border-b ${
          isScrolled
            ? 'bg-[rgba(10,12,16,0.92)] border-[var(--line)] py-3.5'
            : 'border-transparent py-[22px]'
        }`}
      >
        <div className="wrap flex items-center justify-between">
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, 'top')}
            className="font-display font-bold text-base tracking-[0.02em] flex items-baseline gap-2"
          >
            DISCOVERY<span className="text-brass">2K26</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-[34px] font-mono text-[13px] tracking-[0.06em] text-paper-dim">
            {navLinks.map((link) => (
              <a
                key={link.hash}
                href={`#${link.hash}`}
                onClick={(e) => {
                  if (link.hash === 'register') {
                    handleRegister(e);
                  } else {
                    handleNavClick(e, link.hash);
                  }
                }}
                className="relative py-1 transition-colors duration-200 hover:text-paper group"
              >
                {link.label}
                <span className="absolute left-0 right-full bottom-0 h-px bg-brass transition-all duration-[280ms] ease-[cubic-bezier(.65,0,.35,1)] group-hover:right-0" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-[18px]">
            <a
              href="/register"
              onClick={handleRegister}
              className="btn-nav-register hidden md:inline-block"
            >
              Register a Team
            </a>
            <button
              className="flex md:hidden flex-col gap-[5px] w-[26px]"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="block h-[1.5px] bg-paper w-full" />
              <span className="block h-[1.5px] bg-paper w-full" />
              <span className="block h-[1.5px] bg-paper w-full" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-ink z-[900] flex flex-col justify-center px-8 transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)] ${
          isMobileOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <button
          className="absolute top-[26px] right-7 font-mono text-[13px] tracking-[.1em] text-paper-dim"
          onClick={closeMobile}
        >
          CLOSE — ✕
        </button>
        {navLinks.map((link, i) => (
          <a
            key={link.hash}
            href={`#${link.hash}`}
            onClick={(e) => {
              if (link.hash === 'register') {
                handleRegister(e);
              } else {
                handleNavClick(e, link.hash);
              }
            }}
            className="font-display text-[38px] font-semibold py-3.5 border-b border-line flex items-center gap-4"
          >
            <span className="font-mono text-sm text-brass">0{i + 1}</span>
            {link.label.split(' · ')[1]}
          </a>
        ))}
      </div>
    </>
  );
};
