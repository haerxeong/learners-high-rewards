/* AdminConsole.tsx — 운영 백오피스 (확률·보상 관리) · 데스크탑 레이아웃 */
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { GRADES } from '../../data';
import { GradeBadge } from '../../components/ui/GradeBadge';
import { api, type AdminShopItem, type AdminShopItemInput } from '../../api';
import {
  IconChart,
  IconCheckCircle,
  IconFlag,
  IconGrid,
  IconSliders,
  IconTrophy,
  IconUsers,
  type IconProps,
} from '../../icons';
import type { GradeKey } from '../../types';

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 38,
        height: 22,
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        padding: 2,
        background: on ? 'var(--mint)' : 'rgba(255,255,255,0.12)',
        transition: 'background .15s',
        display: 'flex',
        justifyContent: on ? 'flex-end' : 'flex-start',
      }}
    >
      <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', display: 'block' }} />
    </button>
  );
}

function AdminPanel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--divider)', borderRadius: 14, padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text)' }}>{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

const th: CSSProperties = {
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 400,
  color: 'var(--text-3)',
  padding: '0 10px 9px',
  whiteSpace: 'nowrap',
};
const td: CSSProperties = {
  fontSize: 12.5,
  color: 'var(--text-2)',
  padding: '9px 10px',
  borderTop: '1px solid var(--divider)',
};

interface ProbRow {
  g: GradeKey;
  base: number;
  boost: number;
  actual: number;
}

function ProbTable() {
  const rows: ProbRow[] = [
    { g: 'common', base: 70.0, boost: 67.7, actual: 69.8 },
    { g: 'rare', base: 24.8, boost: 25.6, actual: 24.9 },
    { g: 'epic', base: 5.0, boost: 6.0, actual: 5.1 },
    { g: 'big', base: 0.2, boost: 0.2, actual: 0.2 },
  ];
  const sum = rows.reduce((s, r) => s + r.base, 0);
  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>등급</th>
            <th style={{ ...th, textAlign: 'right' }}>설계 확률</th>
            <th style={{ ...th, textAlign: 'right' }}>부스트 적용</th>
            <th style={{ ...th, textAlign: 'right' }}>실측</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.g}>
              <td style={td}>
                <GradeBadge g={r.g} />
              </td>
              <td style={{ ...td, textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 7,
                    padding: '4px 9px',
                    color: 'var(--text)',
                  }}
                >
                  {r.base.toFixed(1)}%
                </span>
              </td>
              <td style={{ ...td, textAlign: 'right', color: 'var(--text-3)' }}>{r.boost.toFixed(1)}%</td>
              <td style={{ ...td, textAlign: 'right', color: 'var(--mint)' }}>{r.actual.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 12 }}>
        <span style={{ color: 'var(--text-3)' }}>설계 확률 합계</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--mint)', fontWeight: 500 }}>
          <IconCheckCircle size={15} /> {sum.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

interface ValRow {
  g: GradeKey;
  design: number;
  actual: number;
}

function ValidationBars() {
  const rows: ValRow[] = [
    { g: 'common', design: 70, actual: 69.8 },
    { g: 'rare', design: 24.8, actual: 24.9 },
    { g: 'epic', design: 5, actual: 5.1 },
    { g: 'big', design: 0.2, actual: 0.2 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {rows.map((r) => (
        <div key={r.g}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 6 }}>
            <span style={{ color: GRADES[r.g].color }}>{r.g === 'big' ? 'BIG' : GRADES[r.g].ko}</span>
            <span style={{ color: 'var(--text-3)' }}>
              설계 {r.design}% · 실측 {r.actual}%
            </span>
          </div>
          <div style={{ position: 'relative', height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${r.design}%`,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.18)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${r.actual}%`,
                borderRadius: 999,
                background: GRADES[r.g].color,
              }}
            />
          </div>
        </div>
      ))}
      <div className="t-cap" style={{ display: 'flex', gap: 14, marginTop: 2 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 7, borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} /> 설계
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 7, borderRadius: 2, background: 'var(--mint)' }} /> 실측
        </span>
      </div>
    </div>
  );
}

function ProductPool() {
  const [items, setItems] = useState<AdminShopItem[]>([]);
  const [draft, setDraft] = useState<AdminShopItemInput>({
    name: '',
    emoji: '🎁',
    grade: 'common',
    price: 100,
    category: '음식',
    stock: 1,
    active: true,
  });
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | 'new' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadItems();
  }, []);

  async function loadItems() {
    try {
      setError(null);
      setLoading(true);
      setItems(await api.admin.shopItems());
    } catch (e) {
      setError(e instanceof Error ? e.message : '상품 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function createItem() {
    if (!draft.name.trim() || !draft.emoji.trim() || !draft.category.trim()) {
      setError('상품명, 이모지, 카테고리를 입력하세요.');
      return;
    }
    try {
      setSavingId('new');
      setError(null);
      const created = await api.admin.createShopItem({
        ...draft,
        name: draft.name.trim(),
        emoji: draft.emoji.trim(),
        category: draft.category.trim(),
      });
      setItems((prev) => [...prev, created]);
      setDraft((prev) => ({ ...prev, name: '', emoji: '🎁', stock: 1 }));
    } catch (e) {
      setError(e instanceof Error ? e.message : '상품 등록에 실패했습니다.');
    } finally {
      setSavingId(null);
    }
  }

  async function updateItem(next: AdminShopItem) {
    try {
      setSavingId(next.id);
      setError(null);
      const saved = await api.admin.updateShopItem(next);
      setItems((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
    } catch (e) {
      setError(e instanceof Error ? e.message : '상품 수정에 실패했습니다.');
      await loadItems();
    } finally {
      setSavingId(null);
    }
  }

  function commitItem(id: number) {
    const next = items.find((item) => item.id === id);
    if (next) void updateItem(next);
  }

  async function deleteItem(id: number) {
    try {
      setSavingId(id);
      setError(null);
      await api.admin.deleteShopItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : '상품 삭제에 실패했습니다.');
    } finally {
      setSavingId(null);
    }
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    height: 34,
    borderRadius: 8,
    border: '1px solid var(--divider)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)',
    fontFamily: 'var(--font)',
    fontSize: 12.5,
    padding: '0 10px',
  };

  const actionBtn: CSSProperties = {
    height: 30,
    borderRadius: 8,
    border: '1px solid var(--divider)',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--text-2)',
    fontFamily: 'var(--font)',
    fontSize: 11.5,
    cursor: 'pointer',
    padding: '0 10px',
    whiteSpace: 'nowrap',
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 64px 110px 100px 110px 90px 78px', gap: 8, marginBottom: 12 }}>
        <input style={inputStyle} value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} placeholder="상품명" />
        <input style={{ ...inputStyle, textAlign: 'center' }} value={draft.emoji} onChange={(e) => setDraft((p) => ({ ...p, emoji: e.target.value }))} placeholder="🎁" />
        <select style={inputStyle} value={draft.grade} onChange={(e) => setDraft((p) => ({ ...p, grade: e.target.value as GradeKey }))}>
          <option value="common">COMMON</option>
          <option value="rare">RARE</option>
          <option value="epic">EPIC</option>
          <option value="big">BIG</option>
        </select>
        <input style={inputStyle} type="number" min={0} value={draft.price} onChange={(e) => setDraft((p) => ({ ...p, price: Number(e.target.value) }))} placeholder="가격" />
        <input style={inputStyle} value={draft.category} onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))} placeholder="카테고리" />
        <input style={inputStyle} type="number" min={0} value={draft.stock} onChange={(e) => setDraft((p) => ({ ...p, stock: Number(e.target.value) }))} placeholder="재고" />
        <button onClick={createItem} disabled={savingId === 'new'} style={{ ...actionBtn, background: 'var(--mint-soft)', color: 'var(--mint)' }}>
          등록
        </button>
      </div>
      {error && <div style={{ fontSize: 12, color: 'var(--coral)', marginBottom: 10 }}>{error}</div>}
      {loading ? (
        <div className="t-cap" style={{ padding: '18px 2px' }}>상품 목록을 불러오는 중</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>상품명</th>
              <th style={th}>등급</th>
              <th style={{ ...th, textAlign: 'right' }}>조각 가격</th>
              <th style={{ ...th, textAlign: 'right' }}>재고</th>
              <th style={{ ...th, textAlign: 'center' }}>활성</th>
              <th style={{ ...th, textAlign: 'right' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td style={{ ...td, color: 'var(--text)' }}>
                  <span style={{ marginRight: 8 }}>{it.emoji}</span>
                  {it.name}
                  <span style={{ color: 'var(--text-3)', marginLeft: 8 }}>{it.category}</span>
                </td>
                <td style={td}>
                  <GradeBadge g={it.grade} />
                </td>
                <td style={{ ...td, textAlign: 'right' }}>
                  <input
                    style={{ ...inputStyle, width: 92, textAlign: 'right' }}
                    type="number"
                    min={0}
                    value={it.price}
                    onChange={(e) => setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, price: Number(e.target.value) } : x)))}
                    onBlur={() => commitItem(it.id)}
                    disabled={savingId === it.id}
                  />
                </td>
                <td style={{ ...td, textAlign: 'right' }}>
                  <input
                    style={{ ...inputStyle, width: 82, textAlign: 'right', color: it.stock === 0 ? 'var(--coral)' : 'var(--text)' }}
                    type="number"
                    min={0}
                    value={it.stock}
                    onChange={(e) => setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, stock: Number(e.target.value) } : x)))}
                    onBlur={() => commitItem(it.id)}
                    disabled={savingId === it.id}
                  />
                </td>
                <td style={{ ...td, textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Toggle on={it.active} onClick={() => updateItem({ ...it, active: !it.active })} />
                  </div>
                </td>
                <td style={{ ...td, textAlign: 'right' }}>
                  <button onClick={() => deleteItem(it.id)} disabled={savingId === it.id} style={{ ...actionBtn, color: 'var(--coral)' }}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AdminKPI({
  label,
  value,
  sub,
  accent = 'var(--mint)',
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--divider)', borderRadius: 14, padding: '16px 18px', flex: 1 }}>
      <div className="t-cap" style={{ marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 25, fontWeight: 500, color: 'var(--text)' }}>{value}</span>
        {sub && <span style={{ fontSize: 12, color: accent }}>{sub}</span>}
      </div>
    </div>
  );
}

interface NavItem {
  label: string;
  Icon: (p: IconProps) => ReactNode;
  on?: boolean;
}

const NAV: NavItem[] = [
  { label: '확률·보상 관리', Icon: IconSliders, on: true },
  { label: '상품 풀', Icon: IconGrid },
  { label: '일일 통계', Icon: IconChart },
  { label: 'BIG 당첨', Icon: IconTrophy },
  { label: '어뷰징 탐지', Icon: IconFlag },
  { label: '사용자', Icon: IconUsers },
];

interface BigWin {
  name: string;
  prize: string;
  date: string;
  tax: string;
  done: boolean;
}

interface AbuseRow {
  id: string;
  flag: string;
  risk: string;
  c: string;
}

export function AdminConsole() {
  const bigWins: BigWin[] = [
    { name: '이서연', prize: '아이패드 프로', date: '5.27', tax: '처리 완료', done: true },
    { name: '박지후', prize: '에어팟 4세대', date: '5.24', tax: '동의 대기', done: false },
    { name: '정민서', prize: '에어팟 맥스', date: '5.23', tax: '처리 완료', done: true },
  ];
  const abuse: AbuseRow[] = [
    { id: 'usr_8821', flag: '비정상 순공 패턴', risk: '높음', c: 'var(--coral)' },
    { id: 'usr_4470', flag: '다중 계정 의심', risk: '중간', c: 'var(--gold)' },
    { id: 'usr_1290', flag: '타이머 조작 흔적', risk: '중간', c: 'var(--gold)' },
  ];
  const dist: { g: GradeKey; n: number }[] = [
    { g: 'common', n: 8210 },
    { g: 'rare', n: 2716 },
    { g: 'epic', n: 599 },
    { g: 'big', n: 235 },
  ];
  const distTotal = dist.reduce((s, d) => s + d.n, 0);

  return (
    <div
      className="scroll"
      style={{ background: 'var(--bg)', height: '100vh', overflowY: 'auto', display: 'flex', color: 'var(--text)' }}
    >
      {/* 사이드 */}
      <aside
        style={{
          width: 220,
          borderRight: '1px solid var(--divider)',
          padding: '22px 14px',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          alignSelf: 'flex-start',
          height: '100vh',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 26, padding: '0 8px' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'var(--surface)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--mint)',
            }}
          >
            <IconSliders size={17} />
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 500 }}>운영 콘솔</span>
        </div>
        {NAV.map(({ label, Icon, on }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
              background: on ? 'var(--surface)' : 'transparent',
              color: on ? 'var(--text)' : 'var(--text-3)',
              marginBottom: 2,
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            <Icon size={17} /> {label}
          </div>
        ))}
      </aside>

      {/* 메인 */}
      <main style={{ flex: 1, padding: '22px 26px', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div className="t-cap">확률·보상 관리</div>
            <div style={{ fontSize: 20, fontWeight: 500, marginTop: 2 }}>리워드 운영 대시보드</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-3)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--mint)' }} /> 2026.05.29 21:30 기준
          </div>
        </div>

        {/* KPI */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <AdminKPI label="오늘 보상 발급" value="11,760" sub="+4.2%" />
          <AdminKPI label="조각 교환률" value="63.4%" sub="+1.1%p" accent="var(--blue)" />
          <AdminKPI label="BIG 당첨" value="235" sub="설계 2.0%" accent="var(--gold)" />
          <AdminKPI label="어뷰징 플래그" value="3" sub="검토 필요" accent="var(--coral)" />
        </div>

        {/* 2열 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <AdminPanel
            title="등급별 확률 설정"
            action={
              <button
                style={{
                  fontFamily: 'var(--font)',
                  fontSize: 11.5,
                  color: 'var(--mint)',
                  background: 'var(--mint-soft)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 12px',
                  cursor: 'pointer',
                }}
              >
                저장
              </button>
            }
          >
            <ProbTable />
          </AdminPanel>
          <AdminPanel title="실제 확률 vs 설계 확률 검증">
            <ValidationBars />
          </AdminPanel>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <AdminPanel title="오늘 등급별 분포">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {dist.map((d) => (
                <div key={d.g}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: GRADES[d.g].color }}>{d.g === 'big' ? 'BIG' : GRADES[d.g].ko}</span>
                    <span style={{ color: 'var(--text-3)' }}>
                      {d.n.toLocaleString()}건 · {((d.n / distTotal) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(d.n / distTotal) * 100}%`,
                        height: '100%',
                        borderRadius: 999,
                        background: GRADES[d.g].color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel title="BIG 리워드 당첨 · 제세공과금">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>당첨자</th>
                  <th style={th}>상품</th>
                  <th style={th}>일자</th>
                  <th style={{ ...th, textAlign: 'right' }}>세금 처리</th>
                </tr>
              </thead>
              <tbody>
                {bigWins.map((w, i) => (
                  <tr key={i}>
                    <td style={{ ...td, color: 'var(--text)' }}>{w.name}</td>
                    <td style={td}>{w.prize}</td>
                    <td style={td}>{w.date}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: 11,
                          padding: '3px 9px',
                          borderRadius: 999,
                          color: w.done ? 'var(--mint)' : 'var(--gold)',
                          background: w.done ? 'var(--mint-soft)' : 'var(--gold-soft)',
                        }}
                      >
                        {w.tax}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminPanel>
        </div>

        {/* 어뷰징 */}
        <AdminPanel title="어뷰징 의심 계정" action={<span className="t-cap">부정 탐지 플래그 {abuse.length}건</span>}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>계정 ID</th>
                <th style={th}>탐지 사유</th>
                <th style={th}>위험도</th>
                <th style={{ ...th, textAlign: 'right' }}>조치</th>
              </tr>
            </thead>
            <tbody>
              {abuse.map((a, i) => (
                <tr key={i}>
                  <td style={{ ...td, color: 'var(--text)', fontFamily: 'monospace' }}>{a.id}</td>
                  <td style={td}>{a.flag}</td>
                  <td style={td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: a.c }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: a.c }} /> {a.risk}
                    </span>
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <button
                      style={{
                        fontFamily: 'var(--font)',
                        fontSize: 11.5,
                        color: 'var(--text-2)',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--divider)',
                        borderRadius: 8,
                        padding: '5px 12px',
                        cursor: 'pointer',
                      }}
                    >
                      검토
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminPanel>

        {/* 상품 풀 */}
        <div style={{ marginTop: 16 }}>
          <AdminPanel title="상품 풀 관리">
            <ProductPool />
          </AdminPanel>
        </div>
      </main>
    </div>
  );
}
