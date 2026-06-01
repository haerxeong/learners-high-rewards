import type { ReactNode } from 'react';

interface TabletHeaderProps {
  title: string;
  sub?: string;
  right?: ReactNode;
}

/* 태블릿 상단 헤더 (가로 레이아웃 기준, 상태바 여백 없음) */
export function TabletHeader({ title, sub, right }: TabletHeaderProps) {
  return (
    <div
      style={{
        padding: '26px 32px 18px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {sub && (
          <div className="t-cap" style={{ marginBottom: 4 }}>
            {sub}
          </div>
        )}
        <div className="t-title" style={{ fontSize: 26 }}>
          {title}
        </div>
      </div>
      {right}
    </div>
  );
}
