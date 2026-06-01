import type { CSSProperties, ReactNode } from 'react';

type Variant = 'mint' | 'coral' | 'gold' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface PillBtnProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  full?: boolean;
}

const VARIANTS: Record<Variant, CSSProperties> = {
  mint: { background: 'var(--mint)', color: 'var(--mint-deep)' },
  coral: { background: 'var(--coral)', color: 'var(--coral-deep)' },
  gold: { background: 'var(--gold)', color: 'var(--gold-deep)' },
  ghost: { background: 'rgba(255,255,255,0.06)', color: 'var(--text)' },
  outline: { background: 'transparent', color: 'var(--mint)', boxShadow: 'inset 0 0 0 1px var(--mint-line)' },
};

export function PillBtn({ children, variant = 'mint', size = 'md', disabled, onClick, style, full }: PillBtnProps) {
  const v = VARIANTS[variant];
  const s: CSSProperties =
    size === 'lg'
      ? { padding: '16px 28px', fontSize: 16 }
      : size === 'sm'
        ? { padding: '8px 16px', fontSize: 12.5 }
        : { padding: '12px 22px', fontSize: 14 };
  return (
    <button
      className="pill"
      disabled={disabled}
      onClick={onClick}
      style={{ ...v, ...s, width: full ? '100%' : undefined, ...style }}
    >
      {children}
    </button>
  );
}
