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
    <section className="section bg-[#F6F8F5] border-b border-[#E6E6E6]" id="briefing">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1F5EE] border border-[#BAC8B1] text-[#404E3B] font-mono text-xs font-bold tracking-wide w-fit mb-4">
          <span className="w-2 h-2 rounded-full bg-[#7B9669]" />
          <span>SYMPOSIUM BRIEFING BENTO</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="section-title text-[#404E3B]">National Level Technical Excellence</h2>
            <p className="text-[#2E382A] text-base max-w-[560px] mt-2">
              Every track and competition at Discovery 2K26 is curated and evaluated by academic departments with industry leaders.
            </p>
          </div>
        </div>

        {/* Bento Box Briefing Layout */}
        <div className="bento-grid">
          
          {/* Main Overview Spotlight Tile (8 columns) */}
          <div className="bento-col-8 jade-card p-8 sm:p-10 flex flex-col justify-between shadow-md">
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold text-[#7B9669] bg-[#F1F5EE] border border-[#BAC8B1] px-3 py-1 rounded-full w-fit block">
                ADCET FLAGSHIP FESTIVAL
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#404E3B] leading-tight">
                One Campus. 11 Departments. 2,500+ Engineering Minds.
              </h3>
              <p className="text-[#2E382A] text-base sm:text-lg leading-relaxed">
                <strong className="text-[#7B9669] font-bold">Discovery 2K26</strong> is Annasaheb Dange College of Engineering and Technology's annual national tech festival where Computer Science, AI, Mechanical, Civil, ECE, Electrical, and Robotics stream competitions run in parallel.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-8 pt-6 border-t border-[#E6E6E6]">
              <span className="bg-[#F1F5EE] text-[#404E3B] font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-[#BAC8B1]">AISA CLUB</span>
              <span className="bg-[#EEF2EB] text-[#6C8480] font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-[#E6E6E6]">NEXUS CLUB</span>
              <span className="bg-[#EEF2EB] text-[#7B9669] font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-[#BAC8B1]">TECHASTRA CELL</span>
            </div>
          </div>

          {/* Metric Stack Tiles (4 columns) */}
          <div className="bento-col-4 space-y-4 flex flex-col justify-between">
            <div className="jade-card p-6 bg-[#F1F5EE] border-[#BAC8B1]">
              <div className="font-mono text-xs font-bold text-[#7B9669]">GRAND PRIZE POOL</div>
              <div className="font-display font-black text-3xl sm:text-4xl text-[#404E3B] mt-1 relative">
                <span
                  ref={redactRef}
                  className="absolute inset-y-[2px] -inset-x-[2px] bg-[#7B9669] origin-right transition-transform duration-700"
                />
                ₹1.5 Lakhs+
              </div>
              <div className="text-xs text-[#6C8480] mt-1 font-semibold">Instant Same-Day Payout</div>
            </div>

            <div className="jade-card p-6">
              <div className="font-mono text-xs font-bold text-[#6C8480]">PARTICIPATION CERTIFICATE</div>
              <div className="font-display font-black text-2xl sm:text-3xl text-[#404E3B] mt-1">100% Certified</div>
              <div className="text-xs text-[#6C8480] mt-1 font-semibold">Official Verification for All</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
