import type { ComponentType } from 'react';
import type { IconProps } from '../icons';
import { IconBox, IconFlame, IconGift, IconSpark, IconStore, IconTrophy } from '../icons';
import type { TabKey } from '../types';

interface NavItem {
  key: TabKey;
  label: string;
  Icon: ComponentType<IconProps>;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '스트릭', Icon: IconFlame },
  { key: 'reward', label: '오늘의 보상', Icon: IconGift },
  { key: 'shop', label: '상점', Icon: IconStore },
  { key: 'storage', label: '보관함', Icon: IconBox },
  { key: 'hall', label: '명예의 전당', Icon: IconTrophy },
];

interface SideNavProps {
  active: TabKey;
  onChange: (key: TabKey) => void;
}

export function SideNav({ active, onChange }: SideNavProps) {
  return (
    <nav
      style={{
        width: 224,
        flexShrink: 0,
        background: 'rgba(13,17,23,0.6)',
        borderRight: '1px solid var(--divider)',
        display: 'flex',
        flexDirection: 'column',
        padding: '26px 16px',
      }}
    >
      {/* 로고 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 30 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: 'var(--mint)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--mint-deep)',
          }}
        >
          <IconSpark size={18} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>캡디 가챠</div>
          <div className="t-cap" style={{ fontSize: 10 }}>
            다인 학생
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(({ key, label, Icon }) => {
          const on = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font)',
                textAlign: 'left',
                background: on ? 'var(--mint-soft)' : 'transparent',
                color: on ? 'var(--mint)' : 'var(--text-3)',
                transition: 'background .15s, color .15s',
              }}
            >
              <Icon size={21} sw={on ? 1.9 : 1.6} />
              <span style={{ fontSize: 13.5, fontWeight: on ? 500 : 400 }}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* 하단 응원 */}
      <div style={{ marginTop: 'auto' }}>
        <div
          style={{
            background: 'var(--card-soft)',
            border: '1px solid var(--divider)',
            borderRadius: 14,
            padding: 14,
          }}
        >
          <div className="t-cap" style={{ lineHeight: 1.5 }}>
            오늘도 잘하고 있어요. 꾸준함이 보상이 돼요.
          </div>
        </div>
      </div>
    </nav>
  );
}
