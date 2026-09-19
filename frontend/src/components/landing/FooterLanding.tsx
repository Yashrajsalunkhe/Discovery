import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface FooterLandingProps {
  compact?: boolean;
}

interface Creator {
  name: string;
  href?: string;
}

const creators: Creator[] = [
  { name: 'Aditya Padale', href: 'https://www.adityaa.me/' },
  { name: 'Yashraj Salunkhe', href: 'https://www.yashrajsalunkhe.in/' },
  { name: 'Kunal Shitole' },
  { name: 'Chinmay Deshmukh' },
];

const CreatorHoverLink = ({ creator }: { creator: Creator }) => {
  const triggerClassName = 'text-[#0F1115] underline decoration-[#FFCC00] decoration-2 underline-offset-2 hover:bg-[#FFCC00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1115]';
  const trigger = creator.href ? (
    <a href={creator.href} target="_blank" rel="noreferrer" className={triggerClassName}>
      {creator.name}
    </a>
  ) : (
    <span tabIndex={0} role="button" className={triggerClassName}>
      {creator.name}
    </span>
  );

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent className="w-64 rounded-none border-[3px] border-[#0F1115] bg-[#FFFDF7] p-4 text-[#0F1115] shadow-[5px_5px_0px_#FF6B9D]">
        <p className="font-display text-sm font-black uppercase">{creator.name}</p>
        <p className="mt-2 font-body text-xs leading-relaxed text-[#0F1115]/75">
          Part of the Discovery 2K26 creator team.
        </p>
        {creator.href && (
          <p className="mt-3 border-t-2 border-[#0F1115] pt-2 font-mono text-[10px] font-bold uppercase tracking-wide">
            View portfolio ↗
          </p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export const FooterLanding: React.FC<FooterLandingProps> = ({ compact = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sections = [
    { label: 'Briefing', hash: 'briefing' },
    { label: 'Department Tracks', hash: 'tracks' },
    { label: 'Schedule', hash: 'schedule' },
    { label: 'Why Attend', hash: 'why' },
    { label: 'FAQ', hash: 'faq' },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: hash } });
    }
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <footer className="py-16 bg-[#FAFAF8] text-[#0F1115] border-t-2 border-[#0F1115]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">

        {!compact && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b-2 border-[#0F1115]">

          {/* Brand */}
          <div className="lg:col-span-4 space-y-3">
            <a href="/" onClick={handleBrandClick} className="font-display font-black text-2xl text-[#0F1115] flex items-center gap-2">
              <div className="w-6 h-6 bg-[#FFCC00] border-2 border-[#0F1115] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#0F1115]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
              <span>DISCOVERY <span className="bg-[#FFCC00] px-1 border border-[#0F1115] font-mono text-xs">2K26</span></span>
            </a>
            <p className="font-body text-sm text-[#0F1115]/80 leading-relaxed max-w-sm">
              ADCET's national-level technical festival. One campus, one day, 28 events across 11 departments running live.
            </p>
          </div>

          {/* Sections */}
          <div className="lg:col-span-3">
            <div className="font-mono text-xs font-black tracking-widest text-[#0F1115] bg-[#FFCC00] px-2 py-0.5 border border-[#0F1115] inline-block mb-4">
              SECTIONS
            </div>
            <ul className="space-y-2 font-mono text-xs font-bold text-[#0F1115]">
              {sections.map((s) => (
                <li key={s.hash}>
                  <a
                    href={`#${s.hash}`}
                    onClick={(e) => handleClick(e, s.hash)}
                    className="hover:bg-[#FFCC00] hover:px-1.5 py-0.5 transition-all inline-block"
                  >
                    → {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Organized by */}
          <div className="lg:col-span-3">
            <div className="font-mono text-xs font-black tracking-widest text-[#0F1115] bg-[#FFCC00] px-2 py-0.5 border border-[#0F1115] inline-block mb-4">
              ORGANIZED BY
            </div>
            <div className="font-mono text-xs font-bold text-[#0F1115] space-y-1.5">
              <p>Student Council, ADCET</p>
              <p>Department Technical Clubs</p>
              <p>ADCET Ashta Faculty Cell</p>
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <div className="font-mono text-xs font-black tracking-widest text-[#0F1115] bg-[#FFCC00] px-2 py-0.5 border border-[#0F1115] inline-block mb-4">
              CONTACT
            </div>
            <div className="font-mono text-xs font-bold text-[#0F1115] space-y-1.5">
              <a
                href="mailto:discovery@adcet.ac.in"
                className="hover:bg-[#FFCC00] hover:px-1 transition-all inline-block break-all"
              >
                discovery2k26@adcet.in
              </a>
              <p>ADCET, Ashta, Sangli</p>
              <p>16.95°N · 74.40°E</p>
            </div>
          </div>

        </div>}

        {/* Bottom */}
        <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs font-bold ${compact ? 'compact-created-by w-full justify-center text-center border-y-2 border-[#0F1115] py-4' : 'pt-6'}`}>
          <div className={compact ? 'w-full text-center text-[#0F1115] leading-relaxed' : 'text-[#0F1115]/70'}>
            Created by{' '}
            {creators.map((creator, index) => (
              <React.Fragment key={creator.name}>
                <CreatorHoverLink creator={creator} />
                {index < creators.length - 1 ? ', ' : '.'}
              </React.Fragment>
            ))}
          </div>
          {!compact && <div className="flex gap-2 flex-wrap">
            <a href="https://www.instagram.com/adcet_ashta" target="_blank" rel="noreferrer" className="bg-white text-[#0F1115] px-2.5 py-1 border-2 border-[#0F1115] shadow-[2px_2px_0px_#0F1115] hover:bg-[#FFCC00] transition-colors">
              INSTAGRAM
            </a>
            <a href="https://www.linkedin.com/school/annasaheb-dange-college-of-engineering-and-technology-ashta/posts/" target="_blank" rel="noreferrer" className="bg-white text-[#0F1115] px-2.5 py-1 border-2 border-[#0F1115] shadow-[2px_2px_0px_#0F1115] hover:bg-[#FFCC00] transition-colors">
              LINKEDIN
            </a>
            <a href="https://www.youtube.com/channel/UCM4WFVdIWyPvxWiVfMHhYFg" target="_blank" rel="noreferrer" className="bg-white text-[#0F1115] px-2.5 py-1 border-2 border-[#0F1115] shadow-[2px_2px_0px_#0F1115] hover:bg-[#FFCC00] transition-colors">
              YOUTUBE
            </a>
            <a href="https://www.facebook.com/adcet.ac.in" target="_blank" rel="noreferrer" className="bg-white text-[#0F1115] px-2.5 py-1 border-2 border-[#0F1115] shadow-[2px_2px_0px_#0F1115] hover:bg-[#FFCC00] transition-colors">
              FACEBOOK
            </a>
          </div>}
        </div>

        {/* Big DISCOVERY typography like NEUROVERSE */}
        <div className={`${compact ? 'mt-0 pt-0 border-t-0' : 'mt-8 pt-6 border-t-2 border-[#0F1115]'} relative flex flex-col sm:flex-row items-center justify-center gap-4 overflow-hidden select-none`}>
          <h1 className="font-display font-black text-[#FFCC00] uppercase text-[11.5vw] xl:text-[145px] leading-none tracking-tighter drop-shadow-[4px_4px_0px_#0F1115] [-webkit-text-stroke:2px_#0F1115] text-center w-full">
            DISCOVERY.
          </h1>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="sm:absolute right-0 bottom-1 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#FFCC00] text-[#0F1115] border-2 border-[#0F1115] shadow-[3px_3px_0px_#0F1115] flex items-center justify-center font-black text-xl sm:text-2xl hover:bg-[#0F1115] hover:text-[#FFCC00] hover:scale-105 active:scale-95 transition-all shrink-0"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            ↑
          </button>
        </div>

      </div>
    </footer>
  );
};
