import { useState, useCallback, useMemo } from 'react';
import { eventsByDepartment, type Event } from '@/data/events';

interface DepartmentInfo {
  code: string;
  name: string;
  category: 'software' | 'hardware' | 'civil-aero' | 'other';
  badgeBg: string;
  events: (Event & { format: string; focus: string })[];
}

const departments: DepartmentInfo[] = [
  {
    code: 'AI&DS',
    name: 'AI & Data Science',
    category: 'software',
    badgeBg: 'bg-[#7B9669] text-white',
    events: (eventsByDepartment['aids'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Present a research idea or technical study with clarity and evidence.',
      format: e.rules?.[0]?.includes('Presentation') ? 'Presentation' : 'Timed challenge',
      focus: 'Research & AI Systems',
    })),
  },
  {
    code: 'CSE',
    name: 'Computer Science',
    category: 'software',
    badgeBg: 'bg-[#7B9669] text-white',
    events: (eventsByDepartment['cse'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Present a computing research idea, project or technology.',
      format: e.name.includes('Code') ? 'Timed challenge' : e.name.includes('B-Plan') || e.name.includes('Plan') ? 'Pitch challenge' : 'Presentation',
      focus: e.name.includes('Code') ? 'Algorithms & Software' : 'Computer Architecture',
    })),
  },
  {
    code: 'IOT&CS',
    name: 'IoT & Cyber Security',
    category: 'software',
    badgeBg: 'bg-[#404E3B] text-white',
    events: (eventsByDepartment['iot'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Present an idea at the intersection of connected devices and security.',
      format: e.name.includes('Catch the Flag') ? 'Team challenge' : 'Presentation',
      focus: 'Cyber Warfare & Security',
    })),
  },
  {
    code: 'BCA',
    name: 'BCA & Applications',
    category: 'software',
    badgeBg: 'bg-[#6C8480] text-white',
    events: (eventsByDepartment['bca'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Take on a technology-focused challenge and showcase your skills.',
      format: e.name.includes('Paper') ? 'Presentation' : 'Team challenge',
      focus: 'Web Technologies & Logic',
    })),
  },
  {
    code: 'MECH',
    name: 'Mechanical Engineering',
    category: 'hardware',
    badgeBg: 'bg-[#404E3B] text-white',
    events: (eventsByDepartment['mechanical'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Share a technical concept, experiment or innovation.',
      format: e.name.includes('Race') ? 'Live race' : e.name.includes('CAD') ? 'Design challenge' : 'Presentation',
      focus: e.name.includes('Race') ? 'Robotics & Control' : 'Mechanical Systems',
    })),
  },
  {
    code: 'EE',
    name: 'Electrical Engineering',
    category: 'hardware',
    badgeBg: 'bg-[#7B9669] text-white',
    events: (eventsByDepartment['electrical'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Explain an electrical engineering idea, application or emerging technology.',
      format: e.name.includes('Circuit') ? 'Build challenge' : 'Presentation',
      focus: 'Circuits & Power',
    })),
  },
  {
    code: 'ROBOTICS',
    name: 'Robotics & AI',
    category: 'hardware',
    badgeBg: 'bg-[#7B9669] text-white',
    events: (eventsByDepartment['robotics'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Build and present an innovative robotics or AI solution.',
      format: 'Prototype challenge',
      focus: 'Autonomous Systems',
    })),
  },
  {
    code: 'CIVIL',
    name: 'Civil Engineering',
    category: 'civil-aero',
    badgeBg: 'bg-[#6C8480] text-white',
    events: (eventsByDepartment['civil'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Present a civil engineering study or solution.',
      format: e.name.includes('SETU') || e.name.includes('Bridge') ? 'Build challenge' : 'Presentation',
      focus: 'Structural Design & Smart Cities',
    })),
  },
  {
    code: 'AERO',
    name: 'Aeronautical Eng.',
    category: 'civil-aero',
    badgeBg: 'bg-[#6C8480] text-white',
    events: (eventsByDepartment['aeronautical'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Communicate an aviation or aerospace concept.',
      format: 'Flight challenge',
      focus: 'Aerodynamics & Flight',
    })),
  },
  {
    code: 'FOOD',
    name: 'Food Technology',
    category: 'other',
    badgeBg: 'bg-[#7B9669] text-white',
    events: (eventsByDepartment['food'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Explore food products and innovation.',
      format: 'Product challenge',
      focus: 'Food Innovation',
    })),
  },
  {
    code: 'BBA',
    name: 'Business Admin',
    category: 'other',
    badgeBg: 'bg-[#404E3B] text-white',
    events: (eventsByDepartment['bba'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Make a persuasive presentation on a business topic.',
      format: 'Presentation',
      focus: 'Management & Strategy',
    })),
  },
];

type ViewState =
  | { type: 'list' }
  | { type: 'events'; departmentIndex: number }
  | { type: 'detail'; departmentIndex: number; eventIndex: number };

export const DepartmentExplorer = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [view, setView] = useState<ViewState>({ type: 'list' });

  // Real-time Event Search & Category Filtering
  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => {
      const matchesCategory = activeCategory === 'all' || dept.category === activeCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.events.some(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.focus.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleDepartmentClick = useCallback((deptCode: string) => {
    const originalIndex = departments.findIndex(d => d.code === deptCode);
    if (originalIndex !== -1) {
      setView({ type: 'events', departmentIndex: originalIndex });
    }
  }, []);

  const handleEventClick = useCallback((deptIndex: number, eventIndex: number) => {
    setView({ type: 'detail', departmentIndex: deptIndex, eventIndex });
  }, []);

  const handleBackToList = useCallback(() => {
    setView({ type: 'list' });
  }, []);

  const handleBackToEvents = useCallback(() => {
    if (view.type === 'detail') {
      setView({ type: 'events', departmentIndex: view.departmentIndex });
    }
  }, [view]);

  const isEvents = view.type === 'events' || view.type === 'detail';
  const isDetail = view.type === 'detail';

  const activeDept = isEvents
    ? departments[(view as { departmentIndex: number }).departmentIndex]
    : null;
  const selectedEvent = isDetail && activeDept
    ? activeDept.events[view.eventIndex]
    : null;

  return (
    <section className="section bg-[#F6F8F5] border-b border-[#E6E6E6]" id="tracks">
      <div className="wrap">
        
        {/* Header Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1F5EE] border border-[#BAC8B1] text-[#404E3B] font-mono text-xs font-bold tracking-wide w-fit mb-4">
          <span className="w-2 h-2 rounded-full bg-[#7B9669]" />
          <span>EVENTS BENTO MATRIX & SEARCH</span>
        </div>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="section-title text-[#404E3B]">Department Competitions</h2>
            <p className="text-[#2E382A] text-base max-w-[560px] mt-2">
              Search by event keyword or filter by academic stream to explore rules and fees.
            </p>
          </div>

          {/* Real-time Search Input Box */}
          {!isEvents && (
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="🔍 Search event or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#BAC8B1] rounded-full py-2.5 px-5 text-sm text-[#404E3B] placeholder-[#6C8480] focus:outline-none focus:border-[#7B9669] shadow-xs font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6C8480] hover:text-[#404E3B]"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Category Filter Tabs */}
        {!isEvents && (
          <div className="flex flex-wrap gap-2.5 mb-8 pb-2">
            {[
              { id: 'all', label: 'All Streams' },
              { id: 'software', label: 'Software & AI' },
              { id: 'hardware', label: 'Hardware & Robotics' },
              { id: 'civil-aero', label: 'Civil & Aero' },
              { id: 'other', label: 'Business & Bio' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`font-mono text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                  activeCategory === tab.id
                    ? 'bg-[#7B9669] text-white border-[#7B9669] shadow-xs'
                    : 'bg-[#F1F5EE] text-[#404E3B] border-[#BAC8B1] hover:border-[#7B9669] hover:text-[#7B9669]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="wrap">
        <div className="jade-card p-4 sm:p-6 shadow-md">
          {/* Bento Department Grid */}
          {!isEvents && (
            <div className="bento-grid">
              {filteredDepartments.length === 0 ? (
                <div className="bento-col-12 p-12 text-center text-[#6C8480] font-mono text-sm">
                  No events found matching "{searchQuery}". Try a different keyword.
                </div>
              ) : (
                filteredDepartments.map((dept, idx) => {
                  const isFeatured = idx === 0 || idx === 3;
                  return (
                    <div
                      key={dept.code}
                      onClick={() => handleDepartmentClick(dept.code)}
                      className={`cursor-pointer group p-6 rounded-2xl bg-[#FFFFFF] border border-[#E6E6E6] hover:border-[#BAC8B1] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
                        isFeatured ? 'bento-col-6' : 'bento-col-4'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-xs font-bold text-[#6C8480]">
                            0{idx + 1}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold ${dept.badgeBg}`}>
                            {dept.code}
                          </span>
                        </div>
                        <h3 className="font-display font-extrabold text-xl text-[#404E3B] group-hover:text-[#7B9669] transition-colors mb-2">
                          {dept.name}
                        </h3>
                        <p className="text-[#6C8480] text-xs line-clamp-2">
                          {dept.events.length} competitions available with cash prizes & certificates.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-6 border-t border-[#E6E6E6]">
                        <span className="font-mono text-xs font-bold text-[#7B9669]">
                          {dept.events.length} Events
                        </span>
                        <span className="font-mono text-xs font-bold text-[#404E3B] group-hover:translate-x-1 transition-transform">
                          Explore →
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Events List View */}
          {isEvents && activeDept && !isDetail && (
            <div className="bg-[#FFFFFF] rounded-xl p-4 sm:p-6 border border-[#E6E6E6]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E6E6] mb-6">
                <div>
                  <button
                    onClick={handleBackToList}
                    className="font-mono text-xs font-bold text-[#7B9669] hover:underline mb-2 block"
                  >
                    ← BACK TO ALL DEPARTMENTS
                  </button>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#404E3B]">
                    {activeDept.name}
                  </h3>
                </div>
                <span className={`px-4 py-1.5 rounded-full font-mono text-xs font-bold ${activeDept.badgeBg}`}>
                  {activeDept.events.length} EVENTS
                </span>
              </div>

              <div className="grid gap-3">
                {activeDept.events.map((event, i) => (
                  <button
                    key={i}
                    onClick={() => handleEventClick((view as { departmentIndex: number }).departmentIndex, i)}
                    className="w-full flex items-center justify-between gap-4 p-4 rounded-xl border border-[#E6E6E6] bg-[#F9FBF8] hover:bg-[#F1F5EE] hover:border-[#BAC8B1] transition-all text-left group"
                  >
                    <div>
                      <h4 className="font-display font-bold text-[#404E3B] text-base sm:text-lg group-hover:text-[#7B9669] transition-colors">
                        {event.name}
                      </h4>
                      <p className="text-[#6C8480] text-xs sm:text-sm mt-0.5 line-clamp-1">
                        {event.focus} • Format: {event.format}
                      </p>
                    </div>
                    <span className="btn-jade-outline text-xs py-2 px-4 shrink-0">
                      View Details →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Event Details View */}
          {selectedEvent && activeDept && (
            <div className="bg-[#FFFFFF] rounded-xl p-4 sm:p-8 border border-[#E6E6E6]">
              <button
                onClick={handleBackToEvents}
                className="font-mono text-xs font-bold text-[#7B9669] hover:underline mb-4 block"
              >
                ← BACK TO EVENTS LIST
              </button>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E6E6E6]">
                <div>
                  <span className="font-mono text-xs font-bold text-[#7B9669] uppercase tracking-wider">
                    {activeDept.name}
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-4xl text-[#404E3B] mt-1">
                    {selectedEvent.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-[#F1F5EE] text-[#404E3B] border border-[#BAC8B1] font-mono text-xs font-bold px-3.5 py-1.5 rounded-full">
                    Entry Fee: ₹{selectedEvent.entryFee} / person
                  </span>
                </div>
              </div>

              <p className="text-[#2E382A] text-base sm:text-lg leading-relaxed my-6">
                {selectedEvent.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                {selectedEvent.rules && selectedEvent.rules.length > 0 && (
                  <div className="p-5 rounded-2xl bg-[#EEF2EB] border border-[#BAC8B1]">
                    <h4 className="font-mono text-xs font-bold text-[#7B9669] uppercase tracking-wider mb-3">
                      Rules & Guidelines
                    </h4>
                    <ul className="space-y-2 text-[#2E382A] text-sm list-disc list-inside">
                      {selectedEvent.rules.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEvent.specifications && selectedEvent.specifications.length > 0 && (
                  <div className="p-5 rounded-2xl bg-[#EEF2EB] border border-[#BAC8B1]">
                    <h4 className="font-mono text-xs font-bold text-[#6C8480] uppercase tracking-wider mb-3">
                      Specifications
                    </h4>
                    <ul className="space-y-2 text-[#2E382A] text-sm list-disc list-inside">
                      {selectedEvent.specifications.filter(Boolean).map((spec, idx) => (
                        <li key={idx}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
