import { useEffect, useState } from 'react';
import { GRADES } from '../../data';
import { celebrate } from '../../lib/celebrate';
import { IconCheck, IconCheckCircle, IconGift, IconShieldCheck } from '../../icons';
import { useStore } from '../../store';
import { Card } from '../../components/ui/Card';
import { Gauge } from '../../components/ui/Gauge';
import { GradeBadge } from '../../components/ui/GradeBadge';
import { Modal } from '../../components/ui/Modal';
import { PillBtn } from '../../components/ui/PillBtn';
import { Shard } from '../../components/ui/Shard';
import { ShardCounter } from '../../components/ui/ShardCounter';
import { TabletHeader } from '../../components/TabletHeader';
import type { GradeKey } from '../../types';
import { ReflectionStory } from './ReflectionStory';

/* 시안 표기용 — 실제 확률은 서버가 내려준 값을 표시만 한다 (프론트 하드코딩 금지) */
const REWARD_ODDS: { g: GradeKey; pct: number }[] = [
  { g: 'common', pct: 70 },
  { g: 'rare', pct: 23 },
  { g: 'epic', pct: 5 },
  { g: 'big', pct: 2 },
];

interface PoolItem {
  n: string;
  e: string;
  shards: number;
}

type Phase = 'idle' | 'reflect' | 'spinning' | 'result';
interface RewardResult {
  g: GradeKey;
  item: PoolItem;
}

function OddsRow({ g, pct }: { g: GradeKey; pct: number }) {
  const grade = GRADES[g];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
      <span style={{ width: 8, height: 8, borderRadius: 3, background: grade.color, transform: 'rotate(45deg)' }} />
      <span style={{ fontSize: 12.5, color: 'var(--text-2)', flex: 1 }}>{grade.key === 'big' ? 'BIG' : grade.ko}</span>
      <span style={{ fontSize: 12.5, fontWeight: 500, color: grade.color }}>{pct}%</span>
    </div>
  );
}

export function RewardScreen({ onOpenBig }: { onOpenBig: () => void }) {
  const { shards, streak, claimed, shields, claimDaily, rewardLog, error } = useStore();
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<RewardResult | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const nextNeed = 23;
  const nextPct = 77;

  /* 결과 공개 순간 축포 */
  useEffect(() => {
    if (phase === 'result' && result) celebrate(result.g);
  }, [phase, result]);

  function claim() {
    if (claimed || phase !== 'idle') return;
    setPhase('reflect');
  }

  async function startSpin() {
    setPhase('spinning');
    setActionError(null);
    try {
      const reward = await claimDaily();
      window.setTimeout(() => {
        setResult(reward);
        setPhase('result');
      }, 700);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : '보상 수령에 실패했습니다.');
      setPhase('idle');
      setResult(null);
    }
  }

  function closeResult() {
    setPhase('idle');
    setResult(null);
  }

  function enterBig() {
    setPhase('idle');
    setResult(null);
    onOpenBig();
  }

  const btnLabel = claimed ? '내일 또 만나요' : phase === 'spinning' ? '두근두근…' : '보상 받기 ✨';

  return (
    <div className="scroll" style={{ height: '100%', overflowY: 'auto', paddingBottom: 28 }}>
      <TabletHeader title="오늘의 보상" sub="하루 한 번, 오늘의 나에게" right={<ShardCounter value={shards} />} />

      <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* 응원 문구 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--mint)' }}>
          <IconCheckCircle size={18} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>2시간 달성 완료 · 잘하고 있어요</span>
        </div>
        {(error || actionError) && (
          <div style={{ fontSize: 12.5, color: 'var(--coral)' }}>{actionError ?? error}</div>
        )}

        {/* 3열 메인 */}
        <div style={{ display: 'flex', gap: 18, alignItems: 'stretch' }}>
          {/* 좌: 다음 보상까지 */}
          <Card soft pad={20} style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <span className="t-cap">다음 보상까지</span>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{nextPct}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 38, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                {nextNeed}
              </span>
              <span style={{ fontSize: 15, color: 'var(--text-2)' }}>조각</span>
            </div>
            <Gauge value={nextPct} />
            <div className="t-cap" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shard size={11} /> 100조각 = 기프티콘 3,000원
            </div>
            <div style={{ flex: 1 }} />
            {/* 보호막 안내 */}
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                background: 'var(--mint-soft)',
                border: '1px solid var(--mint-line)',
                borderRadius: 16,
                padding: '13px 15px',
              }}
            >
              <span style={{ color: 'var(--mint)', flexShrink: 0 }}>
                <IconShieldCheck size={24} />
              </span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)' }}>보호막 {shields}개 보유</div>
                <div className="t-cap">하루 빠져도 연속 기록이 지켜져요</div>
              </div>
            </div>
          </Card>

          {/* 중앙: 보상 카드 (가장 크게) */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              position: 'relative',
              borderRadius: 22,
              padding: '40px 28px 32px',
              background: 'radial-gradient(120% 90% at 50% 0%, rgba(93,202,165,0.16), var(--card) 62%)',
              border: '1px solid var(--mint-line)',
              textAlign: 'center',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: '50%',
                margin: '0 auto 24px',
                display: 'grid',
                placeItems: 'center',
                position: 'relative',
                background: 'radial-gradient(circle at 50% 40%, rgba(93,202,165,0.28), rgba(93,202,165,0.06))',
                boxShadow: 'inset 0 0 0 1px var(--mint-line)',
              }}
            >
              {phase === 'spinning' &&
                [0, 0.4, 0.8].map((delay) => (
                  <span
                    key={delay}
                    className="animate-burstRing"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: '2px solid var(--mint)',
                      animationDelay: `${delay}s`,
                    }}
                  />
                ))}
              <div
                style={{ color: 'var(--mint)', position: 'relative' }}
                className={phase === 'spinning' ? 'animate-charge' : 'animate-floatY'}
              >
                <IconGift size={80} sw={1.4} />
              </div>
            </div>
            <div style={{ maxWidth: 340, margin: '0 auto', width: '100%' }}>
              <PillBtn variant="mint" size="lg" full disabled={claimed || phase !== 'idle'} onClick={claim}>
                {btnLabel}
              </PillBtn>
            </div>
            <div className="t-cap" style={{ marginTop: 14 }}>
              하루 한 번 무료 · 순공 2시간 달성 시
            </div>
          </div>

          {/* 우: 부스트 + 확률 */}
          <Card pad={20} style={{ width: 300, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, background: 'var(--mint-soft)', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--mint)' }}>+2.3%</div>
                <div className="t-cap">확률 부스트</div>
              </div>
              <div style={{ flex: 1, background: 'var(--coral-soft)', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--coral)' }}>{streak}일</div>
                <div className="t-cap">연속 달성 중</div>
              </div>
            </div>
            <div className="t-cap" style={{ marginBottom: 4 }}>
              등급별 확률
            </div>
            {REWARD_ODDS.map((o) => (
              <OddsRow key={o.g} {...o} />
            ))}
            <div
              className="t-cap"
              style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, opacity: 0.8 }}
            >
              <IconCheck size={13} /> 확률은 상시 공개됩니다
            </div>
          </Card>
        </div>

        {/* 최근 보상 기록 */}
        <div>
          <div className="t-cap" style={{ margin: '4px 2px 8px' }}>
            최근 보상 기록
          </div>
          <Card pad={4} soft>
            {rewardLog.map((r, i, arr) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '13px 14px',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--divider)' : 'none',
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--text-3)', width: 34 }}>{r.date}</span>
                <GradeBadge g={r.grade} />
                <span style={{ flex: 1, fontSize: 13, color: 'var(--text-2)' }}>{r.name}</span>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.time}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* 오늘의 회고 (보상 전 단계) */}
      {phase === 'reflect' && <ReflectionStory onComplete={startSpin} onClose={() => setPhase('idle')} />}

      {/* 결과 모달 */}
      {phase === 'result' && result && (
        <RewardResultModal result={result} onClose={closeResult} onEnterBig={enterBig} />
      )}
    </div>
  );
}

/* 보상 결과 모달 */
function RewardResultModal({
  result,
  onClose,
  onEnterBig,
}: {
  result: RewardResult;
  onClose: () => void;
  onEnterBig: () => void;
}) {
  const { g, item } = result;
  const grade = GRADES[g];
  const isBig = g === 'big';
  return (
    <Modal onClose={isBig ? undefined : onClose} gold={isBig} maxWidth={340}>
      <div style={{ padding: '30px 24px 24px', textAlign: 'center' }}>
        <div className="t-cap" style={{ marginBottom: 16 }}>
          {isBig ? '특별한 순간이 도착했어요' : '오늘의 보상이 도착했어요'}
        </div>
        <div style={{ position: 'relative', width: 104, height: 104, margin: '0 auto 18px' }}>
          <span
            aria-hidden
            className="animate-auraPulse"
            style={{
              position: 'absolute',
              inset: -16,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${grade.color} 0%, transparent 68%)`,
            }}
          />
          <div
            style={{
              position: 'relative',
              width: 104,
              height: 104,
              borderRadius: isBig ? '50%' : 24,
              background: grade.bg,
              display: 'grid',
              placeItems: 'center',
              fontSize: 46,
              boxShadow: `inset 0 0 0 1.5px ${grade.color}`,
              animation: isBig ? 'pulseBig 1.6s ease-in-out infinite' : 'revealPop .6s cubic-bezier(.2,.8,.2,1)',
            }}
          >
            {item.e}
          </div>
        </div>
        <div style={{ marginBottom: 6 }}>
          <GradeBadge g={g} />
        </div>
        <div className="t-title" style={{ fontSize: 19, marginBottom: 6 }}>
          {isBig ? 'BIG 리워드 당첨!' : item.n}
        </div>
        <div className="t-body" style={{ marginBottom: 22 }}>
          {isBig ? '두 번째 룰렛이 열립니다 ✨' : '꾸준함이 만든 결과예요'}
        </div>
        {isBig ? (
          <PillBtn variant="gold" size="lg" full onClick={onEnterBig}>
            룰렛 열기 ✨
          </PillBtn>
        ) : (
          <PillBtn variant="mint" size="lg" full onClick={onClose}>
            받기
          </PillBtn>
        )}
      </div>
    </Modal>
  );
}
