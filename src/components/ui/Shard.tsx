/* 조각 아이콘 (마름모) */
export function Shard({ size = 14, color = 'var(--mint)' }: { size?: number; color?: string }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: color,
        display: 'inline-block',
        transform: 'rotate(45deg)',
        flexShrink: 0,
        boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.18)',
      }}
    />
  );
}
