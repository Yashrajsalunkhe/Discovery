import { useNavigate } from 'react-router-dom';

export const RegisterCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-[140px] max-md:py-[80px] max-sm:py-[64px] border-b border-slate-200 relative overflow-hidden bg-slate-50" id="register">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            repeating-linear-gradient(0deg, rgba(148,163,184,0.08) 0 1px, transparent 1px 64px),
            repeating-linear-gradient(90deg, rgba(148,163,184,0.08) 0 1px, transparent 1px 64px)
          `,
        }}
      />
      <div className="wrap relative z-[1] text-center">
        <div className="eyebrow justify-center mb-6 text-slate-500">
          <span className="dot" />FILE 05 — REGISTRATION
        </div>
        <h2
          className="font-display font-extrabold leading-[1.02] max-w-[900px] mx-auto text-slate-900"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
        >
          Pick your station.{' '}
          <span className="hidden sm:inline"><br /></span>
          Bring your <span className="text-indigo-600">team</span>.
        </h2>
        <p className="mx-auto mt-[26px] max-w-[460px] text-slate-600 text-base">
          Solo or squad, first-year or final-year — every track sets its own team size in its rulebook. Registration takes under five minutes.
        </p>
        <div className="flex justify-center gap-[22px] max-sm:gap-3 mt-11 max-sm:mt-8 flex-wrap max-[475px]:flex-col max-[475px]:items-stretch max-[475px]:px-4">
          <a
            href="/register"
            onClick={(e) => { e.preventDefault(); navigate('/register'); }}
            className="btn-primary"
          >
            <span>Register a Team</span>
          </a>
          <a href="#" className="btn-ghost">Download Brochure</a>
        </div>
        <div className="mt-9 max-sm:mt-6 font-mono text-[12.5px] max-sm:text-[11px] tracking-[.1em] text-slate-500 max-sm:px-4">
          REGISTRATIONS CLOSE 48 HOURS BEFORE GATE OPEN
        </div>
      </div>
    </section>
  );
};
