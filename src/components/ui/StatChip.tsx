import type { ReactNode } from 'react';

interface StatChipProps {
  label: string;
  value: ReactNode;
  accent?: string;
  icon?: ReactNode;
}

export function StatChip({ label, value, accent = 'var(--mint)', icon }: StatChipProps) {
  return (
    <div
      style={{
        flex: 1,
        background: 'var(--card-soft)',
        border: '1px solid var(--divider)',
        borderRadius: 14,
        padding: '11px 12px',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: accent, marginBottom: 5 }}>
        {icon}
        <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--text)' }}>{value}</span>
      </div>
      <div className="t-cap" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {label}
      </div>
    </div>
  );
}
