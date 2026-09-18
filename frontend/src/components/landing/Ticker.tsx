import React from 'react';

export const Ticker: React.FC = () => {
  const items = [
    { text: '28 EVENTS', bold: true },
    { text: '11 DEPARTMENTS', bold: true },
    { text: 'ONE DAY ON CAMPUS', bold: false },
    { text: 'ADCET, ASHTA', bold: false },
    { text: 'NATIONAL LEVEL', bold: false },
  ];

  // Duplicate for seamless scroll animation
  const track = [...items, ...items, ...items];

  return (
    <div className="relative border-y-2 border-[#0F1115] bg-[#FAFAF8] overflow-hidden py-3 flex items-center select-none z-20">
      {/* Left Editorial Fixed Tag */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-[#FFCC00] text-[#0F1115] border-r-2 border-[#0F1115] font-mono text-xs font-black tracking-widest shrink-0 z-10 shadow-[2px_0px_0px_#0F1115]">
        <svg className="w-3.5 h-3.5 fill-current animate-pulse" viewBox="0 0 24 24">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
        <span>LATEST UPDATES</span>
      </div>

      {/* Scrolling Track */}
      <div className="overflow-hidden w-full">
        <div
          className="inline-flex ticker-track items-center whitespace-nowrap"
          style={{ animation: 'ticker 22s linear infinite' }}
        >
          {track.map((item, i) => (
            <span
              key={i}
              className="font-mono text-[13px] max-sm:text-[11px] tracking-[.12em] text-[#0F1115] px-6 inline-flex items-center gap-4 uppercase font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-[#FFCC00] border border-[#0F1115] inline-block" />
              {item.bold ? (
                <b className="font-black text-[#0F1115] bg-[#FFCC00]/40 px-1.5 py-0.5 border border-[#0F1115]/30">
                  {item.text}
                </b>
              ) : (
                <span>{item.text}</span>
              )}
              <span className="text-[#0F1115]/30 font-bold">—</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right Scroll Indicator */}
      <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-[#0F1115] text-[#FAFAF8] border-l-2 border-[#0F1115] font-mono text-xs font-bold tracking-widest shrink-0 z-10">
        <span>SCROLL</span>
        <svg className="w-3.5 h-3.5 text-[#FFCC00] animate-bounce" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
};
