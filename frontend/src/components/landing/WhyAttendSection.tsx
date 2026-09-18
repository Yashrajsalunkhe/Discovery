export const WhyAttendSection = () => {
  const perks = [
    {
      index: '01',
      title: 'Cash Prizes & Trophies',
      desc: "Every track carries its own prize purse, paid out on the same day during the closing ceremony.",
    },
    {
      index: '02',
      title: 'Official Certification for All',
      desc: 'Every registered participant leaves with an official national event certificate — win or lose.',
    },
    {
      index: '03',
      title: 'Judged by Industry Leaders',
      desc: 'Panels pull from active software engineers, founders, and industry domain specialists.',
    },
    {
      index: '04',
      title: 'Cross-College Networking',
      desc: 'Teams travel in from engineering institutions across the state and country.',
    },
    {
      index: '05',
      title: 'Live Builds & Technical Exhibits',
      desc: 'The central campus quad stays active all day for project demos, hardware builds, and exhibits.',
    },
    {
      index: '06',
      title: 'Event Kits & Campus Food',
      desc: "Comprehensive event kit, badge, schedule pass, and on-campus food included for all participants.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAFAF8] text-[#0F1115] border-b-2 border-[#0F1115]" id="why">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">

        {/* Editorial Section Tab Tag */}
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest bg-[#FFCC00] text-[#0F1115] px-3 py-1 border-2 border-[#0F1115] shadow-[2px_2px_0px_#0F1115] mb-6">
          <span>FILE 04</span>
          <span>//</span>
          <span>WHY SHOW UP & PERKS</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-end">
          <div className="lg:col-span-8">
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#0F1115] leading-[0.95]">
              What you actually <span className="bg-[#FFCC00] px-2 border-2 border-[#0F1115] inline-block">walk away with.</span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="font-body text-base text-[#0F1115]/80 font-medium leading-relaxed border-l-3 border-[#FFCC00] pl-4 py-1">
              Not just a certificate PDF. Six concrete reasons engineering teams travel in for Discovery 2K26.
            </p>
          </div>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk) => (
            <div
              key={perk.index}
              className="p-6 sm:p-8 bg-white border-2 border-[#0F1115] shadow-[5px_5px_0px_#0F1115] hover:bg-[#FFCC00] hover:shadow-[7px_7px_0px_#0F1115] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-black text-4xl text-[#0F1115] group-hover:scale-110 transition-transform">
                  {perk.index}
                </span>
                <span className="font-mono text-[10px] font-black bg-[#0F1115] text-[#FFCC00] px-2 py-0.5">
                  FEATURE
                </span>
              </div>

              <div>
                <h3 className="font-display font-black text-xl text-[#0F1115] uppercase mb-2">
                  {perk.title}
                </h3>
                <p className="font-body text-sm text-[#0F1115]/80 leading-relaxed">
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
