interface SeamDividerProps {
  label?: string;
}

export const SeamDivider = ({ label = 'SIGNAL BOOSTED — ENTERING REGISTRATION ZONE' }: SeamDividerProps) => {
  return (
    <div className="relative h-[74px] bg-slate-50 border-t border-b border-slate-200 overflow-hidden">
      <div
        className="absolute top-0 -left-[10%] w-[120%] h-[200%] bg-white"
        style={{ transform: 'skewY(-2.2deg)', transformOrigin: 'top left' }}
      />
      <div className="relative z-[1] h-full flex items-center justify-center font-mono text-[11.5px] tracking-[.16em] text-slate-500">
        {label}
      </div>
    </div>
  );
};
