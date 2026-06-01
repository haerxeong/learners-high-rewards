import confetti from 'canvas-confetti';
import type { GradeKey } from '../types';

/* 빨강 계열 배제 · 따뜻한 민트/골드/코랄 + 블루/퍼플 */
const COLORS = ['#5dcaa5', '#fac775', '#f0997b', '#85b7eb', '#afa9ec', '#ffffff'];

const BASE = { colors: COLORS, zIndex: 9999, disableForReducedMotion: true } as const;

/* 좌·우에서 솟구치는 분수 효과 (지속형) */
function sideFountains(durationMs: number) {
  const end = Date.now() + durationMs;
  (function frame() {
    confetti({ ...BASE, particleCount: 7, angle: 60, spread: 75, startVelocity: 55, origin: { x: 0, y: 0.65 } });
    confetti({ ...BASE, particleCount: 7, angle: 120, spread: 75, startVelocity: 55, origin: { x: 1, y: 0.65 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/* 보상 등급에 따라 점점 화려해지는 축포 */
export function celebrate(grade: GradeKey) {
  const origin = { x: 0.5, y: 0.5 };

  if (grade === 'big') {
    confetti({ ...BASE, particleCount: 180, spread: 110, startVelocity: 48, scalar: 1.15, origin });
    sideFountains(1400);
    setTimeout(() => confetti({ ...BASE, particleCount: 120, spread: 130, startVelocity: 40, origin }), 260);
    return;
  }

  const count: Record<Exclude<GradeKey, 'big'>, number> = { common: 70, rare: 110, epic: 150 };
  confetti({ ...BASE, particleCount: count[grade], spread: grade === 'common' ? 65 : 95, startVelocity: 42, origin });

  if (grade === 'epic') {
    setTimeout(() => {
      confetti({ ...BASE, particleCount: 55, angle: 60, spread: 60, origin: { x: 0.2, y: 0.6 } });
      confetti({ ...BASE, particleCount: 55, angle: 120, spread: 60, origin: { x: 0.8, y: 0.6 } });
    }, 180);
  }
}
