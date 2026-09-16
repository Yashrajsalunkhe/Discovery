import { useState, useCallback, memo } from "react";
import {
  Navbar,
  HeroLanding,
  Ticker,
  BriefingSection,
  DepartmentExplorer,
  ScheduleTimeline,
  WhyAttendSection,
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

type ViewState =
  | { type: "home" }
  | { type: "events"; department: Department }
  | { type: "event-details"; event: Event }
  | { type: "registration"; event?: Event };

const Index = memo(() => {
  const [currentView, setCurrentView] = useState<ViewState>({ type: "home" });

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

  const handleNavigation = useCallback(
    (section: string) => {
      if (section === "home") {
        handleBackToHome();
      } else if (section === "registration") {
        setCurrentView({ type: "registration" });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        if (currentView.type !== "home") {
          setCurrentView({ type: "home" });
          setTimeout(() => {
            document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        } else {
          document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [currentView.type, handleBackToHome]
  );

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

  // --- Sub-views use the new mission-control nav/footer ---
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

  // --- Home / Landing Page ---
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroLanding />
      <Ticker />
      <BriefingSection />
      <DepartmentExplorer />
      <ScheduleTimeline />
      <WhyAttendSection />
      <SeamDivider />
      <RegisterCTA />
      <FooterLanding />
    </div>
  );
});

export default Index;