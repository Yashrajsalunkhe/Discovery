import { Code2, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Main content */}
          <div className="flex items-center space-x-2 text-center">
            <span className="text-gray-300 text-sm">Crafted with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="text-gray-300 text-sm">by</span>
          </div>

          {/* Developers */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-2">
              <Code2 className="h-4 w-4 text-blue-400" />
              <span className="font-semibold text-white">Aditya Padale</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <Code2 className="h-4 w-4 text-green-400" />
              <span className="font-semibold text-white">Yashraj Salunkhe</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Discovery ADCET. All rights reserved.
          </div>

          {/* Big DISCOVERY typography like NEUROVERSE */}
          <div className="pt-4 border-t border-gray-700/50 w-full relative flex flex-col sm:flex-row items-center justify-center gap-4 overflow-hidden select-none">
            <h1 className="font-display font-black text-[#FFCC00] uppercase text-[10vw] xl:text-[120px] leading-none tracking-tighter drop-shadow-[4px_4px_0px_#0F1115] [-webkit-text-stroke:2px_#0F1115] text-center w-full">
              DISCOVERY.
            </h1>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="sm:absolute right-0 bottom-1 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFCC00] text-[#0F1115] border-2 border-[#0F1115] shadow-[2px_2px_0px_#0F1115] flex items-center justify-center font-black text-lg hover:bg-white transition-all shrink-0"
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
