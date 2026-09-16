import React from 'react';

export const FooterLanding = () => {
  const sections = [
    { label: 'Events & Tracks', hash: 'tracks' },
    { label: 'About Briefing', hash: 'briefing' },
    { label: 'Schedule Clock', hash: 'schedule' },
    { label: 'Why Attend', hash: 'why' },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="py-16 bg-[#404E3B] text-[#EEF2EB] border-t border-[#2F3B2B]">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#52634C]">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="font-display font-black text-2xl text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#7B9669] text-white flex items-center justify-center font-bold text-xs">
                D
              </div>
              <span>DISCOVERY<span className="text-[#BAC8B1] font-mono text-sm ml-0.5">2K26</span></span>
            </div>
            <p className="text-[#BAC8B1] text-sm leading-relaxed">
              Annasaheb Dange College of Engineering and Technology (ADCET), Ashta. National technical symposium bringing innovation to life.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="font-mono text-xs font-bold text-[#BAC8B1] tracking-wider uppercase">
              Navigation
            </div>
            {sections.map((s) => (
              <a
                key={s.hash}
                href={`#${s.hash}`}
                onClick={(e) => handleClick(e, s.hash)}
                className="block text-[#EEF2EB] font-medium text-sm hover:text-[#BAC8B1] transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Organized By */}
          <div className="space-y-3">
            <div className="font-mono text-xs font-bold text-[#BAC8B1] tracking-wider uppercase">
              Organizing Committees
            </div>
            <p className="text-[#EEF2EB] text-sm">AISA — AI & Data Science Cell</p>
            <p className="text-[#EEF2EB] text-sm">Nexus Club, ADCET</p>
            <p className="text-[#EEF2EB] text-sm">TechAstra Technical Body</p>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="font-mono text-xs font-bold text-[#BAC8B1] tracking-wider uppercase">
              Venue & Contact
            </div>
            <a
              href="mailto:discovery@adcet.ac.in"
              className="block text-[#BAC8B1] font-mono text-xs font-semibold hover:underline"
            >
              discovery@adcet.ac.in
            </a>
            <p className="text-[#BAC8B1] text-xs leading-relaxed">
              ADCET Campus, Ashta, Sangli, Maharashtra — 416301
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs font-mono text-[#BAC8B1]">
          <div>
            © 2026 DISCOVERY ADCET. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-3">
            <span className="hover:text-white cursor-pointer transition-colors">INSTAGRAM</span>
            <span className="hover:text-white cursor-pointer transition-colors">LINKEDIN</span>
            <span className="hover:text-white cursor-pointer transition-colors">YOUTUBE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
