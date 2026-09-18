import { useEffect, useRef } from 'react';

export const BriefingSection = () => {
  const redactRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Simple intersection observer to reveal the redact bar
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
    <section className="section" id="briefing">
      <div className="wrap">
        <div className="file-tab">FILE 01 — BRIEFING</div>
        <div className="section-head">
          <h2 className="section-title">What Discovery actually is, in plain terms.</h2>
          <p className="section-note">
            No filler track, no filler round. Every event on this campus is run and judged by the department it belongs to.
          </p>
        </div>

        <div
          className="grid grid-cols-[1.3fr_1fr] max-md:grid-cols-1 border border-line briefing-grid"
          data-reveal
        >
          {/* Copy */}
          <div className="p-12 max-md:p-6 max-sm:p-5 border-r border-line max-md:border-r-0 max-md:border-b max-md:border-line">
            <p className="text-[17px] max-sm:text-[15px] leading-[1.75] text-paper-dim max-w-[560px]">
              <strong className="text-paper font-semibold">Discovery 2K26</strong> is ADCET's national-level technical festival — a single day where Computer, AI &amp; DS, Mechanical, Civil, E&amp;TC, Electrical and Robotics all run their own competitions in parallel, on the same campus, in front of the same judges from industry.
            </p>
            <p className="text-[17px] max-sm:text-[15px] leading-[1.75] text-paper-dim max-w-[560px] mt-[18px] max-sm:mt-3">
              It's organized end-to-end by students — the same clubs that run the department's year-round technical work — with faculty mentors backing every track. Outside teams are welcome on every event; there is no home-team advantage built into the judging.
            </p>
            <div className="flex gap-2.5 mt-[34px] flex-wrap">
              <div className="org-stamp">ADCET Team</div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col">
            {[
              { num: '28', label: 'EVENTS\nACROSS 11 DEPARTMENTS' },
              { num: '1', label: 'CAMPUS\nONE-DAY FORMAT' },
              { num: '₹1L+', label: 'IN PRIZES\nACROSS ALL TRACKS', redact: true },
              { num: 'All', label: 'PARTICIPANTS\nCERTIFIED' },
            ].map((stat, i, arr) => (
              <div
                key={i}
                className={`py-[26px] px-10 max-md:px-6 max-sm:px-5 flex items-baseline justify-between gap-5 ${
                  i < arr.length - 1 ? 'border-b border-line' : ''
                }`}
              >
                <div className="font-display font-bold text-paper whitespace-nowrap relative"
                  style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)' }}>
                  {stat.redact && (
                    <span
                      ref={redactRef}
                      className="absolute inset-y-[2px] -inset-x-[2px] bg-paper origin-right transition-transform duration-700 ease-[cubic-bezier(.65,0,.35,1)]"
                      data-redact
                    />
                  )}
                  {stat.num}
                </div>
                <div className="font-mono text-xs tracking-[.08em] text-paper-mute text-right whitespace-pre-line">
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
