import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAllEvents, Event } from "@/data/events";
import { EventDetails } from "@/components/EventDetails";
import { Navbar, FooterLanding } from "@/components/landing";

export const EventDetailPage = () => {
  const { deptId, eventId } = useParams<{ deptId?: string; eventId?: string }>();
  const navigate = useNavigate();

  const allEvents = getAllEvents();
  const event: Event | undefined = allEvents.find((e) => e.id === eventId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [eventId]);

  const handleBack = () => {
    if (deptId) {
      navigate(`/department/${deptId}`);
    } else if (event) {
      // Find department key from event department string
      const deptKey = event.department.toLowerCase().replace(/[^a-z]/g, "");
      navigate(`/department/${deptKey}`);
    } else {
      navigate("/");
    }
  };

  const handleRegister = () => {
    if (event) {
      navigate(`/register?event=${encodeURIComponent(event.name)}`);
    } else {
      navigate("/register");
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-display font-black text-[#0F1115] mb-4">Event Not Found</h1>
          <p className="text-[#0F1115]/70 mb-8">We couldn't find the requested event details.</p>
          <Button
            onClick={() => navigate("/")}
            className="bg-[#FFCC00] text-[#0F1115] hover:bg-[#0F1115] hover:text-[#FFCC00] font-mono font-bold border-2 border-[#0F1115] shadow-[3px_3px_0px_#0F1115]"
          >
            ← Return to Home
          </Button>
        </main>
        <FooterLanding />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Navbar />
      <main className="flex-1">
        <EventDetails event={event} onBack={handleBack} onRegister={handleRegister} />
      </main>
      <FooterLanding />
    </div>
  );
};

export default EventDetailPage;
