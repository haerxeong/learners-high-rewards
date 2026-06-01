import type { ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  maxWidth?: number;
  gold?: boolean;
}

export function Modal({ children, onClose, maxWidth = 360, gold }: ModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        background: gold ? 'rgba(20,14,2,0.7)' : 'rgba(7,10,15,0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 22,
        animation: 'fadeIn .2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth,
          background: 'var(--card)',
          border: `1px solid ${gold ? 'var(--gold-soft)' : 'var(--divider-strong)'}`,
          borderRadius: 24,
          boxShadow: 'var(--shadow-pop)',
          overflow: 'hidden',
          animation: 'popIn .34s cubic-bezier(.2,.9,.3,1.2)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
