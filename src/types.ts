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
  date: string;
  time: string;
  grade: GradeKey;
  name: string;
}

export interface ExchangeLogEntry {
  date: string;
  n: string;
  used: number;
  status: string;
}

export interface InventoryItem {
  n: string;
  e: string;
  grade: GradeKey;
}

export interface BigPrize {
  id: string;
  n: string;
  e: string;
  pct: number;
}

export interface ShopItem {
  id: string;
  n: string;
  e: string;
  grade: GradeKey;
  price: number;
  cat: string;
  sold: boolean;
}

export type TabKey = 'home' | 'reward' | 'shop' | 'storage' | 'hall';
