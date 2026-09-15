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

      <div className="max-w-[var(--container)] mx-auto px-8 pt-[18px] max-md:px-4">
        <div
          className="overflow-hidden border border-line rounded-[28px]"
          style={{
            background: 'linear-gradient(180deg, rgba(18,21,27,0.98), rgba(10,12,16,0.96))',
            boxShadow: '0 24px 60px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Department grid — hidden when viewing events */}
          {!isEvents && (
            <div
              className="grid grid-cols-3 max-md:grid-cols-2 gap-[18px] p-[18px] max-md:gap-3 max-md:p-3"
              style={{
                background: `
                  radial-gradient(circle at top left, rgba(61,107,255,0.12), transparent 28%),
                  radial-gradient(circle at bottom right, rgba(232,185,35,0.09), transparent 26%),
                  var(--ink)
                `,
              }}
            >
              {departments.map((dept, i) => (
                <button
                  key={dept.code}
                  onClick={() => handleDepartmentClick(i)}
                  className="relative min-h-[210px] max-md:min-h-[170px] flex flex-col items-start justify-between gap-[18px] p-5 max-md:p-4 text-left overflow-hidden rounded-[20px] border border-line transition-all duration-250 hover:-translate-y-1 hover:border-brass/60 hover:shadow-[0_16px_28px_rgba(0,0,0,0.2)] group"
                  style={{
                    background: 'linear-gradient(180deg, rgba(18,21,27,0.96), rgba(14,16,22,0.98))',
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250"
                    style={{
                      background: i % 3 === 1
                        ? 'linear-gradient(135deg, rgba(61,107,255,0.18), transparent 46%)'
                        : i % 3 === 2
                        ? 'linear-gradient(135deg, rgba(225,75,75,0.14), transparent 46%)'
                        : 'linear-gradient(135deg, rgba(232,185,35,0.14), transparent 46%)',
                    }}
                  />
                  <span className="relative z-[1] font-mono text-[11px] tracking-[.08em] text-paper-mute">
                    0{i + 1}
                  </span>
                  <span className="relative z-[1] font-display text-[1.15rem] font-semibold leading-[1.25] max-w-[88%]">
                    {dept.name}
                  </span>
                  <span className="relative z-[1] font-mono text-[11px] tracking-[.08em] text-brass">
                    {dept.events.length} EVT
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Events view */}
          {isEvents && activeDept && !isDetail && (
            <div className="p-0 max-md:p-0" style={{
              minHeight: '430px',
              background: 'linear-gradient(180deg, rgba(9,11,15,0.96), rgba(15,18,24,0.97))',
            }}>
              {/* Header */}
              <div className="flex items-start justify-between gap-6 mx-0 mb-[18px] p-[22px_18px_18px] border-b border-line"
                style={{ background: 'linear-gradient(180deg, rgba(19,23,31,0.9), rgba(17,20,26,0.75))' }}>
                <div>
                  <button
                    onClick={handleBackToList}
                    className="font-mono text-[11px] tracking-[.08em] text-paper-dim pb-2.5 border-b border-line hover:text-brass hover:border-brass transition-colors duration-200 mb-2.5 block"
                  >
                    ← BACK TO DEPARTMENTS
                  </button>
                  <div className="text-brass font-mono text-[11px] tracking-[.1em] mb-2.5">
                    DEPARTMENT {String((view as { departmentIndex: number }).departmentIndex + 1).padStart(2, '0')} / {activeDept.code}
                  </div>
                  <h3 className="font-display font-semibold" style={{ fontSize: 'clamp(1.3rem, 2vw, 1.9rem)', lineHeight: 1.15 }}>
                    {activeDept.name}
                  </h3>
                </div>
                <div className="text-paper-mute font-mono text-[11px] whitespace-nowrap">
                  {activeDept.events.length} {activeDept.events.length === 1 ? 'EVENT' : 'EVENTS'}
                </div>
              </div>

              {/* Event list */}
              <div className="grid gap-3 px-[18px] max-md:px-3 pb-[18px]">
                {activeDept.events.map((event, i) => (
                  <button
                    key={i}
                    onClick={() => handleEventClick((view as { departmentIndex: number }).departmentIndex, i)}
                    className="w-full flex items-center justify-between gap-5 py-[15px] px-4 text-left text-paper-dim rounded-[14px] border border-line transition-all duration-200 hover:text-paper hover:border-brass/65 hover:translate-x-0.5"
                    style={{ background: 'rgba(17,20,26,0.8)' }}
                  >
                    <span className="max-w-[78%]">{event.name}</span>
                    <span className="font-mono text-[11px] tracking-[.08em] text-brass">VIEW</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Event detail view */}
          {selectedEvent && activeDept && (
            <div className="p-[18px_18px_26px] min-h-[300px]" style={{
              background: 'linear-gradient(180deg, rgba(9,11,15,0.96), rgba(15,18,24,0.97))',
            }}>
              <button
                onClick={handleBackToEvents}
                className="font-mono text-[11px] tracking-[.08em] text-paper-dim py-2 pb-2.5 border-b border-line hover:text-brass hover:border-brass transition-colors duration-200 mb-[22px] block"
              >
                ← BACK TO EVENTS
              </button>
              <div className="text-brass font-mono text-[11px] tracking-[.1em] mb-2.5">
                {activeDept.name}
              </div>
              <h4 className="font-display text-[1.6rem] mb-2.5">
                {selectedEvent.name}
              </h4>
              <p className="text-paper-dim text-[15px] max-w-[620px] leading-[1.7]">
                {selectedEvent.description || 'Event details will be announced by the organizers.'}
              </p>
              <div className="flex flex-wrap gap-[22px] mt-5 text-paper-mute font-mono text-[11px] tracking-[.04em]">
                <span className="flex gap-2 items-center">
                  FORMAT <strong className="text-paper-dim font-medium">{selectedEvent.format}</strong>
                </span>
                <span className="flex gap-2 items-center">
                  FOCUS <strong className="text-paper-dim font-medium">{selectedEvent.focus}</strong>
                </span>
                <span className="flex gap-2 items-center">
                  TEAM <strong className="text-paper-dim font-medium">
                    {selectedEvent.minTeamSize && selectedEvent.minTeamSize > 1
                      ? `${selectedEvent.minTeamSize}-${selectedEvent.maxTeamSize} participants`
                      : `Up to ${selectedEvent.maxTeamSize} participant${selectedEvent.maxTeamSize === 1 ? '' : 's'}`}
                  </strong>
                </span>
                <span className="flex gap-2 items-center">
                  FEE <strong className="text-paper-dim font-medium">₹{selectedEvent.entryFee} / participant</strong>
                </span>
              </div>

              <div className="grid gap-5 mt-7 md:grid-cols-2">
                {selectedEvent.rules && selectedEvent.rules.length > 0 && (
                  <div className="border border-line rounded-[14px] p-4" style={{ background: 'rgba(17,20,26,0.8)' }}>
                    <h5 className="font-mono text-[11px] tracking-[.1em] text-brass mb-3">RULES & GUIDELINES</h5>
                    <ol className="space-y-2 text-paper-dim text-sm leading-[1.6] list-decimal list-inside">
                      {selectedEvent.rules.map((rule, index) => <li key={index}>{rule}</li>)}
                    </ol>
                  </div>
                )}
                {selectedEvent.specifications && selectedEvent.specifications.length > 0 && (
                  <div className="border border-line rounded-[14px] p-4" style={{ background: 'rgba(17,20,26,0.8)' }}>
                    <h5 className="font-mono text-[11px] tracking-[.1em] text-brass mb-3">SPECIFICATIONS</h5>
                    <ul className="space-y-2 text-paper-dim text-sm leading-[1.6] list-disc list-inside">
                      {selectedEvent.specifications.filter(Boolean).map((spec, index) => <li key={index}>{spec}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              {selectedEvent.coordinators && (
                <div className="mt-5 border border-line rounded-[14px] p-4" style={{ background: 'rgba(17,20,26,0.8)' }}>
                  <h5 className="font-mono text-[11px] tracking-[.1em] text-brass mb-3">EVENT COORDINATORS</h5>
                  <div className="grid gap-4 sm:grid-cols-2 text-sm text-paper-dim">
                    {selectedEvent.coordinators.faculty && (
                      <div>
                        <div className="text-paper font-medium">Faculty: {selectedEvent.coordinators.faculty.name}</div>
                        <div>{selectedEvent.coordinators.faculty.phone}</div>
                        {selectedEvent.coordinators.faculty.email && <div className="break-all">{selectedEvent.coordinators.faculty.email}</div>}
                      </div>
                    )}
                    {selectedEvent.coordinators.student && (
                      <div>
                        <div className="text-paper font-medium">Student: {selectedEvent.coordinators.student.name}</div>
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
