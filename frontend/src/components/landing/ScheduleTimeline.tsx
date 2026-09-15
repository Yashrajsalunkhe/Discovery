export const ScheduleTimeline = () => {
  const timelineItems = [
    {
      time: '08:00',
      title: 'Reporting & Kit Distribution',
      desc: 'Check-in, ID verification, event kits and campus maps handed out at the main gate.',
    },
    {
      time: '09:00',
      title: 'Inaugural Ceremony',
      desc: 'Welcome address, chief guest, and the formal flag-off for all ten stations.',
    },
    {
      time: '09:45',
      title: 'Track Prelims — Session I',
      desc: 'All departments run their opening rounds in parallel across their home labs and grounds.',
    },
    {
      time: '13:00',
      title: 'Lunch Break',
      desc: 'On-campus lunch for all registered participants and mentors.',
    },
    {
      time: '14:00',
      title: 'Track Finals — Session II',
      desc: 'Shortlisted teams present, build, or compete live in front of industry judges.',
    },
    {
      time: '16:30',
      title: 'Judging & Deliberation',
      desc: 'Panels finalize scores while the main lawn opens for exhibits and demos.',
    },
    {
      time: '17:00',
      title: 'Prize Distribution & Closing',
      desc: 'Winners announced station by station, closing address, and campus wrap.',
    },
  ];

  return (
    <section className="section" id="schedule">
      <div className="wrap">
        <div className="file-tab">FILE 03 — MISSION CLOCK</div>
        <div className="section-head">
          <h2 className="section-title">How the day actually runs, hour by hour.</h2>
          <p className="section-note">
            Times are the standard shape for the day — exact slots per track ship with your event pass.
          </p>
        </div>

        <div className="grid max-md:grid-cols-1 gap-[60px] max-md:gap-[30px]" style={{ gridTemplateColumns: '220px 1fr' }}>
          {/* Side */}
          <div className="sticky top-[140px] self-start max-md:static">
            <div className="font-mono text-xs tracking-[.1em] text-paper-mute leading-8">
              DAY&nbsp;01<br />
              ADCET CAMPUS<br />
              GATES 08:00 IST<br />
              CLOSE 17:00 IST
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-10" data-timeline>
            {/* Vertical line */}
            <div className="absolute left-[6px] top-[6px] bottom-[6px] w-px bg-line">
              <div
                className="absolute left-0 top-0 w-px h-full bg-brass origin-top"
                style={{ transform: 'scaleY(0)' }}
                id="timelineFill"
              />
            </div>

            {timelineItems.map((item, i) => (
              <div
                key={i}
                className={`relative timeline-item ${i < timelineItems.length - 1 ? 'pb-[52px]' : ''}`}
              >
                {/* Dot */}
                <div className="absolute -left-10 top-1 w-[13px] h-[13px] rounded-full bg-ink border-2 border-line" />
                <div className="font-mono text-[12.5px] tracking-[.08em] text-brass mb-2">
                  {item.time}
                </div>
                <div className="font-display font-semibold text-[1.4rem] mb-2">
                  {item.title}
                </div>
                <div className="text-paper-dim text-[14.5px] max-w-[460px] leading-[1.6]">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
