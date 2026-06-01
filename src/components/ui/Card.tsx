import type { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  soft?: boolean;
  pad?: number;
  style?: CSSProperties;
  onClick?: () => void;
  className?: string;
}

export function Card({ children, soft, pad = 16, style, onClick, className = '' }: CardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: soft ? 'var(--card-soft)' : 'var(--card)',
        border: '1px solid var(--divider)',
        borderRadius: 'var(--r-card)',
        padding: pad,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
