import type { BigPrize, ExchangeLogEntry, GradeKey, InventoryItem, RewardLogEntry, ShopItem } from './types';

const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};
const API_BASE = env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const DEMO_USER = env.VITE_DEMO_USER ?? 'demo-dain';

interface UserStateDto {
  user_id: number;
  display_name: string;
  shards: number;
  streak: number;
  shields: number;
  claimed_today: boolean;
  pending_big_spin: boolean;
  usable_inventory_count: number;
}

interface RewardDto {
  id: number;
  name: string;
  emoji: string;
  grade: GradeKey;
  kind: 'shards' | 'coupon' | 'big_entry';
  shard_amount: number;
}

interface DailyClaimDto {
  state: UserStateDto;
  reward: RewardDto;
}

interface HallWinnerDto {
  id: number;
  masked_name: string;
  org: string;
  prize_name: string;
  prize_emoji: string;
  streak_days: number;
  won_at: string;
}

interface BigSpinDto {
  state: UserStateDto;
  prize: HallWinnerDto;
}

interface RewardLogDto {
  id: number;
  grade: GradeKey;
  name: string;
  created_at: string;
}

interface ExchangeLogDto {
  id: number;
  item_name: string;
  used_shards: number;
  status: string;
  created_at: string;
}

interface ShopItemDto {
  id: number;
  name: string;
  emoji: string;
  grade: GradeKey;
  price: number;
  category: string;
  stock: number;
  sold: boolean;
}

interface InventoryItemDto {
  id: number;
  name: string;
  emoji: string;
  grade: GradeKey;
  status: 'usable' | 'used';
  received_date: string;
  expires_date: string;
}

interface ExchangeDto {
  state: UserStateDto;
  item: InventoryItemDto;
  log: ExchangeLogDto;
}

export interface StudySummary {
  today: string;
  monthLabel: string;
  todayStudyMinutes: number;
  goalMinutes: number;
  monthlyAchievementRate: number;
  rewardAvailableCount: number;
  achievedDays: number[];
  shieldedDays: number[];
}

interface StudySummaryDto {
  today: string;
  month_label: string;
  today_study_minutes: number;
  goal_minutes: number;
  monthly_achievement_rate: number;
  reward_available_count: number;
  achieved_days: number[];
  shielded_days: number[];
}

export interface HallWinner {
  id: number;
  name: string;
  org: string;
  prize: string;
  e: string;
  days: number;
  ago: string;
}

export interface AppState {
  shards: number;
  streak: number;
  shields: number;
  claimed: boolean;
  pendingBigSpin: boolean;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Demo-User': DEMO_USER,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `API 요청 실패 (${res.status})`);
  }
  return res.json() as Promise<T>;
}

function appState(dto: UserStateDto): AppState {
  return {
    shards: dto.shards,
    streak: dto.streak,
    shields: dto.shields,
    claimed: dto.claimed_today,
    pendingBigSpin: dto.pending_big_spin,
  };
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: `${d.getMonth() + 1}.${d.getDate()}`,
    time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
  };
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

function rewardLog(dto: RewardLogDto): RewardLogEntry {
  const t = formatDateTime(dto.created_at);
  return { id: dto.id, date: t.date, time: t.time, grade: dto.grade, name: dto.name };
}

function exchangeLog(dto: ExchangeLogDto): ExchangeLogEntry {
  const t = formatDateTime(dto.created_at);
  return { id: dto.id, date: t.date, n: dto.item_name, used: dto.used_shards, status: dto.status };
}

function shopItem(dto: ShopItemDto): ShopItem {
  return {
    id: dto.id,
    n: dto.name,
    e: dto.emoji,
    grade: dto.grade,
    price: dto.price,
    cat: dto.category,
    sold: dto.sold,
    stock: dto.stock,
  };
}

function inventoryItem(dto: InventoryItemDto): InventoryItem {
  return {
    id: dto.id,
    n: dto.name,
    e: dto.emoji,
    grade: dto.grade,
    got: formatShortDate(dto.received_date),
    exp: dto.status === 'used' ? '사용 완료' : dto.expires_date.replace(/-/g, '.'),
    status: dto.status,
  };
}

function hallWinner(dto: HallWinnerDto): HallWinner {
  return {
    id: dto.id,
    name: dto.masked_name,
    org: dto.org,
    prize: dto.prize_name,
    e: dto.prize_emoji,
    days: dto.streak_days,
    ago: '방금',
  };
}

function studySummary(dto: StudySummaryDto): StudySummary {
  return {
    today: dto.today,
    monthLabel: dto.month_label,
    todayStudyMinutes: dto.today_study_minutes,
    goalMinutes: dto.goal_minutes,
    monthlyAchievementRate: dto.monthly_achievement_rate,
    rewardAvailableCount: dto.reward_available_count,
    achievedDays: dto.achieved_days,
    shieldedDays: dto.shielded_days,
  };
}

export const api = {
  async state() {
    return appState(await request<UserStateDto>('/api/me/state'));
  },
  async bootstrap() {
    const [state, rewards, exchanges, inventory, shop, hall, hallStats, study] = await Promise.all([
      request<UserStateDto>('/api/me/state'),
      request<RewardLogDto[]>('/api/rewards/logs'),
      request<ExchangeLogDto[]>('/api/shop/exchange-logs'),
      request<InventoryItemDto[]>('/api/inventory'),
      request<ShopItemDto[]>('/api/shop/items'),
      request<HallWinnerDto[]>('/api/hall/winners'),
      request<{ this_month_count: number }>('/api/hall/stats'),
      request<StudySummaryDto>('/api/study/summary'),
    ]);
    return {
      state: appState(state),
      rewardLog: rewards.map(rewardLog),
      exchangeLog: exchanges.map(exchangeLog),
      inventory: inventory.map(inventoryItem),
      shopItems: shop.map(shopItem),
      hallWinners: hall.map(hallWinner),
      hallCount: hallStats.this_month_count,
      study: studySummary(study),
    };
  },
  async claimDaily(reflection = '') {
    const dto = await request<DailyClaimDto>('/api/rewards/daily/claim', {
      method: 'POST',
      body: JSON.stringify({ reflection }),
    });
    return {
      state: appState(dto.state),
      reward: {
        g: dto.reward.grade,
        item: { n: dto.reward.name, e: dto.reward.emoji, shards: dto.reward.shard_amount },
      },
    };
  },
  async spinBig() {
    const dto = await request<BigSpinDto>('/api/rewards/big/spin', { method: 'POST' });
    const prize: BigPrize = { id: dto.prize.id, n: dto.prize.prize_name, e: dto.prize.prize_emoji, pct: 0 };
    return { state: appState(dto.state), prize };
  },
  async exchange(itemId: ShopItem['id']) {
    const dto = await request<ExchangeDto>('/api/shop/exchange', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId }),
    });
    return {
      state: appState(dto.state),
      item: inventoryItem(dto.item),
      log: exchangeLog(dto.log),
    };
  },
  async useInventory(itemId: InventoryItem['id']) {
    return inventoryItem(await request<InventoryItemDto>(`/api/inventory/${itemId}/use`, { method: 'POST' }));
  },
};
