interface SeamDividerProps {
  label?: string;
}

export const SeamDivider = ({ label = 'SIGNAL BOOSTED — ENTERING REGISTRATION ZONE' }: SeamDividerProps) => {
  return (
    <div className="relative h-[74px] bg-panel border-t border-b border-line overflow-hidden">
      <div
        className="absolute top-0 -left-[10%] w-[120%] h-[200%] bg-ink"
        style={{ transform: 'skewY(-2.2deg)', transformOrigin: 'top left' }}
      />
      <div className="relative z-[1] h-full flex items-center justify-center font-mono text-[11.5px] tracking-[.16em] text-paper-mute">
        {label}
      </div>
    </div>
  );
};
