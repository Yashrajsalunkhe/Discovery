export const WhyAttendSection = () => {
  const perks = [
    {
      index: '01',
      title: 'Cash Prizes & Trophies',
      desc: "Every track carries its own substantial prize purse, paid out directly on the same day.",
      badge: '₹1.5L+ Pool',
      color: 'text-[#7B9669]',
      span: 'bento-col-8',
      featured: true,
    },
    {
      index: '02',
      title: 'Verified Certificates',
      desc: 'Every registered participant leaves with an official, verifiable certificate for their portfolio.',
      badge: 'Official',
      color: 'text-[#404E3B]',
      span: 'bento-col-4',
    },
    {
      index: '03',
      title: 'Judged by Industry Experts',
      desc: 'Panels feature senior engineers, tech founders, and industrial researchers.',
      badge: 'Mentorship',
      color: 'text-[#6C8480]',
      span: 'bento-col-4',
    },
    {
      index: '04',
      title: 'National Networking',
      desc: 'Connect with top engineering talent and ambitious teams from over 50+ universities.',
      badge: '50+ Colleges',
      color: 'text-[#7B9669]',
      span: 'bento-col-4',
    },
    {
      index: '05',
      title: 'Live Builds & Demos',
      desc: 'Campus lawns stay active all day with prototype demos, robotics tracks, and flight simulators.',
      badge: 'Interactive',
      color: 'text-[#404E3B]',
      span: 'bento-col-4',
    },
  ];

  return (
    <section className="section bg-[#F6F8F5] border-b border-[#E6E6E6]" id="why">
      <div className="wrap">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1F5EE] border border-[#BAC8B1] text-[#404E3B] font-mono text-xs font-bold tracking-wide w-fit mb-4">
          <span className="w-2 h-2 rounded-full bg-[#7B9669]" />
          <span>KEY HIGHLIGHTS</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="section-title text-[#404E3B]">Why Attend Discovery 2K26?</h2>
            <p className="text-[#2E382A] text-base max-w-[560px] mt-2">
              Beyond competing, Discovery 2K26 offers incredible networking, industry exposure, and immediate rewards.
            </p>
          </div>
        </div>

        {/* Bento Grid Perks */}
        <div className="bento-grid">
          {perks.map((perk) => (
            <div
              key={perk.index}
              className={`${perk.span} jade-card p-6 sm:p-8 flex flex-col justify-between group ${
                perk.featured ? 'bg-[#F1F5EE] border-[#BAC8B1]' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-display font-black text-3xl sm:text-4xl ${perk.color}`}>
                    {perk.index}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#6C8480] bg-[#EEF2EB] border border-[#BAC8B1] px-3 py-1 rounded-full">
                    {perk.badge}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#404E3B] group-hover:text-[#7B9669] transition-colors mb-2">
                  {perk.title}
                </h3>
                <p className="text-[#2E382A] text-sm leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
