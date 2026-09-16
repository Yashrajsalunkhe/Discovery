import { useState, useCallback } from 'react';
import { eventsByDepartment, type Event } from '@/data/events';

interface DepartmentInfo {
  code: string;
  name: string;
  events: (Event & { format: string; focus: string })[];
}

// Build department data from the existing events.ts data
const departments: DepartmentInfo[] = [
  {
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
    code: 'BBA',
    name: 'Business Administration',
    events: (eventsByDepartment['bba'] || []).map((e) => ({
      ...e,
      name: e.name,
      description: e.description || 'Make a persuasive, evidence-backed presentation on a business topic.',
      format: 'Presentation',
      focus: 'Analysis & communication',
    })),
  },
  {
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
  const [view, setView] = useState<ViewState>({ type: 'list' });

  const handleDepartmentClick = useCallback((index: number) => {
    setView({ type: 'events', departmentIndex: index });
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
    <section className="section section-alt" id="tracks">
      <div className="wrap">
        <div className="file-tab">FILE 02 — DEPARTMENTS</div>
        <div className="section-head">
          <h2 className="section-title">Choose a department. Find your event.</h2>
          <p className="section-note">
            Select a department to see its events, then select an event for the format and focus.
          </p>
        </div>
      </div>

      <div className="max-w-[var(--container)] mx-auto px-8 pt-[18px] max-md:px-4 max-sm:px-3">
        <div
          className="overflow-hidden border border-[#E2E8F0] rounded-[28px] max-sm:rounded-[18px] bg-white"
          style={{
            boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06)',
          }}
        >
          {/* Department grid — hidden when viewing events */}
          {!isEvents && (
            <div
              className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-[18px] p-[18px] max-md:gap-3 max-md:p-3 max-sm:gap-2.5 max-sm:p-2.5"
              style={{
                background: '#F8FAFC',
              }}
            >
              {departments.map((dept, i) => (
                <button
                  key={dept.code}
                  onClick={() => handleDepartmentClick(i)}
                  className="relative min-h-[260px] max-md:min-h-[230px] max-sm:min-h-[210px] flex flex-col items-start justify-between gap-[18px] max-sm:gap-3 p-6 max-md:p-5 max-sm:p-5 text-left overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_14px_34px_rgba(15,23,42,0.11)] group"
                  style={{
                    boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <div
                    className="absolute left-6 top-0 h-1 w-12 rounded-b-full bg-blue-600 transition-all duration-200 group-hover:w-20"
                    style={{
                      zIndex: 1,
                    }}
                  />
                  <span className="relative z-[1] font-mono text-sm font-medium tracking-[.08em] text-[#64748B]">
                    0{i + 1}
                  </span>
                  <span
                    className="relative z-[1] font-display font-bold leading-[1.2] max-w-full text-[#0F172A]"
                    style={{ fontSize: 'clamp(20px, 2vw, 26px)' }}
                  >
                    {dept.name}
                  </span>
                  <span className="relative z-[1] font-mono text-[11px] tracking-[.08em]">
                    <span className="text-[#2563EB] font-semibold">{dept.events.length}</span>{' '}
                    <span className="text-[#475569]">EVT</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Events view */}
          {isEvents && activeDept && !isDetail && (
            <div className="p-0 max-md:p-0 bg-[#F8FAFC]" style={{ minHeight: '430px' }}>
              {/* Header */}
              <div className="flex items-start justify-between gap-6 mx-0 mb-[18px] p-[24px] max-sm:p-5 border-b border-[#E2E8F0] bg-white">
                <div>
                  <button
                    onClick={handleBackToList}
                    className="font-mono text-[11px] tracking-[.08em] text-[#475569] pb-2.5 border-b border-[#E2E8F0] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors duration-200 mb-3 block"
                  >
                    ← BACK TO DEPARTMENTS
                  </button>
                  <div className="text-[#2563EB] font-mono text-[11px] tracking-[.1em] mb-2.5">
                    DEPARTMENT {String((view as { departmentIndex: number }).departmentIndex + 1).padStart(2, '0')} / {activeDept.code}
                  </div>
                  <h3 className="font-display font-bold text-[#0F172A]" style={{ fontSize: 'clamp(1.4rem, 2vw, 1.9rem)', lineHeight: 1.15 }}>
                    {activeDept.name}
                  </h3>
                </div>
                <div className="text-[#64748B] font-mono text-[11px] whitespace-nowrap pt-1">
                  {activeDept.events.length} {activeDept.events.length === 1 ? 'EVENT' : 'EVENTS'}
                </div>
              </div>

              {/* Event list */}
              <div className="grid gap-4 px-6 max-md:px-4 max-sm:px-3 pb-6 md:grid-cols-2">
                {activeDept.events.map((event, i) => (
                  <button
                    key={i}
                    onClick={() => handleEventClick((view as { departmentIndex: number }).departmentIndex, i)}
                    className="w-full min-w-0 flex flex-col items-start justify-between gap-5 p-5 text-left rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_26px_rgba(15,23,42,0.09)]"
                  >
                    <span className="w-full min-w-0">
                      <span className="inline-flex max-w-full mb-3 px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] font-mono text-[10px] tracking-[.08em] truncate">
                        {event.department || activeDept.name}
                      </span>
                      <span className="block text-[#0F172A] font-display font-bold text-[1.05rem] leading-[1.3] break-words">
                        {event.name}
                      </span>
                      <span className="block mt-2 text-[#475569] text-sm leading-[1.55] line-clamp-2">
                        {event.description || 'Event details will be announced by the organizers.'}
                      </span>
                    </span>
                    <span className="inline-flex items-center justify-center w-full min-h-11 px-4 py-2 rounded-lg bg-[#2563EB] text-white font-mono text-[11px] tracking-[.06em] transition-colors duration-200 hover:bg-blue-700">
                      VIEW DETAILS →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Event detail view */}
          {selectedEvent && activeDept && (
            <div className="p-6 max-sm:p-4 min-h-[300px] bg-[#F8FAFC]">
              <button
                onClick={handleBackToEvents}
                className="font-mono text-[11px] tracking-[.08em] text-[#475569] py-2 pb-2.5 border-b border-[#E2E8F0] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors duration-200 mb-7 block"
              >
                ← BACK TO EVENTS
              </button>
              <div className="text-[#2563EB] font-mono text-[11px] tracking-[.1em] mb-3">
                {activeDept.name}
              </div>
              <h4 className="font-display font-bold text-[#0F172A]" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', lineHeight: 1.2 }}>
                {selectedEvent.name}
              </h4>
              <p className="text-[#475569] text-[15px] max-w-[760px] leading-[1.7] mt-3">
                {selectedEvent.description || 'Event details will be announced by the organizers.'}
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                  <span className="block text-[#64748B] font-mono text-[10px] tracking-[.1em]">FORMAT</span>
                  <strong className="block mt-2 text-[#0F172A] font-medium text-sm">{selectedEvent.format}</strong>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                  <span className="block text-[#64748B] font-mono text-[10px] tracking-[.1em]">FOCUS</span>
                  <strong className="block mt-2 text-[#0F172A] font-medium text-sm">{selectedEvent.focus}</strong>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                  <span className="block text-[#64748B] font-mono text-[10px] tracking-[.1em]">TEAM</span>
                  <strong className="block mt-2 text-[#0F172A] font-medium text-sm">
                    {selectedEvent.minTeamSize && selectedEvent.minTeamSize > 1
                      ? `${selectedEvent.minTeamSize}-${selectedEvent.maxTeamSize} participants`
                      : `Up to ${selectedEvent.maxTeamSize} participant${selectedEvent.maxTeamSize === 1 ? '' : 's'}`}
                  </strong>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                  <span className="block text-[#64748B] font-mono text-[10px] tracking-[.1em]">FEE</span>
                  <strong className="block mt-2 text-[#0F172A] font-medium text-sm">₹{selectedEvent.entryFee} / participant</strong>
                </div>
              </div>

              <div className="grid gap-5 mt-7 md:grid-cols-2">
                {selectedEvent.rules && selectedEvent.rules.length > 0 && (
                  <div className="border border-[#E2E8F0] rounded-[18px] p-5 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <h5 className="font-mono text-[11px] tracking-[.1em] text-[#2563EB] mb-3">RULES & GUIDELINES</h5>
                    <ol className="space-y-2 text-[#475569] text-sm leading-[1.6] list-decimal list-inside">
                      {selectedEvent.rules.map((rule, index) => <li key={index}>{rule}</li>)}
                    </ol>
                  </div>
                )}
                {selectedEvent.specifications && selectedEvent.specifications.length > 0 && (
                  <div className="border border-[#E2E8F0] rounded-[18px] p-5 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <h5 className="font-mono text-[11px] tracking-[.1em] text-[#2563EB] mb-3">SPECIFICATIONS</h5>
                    <ul className="space-y-2 text-[#475569] text-sm leading-[1.6] list-disc list-inside">
                      {selectedEvent.specifications.filter(Boolean).map((spec, index) => <li key={index}>{spec}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              {selectedEvent.coordinators && (
                <div className="mt-5 border border-[#E2E8F0] rounded-[18px] p-5 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <h5 className="font-mono text-[11px] tracking-[.1em] text-[#2563EB] mb-3">EVENT COORDINATORS</h5>
                  <div className="grid gap-4 sm:grid-cols-2 text-sm text-[#475569]">
                    {selectedEvent.coordinators.faculty && (
                      <div>
                        <div className="text-[#0F172A] font-medium">Faculty: {selectedEvent.coordinators.faculty.name}</div>
                        <div>{selectedEvent.coordinators.faculty.phone}</div>
                        {selectedEvent.coordinators.faculty.email && <div className="break-all">{selectedEvent.coordinators.faculty.email}</div>}
                      </div>
                    )}
                    {selectedEvent.coordinators.student && (
                      <div>
                        <div className="text-[#0F172A] font-medium">Student: {selectedEvent.coordinators.student.name}</div>
                        <div>{selectedEvent.coordinators.student.phone}</div>
                        {selectedEvent.coordinators.student.email && <div className="break-all">{selectedEvent.coordinators.student.email}</div>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
