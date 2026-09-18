import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsByDepartment, type Event } from '@/data/events';

interface DepartmentInfo {
  id: string;
  code: string;
  name: string;
  events: (Event & { format: string; focus: string })[];
}

// Build department data from the existing events.ts data
const departments: DepartmentInfo[] = [
  {
    id: 'aids',
    code: 'AI&DS',
    name: 'AI & Data Science',
    events: (eventsByDepartment['aids'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Present a research idea or technical study with clarity and evidence.',
      format: e.rules?.[0]?.includes('Presentation') ? 'Presentation' : 'Timed challenge',
      focus: 'Research & communication',
    })),
  },
  {
    id: 'mechanical',
    code: 'MECH',
    name: 'Mechanical Engineering',
    events: (eventsByDepartment['mechanical'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Share a technical concept, experiment or innovation.',
      format: e.name.includes('Race') ? 'Live race' : e.name.includes('CAD') ? 'Design challenge' : 'Presentation',
      focus: e.name.includes('Race') ? 'Robotics & control' : e.name.includes('CAD') ? 'CAD & engineering design' : 'Technical communication',
    })),
  },
  {
    id: 'electrical',
    code: 'EE',
    name: 'Electrical Engineering',
    events: (eventsByDepartment['electrical'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Explain an electrical engineering idea, application or emerging technology.',
      format: e.name.includes('Circuit') ? 'Build challenge' : e.name.includes('Troubleshoot') ? 'Practical challenge' : 'Presentation',
      focus: e.name.includes('Circuit') ? 'Circuits & troubleshooting' : e.name.includes('Troubleshoot') ? 'Analysis & precision' : 'Research & communication',
    })),
  },
  {
    id: 'civil',
    code: 'CIVIL',
    name: 'Civil Engineering',
    events: (eventsByDepartment['civil'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Present a civil engineering study or solution.',
      format: e.name.includes('SETU') || e.name.includes('Bridge') ? 'Build challenge' : e.name.includes('AKRUTI') ? 'Design challenge' : 'Presentation',
      focus: e.name.includes('SETU') || e.name.includes('Bridge') ? 'Structures & teamwork' : e.name.includes('AKRUTI') ? 'Planning & creativity' : 'Research & communication',
    })),
  },
  {
    id: 'cse',
    code: 'CSE',
    name: 'Computer Science Engineering',
    events: (eventsByDepartment['cse'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Present a computing research idea, project or technology.',
      format: e.name.includes('Code') ? 'Timed challenge' : e.name.includes('B-Plan') || e.name.includes('Plan') ? 'Pitch challenge' : 'Presentation',
      focus: e.name.includes('Code') ? 'Algorithms & programming' : e.name.includes('B-Plan') || e.name.includes('Plan') ? 'Entrepreneurship & strategy' : 'Research & communication',
    })),
  },
  {
    id: 'aeronautical',
    code: 'AERO',
    name: 'Aeronautical Engineering',
    events: (eventsByDepartment['aeronautical'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Communicate an aviation or aerospace concept.',
      format: e.name.includes('Glider') || e.name.includes('Flight Challenge') ? 'Flight challenge' : e.name.includes('Simulator') ? 'Simulation' : 'Presentation',
      focus: e.name.includes('Glider') || e.name.includes('Flight Challenge') ? 'Aerodynamics & experimentation' : e.name.includes('Simulator') ? 'Flight operations & control' : 'Research & communication',
    })),
  },
  {
    id: 'iot',
    code: 'IOT&CS',
    name: 'IoT & Cyber Security',
    events: (eventsByDepartment['iot'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Present an idea at the intersection of connected devices and security.',
      format: e.name.includes('Catch the Flag') ? 'Team challenge' : e.name.includes('Pickle Ball') ? 'Sports challenge' : 'Presentation',
      focus: e.name.includes('Catch the Flag') ? 'Strategy & teamwork' : e.name.includes('Pickle Ball') ? 'Teamwork & sportsmanship' : 'Research & communication',
    })),
  },
  {
    id: 'bba',
    code: 'BBA',
    name: 'BBA',
    events: (eventsByDepartment['bba'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Make a persuasive, evidence-backed presentation on a business topic.',
      format: 'Presentation',
      focus: 'Analysis & communication',
    })),
  },
  {
    id: 'food',
    code: 'FOOD',
    name: 'Food Technology',
    events: (eventsByDepartment['food'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Explore food products and innovation.',
      format: e.name.includes('New Product') ? 'Product challenge' : 'Concept challenge',
      focus: e.name.includes('New Product') ? 'Development & market thinking' : 'Nutrition & innovation',
    })),
  },
  {
    id: 'robotics',
    code: 'ROBOTICS',
    name: 'Robotics & AI',
    events: (eventsByDepartment['robotics'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Build and present an innovative robotics or AI solution.',
      format: 'Prototype challenge',
      focus: 'Robotics & artificial intelligence',
    })),
  },
  {
    id: 'bca',
    code: 'BCA',
    name: 'BCA',
    events: (eventsByDepartment['bca'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Take on a technology-focused challenge and showcase your skills.',
      format: e.name.includes('Paper') ? 'Presentation' : 'Team challenge',
      focus: e.name.includes('Paper') ? 'Research & communication' : 'Logic & teamwork',
    })),
  },
];

type ViewState =
  | { type: 'list' }
  | { type: 'events'; departmentIndex: number }
  | { type: 'detail'; departmentIndex: number; eventIndex: number };

export const DepartmentExplorer = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>({ type: 'list' });

  const handleDepartmentClick = useCallback((index: number) => {
    const dept = departments[index];
    if (dept) {
      navigate(`/department/${dept.id}`);
    } else {
      setView({ type: 'events', departmentIndex: index });
    }
  }, [navigate]);

  const handleEventClick = useCallback((deptIndex: number, eventIndex: number) => {
    const dept = departments[deptIndex];
    const event = dept?.events[eventIndex];
    if (dept && event) {
      navigate(`/department/${dept.id}/event/${event.id}`);
    } else {
      setView({ type: 'detail', departmentIndex: deptIndex, eventIndex });
    }
  }, [navigate]);

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
    <section className="py-16 sm:py-24 bg-[#FAFAF8] text-[#0F1115] border-b-2 border-[#0F1115]" id="tracks">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">

        {/* Editorial Section Tab Tag */}
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest bg-[#FFCC00] text-[#0F1115] px-3 py-1 border-2 border-[#0F1115] shadow-[2px_2px_0px_#0F1115] mb-6">
          <span>FILE 02</span>
          <span>//</span>
          <span>DEPARTMENT EXPLORER & TRACKS</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-end">
          <div className="lg:col-span-8">
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#0F1115] leading-[0.95]">
              Choose a department. <span className="bg-[#FFCC00] px-2 border-2 border-[#0F1115] inline-block">Find your event.</span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="font-body text-base text-[#0F1115]/80 font-medium leading-relaxed border-l-3 border-[#FFCC00] pl-4 py-1">
              Select a department to view all 28 events, rulebooks, coordinators, entry fees, and registration details.
            </p>
          </div>
        </div>
        {/* Grid View of Departments */}
        {!isEvents && !isDetail && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept, i) => (
              <button
                key={dept.code}
                onClick={() => handleDepartmentClick(i)}
                className="relative p-6 text-left bg-white border-2 border-[#0F1115] shadow-[4px_4px_0px_#0F1115] hover:bg-[#FFCC00] hover:shadow-[6px_6px_0px_#0F1115] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between min-h-[170px]"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="font-mono text-xs font-black bg-[#0F1115] text-[#FFCC00] px-2 py-0.5 border border-[#0F1115]">
                    {String(i + 1).padStart(2, '0')} // {dept.code}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0F1115] bg-[#FFCC00] px-2 py-0.5 border border-[#0F1115] group-hover:bg-[#0F1115] group-hover:text-[#FFCC00]">
                    {dept.events.length} {dept.events.length === 1 ? 'EVENT' : 'EVENTS'}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-black text-xl text-[#0F1115] leading-snug group-hover:underline">
                    {dept.name}
                  </h3>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#0F1115]/10 mt-3 font-mono text-xs font-bold text-[#0F1115]">
                  <span>EXPLORE TRACK</span>
                  <span className="text-sm font-black group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Events View for selected department */}
        {isEvents && activeDept && !isDetail && (
          <div className="bg-white border-2 border-[#0F1115] shadow-[6px_6px_0px_#0F1115]">
            {/* Header */}
            <div className="p-6 sm:p-8 bg-[#FFCC00] border-b-2 border-[#0F1115] flex items-center justify-between gap-4 flex-wrap">
              <div>
                <button
                  onClick={handleBackToList}
                  className="font-mono text-xs font-bold tracking-widest text-[#0F1115] bg-white px-3 py-1 border border-[#0F1115] hover:bg-[#0F1115] hover:text-[#FFCC00] transition-colors mb-3 inline-block"
                >
                  ← BACK TO DEPARTMENTS
                </button>
                <div className="font-mono text-xs font-bold text-[#0F1115] uppercase tracking-wider mb-1">
                  DEPARTMENT {String((view as { departmentIndex: number }).departmentIndex + 1).padStart(2, '0')} // {activeDept.code}
                </div>
                <h3 className="font-display font-black text-2xl sm:text-4xl text-[#0F1115] uppercase">
                  {activeDept.name}
                </h3>
              </div>
              <div className="font-mono text-xs font-black bg-[#0F1115] text-[#FFCC00] px-3 py-1.5 border border-[#0F1115]">
                {activeDept.events.length} {activeDept.events.length === 1 ? 'EVENT' : 'EVENTS'} TOTAL
              </div>
            </div>

            {/* Event list */}
            <div className="p-6 sm:p-8 grid gap-4">
              {activeDept.events.map((event, i) => (
                <button
                  key={i}
                  onClick={() => handleEventClick((view as { departmentIndex: number }).departmentIndex, i)}
                  className="w-full flex items-center justify-between gap-4 p-4 text-left bg-[#FAFAF8] border-2 border-[#0F1115] shadow-[3px_3px_0px_#0F1115] hover:bg-[#FFCC00] hover:shadow-[5px_5px_0px_#0F1115] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold bg-[#0F1115] text-[#FFCC00] px-2 py-0.5">
                      E{String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display font-bold text-base sm:text-lg text-[#0F1115]">
                      {event.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-black bg-[#0F1115] text-[#FAFAF8] px-3 py-1 group-hover:bg-white group-hover:text-[#0F1115]">
                    VIEW EVENT →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Event detail view */}
        {selectedEvent && activeDept && (
          <div className="bg-white border-2 border-[#0F1115] shadow-[6px_6px_0px_#0F1115] p-6 sm:p-10">
            <button
              onClick={handleBackToEvents}
              className="font-mono text-xs font-bold tracking-widest text-[#0F1115] bg-[#FFCC00] px-3 py-1 border-2 border-[#0F1115] shadow-[2px_2px_0px_#0F1115] hover:bg-[#0F1115] hover:text-[#FFCC00] transition-colors mb-6 inline-block"
            >
              ← BACK TO EVENTS
            </button>

            <div className="font-mono text-xs font-bold text-[#0F1115]/60 uppercase tracking-widest mb-1">
              {activeDept.name}
            </div>
            <h4 className="font-display font-black text-2xl sm:text-4xl text-[#0F1115] uppercase mb-4">
              {selectedEvent.name}
            </h4>
            <p className="font-body text-base sm:text-lg text-[#0F1115]/80 leading-relaxed max-w-3xl mb-6">
              {selectedEvent.description || 'Event details will be announced by the department organizers.'}
            </p>

            {/* Event Attributes Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFAF8] p-4 border-2 border-[#0F1115] mb-8 font-mono text-xs">
              <div>
                <div className="font-bold text-[#0F1115]/60">FORMAT</div>
                <div className="font-black text-[#0F1115] text-sm">{selectedEvent.format}</div>
              </div>
              <div>
                <div className="font-bold text-[#0F1115]/60">FOCUS</div>
                <div className="font-black text-[#0F1115] text-sm">{selectedEvent.focus}</div>
              </div>
              <div>
                <div className="font-bold text-[#0F1115]/60">TEAM SIZE</div>
                <div className="font-black text-[#0F1115] text-sm">
                  {selectedEvent.minTeamSize && selectedEvent.minTeamSize > 1
                    ? `${selectedEvent.minTeamSize}-${selectedEvent.maxTeamSize} Members`
                    : `Up to ${selectedEvent.maxTeamSize} Member${selectedEvent.maxTeamSize === 1 ? '' : 's'}`}
                </div>
              </div>
              <div>
                <div className="font-bold text-[#0F1115]/60">ENTRY FEE</div>
                <div className="font-black text-[#0F1115] text-sm">₹{selectedEvent.entryFee} / Participant</div>
              </div>
            </div>

            {/* Rules & Specs */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              {selectedEvent.rules && selectedEvent.rules.length > 0 && (
                <div className="border-2 border-[#0F1115] p-5 bg-[#FAFAF8]">
                  <h5 className="font-mono text-xs font-black tracking-widest text-[#0F1115] bg-[#FFCC00] px-2 py-0.5 border border-[#0F1115] inline-block mb-4">
                    RULES & GUIDELINES
                  </h5>
                  <ol className="space-y-2 font-body text-sm text-[#0F1115]/90 leading-relaxed list-decimal list-inside">
                    {selectedEvent.rules.map((rule, index) => <li key={index}>{rule}</li>)}
                  </ol>
                </div>
              )}
              {selectedEvent.specifications && selectedEvent.specifications.length > 0 && (
                <div className="border-2 border-[#0F1115] p-5 bg-[#FAFAF8]">
                  <h5 className="font-mono text-xs font-black tracking-widest text-[#0F1115] bg-[#FFCC00] px-2 py-0.5 border border-[#0F1115] inline-block mb-4">
                    SPECIFICATIONS
                  </h5>
                  <ul className="space-y-2 font-body text-sm text-[#0F1115]/90 leading-relaxed list-disc list-inside">
                    {selectedEvent.specifications.filter(Boolean).map((spec, index) => <li key={index}>{spec}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Coordinators */}
            {selectedEvent.coordinators && (
              <div className="border-2 border-[#0F1115] p-5 bg-[#FFCC00]/20">
                <h5 className="font-mono text-xs font-black tracking-widest text-[#0F1115] bg-[#0F1115] text-[#FFCC00] px-2 py-0.5 inline-block mb-3">
                  EVENT COORDINATORS
                </h5>
                <div className="grid gap-4 sm:grid-cols-2 font-mono text-xs text-[#0F1115]">
                  {selectedEvent.coordinators.faculty && (
                    <div>
                      <div className="font-bold">Faculty: {selectedEvent.coordinators.faculty.name}</div>
                      <div>Phone: {selectedEvent.coordinators.faculty.phone}</div>
                      {selectedEvent.coordinators.faculty.email && <div className="break-all">Email: {selectedEvent.coordinators.faculty.email}</div>}
                    </div>
                  )}
                  {selectedEvent.coordinators.student && (
                    <div>
                      <div className="font-bold">Student: {selectedEvent.coordinators.student.name}</div>
                      <div>Phone: {selectedEvent.coordinators.student.phone}</div>
                      {selectedEvent.coordinators.student.email && <div className="break-all">Email: {selectedEvent.coordinators.student.email}</div>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
