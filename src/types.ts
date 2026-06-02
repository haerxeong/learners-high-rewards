export type GradeKey = 'common' | 'rare' | 'epic' | 'big';

export interface Grade {
  key: GradeKey;
  label: string;
  ko: string;
  color: string;
  bg: string;
  emoji: string;
}

export interface RewardLogEntry {
  id?: number;
  date: string;
  time: string;
  grade: GradeKey;
  name: string;
}

export interface ExchangeLogEntry {
  id?: number;
  date: string;
  n: string;
  used: number;
  status: string;
}

export interface InventoryItem {
  id?: number | string;
  n: string;
  e: string;
  grade: GradeKey;
  got?: string;
  exp?: string;
  status?: 'usable' | 'used';
}

export interface BigPrize {
  id: string | number;
  n: string;
  e: string;
  pct: number;
}

export interface ShopItem {
  id: string | number;
  n: string;
  e: string;
  grade: GradeKey;
  price: number;
  cat: string;
  sold: boolean;
  stock?: number;
}

export type TabKey = 'home' | 'reward' | 'shop' | 'storage' | 'hall';
