import { useState, useCallback, memo } from "react";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { DepartmentGrid, Department } from "@/components/DepartmentGrid";
import { EventsList } from "@/components/EventsList";
import { EventDetails } from "@/components/EventDetails";
import { ContactSection } from "@/components/ContactSection";
import { RegistrationForm } from "@/components/RegistrationForm";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { Footer } from "@/components/Footer";
import { Event } from "@/data/events";

type ViewState = 
  | { type: 'home' }
  | { type: 'events'; department: Department }
  | { type: 'event-details'; event: Event }
  | { type: 'registration'; event?: Event };

const Index = memo(() => {
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'home' });

  const handleExploreEvents = useCallback(() => {
    const departmentsSection = document.getElementById('departments');
    departmentsSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleDepartmentSelect = useCallback((department: Department) => {
    setCurrentView({ type: 'events', department });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleEventSelect = useCallback((event: Event) => {
    setCurrentView({ type: 'event-details', event });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleEventRegister = useCallback((event?: Event) => {
    setCurrentView({ type: 'registration', event });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGeneralRegister = useCallback(() => {
    setCurrentView({ type: 'registration' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentView({ type: 'home' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigation = useCallback((section: string) => {
    if (section === 'home') {
      handleBackToHome();
    } else if (section === 'registration') {
      setCurrentView({ type: 'registration' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Ensure we're on the home view first
      if (currentView.type !== 'home') {
        setCurrentView({ type: 'home' });
        // Wait for the view to change, then scroll
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [currentView.type, handleBackToHome]);

  const handleBackToEvents = useCallback(() => {
    if (currentView.type === 'event-details' || currentView.type === 'registration') {
      // Get the department from the event to go back to the right events list
      const event = currentView.event;
      const departmentId = event.department.toLowerCase().replace(/[^a-z]/g, '');
      
      // Find the matching department
      const departmentMap: Record<string, Department> = {
        'aeronauticalengineering': {
          id: 'aeronautical',
          name: 'Aeronautical Engineering',
          eventCount: 3
        },
        'mechanicalengineering': {
          id: 'mechanical',
          name: 'Mechanical Engineering', 
          eventCount: 3
        },
        'electricalengineering': {
          id: 'electrical',
          name: 'Electrical Engineering',
          eventCount: 3
        },
        'civilengineering': {
          id: 'civil',
          name: 'Civil Engineering',
          eventCount: 3
        },
        'computerscienceengineering': {
          id: 'cse',
          name: 'Computer Science Engineering',
          eventCount: 3
        },
        'aidatascience': {
          id: 'aids',
          name: 'AI & Data Science',
          eventCount: 3
        },
        'iotcybersecurity': {
          id: 'iot',
          name: 'IoT & Cyber Security',
          eventCount: 3
        },
        'businessadministration': {
          id: 'bba',
          name: 'Business Administration',
          eventCount: 1
        },
        'foodtechnology': {
          id: 'food',
          name: 'Food Technology',
          eventCount: 2
        }
      };

      const department = departmentMap[departmentId];
      if (department) {
        setCurrentView({ type: 'events', department });
      } else {
        handleBackToHome();
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, handleBackToHome]);

  if (currentView.type === 'registration') {
    return (
      <div className="min-h-screen flex flex-col">
        <FloatingNavbar onNavigate={handleNavigation} />
        <RegistrationForm 
          eventTitle={currentView.event?.name}
          onBack={currentView.event ? handleBackToEvents : handleBackToHome}
          showFooter={false}
        />
        <Footer />
      </div>
    );
  }

  if (currentView.type === 'events') {
    return (
      <div className="min-h-screen flex flex-col">
        <FloatingNavbar onNavigate={handleNavigation} />
        <EventsList 
          department={currentView.department}
          onBack={handleBackToHome}
          onEventSelect={handleEventSelect}
        />
        <Footer />
      </div>
    );
  }

  if (currentView.type === 'event-details') {
    return (
      <div className="min-h-screen flex flex-col">
        <FloatingNavbar onNavigate={handleNavigation} />
        <EventDetails 
          event={currentView.event}
          onBack={handleBackToEvents}
          onRegister={() => handleEventRegister(currentView.event)}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <FloatingNavbar onNavigate={handleNavigation} />
      <div id="home">
        <HeroSection 
          onExploreEvents={handleExploreEvents} 
          onRegister={handleGeneralRegister}
        />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <div id="events">
        <DepartmentGrid onDepartmentSelect={handleDepartmentSelect} />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
});

export default Index;