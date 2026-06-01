import { useEffect, useRef, useState, type ComponentType } from 'react';
import { IconArrowUp, IconClock, IconSpark, IconX } from '../../icons';
import { PillBtn } from '../../components/ui/PillBtn';

/* 회고 데이터 */
const TODAY_TOTAL = '2시간 18분';
const TODAY_MIN = 138;
const YDAY_MIN = 126;
const DELTA_MIN = TODAY_MIN - YDAY_MIN;

const SUBJECTS = [
  { n: '수학', min: 60, c: 'var(--mint)' },
  { n: '영어', min: 40, c: 'var(--blue)' },
  { n: '국어', min: 25, c: 'var(--purple)' },
  { n: '과학', min: 13, c: 'var(--coral)' },
];

/* 시간대별 집중도 (0~100), 14:30~15:00 구간 하락 */
const FOCUS = [
  { t: '13:00', v: 72 },
  { t: '13:30', v: 86 },
  { t: '14:00', v: 90 },
  { t: '14:30', v: 48 },
  { t: '15:00', v: 42 },
  { t: '15:30', v: 80 },
  { t: '16:00', v: 88 },
];

function fmtMin(m: number) {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h && mm) return `${h}시간 ${mm}분`;
  if (h) return `${h}시간`;
  return `${mm}분`;
}

/* ── 카드 1: 오늘 공부한 양 ── */
function CardAmount() {
  const max = Math.max(TODAY_MIN, YDAY_MIN);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
      <div className="t-cap" style={{ marginBottom: 18 }}>
        오늘 공부한 양
      </div>
      <div style={{ fontSize: 46, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
        {TODAY_TOTAL}
      </div>
      <div
        style={{
          marginTop: 16,
          display: 'inline-flex',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: 6,
          padding: '8px 14px',
          borderRadius: 999,
          background: 'var(--mint-soft)',
          color: 'var(--mint)',
        }}
      >
        <IconArrowUp size={16} />
        <span style={{ fontSize: 14, fontWeight: 500 }}>어제보다 +{DELTA_MIN}분</span>
      </div>

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { l: '어제', m: YDAY_MIN, c: 'rgba(255,255,255,0.22)' },
          { l: '오늘', m: TODAY_MIN, c: 'var(--mint)' },
        ].map((r) => (
          <div key={r.l}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontSize: 12.5, color: r.l === '오늘' ? 'var(--text)' : 'var(--text-3)' }}>{r.l}</span>
              <span style={{ fontSize: 12.5, color: 'var(--text-3)' }}>{fmtMin(r.m)}</span>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(r.m / max) * 100}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: r.c,
                  transition: 'width .7s cubic-bezier(.2,.8,.2,1)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 카드 2: 무엇을 공부했나 ── */
function CardSubjects() {
  const max = Math.max(...SUBJECTS.map((s) => s.min));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
      <div className="t-cap" style={{ marginBottom: 8 }}>
        무엇을 공부했나
      </div>
      <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--text)', marginBottom: 30, letterSpacing: '-0.01em' }}>
        오늘은 수학에
        <br />
        가장 오래 머물렀어요
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {SUBJECTS.map((s) => (
          <div key={s.n}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: s.c }} />
                {s.n}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{fmtMin(s.min)}</span>
            </div>
            <div style={{ height: 11, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(s.min / max) * 100}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: s.c,
                  transition: 'width .7s cubic-bezier(.2,.8,.2,1)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 카드 3: 집중 흐름 ── */
function FocusGraph() {
  const W = 320;
  const H = 150;
  const pad = { t: 14, b: 26, l: 4, r: 4 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const pts = FOCUS.map((d, i) => [pad.l + (iw * i) / (FOCUS.length - 1), pad.t + ih - (d.v / 100) * ih]);
  const path = pts.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p[0]} ${p[1]}`;
    const prev = a[i - 1];
    const cx = (prev[0] + p[0]) / 2;
    return acc + ` C ${cx} ${prev[1]}, ${cx} ${p[1]}, ${p[0]} ${p[1]}`;
  }, '');
  const area = path + ` L ${pts[pts.length - 1][0]} ${pad.t + ih} L ${pts[0][0]} ${pad.t + ih} Z`;
  const dipX1 = pts[3][0];
  const dipX2 = pts[4][0];
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5DCAA5" stopOpacity="0.3" />
          <stop offset="1" stopColor="#5DCAA5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={dipX1} y={pad.t} width={dipX2 - dipX1} height={ih} fill="var(--coral-soft)" />
      <path d={area} fill="url(#fg)" />
      <path d={path} fill="none" stroke="var(--mint)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => {
        const dip = i === 3 || i === 4;
        return (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r={dip ? 4 : 3}
            fill={dip ? 'var(--coral)' : 'var(--bg)'}
            stroke={dip ? 'var(--coral)' : 'var(--mint)'}
            strokeWidth="2"
          />
        );
      })}
      {FOCUS.map(
        (d, i) =>
          i % 2 === 0 && (
            <text key={i} x={pts[i][0]} y={H - 8} fill="var(--text-3)" fontSize="9.5" textAnchor="middle">
              {d.t}
            </text>
          ),
      )}
    </svg>
  );
}

function CardFocus() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
      <div className="t-cap" style={{ marginBottom: 8 }}>
        집중 흐름
      </div>
      <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--text)', marginBottom: 22, letterSpacing: '-0.01em' }}>
        오후 내내 잘 몰입했어요
      </div>
      <FocusGraph />
      <div
        style={{
          marginTop: 18,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          background: 'var(--coral-soft)',
          borderRadius: 14,
          padding: '13px 14px',
        }}
      >
        <span style={{ color: 'var(--coral)', flexShrink: 0, marginTop: 1 }}>
          <IconClock size={18} />
        </span>
        <div style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: 1.5 }}>
          14:30~15:00 구간에 집중이 흐트러졌어요
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          background: 'var(--mint-soft)',
          borderRadius: 14,
          padding: '13px 14px',
        }}
      >
        <span style={{ color: 'var(--mint)', flexShrink: 0, marginTop: 1 }}>
          <IconSpark size={18} />
        </span>
        <div style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: 1.5 }}>
          내일은 1시간마다 5분씩 쉬어보는 건 어때요?
        </div>
      </div>
    </div>
  );
}

const REFLECT_CARDS: ComponentType[] = [CardAmount, CardSubjects, CardFocus];
const STORY_DUR = 5200;

interface ReflectionStoryProps {
  onComplete: () => void;
  onClose: () => void;
}

export function ReflectionStory({ onComplete, onClose }: ReflectionStoryProps) {
  const [idx, setIdx] = useState(0);
  const [prog, setProg] = useState(0);
  const holdRef = useRef(false);
  const elapsedRef = useRef(0);
  const pressRef = useRef(0);
  const last = idx === REFLECT_CARDS.length - 1;

  useEffect(() => {
    elapsedRef.current = 0;
    setProg(0);
    let prevT = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = now - prevT;
      prevT = now;
      if (!holdRef.current) {
        elapsedRef.current += dt;
        const p = Math.min(1, elapsedRef.current / STORY_DUR);
        setProg(p);
        if (p >= 1) {
          if (idx < REFLECT_CARDS.length - 1) {
            setIdx(idx + 1);
            return;
          }
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [idx]);

  function goNext() {
    if (idx < REFLECT_CARDS.length - 1) setIdx(idx + 1);
    else {
      elapsedRef.current = STORY_DUR;
      setProg(1);
    }
  }
  function goPrev() {
    if (idx > 0) setIdx(idx - 1);
    else {
      elapsedRef.current = 0;
      setProg(0);
    }
  }

  function down() {
    holdRef.current = true;
    pressRef.current = Date.now();
  }
  function up(zone: 'left' | 'right') {
    holdRef.current = false;
    if (Date.now() - pressRef.current < 240) {
      if (zone === 'left') goPrev();
      else goNext();
    }
  }

  const CardView = REFLECT_CARDS[idx];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 80,
        background: 'var(--bg)',
        display: 'flex',
        justifyContent: 'center',
        animation: 'fadeIn .22s ease',
        overflow: 'hidden',
      }}
    >
      {/* 가로 태블릿: 스토리는 중앙 컬럼으로 폭 제한 */}
      <div style={{ position: 'relative', width: 520, maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* 진행 바 */}
        <div style={{ display: 'flex', gap: 5, padding: '36px 16px 0', position: 'relative', zIndex: 3 }}>
          {REFLECT_CARDS.map((_, i) => (
            <div
              key={i}
              style={{ flex: 1, height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: 999,
                  background: '#fff',
                  width: i < idx ? '100%' : i === idx ? `${prog * 100}%` : '0%',
                  transition: i === idx ? 'none' : 'width .2s',
                }}
              />
            </div>
          ))}
        </div>

        {/* 헤더 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px 0',
            position: 'relative',
            zIndex: 3,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--coral-soft)',
                display: 'grid',
                placeItems: 'center',
                fontSize: 14,
              }}
            >
              🙂
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>오늘의 회고</div>
              <div className="t-cap" style={{ fontSize: 10 }}>
                5월 30일 · 다인
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.07)',
              color: 'var(--text-2)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <IconX size={17} />
          </button>
        </div>

        {/* 탭 영역 (좌: 이전 / 우: 다음) */}
        <div style={{ position: 'absolute', inset: '90px 0 0', display: 'flex', zIndex: 1 }}>
          <div
            style={{ width: '32%' }}
            onPointerDown={down}
            onPointerUp={() => up('left')}
            onPointerLeave={() => (holdRef.current = false)}
          />
          <div
            style={{ flex: 1 }}
            onPointerDown={down}
            onPointerUp={() => up('right')}
            onPointerLeave={() => (holdRef.current = false)}
          />
        </div>

        {/* 카드 본문 */}
        <div
          key={idx}
          style={{
            flex: 1,
            minHeight: 0,
            padding: '8px 30px 0',
            position: 'relative',
            zIndex: 2,
            pointerEvents: 'none',
            animation: 'riseUp .4s ease',
          }}
        >
          <CardView />
        </div>

        {/* 하단: 마지막 카드에서만 보상 버튼 */}
        <div style={{ padding: '12px 24px 24px', position: 'relative', zIndex: 3 }}>
          {last ? (
            <PillBtn variant="mint" size="lg" full onClick={onComplete} style={{ animation: 'riseUp .45s ease' }}>
              오늘 하루 수고했어요 🎁 보상 받기
            </PillBtn>
          ) : (
            <div className="t-cap" style={{ textAlign: 'center', opacity: 0.7 }}>
              탭하여 다음 · {idx + 1}/{REFLECT_CARDS.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
