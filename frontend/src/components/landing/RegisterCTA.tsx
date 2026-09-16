import { useNavigate } from 'react-router-dom';

export const RegisterCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 border-b border-[#E6E6E6] relative overflow-hidden bg-[#F1F5EE]/80" id="register">
      {/* Canvas Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#E2EBE0] blur-[90px] pointer-events-none" />

      <div className="wrap relative z-10 text-center max-w-[800px]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#BAC8B1] text-[#404E3B] font-mono text-xs font-bold tracking-wide mb-6">
          <span className="w-2 h-2 rounded-full bg-[#7B9669] animate-pulse" />
          <span>JOIN THE COMPETITION</span>
        </div>

        <h2 className="section-title text-[#404E3B] mb-4">
          Ready to Showcase Your Technical Skills?
        </h2>

        <p className="text-[#2E382A] text-base sm:text-lg leading-relaxed mb-8 max-w-[600px] mx-auto">
          Whether you are competing solo in coding or building a multi-department team for robotics, registration takes less than 3 minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/register"
            onClick={(e) => { e.preventDefault(); navigate('/register'); }}
            className="btn-jade-primary text-base py-3.5 px-8 w-full sm:w-auto"
          >
            <span>Register Your Team</span>
            <span className="text-lg">⚡</span>
          </a>

          <a
            href="#tracks"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-jade-dark text-base py-3.5 px-8 w-full sm:w-auto"
          >
            <span>Browse All 15+ Events</span>
          </a>
        </div>

        <div className="mt-8 font-mono text-xs font-semibold text-[#6C8480] tracking-wider">
          ADCET CAMPUS • ASHTA, SANGLI • 29TH SEPTEMBER 2026
        </div>
      </div>
    </section>
  );
};
