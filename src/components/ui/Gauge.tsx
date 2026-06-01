interface GaugeProps {
  value: number;
  from?: string;
  to?: string;
  height?: number;
  track?: string;
}

export function Gauge({ value, from = 'var(--mint)', to = 'var(--blue)', height = 8, track }: GaugeProps) {
  return (
    <div className="gauge" style={{ height, background: track }}>
      <span style={{ width: `${Math.min(100, value)}%`, background: `linear-gradient(90deg, ${from}, ${to})` }} />
    </div>
  );
}
