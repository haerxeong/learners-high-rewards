import type { Grade, GradeKey } from './types';

/* 등급 정의 (화면 간 동일 컬러 유지) */
export const GRADES: Record<GradeKey, Grade> = {
  common: { key: 'common', label: 'COMMON', ko: '일반', color: 'var(--common)', bg: 'var(--common-bg)', emoji: '🌱' },
  rare: { key: 'rare', label: 'RARE', ko: '레어', color: 'var(--rare)', bg: 'var(--rare-bg)', emoji: '💧' },
  epic: { key: 'epic', label: 'EPIC', ko: '에픽', color: 'var(--epic)', bg: 'var(--epic-bg)', emoji: '🔮' },
  big: { key: 'big', label: 'BIG 리워드', ko: 'BIG', color: 'var(--big)', bg: 'var(--big-bg)', emoji: '✨' },
};

/* 캘린더 공통 (2026년 5월: 1일=금요일, 오늘=29일) */
export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
export const MAY_FIRST_DOW = 5;
export const TODAY = 29;
export const ACHIEVED: Set<number> = (() => {
  const s = new Set<number>();
  for (let d = 7; d <= 29; d++) s.add(d);
  [1, 3, 4].forEach((d) => s.add(d));
  return s;
})();
