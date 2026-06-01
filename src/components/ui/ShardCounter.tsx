/* 조각 카운터 (헤더 우측) */
export function ShardCounter({ value }: { value: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: 'var(--mint-soft)',
        border: '1px solid var(--mint-line)',
        borderRadius: 999,
        padding: '7px 13px 7px 11px',
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 6,
          display: 'inline-grid',
          placeItems: 'center',
          background: 'var(--mint)',
          color: 'var(--mint-deep)',
          fontSize: 11,
          fontWeight: 500,
          transform: 'rotate(45deg)',
        }}
      >
        <span style={{ transform: 'rotate(-45deg)' }}>◆</span>
      </span>
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{value}</span>
      <span className="t-cap">조각</span>
    </div>
  );
}
