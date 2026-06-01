import { ACHIEVED, MAY_FIRST_DOW, TODAY, WEEKDAYS } from '../data';
import { IconChart, IconCheckCircle, IconClock, IconDots, IconFlame, IconGift, IconShield } from '../icons';
import { useStore } from '../store';
import { Card } from '../components/ui/Card';
import { Gauge } from '../components/ui/Gauge';
import { ShardCounter } from '../components/ui/ShardCounter';
import { StatChip } from '../components/ui/StatChip';
import { TabletHeader } from '../components/TabletHeader';

function CalendarCell({ day }: { day: number | null }) {
  if (!day) return <div />;
  const achieved = ACHIEVED.has(day);
  const isToday = day === TODAY;
  return (
    <div style={{ aspectRatio: '1', display: 'grid', placeItems: 'center' }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          display: 'grid',
          placeItems: 'center',
          fontSize: 14,
          fontWeight: achieved ? 500 : 400,
          color: achieved ? 'var(--mint-deep)' : isToday ? 'var(--coral)' : 'var(--text-3)',
          background: achieved ? 'var(--mint)' : 'transparent',
          boxShadow: isToday ? 'inset 0 0 0 1.5px var(--coral)' : 'none',
        }}
      >
        {day}
      </div>
    </div>
  );
}

const CHECKLIST = [
  { t: '수학 문제집 20문제', done: true },
  { t: '영어 단어 30개', done: true },
  { t: '국어 지문 분석', done: false },
];

export function StreakHome() {
  const { streak, shards, shields } = useStore();
  const cells: (number | null)[] = [];
  for (let i = 0; i < MAY_FIRST_DOW; i++) cells.push(null);
  for (let d = 1; d <= 31; d++) cells.push(d);

  return (
    <div className="scroll" style={{ height: '100%', overflowY: 'auto', paddingBottom: 28 }}>
      <TabletHeader title="잘하고 있어요" sub="2026년 5월 · 다인 학생" right={<ShardCounter value={shards} />} />

      <div style={{ padding: '0 32px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
        {/* 좌측 컬럼 */}
        <div style={{ flex: 1.35, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* 상단 2카드 */}
          <div style={{ display: 'flex', gap: 16 }}>
            <Card
              pad={18}
              style={{
                flex: 1,
                background: 'radial-gradient(120% 100% at 0% 0%, rgba(240,153,123,0.16), var(--card) 60%)',
                borderColor: 'var(--coral-soft)',
              }}
            >
              <div style={{ color: 'var(--coral)', marginBottom: 10 }}>
                <IconFlame size={30} />
              </div>
              <div style={{ fontSize: 36, fontWeight: 500, color: 'var(--text)', lineHeight: 1 }}>
                {streak}
                <span style={{ fontSize: 17, color: 'var(--text-2)' }}>일</span>
              </div>
              <div className="t-cap" style={{ marginTop: 8 }}>
                연속 달성 중
              </div>
            </Card>
            <Card pad={18} style={{ flex: 1 }}>
              <div style={{ color: 'var(--mint)', marginBottom: 10 }}>
                <IconClock size={30} />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 500, color: 'var(--text)', lineHeight: 1 }}>45</span>
                <span style={{ fontSize: 14, color: 'var(--text-3)' }}>/ 120분</span>
              </div>
              <div style={{ marginTop: 14 }}>
                <Gauge value={37.5} />
              </div>
              <div className="t-cap" style={{ marginTop: 8 }}>
                오늘 순공시간
              </div>
            </Card>
          </div>

          {/* 캘린더 */}
          <Card pad={20}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="t-h">5월</span>
              <span className="t-cap">목표 달성한 날을 모았어요</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 6 }}>
              {WEEKDAYS.map((w, i) => (
                <div
                  key={w}
                  style={{
                    textAlign: 'center',
                    fontSize: 12,
                    color: i === 0 ? 'var(--coral)' : 'var(--text-3)',
                    paddingBottom: 6,
                  }}
                >
                  {w}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', rowGap: 4 }}>
              {cells.map((d, i) => (
                <CalendarCell key={i} day={d} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 18, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--divider)' }}>
              <span className="t-cap" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 4, background: 'var(--mint)' }} /> 달성
              </span>
              <span className="t-cap" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 4, boxShadow: 'inset 0 0 0 1.5px var(--coral)' }} /> 오늘
              </span>
            </div>
          </Card>
        </div>

        {/* 우측 컬럼 */}
        <div style={{ width: 360, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* 오늘의 학습 체크리스트 */}
          <Card pad={20}>
            <div className="t-h" style={{ marginBottom: 14 }}>
              오늘의 학습
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {CHECKLIST.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 0' }}>
                  <span style={{ color: c.done ? 'var(--mint)' : 'var(--text-3)', flexShrink: 0 }}>
                    {c.done ? <IconCheckCircle size={22} /> : <IconDots size={22} />}
                  </span>
                  <span style={{ flex: 1, fontSize: 14, color: c.done ? 'var(--text-2)' : 'var(--text)' }}>{c.t}</span>
                  <span className="t-cap" style={{ color: c.done ? 'var(--mint)' : 'var(--coral)' }}>
                    {c.done ? '완료' : '진행중'}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* 하단 지표 3개 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <StatChip label="이번 달 달성률" value="87%" icon={<IconChart size={15} />} />
            <StatChip label="보상 가능" value="1회" accent="var(--coral)" icon={<IconGift size={15} />} />
            <StatChip label="보호막" value={shields} accent="var(--mint)" icon={<IconShield size={15} />} />
          </div>
        </div>
      </div>
    </div>
  );
}
