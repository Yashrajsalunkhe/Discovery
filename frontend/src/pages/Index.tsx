import { useState, useCallback, memo } from "react";
import {
  Navbar,
  HeroLanding,
  Ticker,
  BriefingSection,
  DepartmentExplorer,
  ScheduleTimeline,
  WhyAttendSection,
  FAQSection,
  VenueSection,
  SeamDivider,
  RegisterCTA,
  FooterLanding,
} from "@/components/landing";
import { useGsapAnimations } from "@/hooks/useGsapAnimations";
import { RegistrationForm } from "@/components/RegistrationForm";
import { EventsList } from "@/components/EventsList";
import { EventDetails } from "@/components/EventDetails";
import { Department } from "@/components/DepartmentGrid";
import { Event } from "@/data/events";
import { eventsByDepartment } from "@/data/events";
import { useNavigate } from "react-router-dom";

type ViewState =
  | { type: "home" }
  | { type: "events"; department: Department }
  | { type: "event-details"; event: Event }
  | { type: "registration"; event?: Event };

const Index = memo(() => {
  const [currentView, setCurrentView] = useState<ViewState>({ type: "home" });
  const navigate = useNavigate();

  // Initialize GSAP scroll animations for the landing page
  useGsapAnimations();

  const handleBackToHome = useCallback(() => {
    setCurrentView({ type: "home" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDepartmentSelect = useCallback((department: Department) => {
    setCurrentView({ type: "events", department });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleEventSelect = useCallback((event: Event) => {
    setCurrentView({ type: "event-details", event });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleEventRegister = useCallback((event?: Event) => {
    setCurrentView({ type: "registration", event });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBackToEvents = useCallback(() => {
    if (currentView.type === "event-details" || currentView.type === "registration") {
      const event = currentView.event;
      if (!event) {
        handleBackToHome();
        return;
      }
      const departmentId = event.department.toLowerCase().replace(/[^a-z]/g, "");
      const departmentMap: Record<string, Department> = Object.fromEntries(
        Object.entries(eventsByDepartment).map(([id, events]) => [
          events[0]?.department.toLowerCase().replace(/[^a-z]/g, ""),
          { id, name: events[0]?.department || id, eventCount: events.length, eventNames: events.map(event => event.name) }
        ])
      );
      const department = departmentMap[departmentId];
      if (department) {
        setCurrentView({ type: "events", department });
      } else {
        handleBackToHome();
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView, handleBackToHome]);

  // Sub-views
  if (currentView.type === "registration") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <RegistrationForm
          eventTitle={currentView.event?.name}
          onBack={currentView.event ? handleBackToEvents : handleBackToHome}
          showFooter={false}
        />
        <FooterLanding />
      </div>
    );
  }

  if (currentView.type === "events") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <EventsList
          department={currentView.department}
          onBack={handleBackToHome}
          onEventSelect={handleEventSelect}
        />
        <FooterLanding />
      </div>
    );
  }

  if (currentView.type === "event-details") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <EventDetails
          event={currentView.event}
          onBack={handleBackToEvents}
          onRegister={() => handleEventRegister(currentView.event)}
        />
        <FooterLanding />
      </div>
    );
  }

  // Main Home Landing View with Award-Winning Components
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <HeroLanding />
      <Ticker />
      <BriefingSection />
      <DepartmentExplorer />
      <ScheduleTimeline />
      <WhyAttendSection />
      <FAQSection />
      <VenueSection />
      <SeamDivider />
      <RegisterCTA />
      <FooterLanding />

      {/* Floating Quick Registration Action Button */}
      <div className="fixed bottom-6 right-6 z-[400] hidden sm:block">
        <button
          onClick={() => navigate('/register')}
          className="btn-jade-primary shadow-2xl py-3 px-6 text-sm font-bold flex items-center gap-2 border border-[#BAC8B1] animate-bounce"
        >
          <span>⚡ Quick Register</span>
          <span className="text-xs font-mono bg-white text-[#404E3B] px-2 py-0.5 rounded-full">₹1.5L Pool</span>
        </button>
      </div>
    </div>
  );
});

export default Index;