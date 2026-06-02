import { useMemo, useState } from 'react';
import { IconCamera, IconShare, IconTrophy, IconX } from '../../icons';
import { useStore } from '../../store';
import { GradeBadge } from '../../components/ui/GradeBadge';
import { PillBtn } from '../../components/ui/PillBtn';
import type { BigPrize } from '../../types';

const BIG_PRIZES: BigPrize[] = [
  { id: 'airpods4', n: '에어팟 4세대', e: '🎧', pct: 60 },
  { id: 'ipad', n: '아이패드', e: '📱', pct: 30 },
  { id: 'airmax', n: '에어팟 맥스', e: '🎧', pct: 30 },
  { id: 'ipadpro', n: '아이패드 프로', e: '📱', pct: 10 },
];

const STEP = 128;
const ITEMW = 116;

type Phase = 'ready' | 'spinning' | 'won';

interface BigRouletteProps {
  onClose: () => void;
  onWin?: (prize: BigPrize) => void;
}

export function BigRoulette({ onClose, onWin }: BigRouletteProps) {
  const store = useStore();
  const [phase, setPhase] = useState<Phase>('ready');
  const [offset, setOffset] = useState(-ITEMW / 2);
  const [trans, setTrans] = useState('none');
  const [prize, setPrize] = useState<BigPrize | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reel = useMemo(() => {
    const base: BigPrize[] = [];
    for (let i = 0; i < 44; i++) base.push(BIG_PRIZES[Math.floor(Math.random() * BIG_PRIZES.length)]);
    return base;
  }, []);
  const winIndex = 38;

  async function spin() {
    if (phase !== 'ready') return;
    setPhase('spinning');
    setError(null);
    try {
      const won = await store.spinBig();
      reel[winIndex] = won;
      setPrize(won);
      requestAnimationFrame(() => {
        setTrans('transform 3.8s cubic-bezier(.12,.66,.16,1)');
        const jitter = (Math.random() - 0.5) * 36;
        setOffset(-(winIndex * STEP + ITEMW / 2) + jitter);
      });
      window.setTimeout(() => setPhase('won'), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'BIG 리워드 결과 확인에 실패했습니다.');
      setPhase('ready');
    }
  }

  function finish() {
    if (!prize) return;
    onWin?.(prize);
    onClose();
  }

  return (
    <div
      className="scroll"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 90,
        overflowY: 'auto',
        background: 'radial-gradient(130% 80% at 50% 0%, rgba(250,199,117,0.22), var(--bg) 58%)',
        animation: 'fadeIn .25s ease',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 28,
          right: 28,
          zIndex: 5,
          width: 36,
          height: 36,
          borderRadius: 999,
          border: '1px solid var(--divider)',
          background: 'rgba(0,0,0,0.3)',
          color: 'var(--text-2)',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <IconX size={18} />
      </button>

      {phase !== 'won' ? (
        <div
          style={{
            padding: '64px 22px 40px',
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ width: 620, maxWidth: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: 34 }}>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  background: 'linear-gradient(180deg, #FFE6B0, var(--gold))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                JACKPOT! ✨
              </div>
              <div className="t-body" style={{ marginTop: 8, color: 'var(--gold)' }}>
                당신은 BIG 리워드에 진입했습니다
              </div>
              {error && <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--coral)' }}>{error}</div>}
            </div>

            {/* 룰렛 릴 */}
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <div
                style={{
                  position: 'absolute',
                  top: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 4,
                  width: 0,
                  height: 0,
                  borderLeft: '9px solid transparent',
                  borderRight: '9px solid transparent',
                  borderTop: '11px solid var(--gold)',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  height: 168,
                  overflow: 'hidden',
                  borderRadius: 20,
                  border: '1px solid var(--gold-soft)',
                  background: 'rgba(0,0,0,0.25)',
                  boxShadow: 'inset 0 0 40px rgba(250,199,117,0.12)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 3,
                    pointerEvents: 'none',
                    background:
                      'linear-gradient(90deg, var(--bg), transparent 22%, transparent 78%, var(--bg))',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    width: ITEMW + 8,
                    transform: 'translateX(-50%)',
                    zIndex: 1,
                    borderRadius: 16,
                    boxShadow: 'inset 0 0 0 1.5px var(--gold-soft)',
                    background: 'rgba(250,199,117,0.06)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    display: 'flex',
                    gap: 12,
                    transform: `translateX(${offset}px)`,
                    transition: trans,
                    zIndex: 2,
                  }}
                >
                  {reel.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        width: ITEMW,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 18,
                          background: 'var(--big-bg)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 38,
                          boxShadow: 'inset 0 0 0 1px var(--gold-soft)',
                        }}
                      >
                        {p.e}
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 500 }}>{p.n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 확률 안내 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, margin: '14px 0 auto', flexWrap: 'wrap' }}>
              {[
                ['에어팟 4세대', '60%'],
                ['맥스 · 아이패드', '30%'],
                ['아이패드 프로', '10%'],
              ].map(([n, p]) => (
                <span key={n} className="t-cap" style={{ color: 'var(--gold)', opacity: 0.85 }}>
                  {n} {p}
                </span>
              ))}
            </div>

            <PillBtn
              variant="gold"
              size="lg"
              full
              disabled={phase === 'spinning'}
              onClick={spin}
              style={{ marginTop: 28 }}
            >
              {phase === 'spinning' ? '두근두근…' : '결과 확인하기'}
            </PillBtn>
          </div>
        </div>
      ) : (
        prize && <BigWonView prize={prize} onFinish={finish} />
      )}
    </div>
  );
}

/* 당첨 축하 화면 (공유 유도) */
function BigWonView({ prize, onFinish }: { prize: BigPrize; onFinish: () => void }) {
  return (
    <div
      style={{
        padding: '56px 22px 40px',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeIn .4s',
      }}
    >
      <div style={{ width: 460, maxWidth: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* 공유 카드 (스크린샷 좋게) */}
        <div
          style={{
            borderRadius: 24,
            padding: '34px 24px 28px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(120% 80% at 50% 0%, rgba(250,199,117,0.26), var(--card) 60%)',
            border: '1px solid var(--gold-soft)',
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <GradeBadge g="big" />
          </div>
          <div
            style={{
              width: 128,
              height: 128,
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'grid',
              placeItems: 'center',
              fontSize: 60,
              background: 'var(--big-bg)',
              boxShadow: 'inset 0 0 0 2px var(--gold)',
              animation: 'pulseBig 1.8s ease-in-out infinite',
            }}
          >
            {prize.e}
          </div>
          <div style={{ fontSize: 24, fontWeight: 500, color: 'var(--gold)', marginBottom: 8 }}>{prize.n}</div>
          <div className="t-body" style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.55 }}>
            축하해요! 41일의 노력이
            <br />
            결실을 맺었어요 ✨
          </div>
          <div
            style={{
              marginTop: 18,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '7px 13px',
              borderRadius: 999,
              background: 'var(--gold-soft)',
              color: 'var(--gold)',
            }}
          >
            <IconTrophy size={15} />
            <span style={{ fontSize: 11.5, fontWeight: 500 }}>명예의 전당에 자동 등록됩니다</span>
          </div>
        </div>

        {/* 공유 */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <PillBtn variant="ghost" full style={{ gap: 7 }}>
            <IconCamera size={18} /> 스크린샷
          </PillBtn>
          <PillBtn variant="ghost" full style={{ gap: 7 }}>
            <IconShare size={17} /> 공유하기
          </PillBtn>
        </div>

        <div style={{ flex: 1 }} />

        {/* 다음 단계 안내 */}
        <div
          style={{
            background: 'var(--card-soft)',
            border: '1px solid var(--divider)',
            borderRadius: 16,
            padding: 15,
            marginTop: 20,
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>
            수령까지 한 단계 남았어요
          </div>
          <div className="t-cap" style={{ lineHeight: 1.55 }}>
            배송지 입력과 법정대리인 동의를 마치면 발송됩니다. 미성년자는 제세공과금 안내를 함께 받아요.
          </div>
        </div>
        <PillBtn variant="gold" size="lg" full onClick={onFinish}>
          배송지 입력 · 법정대리인 동의
        </PillBtn>
      </div>
    </div>
  );
}
