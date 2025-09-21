import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, Users, UserPlus } from "lucide-react";
import { memo } from "react";
import Galaxy from "./Galaxy";

interface HeroSectionProps {
  onExploreEvents: () => void;
  onRegister?: () => void;
}

export const HeroSection = memo(({ onExploreEvents, onRegister }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Galaxy Background - Always enabled for high performance */}
      <div className="absolute inset-0 z-0">
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={0.8}
          glowIntensity={0.2}
          saturation={0.4}
          hueShift={240}
          transparent={false}
          speed={0.5}
          rotationSpeed={0.05}
        />
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10 z-10" />
      
      {/* Main content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Main Title */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 tracking-tight">
            <span className="text-gradient">DISCOVERY</span>
            <br />
            <span className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-foreground">2K25</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg xs:text-xl md:text-2xl lg:text-3xl font-semibold text-foreground/90 mb-4 animate-slide-in-left px-2">
            National Level Technical Festival
          </p>
          
          {/* Event Details */}
          <div className="flex flex-col xs:flex-row xs:flex-wrap justify-center gap-3 xs:gap-4 md:gap-6 mb-6 sm:mb-8 animate-slide-in-right px-2">
            <div className="flex items-center justify-center gap-2 text-foreground/80 text-sm xs:text-base">
              <Calendar className="h-4 w-4 xs:h-5 xs:w-5 text-primary flex-shrink-0" />
              <span className="font-medium">11th October 2025</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-foreground/80 text-sm xs:text-base">
              <MapPin className="h-4 w-4 xs:h-5 xs:w-5 text-secondary flex-shrink-0" />
              <span className="font-medium">ADCET Campus, Ashta</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-foreground/80 text-sm xs:text-base">
              <Trophy className="h-4 w-4 xs:h-5 xs:w-5 text-accent flex-shrink-0" />
              <span className="font-medium">24+ Events</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-foreground/80 text-sm xs:text-base">
              <Users className="h-4 w-4 xs:h-5 xs:w-5 text-neon-orange flex-shrink-0" />
              <span className="font-medium">₹100/- per participant</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="animate-scale-in flex flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={onExploreEvents}
              className="animate-float flex-1 xs:flex-none xs:min-w-[180px] sm:min-w-[200px] text-sm sm:text-base py-2 xs:py-3 px-4 xs:px-6 sm:px-8"
            >
              <span className="hidden xs:inline">Explore Events</span>
              <span className="xs:hidden">Explore</span>
            </Button>
            {onRegister && (
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onRegister}
                className="animate-float border-primary text-primary hover:bg-primary hover:text-primary-foreground flex-1 xs:flex-none xs:min-w-[180px] sm:min-w-[200px] text-sm sm:text-base py-2 xs:py-3 px-4 xs:px-6 sm:px-8"
                style={{ animationDelay: '0.2s' }}
              >
                <UserPlus className="h-4 w-4 mr-1 xs:mr-2" />
                <span className="hidden xs:inline">Register Now</span>
                <span className="xs:hidden">Register</span>
              </Button>
            )}
          </div>
          
          {/* Organizing Institution */}
          <div className="mt-8 sm:mt-12 text-center animate-fade-in px-4">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Organized by</p>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">
              Annasaheb Dange College of Engineering and Technology, Ashta
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              NAAC A++ Accredited | Shivaji University Affiliated
            </p>
          </div>
        </div>
      </div>
      
      {/* Floating geometric elements - disabled for better performance */}
      {/* <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-lg animate-float z-15" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/20 rounded-full animate-float z-15" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-accent/20 rotate-45 animate-float z-15" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-neon-orange/20 rounded-lg animate-float z-15" style={{ animationDelay: '0.5s' }} /> */}
    </section>
  );
});