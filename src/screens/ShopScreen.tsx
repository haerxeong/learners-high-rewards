import { useState } from 'react';
import { GRADES } from '../data';
import { useStore } from '../store';
import { Card } from '../components/ui/Card';
import { GradeBadge } from '../components/ui/GradeBadge';
import { Modal } from '../components/ui/Modal';
import { PillBtn } from '../components/ui/PillBtn';
import { ProductFace } from '../components/ui/ProductFace';
import { Shard } from '../components/ui/Shard';
import { ShardCounter } from '../components/ui/ShardCounter';
import { TabletHeader } from '../components/TabletHeader';
import type { ShopItem } from '../types';

const SHOP_ITEMS: ShopItem[] = [
  { id: 'sb', n: '스타벅스 아메리카노', e: '☕', grade: 'common', price: 100, cat: '음식', sold: false },
  { id: 'cu', n: '편의점 기프티콘 5천원', e: '🏪', grade: 'common', price: 100, cat: '음식', sold: false },
  { id: 'br', n: '베스킨라빈스 파인트', e: '🍨', grade: 'rare', price: 200, cat: '음식', sold: false },
  { id: 'cgv', n: 'CGV 영화 관람권', e: '🎬', grade: 'rare', price: 250, cat: '문화', sold: true },
  { id: 'chi', n: '치킨 기프티콘', e: '🍗', grade: 'epic', price: 500, cat: '음식', sold: false },
  { id: 'pizza', n: '피자 기프티콘', e: '🍕', grade: 'epic', price: 600, cat: '음식', sold: false },
  { id: 'air', n: '애플 에어팟', e: '🎧', grade: 'big', price: 5000, cat: '전자기기', sold: false },
  { id: 'dept', n: '백화점 상품권 10만원', e: '🏬', grade: 'big', price: 10000, cat: '문화', sold: false },
];

const CATS = ['전체', '음식', '문화', '전자기기'];

const SHOP_HISTORY = [
  { date: '5.24', n: '스타벅스 아메리카노', used: 100, status: '사용 완료' },
  { date: '5.18', n: '편의점 기프티콘 5천원', used: 100, status: '보관함' },
  { date: '5.09', n: '베스킨라빈스 파인트', used: 200, status: '사용 완료' },
];

function ShopCard({ item, balance, onExchange }: { item: ShopItem; balance: number; onExchange: (i: ShopItem) => void }) {
  const affordable = balance >= item.price && !item.sold;
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--divider)',
        borderRadius: 16,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 11,
        position: 'relative',
        opacity: item.sold ? 0.6 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <ProductFace emoji={item.e} bg={GRADES[item.grade].bg} size={54} radius={14} />
        <GradeBadge g={item.grade} />
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.35, minHeight: 36 }}>{item.n}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Shard size={13} color={GRADES[item.grade].color} />
        <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{item.price.toLocaleString()}</span>
      </div>
      {item.sold ? (
        <div
          style={{
            textAlign: 'center',
            padding: '10px 0',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.05)',
            fontSize: 12.5,
            color: 'var(--text-3)',
          }}
        >
          품절 · 다음 기회에
        </div>
      ) : (
        <PillBtn variant="coral" size="sm" full disabled={!affordable} onClick={() => onExchange(item)}>
          {affordable ? '교환하기' : '조각 부족'}
        </PillBtn>
      )}
    </div>
  );
}

export function ShopScreen() {
  const store = useStore();
  const { shards } = store;
  const [cat, setCat] = useState('전체');
  const [confirm, setConfirm] = useState<ShopItem | null>(null);

  const items = SHOP_ITEMS.filter((i) => cat === '전체' || i.cat === cat);

  function doExchange() {
    if (!confirm) return;
    store.addShards(-confirm.price);
    store.addInventory(confirm);
    store.pushExchange({ date: '5.29', n: confirm.n, used: confirm.price, status: '보관함' });
    setConfirm(null);
  }

  return (
    <div className="scroll" style={{ height: '100%', overflowY: 'auto', paddingBottom: 28 }}>
      <TabletHeader title="상점" sub="모은 조각으로 교환해요" right={<ShardCounter value={shards} />} />

      {/* 카테고리 칩 */}
      <div style={{ display: 'flex', gap: 8, padding: '4px 32px 16px' }}>
        {CATS.map((c) => {
          const on = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: 999,
                cursor: 'pointer',
                border: `1px solid ${on ? 'var(--mint-line)' : 'var(--divider)'}`,
                background: on ? 'var(--mint-soft)' : 'transparent',
                color: on ? 'var(--mint)' : 'var(--text-2)',
                fontSize: 13,
                fontWeight: on ? 500 : 400,
                fontFamily: 'var(--font)',
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '0 32px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
        {/* 상품 그리드 */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
          }}
        >
          {items.map((i) => (
            <ShopCard key={i.id} item={i} balance={shards} onExchange={setConfirm} />
          ))}
        </div>

        {/* 교환 내역 */}
        <div style={{ width: 320, flexShrink: 0 }}>
          <div className="t-cap" style={{ margin: '2px 2px 8px' }}>
            교환 내역
          </div>
          <Card pad={4} soft>
            {[...store.exchangeLog, ...SHOP_HISTORY].map((h, i, arr) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 12px',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--divider)' : 'none',
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--text-3)', width: 30 }}>{h.date}</span>
                <span style={{ flex: 1, fontSize: 12.5, color: 'var(--text-2)' }}>{h.n}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-3)' }}>
                  <Shard size={10} /> {h.used}
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    color: h.status === '보관함' ? 'var(--mint)' : 'var(--text-3)',
                    background: h.status === '보관함' ? 'var(--mint-soft)' : 'transparent',
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  {h.status}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* 교환 확인 모달 */}
      {confirm && (
        <Modal onClose={() => setConfirm(null)} maxWidth={340}>
          <div style={{ padding: '26px 22px 22px', textAlign: 'center' }}>
            <ProductFace
              emoji={confirm.e}
              bg={GRADES[confirm.grade].bg}
              size={72}
              radius={20}
              style={{ margin: '0 auto 16px' }}
            />
            <div className="t-title" style={{ fontSize: 17, marginBottom: 6 }}>
              {confirm.n}
            </div>
            <div className="t-body" style={{ marginBottom: 20 }}>
              {shards.toLocaleString()}조각 중{' '}
              <b style={{ color: 'var(--text)', fontWeight: 500 }}>{confirm.price.toLocaleString()}조각</b>을 사용합니다
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <PillBtn variant="ghost" full onClick={() => setConfirm(null)}>
                취소
              </PillBtn>
              <PillBtn variant="coral" full onClick={doExchange}>
                교환하기
              </PillBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
