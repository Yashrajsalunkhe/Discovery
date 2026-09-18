import { useEffect, useRef } from 'react';

export const BriefingSection = () => {
  const redactRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = redactRef.current;
    if (!bar) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          bar.style.transform = 'scaleX(0)';
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(bar);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-[#FAFAF8] text-[#0F1115] border-b-2 border-[#0F1115]" id="briefing">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">

        {/* Editorial Section Tab Tag */}
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest bg-[#FFCC00] text-[#0F1115] px-3 py-1 border-2 border-[#0F1115] shadow-[2px_2px_0px_#0F1115] mb-6">
          <span>FILE 01</span>
          <span>//</span>
          <span>BRIEFING & OVERVIEW</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-end">
          <div className="lg:col-span-8">
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#0F1115] leading-[0.95]">
              What Discovery actually is, <span className="bg-[#FFCC00] px-2 border-2 border-[#0F1115] inline-block">in plain terms.</span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="font-body text-base text-[#0F1115]/80 font-medium leading-relaxed border-l-3 border-[#FFCC00] pl-4 py-1">
              No filler track, no filler round. Every event on this campus is run and judged by the department it belongs to.
            </p>
          </div>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-2 border-[#0F1115] bg-white shadow-[6px_6px_0px_#0F1115]">

          {/* Main Editorial Text */}
          <div className="lg:col-span-7 p-6 sm:p-10 border-b-2 lg:border-b-0 lg:border-r-2 border-[#0F1115] flex flex-col justify-between">
            <div className="space-y-4 text-base sm:text-lg text-[#0F1115]/90 leading-relaxed font-body">
              <p>
                <strong className="font-black text-[#0F1115] bg-[#FFCC00]/40 px-1 border border-[#0F1115]/30">Discovery 2K26</strong> is ADCET's national-level technical festival — a single day where Computer Science, AI &amp; DS, Mechanical, Civil, Electrical, Aeronautical, Food Technology and Robotics all run their competitions in parallel on the same campus.
              </p>
              <p>
                It's organized end-to-end by students with faculty mentors backing every track. Outside teams are welcome on every event; there is no home-team advantage built into the judging.
              </p>
            </div>

            <div className="pt-8 flex flex-wrap gap-2.5 items-center">
              <span className="font-mono text-xs font-bold text-[#0F1115]/60 uppercase tracking-widest mr-2">ORGANIZERS:</span>
              <span className="font-mono text-xs font-bold bg-[#FAFAF8] text-[#0F1115] px-3 py-1 border border-[#0F1115]">ADCET ASHTA</span>
              <span className="font-mono text-xs font-bold bg-[#FFCC00] text-[#0F1115] px-3 py-1 border border-[#0F1115]">STUDENT COUNCIL</span>
              <span className="font-mono text-xs font-bold bg-[#FAFAF8] text-[#0F1115] px-3 py-1 border border-[#0F1115]">DEPT CLUBS</span>
            </div>
          </div>

          {/* Stats Column */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#FAFAF8]">
            {[
              { num: '28', label: 'EVENTS ACROSS\n11 DEPARTMENTS' },
              { num: '1', label: 'CAMPUS\nONE-DAY FORMAT' },
              { num: '₹1.5L', label: 'IN PRIZES\nACROSS ALL TRACKS', redact: true },
              { num: 'ALL', label: 'PARTICIPANTS\nOFFICIALLY CERTIFIED' },
            ].map((stat, i, arr) => (
              <div
                key={i}
                className={`p-6 sm:p-8 flex items-center justify-between gap-4 ${i < arr.length - 1 ? 'border-b-2 border-[#0F1115]' : ''
                  }`}
              >
                <div className="font-display font-black text-[#0F1115] relative" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                  {stat.redact && (
                    <span
                      ref={redactRef}
                      className="absolute inset-y-1 -inset-x-1 bg-[#0F1115] origin-right transition-transform duration-700 ease-out"
                    />
                  )}
                  {stat.num}
                </div>
                <div className="font-mono text-xs font-bold tracking-wider text-[#0F1115] text-right whitespace-pre-line bg-[#FFCC00]/30 px-2 py-1 border border-[#0F1115]/20">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
