export const Ticker = () => {
  const items = [
    { text: '24+ EVENTS', bold: true },
    { text: '10 DEPARTMENTS', bold: true },
    { text: 'ONE DAY ON CAMPUS', bold: false },
    { text: 'ADCET, ASHTA', bold: false },
    { text: 'NATIONAL LEVEL', bold: false },
  ];

  // Duplicate for seamless scroll
  const track = [...items, ...items];

  return (
    <div className="border-b border-line bg-panel overflow-hidden whitespace-nowrap py-3.5">
      <div
        className="inline-flex ticker-track"
        style={{ animation: 'ticker 26s linear infinite' }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className="font-mono text-[13px] tracking-[.1em] text-paper-dim px-[22px] inline-flex items-center gap-[22px]"
          >
            {item.bold ? (
              <b className="text-brass font-semibold">{item.text}</b>
            ) : (
              item.text
            )}
            <span className="text-line">—</span>
          </span>
        ))}
      </div>
    </div>
  );
};
