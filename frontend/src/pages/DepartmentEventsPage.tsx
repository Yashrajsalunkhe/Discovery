import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Users, IndianRupee, ChevronRight, BookOpen } from "lucide-react";
import { getEventsByDepartment, Event } from "@/data/events";
import { Navbar, FooterLanding } from "@/components/landing";

const departmentNames: Record<string, string> = {
  aids: "AI & Data Science",
  mechanical: "Mechanical Engineering",
  electrical: "Electrical Engineering",
  civil: "Civil Engineering",
  cse: "Computer Science Engineering",
  aeronautical: "Aeronautical Engineering",
  iot: "IoT & Cyber Security",
  bba: "BBA",
  food: "Food Technology",
  robotics: "Robotics & AI",
  bca: "BCA",
};

export const DepartmentEventsPage = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const navigate = useNavigate();

  const normalizedDeptId = (deptId || "").toLowerCase();
  const events: Event[] = getEventsByDepartment(normalizedDeptId);
  const deptName = departmentNames[normalizedDeptId] || events[0]?.department || "Department Events";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [deptId]);

  if (!events || events.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-display font-black text-[#0F1115] mb-4">Department Not Found</h1>
          <p className="text-[#0F1115]/70 mb-8">We couldn't find events for the requested department.</p>
          <Button onClick={() => navigate("/")} className="bg-[#FFCC00] text-[#0F1115] hover:bg-[#0F1115] hover:text-[#FFCC00] font-mono font-bold border-2 border-[#0F1115] shadow-[3px_3px_0px_#0F1115]">
            ← Return to Home
          </Button>
        </main>
        <FooterLanding />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#0F1115]">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1320px] mx-auto w-full">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="font-mono text-xs font-bold tracking-widest text-[#0F1115] bg-white border-2 border-[#0F1115] shadow-[3px_3px_0px_#0F1115] hover:bg-[#FFCC00] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            BACK TO DEPARTMENTS
          </Button>
        </div>

        {/* Header Banner */}
        <div className="bg-[#FFCC00] border-2 border-[#0F1115] shadow-[6px_6px_0px_#0F1115] p-6 sm:p-10 mb-10">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest bg-[#0F1115] text-[#FFCC00] px-3 py-1 border border-[#0F1115] mb-4">
            <span>DEPARTMENT FILE</span>
            <span>//</span>
            <span className="uppercase">{normalizedDeptId}</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#0F1115] mb-3">
            {deptName}
          </h1>

          <p className="font-body text-base sm:text-lg text-[#0F1115]/90 font-medium max-w-2xl leading-relaxed">
            Choose from {events.length} official {events.length === 1 ? 'event' : 'events'} hosted and judged by the {deptName} department.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs font-bold text-[#0F1115]">
            <span className="bg-white px-3 py-1 border border-[#0F1115] shadow-[2px_2px_0px_#0F1115]">
              {events.length} {events.length === 1 ? 'TRACK AVAILABLE' : 'TRACKS AVAILABLE'}
            </span>
            <span className="bg-[#0F1115] text-[#FFCC00] px-3 py-1 border border-[#0F1115]">
              NATIONAL LEVEL DISCOVERY 2K26
            </span>
          </div>
        </div>

        {/* Section Label */}
        <div className="flex items-center justify-between mb-6 border-b-2 border-[#0F1115] pb-3">
          <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight">
            Select an Event to View Details
          </h2>
          <span className="font-mono text-xs font-bold bg-[#FFCC00] px-2 py-0.5 border border-[#0F1115]">
            {events.length} EVENTS
          </span>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div
              key={event.id}
              onClick={() => navigate(`/department/${normalizedDeptId}/event/${event.id}`)}
              className="bg-white border-2 border-[#0F1115] shadow-[5px_5px_0px_#0F1115] hover:shadow-[8px_8px_0px_#0F1115] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between group overflow-hidden"
            >
              {/* Event Card Header */}
              <div>
                {event.image && (
                  <div className="h-44 w-full bg-[#0F1115]/5 border-b-2 border-[#0F1115] overflow-hidden relative">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#0F1115] text-[#FFCC00] font-mono text-xs font-black px-2.5 py-1 border border-[#0F1115]">
                      EVENT 0{index + 1}
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {!event.image && (
                    <div className="font-mono text-xs font-black bg-[#0F1115] text-[#FFCC00] px-2.5 py-1 border border-[#0F1115] inline-block mb-3">
                      EVENT 0{index + 1}
                    </div>
                  )}

                  <h3 className="font-display font-black text-2xl text-[#0F1115] mb-3 leading-snug group-hover:underline">
                    {event.name}
                  </h3>

                  <p className="font-body text-sm text-[#0F1115]/80 line-clamp-3 leading-relaxed mb-6">
                    {event.description || "Detailed rules, topics, coordinators and entry requirements inside."}
                  </p>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs mb-4">
                    <div className="bg-[#FAFAF8] p-2 border border-[#0F1115]">
                      <div className="text-[#0F1115]/60 text-[10px] uppercase font-bold">TEAM SIZE</div>
                      <div className="font-black text-[#0F1115]">
                        {event.minTeamSize && event.minTeamSize > 1
                          ? `${event.minTeamSize}-${event.maxTeamSize} Members`
                          : `Max ${event.maxTeamSize} Member${event.maxTeamSize === 1 ? '' : 's'}`}
                      </div>
                    </div>

                    <div className="bg-[#FAFAF8] p-2 border border-[#0F1115]">
                      <div className="text-[#0F1115]/60 text-[10px] uppercase font-bold">ENTRY FEE</div>
                      <div className="font-black text-[#0F1115]">₹{event.entryFee} / person</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-[#FAFAF8] border-t-2 border-[#0F1115] flex items-center justify-between font-mono text-xs font-bold text-[#0F1115] group-hover:bg-[#FFCC00] transition-colors">
                <span>VIEW EVENT DETAILS</span>
                <span className="text-sm font-black group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <FooterLanding />
    </div>
  );
};

export default DepartmentEventsPage;
