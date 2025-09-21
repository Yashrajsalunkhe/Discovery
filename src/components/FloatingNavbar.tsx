import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Atom } from "lucide-react";

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

export const FloatingNavbar = ({ onNavigate }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    } else {
      // Default scroll behavior for sections
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/20 backdrop-blur-xl border border-white/40"
          : "bg-black/10 backdrop-blur-lg border border-white/30"
      } rounded-full px-3 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-6 max-w-[95vw] overflow-x-auto`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 text-white flex-shrink-0">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
          <Atom className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <span className="font-semibold text-sm sm:text-lg">Discovery</span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick("home")}
          className="text-white/90 hover:text-white hover:bg-white/5 rounded-full px-2 sm:px-4 py-1 sm:py-2 transition-all duration-200 text-xs sm:text-sm"
        >
          Home
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick("about")}
          className="text-white/90 hover:text-white hover:bg-white/5 rounded-full px-2 sm:px-4 py-1 sm:py-2 transition-all duration-200 text-xs sm:text-sm"
        >
          About
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick("events")}
          className="text-white/90 hover:text-white hover:bg-white/5 rounded-full px-2 sm:px-4 py-1 sm:py-2 transition-all duration-200 text-xs sm:text-sm"
        >
          Events
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick("registration")}
          className="text-white/90 hover:text-white hover:bg-white/5 rounded-full px-2 sm:px-4 py-1 sm:py-2 transition-all duration-200 text-xs sm:text-sm"
        >
          Register
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick("contact")}
          className="text-white/90 hover:text-white hover:bg-white/5 rounded-full px-2 sm:px-4 py-1 sm:py-2 transition-all duration-200 text-xs sm:text-sm"
        >
          Contact
        </Button>
      </div>
    </nav>
  );
};
