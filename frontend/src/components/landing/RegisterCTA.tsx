import { useNavigate } from 'react-router-dom';

export const RegisterCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-[140px] border-b border-line relative overflow-hidden" id="register">
      {/* Grid background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            repeating-linear-gradient(0deg, var(--line-soft) 0 1px, transparent 1px 64px),
            repeating-linear-gradient(90deg, var(--line-soft) 0 1px, transparent 1px 64px)
          `,
        }}
      />
      <div className="wrap relative z-[1] text-center">
        <div className="eyebrow justify-center mb-6">
          <span className="dot" />FILE 05 — REGISTRATION
        </div>
        <h2
          className="font-display font-extrabold leading-[1.02] max-w-[900px] mx-auto"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
        >
          Pick your station.<br />
          Bring your <span className="text-brass">team</span>.
        </h2>
        <p className="mx-auto mt-[26px] max-w-[460px] text-paper-dim text-base">
          Solo or squad, first-year or final-year — every track sets its own team size in its rulebook. Registration takes under five minutes.
        </p>
        <div className="flex justify-center gap-[22px] mt-11 flex-wrap">
          <a
            href="/register"
            onClick={(e) => { e.preventDefault(); navigate('/register'); }}
            className="btn-primary"
          >
            <span>Register a Team</span>
          </a>
          <a href="#" className="btn-ghost">Download Brochure</a>
        </div>
        <div className="mt-9 font-mono text-[12.5px] tracking-[.1em] text-paper-mute">
          REGISTRATIONS CLOSE 48 HOURS BEFORE GATE OPEN
        </div>
      </div>
    </section>
  );
};
