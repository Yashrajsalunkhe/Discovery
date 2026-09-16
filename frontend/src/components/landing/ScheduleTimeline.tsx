import { useState, useMemo } from 'react';

export const ScheduleTimeline = () => {
  const [activeSession, setActiveSession] = useState<string>('all');

  const timelineItems = [
    {
      time: '08:00 AM',
      title: 'Reporting & Kit Distribution',
      desc: 'Check-in, identity verification, event delegate kits, and campus maps handed out at the main reception.',
      badge: 'Main Gate',
      session: 'morning',
    },
    {
      time: '09:00 AM',
      title: 'Inaugural Ceremony',
      desc: 'Welcome address by Director, keynotes from industry dignitaries, and formal inauguration.',
      badge: 'Auditorium',
      session: 'morning',
    },
    {
      time: '09:45 AM',
      title: 'Track Prelims & Coding Session I',
      desc: 'All departments start their primary rounds simultaneously across dedicated laboratories and grounds.',
      badge: 'Department Labs',
      session: 'morning',
    },
    {
      time: '01:00 PM',
      title: 'Networking & Lunch Break',
      desc: 'On-campus lunch hosted for all participants, faculty coordinators, and visiting mentors.',
      badge: 'Food Court',
      session: 'afternoon',
    },
    {
      time: '02:00 PM',
      title: 'Track Finals & Live Demos',
      desc: 'Shortlisted teams present live prototypes, CAD models, or compete in finals before industry judges.',
      badge: 'Arena & Labs',
      session: 'afternoon',
    },
    {
      time: '04:30 PM',
      title: 'Grand Exhibition & Deliberation',
      desc: 'Jury panel score consolidation while the central lawn opens for project demonstrations.',
      badge: 'Central Lawn',
      session: 'evening',
    },
    {
      time: '05:00 PM',
      title: 'Valedictory & Prize Ceremony',
      desc: 'Awarding cash prizes, trophies, and certificates department by department.',
      badge: 'Grand Stage',
      session: 'evening',
    },
  ];

  const filteredItems = useMemo(() => {
    if (activeSession === 'all') return timelineItems;
    return timelineItems.filter(item => item.session === activeSession);
  }, [activeSession, timelineItems]);

  return (
    <section className="section bg-[#F6F8F5] border-b border-[#E6E6E6]" id="schedule">
      <div className="wrap">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1F5EE] border border-[#BAC8B1] text-[#404E3B] font-mono text-xs font-bold tracking-wide w-fit mb-4">
          <span className="w-2 h-2 rounded-full bg-[#7B9669]" />
          <span>INTERACTIVE EVENT SCHEDULE</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="section-title text-[#404E3B]">Symposium Timeline</h2>
            <p className="text-[#2E382A] text-base max-w-[560px] mt-2">
              Filter by morning prelims, afternoon finals, or evening valedictory.
            </p>
          </div>
        </div>

        {/* Session Filter Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-8 pb-2">
          {[
            { id: 'all', label: 'Full Itinerary' },
            { id: 'morning', label: 'Morning Prelims (08:00 AM - 01:00 PM)' },
            { id: 'afternoon', label: 'Afternoon Finals (01:00 PM - 04:30 PM)' },
            { id: 'evening', label: 'Valedictory & Awards (05:00 PM)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSession(tab.id)}
              className={`font-mono text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                activeSession === tab.id
                  ? 'bg-[#7B9669] text-white border-[#7B9669] shadow-xs'
                  : 'bg-[#F1F5EE] text-[#404E3B] border-[#BAC8B1] hover:border-[#7B9669] hover:text-[#7B9669]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Side Info Box */}
          <div className="jade-card p-6 self-start space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#7B9669]">
              <span className="w-2 h-2 rounded-full bg-[#7B9669] animate-pulse" />
              29TH SEPT 2026
            </div>
            <h3 className="font-display font-extrabold text-xl text-[#404E3B]">
              ADCET Campus
            </h3>
            <div className="space-y-2 text-xs font-mono text-[#2E382A]">
              <div className="flex justify-between border-b border-[#E6E6E6] pb-1.5">
                <span>Gate Opens:</span>
                <span className="font-bold text-[#404E3B]">08:00 AM</span>
              </div>
              <div className="flex justify-between border-b border-[#E6E6E6] pb-1.5">
                <span>Prelims Start:</span>
                <span className="font-bold text-[#404E3B]">09:45 AM</span>
              </div>
              <div className="flex justify-between border-b border-[#E6E6E6] pb-1.5">
                <span>Prize Ceremony:</span>
                <span className="font-bold text-[#404E3B]">05:00 PM</span>
              </div>
            </div>
          </div>

          {/* Timeline Track */}
          <div className="relative pl-6 sm:pl-8 space-y-6">
            <div className="absolute left-[11px] sm:left-[15px] top-3 bottom-3 w-[3px] bg-[#BAC8B1] rounded-full" />

            {filteredItems.map((item, i) => (
              <div key={i} className="relative pl-6 sm:pl-8 group">
                <div className="absolute left-[-21px] sm:left-[-17px] top-1.5 w-4 h-4 rounded-full bg-[#FFFFFF] border-4 border-[#7B9669] shadow-xs group-hover:scale-125 transition-transform" />
                <div className="jade-card p-5 sm:p-6 transition-all duration-200 group-hover:border-[#BAC8B1]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-[#7B9669] bg-[#F1F5EE] border border-[#BAC8B1] px-3 py-1 rounded-full">
                      {item.time}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-[#6C8480] bg-[#EEF2EB] px-2.5 py-0.5 rounded-full">
                      📍 {item.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-[#404E3B] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-[#2E382A] text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
