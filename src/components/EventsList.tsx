import { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Event, getEventsByDepartment } from "@/data/events";
import { Department } from "./DepartmentGrid";
import "./EventCard.css";

interface EventsListProps {
  department: Department;
  onBack: () => void;
  onEventSelect: (event: Event) => void;
}

export const EventsList = memo(({ department, onBack, onEventSelect }: EventsListProps) => {
  const events = getEventsByDepartment(department.id);

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <Button variant="ghost" onClick={onBack} className="hover:bg-primary/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Departments
          </Button>
        </div>
        
        <div className="text-center mb-8 sm:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gradient">
            {department.name}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Choose from {events.length} exciting events in this department
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {events.map((event, index) => (
            <article 
              key={event.id}
              className="card"
              onClick={() => onEventSelect(event)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                className="card__background"
                src={event.image || "/event-images/placeholder.svg"}
                alt={`${event.name} event`}
                width="1920"
                height="2193"
              />
                            <div className="card__content | flow">
                <div className="card__content--container | flow">
                  <h2 className="card__title">{event.name}</h2>
                  <p className="card__description">
                    {event.description || "Click to view detailed rules and information"}
                  </p>
                </div>
                <button className="card__button">View Details</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});