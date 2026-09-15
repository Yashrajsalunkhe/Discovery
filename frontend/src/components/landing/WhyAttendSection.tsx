export const WhyAttendSection = () => {
  const perks = [
    {
      index: '01',
      title: 'Cash Prizes & Trophies',
      desc: "Every track carries its own prize purse, paid out the same day.",
    },
    {
      index: '02',
      title: 'Certified, No Exceptions',
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
        className="grid grid-cols-3 max-md:grid-cols-1 border border-line"
        style={{ gap: '1px', background: 'var(--line)' }}
        data-perks
      >
        {perks.map((perk, i) => (
          <div
            key={perk.index}
            className="py-[38px] px-8 perk-cell"
            style={{ background: i % 3 === 1 ? 'var(--ink-soft)' : 'var(--ink)' }}
          >
            <div
              className="font-display font-extrabold leading-none mb-3.5"
              style={{
                fontSize: '3.2rem',
                color: 'transparent',
                WebkitTextStroke: '1px var(--line)',
              }}
            >
              {perk.index}
            </div>
            <div className="font-display font-semibold text-[1.15rem] mb-2.5">
              {perk.title}
            </div>
            <div className="text-sm text-paper-dim leading-[1.6]">
              {perk.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
