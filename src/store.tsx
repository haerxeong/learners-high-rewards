import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, type HallWinner, type StudySummary } from './api';
import type { BigPrize, ExchangeLogEntry, InventoryItem, RewardLogEntry, ShopItem } from './types';

interface RewardResult {
  g: 'common' | 'rare' | 'epic' | 'big';
  item: { n: string; e: string; shards: number };
}

export interface Store {
  loading: boolean;
  error: string | null;
  shards: number;
  streak: number;
  shields: number;
  claimed: boolean;
  pendingBigSpin: boolean;
  inventory: InventoryItem[];
  myHall: BigPrize | null;
  rewardLog: RewardLogEntry[];
  exchangeLog: ExchangeLogEntry[];
  shopItems: ShopItem[];
  hallWinners: HallWinner[];
  hallCount: number;
  study: StudySummary | null;
  refresh: () => Promise<void>;
  claimDaily: () => Promise<RewardResult>;
  spinBig: () => Promise<BigPrize>;
  exchangeShopItem: (item: ShopItem) => Promise<void>;
  useInventoryItem: (item: InventoryItem) => Promise<void>;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shards, setShards] = useState(127);
  const [streak, setStreak] = useState(23);
  const [shields, setShields] = useState(2);
  const [claimed, setClaimed] = useState(false);
  const [pendingBigSpin, setPendingBigSpin] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [myHall, setMyHall] = useState<BigPrize | null>(null);
  const [rewardLog, setRewardLog] = useState<RewardLogEntry[]>([]);
  const [exchangeLog, setExchangeLog] = useState<ExchangeLogEntry[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [hallWinners, setHallWinners] = useState<HallWinner[]>([]);
  const [hallCount, setHallCount] = useState(0);
  const [study, setStudy] = useState<StudySummary | null>(null);

  const applyState = useCallback((state: { shards: number; streak: number; shields: number; claimed: boolean; pendingBigSpin: boolean }) => {
    setShards(state.shards);
    setStreak(state.streak);
    setShields(state.shields);
    setClaimed(state.claimed);
    setPendingBigSpin(state.pendingBigSpin);
  }, []);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await api.bootstrap();
      applyState(data.state);
      setRewardLog(data.rewardLog);
      setExchangeLog(data.exchangeLog);
      setInventory(data.inventory);
      setShopItems(data.shopItems);
      setHallWinners(data.hallWinners);
      setHallCount(data.hallCount);
      setStudy(data.study);
    } catch (e) {
      setError(e instanceof Error ? e.message : '서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [applyState]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const claimDaily = useCallback(async () => {
    const res = await api.claimDaily();
    applyState(res.state);
    await refresh();
    return res.reward;
  }, [applyState, refresh]);

  const spinBig = useCallback(async () => {
    const res = await api.spinBig();
    applyState(res.state);
    setMyHall(res.prize);
    await refresh();
    return res.prize;
  }, [applyState, refresh]);

  const exchangeShopItem = useCallback(
    async (item: ShopItem) => {
      const res = await api.exchange(item.id);
      applyState(res.state);
      setInventory((prev) => [res.item, ...prev]);
      setExchangeLog((prev) => [res.log, ...prev]);
      await refresh();
    },
    [applyState, refresh],
  );

  const useInventoryItem = useCallback(async (item: InventoryItem) => {
    if (item.id == null) return;
    const updated = await api.useInventory(item.id);
    setInventory((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
  }, []);

  const store = useMemo<Store>(
    () => ({
      loading,
      error,
      shards,
      streak,
      shields,
      claimed,
      pendingBigSpin,
      inventory,
      myHall,
      rewardLog,
      exchangeLog,
      shopItems,
      hallWinners,
      hallCount,
      study,
      refresh,
      claimDaily,
      spinBig,
      exchangeShopItem,
      useInventoryItem,
    }),
    [
      loading,
      error,
      shards,
      streak,
      shields,
      claimed,
      pendingBigSpin,
      inventory,
      myHall,
      rewardLog,
      exchangeLog,
      shopItems,
      hallWinners,
      hallCount,
      study,
      refresh,
      claimDaily,
      spinBig,
      exchangeShopItem,
      useInventoryItem,
    ],
  );

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
