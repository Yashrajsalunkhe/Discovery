export const FooterLanding = () => {
  const sections = [
    { label: 'Briefing', hash: 'briefing' },
    { label: 'Tracks', hash: 'tracks' },
    { label: 'Schedule', hash: 'schedule' },
    { label: 'Why Attend', hash: 'why' },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="py-20 pb-[34px] bg-slate-50 border-t border-slate-200">
      <div className="wrap">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] max-md:grid-cols-2 max-sm:grid-cols-1 gap-10 max-sm:gap-8 pb-16 border-b border-slate-200">
          <div className="max-w-[280px]">
            <div className="font-display font-bold text-xl mb-4 text-slate-900">
              DISCOVERY<span className="text-indigo-600">2K26</span>
            </div>
            <p className="text-slate-600 text-sm leading-[1.65]">
              ADCET's national-level technical festival. One campus, one day, every department running live.
            </p>
          </div>

          <div>
            <div className="font-mono text-[11.5px] tracking-[.12em] text-slate-500 mb-[18px]">
              SECTIONS
            </div>
            {sections.map((s) => (
              <a
                key={s.hash}
                href={`#${s.hash}`}
                onClick={(e) => handleClick(e, s.hash)}
                className="block text-slate-600 text-[14.5px] leading-[2.1] transition-colors duration-200 hover:text-indigo-600"
              >
                {s.label}
              </a>
            ))}
          </div>

          <div>
            <div className="font-mono text-[11.5px] tracking-[.12em] text-slate-500 mb-[18px]">
              ORGANIZED BY
            </div>
            <p className="text-slate-600 text-[14.5px] leading-[2.1]">AISA — Technical Cell</p>
            <p className="text-slate-600 text-[14.5px] leading-[2.1]">Nexus Club, ADCET</p>
            <p className="text-slate-600 text-[14.5px] leading-[2.1]">TechAstra Club, ADCET</p>
          </div>

          <div>
            <div className="font-mono text-[11.5px] tracking-[.12em] text-slate-500 mb-[18px]">
              CONTACT
            </div>
            <a
              href="mailto:discovery@adcet.ac.in"
              className="block text-slate-600 text-[14.5px] leading-[2.1] transition-colors duration-200 hover:text-indigo-600"
            >
              discovery@adcet.ac.in
            </a>
            <p className="text-slate-600 text-[14.5px] leading-[2.1]">ADCET, Ashta, Sangli — 416301</p>
            <p className="text-slate-600 text-[14.5px] leading-[2.1]">16.95°N · 74.40°E</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-7 flex-wrap gap-3.5 max-sm:flex-col max-sm:items-start">
          <div className="font-mono text-[11.5px] text-slate-500 tracking-[.04em]">
            DISCOVERY 2K26 — ADCET, ASHTA. ALL ROUNDS RUN ON CAMPUS.
          </div>
          <div className="flex gap-2">
            <span className="stamp">INSTAGRAM</span>
            <span className="stamp">LINKEDIN</span>
            <span className="stamp">WHATSAPP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
