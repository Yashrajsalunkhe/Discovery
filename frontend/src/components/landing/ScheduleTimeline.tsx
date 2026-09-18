export const ScheduleTimeline = () => {
  const timelineItems = [
    {
      time: '08:00 IST',
      title: 'Reporting & Kit Distribution',
      desc: 'Check-in, ID verification, event kits and campus maps handed out at the main entry gate.',
    },
    {
      time: '09:00 IST',
      title: 'Inaugural Ceremony',
      desc: 'Welcome address, chief guest keynotes, and formal flag-off across all 11 stations.',
    },
    {
      time: '09:45 IST',
      title: 'Track Prelims — Session I',
      desc: 'All departments run opening competitive rounds in parallel across home labs and grounds.',
    },
    {
      time: '13:00 IST',
      title: 'Lunch Break',
      desc: 'On-campus lunch for all registered participants, mentors, and visiting faculty.',
    },
    {
      time: '14:00 IST',
      title: 'Track Finals — Session II',
      desc: 'Shortlisted teams present, build, or compete live in front of industry judges.',
    },
    {
      time: '16:30 IST',
      title: 'Judging & Deliberation',
      desc: 'Panels finalize scores while the central campus quad opens for project exhibits.',
    },
    {
      time: '17:00 IST',
      title: 'Prize Distribution & Closing',
      desc: 'Trophies and certificates awarded station by station, closing ceremony wrap.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAFAF8] text-[#0F1115] border-b-2 border-[#0F1115]" id="schedule">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">

        {/* Editorial Section Tab Tag */}
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest bg-[#FFCC00] text-[#0F1115] px-3 py-1 border-2 border-[#0F1115] shadow-[2px_2px_0px_#0F1115] mb-6">
          <span>FILE 03</span>
          <span>//</span>
          <span>MISSION CLOCK & SCHEDULE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-end">
          <div className="lg:col-span-8">
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#0F1115] leading-[0.95]">
              How the day runs, <span className="bg-[#FFCC00] px-2 border-2 border-[#0F1115] inline-block">hour by hour.</span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="font-body text-base text-[#0F1115]/80 font-medium leading-relaxed border-l-3 border-[#FFCC00] pl-4 py-1">
              Standard event schedule for 10th October 2026. Detailed track slots ship with your registration pass.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Side Info Stamp */}
          <div className="lg:col-span-4">
            <div className="p-6 bg-[#FFCC00] border-2 border-[#0F1115] shadow-[6px_6px_0px_#0F1115] sticky top-28 space-y-4">
              <div className="font-mono text-xs font-black bg-[#0F1115] text-[#FFCC00] px-2 py-1 inline-block">
                EVENT TIMINGS // ADCET ASHTA
              </div>
              <h3 className="font-display font-black text-2xl text-[#0F1115] uppercase">
                ONE-DAY INTENSIVE FESTIVAL
              </h3>
              <div className="font-mono text-xs font-bold text-[#0F1115] space-y-2 border-t-2 border-[#0F1115] pt-3">
                <div className="flex justify-between"><span>DATE:</span> <span>10TH OCT 2026</span></div>
                <div className="flex justify-between"><span>CAMPUS GATES:</span> <span>08:00 IST</span></div>
                <div className="flex justify-between"><span>WRAP CEREMONY:</span> <span>17:00 IST</span></div>
                <div className="flex justify-between"><span>FORMAT:</span> <span>ON-SITE COMPETITION</span></div>
              </div>
            </div>
          </div>

          {/* Timeline Cards Column */}
          <div className="lg:col-span-8 space-y-4">
            {timelineItems.map((item, i) => (
              <div
                key={i}
                className="p-5 sm:p-6 bg-white border-2 border-[#0F1115] shadow-[4px_4px_0px_#0F1115] hover:shadow-[6px_6px_0px_#FFCC00] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-black bg-[#0F1115] text-[#FFCC00] px-2.5 py-1 border border-[#0F1115] shrink-0 mt-0.5">
                    {item.time}
                  </span>
                  <div>
                    <h4 className="font-display font-black text-lg sm:text-xl text-[#0F1115] uppercase">
                      {item.title}
                    </h4>
                    <p className="font-body text-sm text-[#0F1115]/80 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="font-mono text-xs font-bold bg-[#FAFAF8] text-[#0F1115]/60 px-2 py-1 border border-[#0F1115]/20 shrink-0 self-start sm:self-center">
                  PHASE 0{i + 1}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
