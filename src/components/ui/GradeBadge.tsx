import type { CSSProperties } from 'react';
import { GRADES } from '../../data';
import type { GradeKey } from '../../types';

export function GradeBadge({ g, style }: { g: GradeKey; style?: CSSProperties }) {
  const grade = GRADES[g];
  return (
    <span className="badge" style={{ color: grade.color, background: grade.bg, ...style }}>
      {grade.label}
    </span>
  );
}
