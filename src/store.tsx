import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { BigPrize, ExchangeLogEntry, InventoryItem, RewardLogEntry } from './types';

const RECENT_REWARDS_INIT: RewardLogEntry[] = [
  { date: '5.28', time: '21:40', grade: 'rare', name: '레어 조각 +25' },
  { date: '5.27', time: '22:05', grade: 'common', name: '성장 조각 +10' },
  { date: '5.26', time: '20:18', grade: 'epic', name: '에픽 조각 +60' },
  { date: '5.25', time: '21:12', grade: 'common', name: '성장 조각 +8' },
];

export interface Store {
  shards: number;
  streak: number;
  shields: number;
  claimed: boolean;
  inventory: InventoryItem[];
  myHall: BigPrize | null;
  rewardLog: RewardLogEntry[];
  exchangeLog: ExchangeLogEntry[];
  setClaimed: (v: boolean) => void;
  addShards: (n: number) => void;
  addInventory: (it: InventoryItem) => void;
  pushReward: (e: RewardLogEntry) => void;
  pushExchange: (e: ExchangeLogEntry) => void;
  registerHall: (p: BigPrize) => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [shards, setShards] = useState(127);
  const [claimed, setClaimed] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [myHall, setMyHall] = useState<BigPrize | null>(null);
  const [rewardLog, setRewardLog] = useState<RewardLogEntry[]>(RECENT_REWARDS_INIT);
  const [exchangeLog, setExchangeLog] = useState<ExchangeLogEntry[]>([]);

  const store = useMemo<Store>(
    () => ({
      shards,
      streak: 23,
      shields: 2,
      claimed,
      inventory,
      myHall,
      rewardLog,
      exchangeLog,
      setClaimed,
      addShards: (n) => setShards((s) => Math.max(0, s + n)),
      addInventory: (it) => setInventory((p) => [it, ...p]),
      pushReward: (e) => setRewardLog((l) => [e, ...l]),
      pushExchange: (e) => setExchangeLog((l) => [e, ...l]),
      registerHall: (p) => setMyHall(p),
    }),
    [shards, claimed, inventory, myHall, rewardLog, exchangeLog],
  );

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
