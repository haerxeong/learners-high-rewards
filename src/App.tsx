import { useEffect, useState, type ReactNode } from 'react';
import { SideNav } from './components/SideNav';
import { StoreProvider } from './store';
import { StreakHome } from './screens/StreakHome';
import { RewardScreen } from './screens/reward/RewardScreen';
import { BigRoulette } from './screens/reward/BigRoulette';
import { ShopScreen } from './screens/ShopScreen';
import { StorageScreen } from './screens/StorageScreen';
import { HallScreen } from './screens/HallScreen';
import type { TabKey } from './types';

const TABLET_W = 1194;
const TABLET_H = 834;

/* 고정 크기 콘텐츠를 뷰포트에 맞게 스케일 */
function Fit({ w, h, pad = 40, children }: { w: number; h: number; pad?: number; children: ReactNode }) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    function calc() {
      const aw = window.innerWidth - pad;
      const ah = window.innerHeight - pad;
      setScale(Math.min(1, aw / w, ah / h));
    }
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [w, h, pad]);
  return (
    <div style={{ width: w * scale, height: h * scale }}>
      <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  );
}

/* 태블릿(iPad 가로) 베젤 프레임 */
function TabletDevice({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: TABLET_W,
        height: TABLET_H,
        borderRadius: 38,
        padding: 14,
        background: '#05070a',
        boxShadow: '0 50px 110px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 26,
          overflow: 'hidden',
          position: 'relative',
          background: 'var(--bg)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function TabletApp() {
  const [tab, setTab] = useState<TabKey>('reward');
  const [bigOpen, setBigOpen] = useState(false);

  const screen: Record<TabKey, ReactNode> = {
    home: <StreakHome />,
    reward: <RewardScreen onOpenBig={() => setBigOpen(true)} />,
    shop: <ShopScreen />,
    storage: <StorageScreen />,
    hall: <HallScreen />,
  };

  return (
    <div style={{ height: '100%', display: 'flex' }}>
      <SideNav active={tab} onChange={setTab} />
      <div style={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden', background: 'var(--bg)' }}>
        {screen[tab]}
        {bigOpen && <BigRoulette onClose={() => setBigOpen(false)} onWin={() => setTab('hall')} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <div style={{ minHeight: '100vh', background: '#07090d', display: 'grid', placeItems: 'center', padding: 20 }}>
        <Fit w={TABLET_W} h={TABLET_H}>
          <TabletDevice>
            <TabletApp />
          </TabletDevice>
        </Fit>
      </div>
    </StoreProvider>
  );
}
