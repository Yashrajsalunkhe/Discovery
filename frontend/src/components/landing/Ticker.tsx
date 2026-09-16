export const Ticker = () => {
  const items = [
    { text: '28 EVENTS', bold: true },
    { text: '11 DEPARTMENTS', bold: true },
    { text: 'ONE DAY ON CAMPUS', bold: false },
    { text: 'ADCET, ASHTA', bold: false },
    { text: 'NATIONAL LEVEL', bold: false },
  ];

  // Duplicate for seamless scroll
  const track = [...items, ...items];

  return (
    <div className="border-b border-slate-200 bg-slate-50 overflow-hidden whitespace-nowrap py-3.5 max-sm:py-2.5">
      <div
        className="inline-flex ticker-track"
        style={{ animation: 'ticker 26s linear infinite' }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className="font-mono text-[13px] max-sm:text-[11px] tracking-[.1em] text-slate-600 px-[22px] max-sm:px-[14px] inline-flex items-center gap-[22px] max-sm:gap-[14px]"
          >
            {item.bold ? (
              <b className="text-indigo-600 font-semibold">{item.text}</b>
            ) : (
              item.text
            )}
            <span className="text-slate-300">—</span>
          </span>
        ))}
      </div>
    </div>
  );
};
