import { useNavigate } from 'react-router-dom';

export const RegisterCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-24 bg-[#FAFAF8] text-[#0F1115] border-b-2 border-[#0F1115] relative overflow-hidden" id="register">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 relative z-10">

        {/* High Impact Yellow Editorial Banner Card */}
        <div className="bg-[#FFCC00] border-3 border-[#0F1115] shadow-[8px_8px_0px_#0F1115] p-8 sm:p-14 text-center relative overflow-hidden">

          {/* Section Tag */}
          <div className="inline-flex items-center gap-2 font-mono text-xs font-black tracking-widest bg-[#0F1115] text-[#FFCC00] px-3 py-1 mb-6">
            <span>FILE 05</span>
            <span>//</span>
            <span>FINAL REGISTRATION CALL</span>
          </div>

          <h2
            className="font-display font-black text-3xl sm:text-6xl uppercase tracking-tight text-[#0F1115] leading-[0.92] max-w-4xl mx-auto"
          >
            Pick your station. <br className="hidden sm:inline" />
            Bring your <span className="bg-[#FFFFFF] px-3 border-2 border-[#0F1115] inline-block">team.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl font-body text-base sm:text-lg text-[#0F1115] font-semibold leading-relaxed">
            Solo or squad, first-year or final-year — every track sets its team size in its rulebook. Registration takes under 3 minutes.
          </p>

          <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
            <a
              href="/register"
              onClick={(e) => { e.preventDefault(); navigate('/register'); }}
              className="font-mono text-sm font-black uppercase bg-[#0F1115] text-[#FFCC00] px-8 py-4 border-2 border-[#0F1115] shadow-[4px_4px_0px_#FFFFFF] hover:bg-white hover:text-[#0F1115] transition-all"
            >
              <span>Register a Team Now →</span>
            </a>
            <a
              href="#tracks"
              className="font-mono text-sm font-bold uppercase bg-white text-[#0F1115] px-8 py-4 border-2 border-[#0F1115] shadow-[4px_4px_0px_#0F1115] hover:bg-[#0F1115] hover:text-[#FFCC00] transition-all"
            >
              View Department Tracks
            </a>
          </div>

          <div className="mt-8 font-mono text-xs font-bold tracking-widest text-[#0F1115] uppercase bg-[#FFFFFF]/60 inline-block px-4 py-1 border border-[#0F1115]">
            REGISTRATIONS CLOSE 48 HOURS BEFORE GATE OPEN
          </div>

        </div>

      </div>
    </section>
  );
};
