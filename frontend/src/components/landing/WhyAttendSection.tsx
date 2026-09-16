export const WhyAttendSection = () => {
  const perks = [
    {
      index: '01',
      title: 'Cash Prizes & Trophies',
      desc: "Every track carries its own prize purse, paid out the same day.",
    },
    {
      index: '02',
      title: 'Certificate for All',
      desc: 'Every registered participant leaves with a certificate — win or lose.',
    },
    {
      index: '03',
      title: 'Judged by Industry',
      desc: 'Panels pull from working engineers and founders, not just faculty.',
    },
    {
      index: '04',
      title: 'Cross-College Network',
      desc: 'Teams travel in from colleges across the country for this one.',
    },
    {
      index: '05',
      title: 'Live Builds & Exhibits',
      desc: 'The lawn stays open all day for demos, prototypes, and side projects.',
    },
    {
      index: '06',
      title: 'Swag Worth Keeping',
      desc: "Kits, merch, and campus food that doesn't taste like a fest budget.",
    },
  ];

  return (
    <section className="section section-alt" id="why">
      <div className="wrap">
        <div className="file-tab">FILE 04 — WHY SHOW UP</div>
        <div className="section-head">
          <h2 className="section-title">What you actually walk away with.</h2>
          <p className="section-note">
            Not just a certificate PDF. Six real reasons teams travel in for this.
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 border border-slate-200"
        style={{ gap: '1px', background: '#e2e8f0' }}
        data-perks
      >
        {perks.map((perk, i) => (
          <div
            key={perk.index}
            className="py-[38px] px-8 max-sm:py-7 max-sm:px-5 perk-cell"
            style={{ background: i % 2 === 1 ? '#f8fafc' : '#ffffff' }}
          >
            <div
              className="font-display font-extrabold leading-none mb-3.5"
              style={{
                fontSize: 'clamp(2.4rem, 6vw, 3.2rem)',
                color: '#e2e8f0',
                WebkitTextStroke: '1px #cbd5e1',
              }}
            >
              {perk.index}
            </div>
            <div className="font-display font-semibold text-[1.15rem] mb-2.5 text-slate-900">
              {perk.title}
            </div>
            <div className="text-sm text-slate-600 leading-[1.6]">
              {perk.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
