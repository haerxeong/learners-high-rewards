import { useState } from 'react';
import { GRADES } from '../data';
import { IconBarcode, IconBox, IconGift } from '../icons';
import { useStore } from '../store';
import { Card } from '../components/ui/Card';
import { GradeBadge } from '../components/ui/GradeBadge';
import { PillBtn } from '../components/ui/PillBtn';
import { ProductFace } from '../components/ui/ProductFace';
import { ShardCounter } from '../components/ui/ShardCounter';
import { StatChip } from '../components/ui/StatChip';
import { TabletHeader } from '../components/TabletHeader';
import type { GradeKey } from '../types';

type StorageTab = 'usable' | 'used' | 'soon';

interface StorageItem {
  id: string | number;
  n: string;
  e: string;
  grade: GradeKey;
  got: string;
  exp: string;
  tab: StorageTab;
}

const STORAGE_ITEMS: StorageItem[] = [
  { id: 1, n: '편의점 기프티콘 5천원', e: '🏪', grade: 'common', got: '5.18', exp: '2026.11.18', tab: 'usable' },
  { id: 2, n: '베스킨라빈스 파인트', e: '🍨', grade: 'rare', got: '5.09', exp: '2026.08.09', tab: 'usable' },
  { id: 3, n: '스타벅스 아메리카노', e: '☕', grade: 'common', got: '5.24', exp: '2026.06.10', tab: 'soon' },
  { id: 4, n: 'CGV 영화 관람권', e: '🎬', grade: 'rare', got: '4.30', exp: '사용 완료', tab: 'used' },
  { id: 5, n: '치킨 기프티콘', e: '🍗', grade: 'epic', got: '4.12', exp: '사용 완료', tab: 'used' },
];

const STORAGE_TABS: { key: StorageTab; label: string }[] = [
  { key: 'usable', label: '사용 가능' },
  { key: 'used', label: '사용 완료' },
  { key: 'soon', label: '만료 예정' },
];

export function StorageScreen() {
  const store = useStore();
  const [tab, setTab] = useState<StorageTab>('usable');
  const extra = store.inventory;
  const all: StorageItem[] = [
    ...extra.map((it, i) => ({
      id: 'x' + i,
      n: it.n,
      e: it.e,
      grade: it.grade,
      got: '5.29',
      exp: '2026.11.29',
      tab: 'usable' as StorageTab,
    })),
    ...STORAGE_ITEMS,
  ];
  const items = all.filter((i) => i.tab === tab || (tab === 'usable' && i.tab === 'soon'));
  const usableCount = all.filter((i) => i.tab === 'usable' || i.tab === 'soon').length;

  return (
    <div className="scroll" style={{ height: '100%', overflowY: 'auto', paddingBottom: 28 }}>
      <TabletHeader title="보관함" sub="받은 기프티콘을 모았어요" right={<ShardCounter value={store.shards} />} />

      <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 요약 + 탭 */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 280 }}>
            <StatChip label="보유 기프티콘" value={`${usableCount}개`} icon={<IconBox size={15} />} />
            <StatChip label="이번 달 받은 보상" value="6개" accent="var(--coral)" icon={<IconGift size={15} />} />
          </div>
          <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--card-soft)', borderRadius: 14 }}>
            {STORAGE_TABS.map((t) => {
              const on = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    background: on ? 'var(--card)' : 'transparent',
                    fontFamily: 'var(--font)',
                    color: on ? 'var(--text)' : 'var(--text-3)',
                    fontSize: 12.5,
                    fontWeight: on ? 500 : 400,
                    boxShadow: on ? 'var(--shadow-card)' : 'none',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 항목 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {items.length === 0 && (
            <div
              style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--text-3)', fontSize: 13 }}
            >
              아직 항목이 없어요
            </div>
          )}
          {items.map((it) => {
            const used = it.tab === 'used';
            return (
              <Card
                key={it.id}
                pad={14}
                style={{ display: 'flex', gap: 13, alignItems: 'center', opacity: used ? 0.62 : 1 }}
              >
                <ProductFace emoji={it.e} bg={GRADES[it.grade].bg} size={54} radius={14} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                    <GradeBadge g={it.grade} />
                  </div>
                  <div style={{ fontSize: 13.5, color: 'var(--text)', marginBottom: 3 }}>{it.n}</div>
                  <div className="t-cap">{used ? `${it.got} 사용` : `받은 날 ${it.got} · 만료 ${it.exp}`}</div>
                </div>
                {!used && (
                  <PillBtn variant={it.tab === 'soon' ? 'coral' : 'mint'} size="sm" style={{ gap: 6 }}>
                    <IconBarcode size={15} /> 사용
                  </PillBtn>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
