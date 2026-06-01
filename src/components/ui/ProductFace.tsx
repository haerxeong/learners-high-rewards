import type { CSSProperties } from 'react';

interface ProductFaceProps {
  emoji: string;
  bg?: string;
  size?: number;
  radius?: number;
  style?: CSSProperties;
}

/* 상품 타일 (이모지 표현) */
export function ProductFace({ emoji, bg = 'var(--card-soft)', size = 56, radius = 16, style }: ProductFaceProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        display: 'grid',
        placeItems: 'center',
        fontSize: size * 0.5,
        flexShrink: 0,
        border: '1px solid var(--divider)',
        ...style,
      }}
    >
      {emoji}
    </div>
  );
}
