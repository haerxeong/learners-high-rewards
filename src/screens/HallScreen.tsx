import { IconLock, IconTrophy } from '../icons';
import { useStore } from '../store';
import { ShardCounter } from '../components/ui/ShardCounter';
import { TabletHeader } from '../components/TabletHeader';

interface Winner {
  name: string;
  org: string;
  prize: string;
  e: string;
  days: number;
  ago: string;
}

const HALL_WINNERS: Winner[] = [
  { name: '이○○', org: '대치 OO학원', prize: '아이패드 프로', e: '📱', days: 41, ago: '2일 전' },
  { name: '박○○', org: '개인 학습자', prize: '에어팟 4세대', e: '🎧', days: 28, ago: '5일 전' },
  { name: '정○○', org: '분당 OO에듀', prize: '에어팟 맥스', e: '🎧', days: 36, ago: '6일 전' },
  { name: '최○○', org: '대치 OO학원', prize: '아이패드', e: '📱', days: 33, ago: '8일 전' },
  { name: '김○○', org: '개인 학습자', prize: '에어팟 4세대', e: '🎧', days: 24, ago: '11일 전' },
];

function WinnerCard({ w, mine }: { w: Winner; mine?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 15,
        borderRadius: 18,
        position: 'relative',
        overflow: 'hidden',
        background: mine
          ? 'radial-gradient(120% 120% at 0% 0%, rgba(250,199,117,0.2), var(--card) 65%)'
          : 'var(--card)',
        border: `1px solid ${mine ? 'var(--gold-soft)' : 'var(--divider)'}`,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 15,
          background: 'var(--big-bg)',
          display: 'grid',
          placeItems: 'center',
          fontSize: 26,
          flexShrink: 0,
          boxShadow: 'inset 0 0 0 1px var(--gold-soft)',
        }}
      >
        {w.e}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: 'var(--text)', marginBottom: 3 }}>
          {w.name} 학생 · <span style={{ color: 'var(--text-3)' }}>{w.org}</span>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--gold)' }}>{w.prize} 당첨</div>
        <div className="t-cap" style={{ marginTop: 2 }}>
          {w.days}일 연속 달성
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 9px',
            borderRadius: 999,
            background: 'var(--gold-soft)',
            color: 'var(--gold)',
            fontSize: 10,
            fontWeight: 500,
          }}
        >
          BIG
        </span>
        <div className="t-cap" style={{ marginTop: 6 }}>
          {mine ? '방금' : w.ago}
        </div>
      </div>
    </div>
  );
}

export function HallScreen() {
  const store = useStore();
  const mine = store.myHall;
  return (
    <div className="scroll" style={{ height: '100%', overflowY: 'auto', paddingBottom: 28 }}>
      <TabletHeader title="명예의 전당" sub="이번 달 BIG 리워드 당첨자" right={<ShardCounter value={store.shards} />} />

      <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 통계 배너 */}
        <div
          style={{
            borderRadius: 18,
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: 'radial-gradient(120% 120% at 100% 0%, rgba(250,199,117,0.18), var(--card) 64%)',
            border: '1px solid var(--gold-soft)',
          }}
        >
          <span style={{ color: 'var(--gold)' }}>
            <IconTrophy size={34} />
          </span>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 28, fontWeight: 500, color: 'var(--gold)' }}>{mine ? 13 : 12}명</span>
              <span className="t-body-s">이번 달 누적 당첨</span>
            </div>
            <div className="t-cap" style={{ marginTop: 2 }}>
              당신의 차례도 가까워지고 있어요
            </div>
          </div>
        </div>

        {/* 내 당첨 (있을 때) */}
        {mine && (
          <div>
            <div className="t-cap" style={{ margin: '2px 2px 8px', color: 'var(--gold)' }}>
              나의 당첨 🎉
            </div>
            <WinnerCard w={{ name: '나', org: '다인 학생', prize: mine.n, e: mine.e, days: 41, ago: '방금' }} mine />
          </div>
        )}

        {/* 당첨자 리스트 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {HALL_WINNERS.map((w, i) => (
            <WinnerCard key={i} w={w} />
          ))}
        </div>

        <div
          className="t-cap"
          style={{
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            opacity: 0.8,
            marginTop: 4,
          }}
        >
          <IconLock size={13} /> 개인정보 보호를 위해 이름은 일부만 표시됩니다
        </div>
      </div>
    </div>
  );
}
