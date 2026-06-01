/* icons.tsx — 라인 아이콘 세트 (currentColor 기반) */
import type { ReactNode, CSSProperties } from 'react';

export interface IconProps {
  size?: number;
  sw?: number;
  style?: CSSProperties;
}

interface IcProps extends IconProps {
  d?: string;
  fill?: string;
  children?: ReactNode;
  vb?: number;
}

export function Ic({ d, size = 22, sw = 1.6, fill = 'none', children, vb = 24, style }: IcProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${vb} ${vb}`}
      fill={fill}
      stroke={fill === 'none' ? 'currentColor' : 'none'}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {d ? <path d={d} /> : children}
    </svg>
  );
}

export const IconFlame = (p: IconProps) => (
  <Ic {...p} d="M12 3c.5 3-2 4.5-2 7a2 2 0 104 0c1 1.2 2 2.6 2 4.5A6 6 0 116 13c1-2 2-2.5 2-4 1.2.8 1.6 2 1.6 2C10 8 11 5.5 12 3z" />
);
export const IconClock = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M12 7.5V12l3 1.8" />
  </Ic>
);
export const IconGift = (p: IconProps) => (
  <Ic {...p}>
    <rect x="4" y="9" width="16" height="11.5" rx="2" />
    <path d="M3.5 9h17M12 9v11.5M12 9c-1.5-3.5-5.5-3.8-5.5-1.2 0 1.6 3 1.2 5.5 1.2zM12 9c1.5-3.5 5.5-3.8 5.5-1.2 0 1.6-3 1.2-5.5 1.2z" />
  </Ic>
);
export const IconShield = (p: IconProps) => (
  <Ic {...p} d="M12 3l7 2.5v5.5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V5.5L12 3z" />
);
export const IconShieldCheck = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 3l7 2.5v5.5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V5.5L12 3z" />
    <path d="M8.8 11.8l2.2 2.2 4-4.4" />
  </Ic>
);
export const IconCheck = (p: IconProps) => <Ic {...p} d="M5 12.5l4.5 4.5L19 7" />;
export const IconCheckCircle = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M8.4 12.2l2.4 2.4 4.6-5" />
  </Ic>
);
export const IconCircle = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="8.2" />
  </Ic>
);
export const IconDots = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M9 12.5l2 2 4-4.5" stroke="currentColor" strokeDasharray="2 2.4" />
  </Ic>
);
export const IconCalendar = (p: IconProps) => (
  <Ic {...p}>
    <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
    <path d="M4 9.5h16M8.5 3.5v4M15.5 3.5v4" />
  </Ic>
);
export const IconStore = (p: IconProps) => (
  <Ic {...p}>
    <path d="M5 9.5V20h14V9.5" />
    <path d="M3.5 5h17l1 4.2a2.6 2.6 0 01-5.1.5 2.6 2.6 0 01-5.2 0 2.6 2.6 0 01-5.1-.5L3.5 5z" />
    <path d="M10 20v-5h4v5" />
  </Ic>
);
export const IconBox = (p: IconProps) => (
  <Ic {...p}>
    <path d="M4 8.2l8-4 8 4v7.6l-8 4-8-4V8.2z" />
    <path d="M4 8.2l8 4 8-4M12 12.2V20" />
  </Ic>
);
export const IconTrophy = (p: IconProps) => (
  <Ic {...p}>
    <path d="M7 4.5h10v4a5 5 0 01-10 0v-4z" />
    <path d="M7 6H4.5v1.5A3 3 0 007 10.4M17 6h2.5v1.5A3 3 0 0117 10.4M9.5 14.5h5l-.6 3h-3.8l-.6-3zM8 20h8" />
  </Ic>
);
export const IconUser = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="8.5" r="3.6" />
    <path d="M5.5 19.5a6.5 6.5 0 0113 0" />
  </Ic>
);
export const IconSpark = (p: IconProps) => (
  <Ic {...p} d="M12 3.5l1.7 5.3 5.3 1.7-5.3 1.7L12 17.5l-1.7-5.3L5 10.5l5.3-1.7L12 3.5z" />
);
export const IconChevR = (p: IconProps) => <Ic {...p} d="M9 5l7 7-7 7" />;
export const IconChevL = (p: IconProps) => <Ic {...p} d="M15 5l-7 7 7 7" />;
export const IconShare = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="6.5" cy="12" r="2.4" />
    <circle cx="17.5" cy="6" r="2.4" />
    <circle cx="17.5" cy="18" r="2.4" />
    <path d="M8.7 10.9l6.6-3.6M8.7 13.1l6.6 3.6" />
  </Ic>
);
export const IconCamera = (p: IconProps) => (
  <Ic {...p}>
    <path d="M4 8.5h3l1.5-2h7L17 8.5h3v11H4v-11z" />
    <circle cx="12" cy="13.5" r="3.2" />
  </Ic>
);
export const IconBarcode = (p: IconProps) => (
  <Ic {...p}>
    <path d="M4 6v12M7 6v12M9.5 6v12M12.5 6v12M14.5 6v12M17 6v12M20 6v12" />
  </Ic>
);
export const IconX = (p: IconProps) => <Ic {...p} d="M6 6l12 12M18 6L6 18" />;
export const IconChart = (p: IconProps) => (
  <Ic {...p}>
    <path d="M4 4v16h16" />
    <path d="M7.5 14l3-3.5 3 2.5 4-5.5" />
  </Ic>
);
export const IconArrowUp = (p: IconProps) => <Ic {...p} d="M12 19V5M6 11l6-6 6 6" />;
export const IconBook = (p: IconProps) => (
  <Ic {...p}>
    <path d="M5 4.5h9a3 3 0 013 3V20a2.5 2.5 0 00-2.5-2.5H5V4.5z" />
    <path d="M5 4.5v13" />
  </Ic>
);
export const IconLock = (p: IconProps) => (
  <Ic {...p}>
    <rect x="5.5" y="10.5" width="13" height="9" rx="2.2" />
    <path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" />
  </Ic>
);
