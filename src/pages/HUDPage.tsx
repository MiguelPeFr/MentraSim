import React, { useEffect } from 'react';
import HUDRenderer from '../components/HUDRenderer';
import StatusBar from '../components/StatusBar';
import { useAppStore } from '../stores/appStore';

const HUDPage: React.FC = () => {
  const { currentLayout } = useAppStore();

  useEffect(() => {
    // Initialize WebSocket connection when HUD page loads
    const { initializeWebSocket } = useAppStore.getState();
    initializeWebSocket();
    const { connectWebSocket, jwtToken } = useAppStore.getState();
    if (jwtToken) connectWebSocket();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'mentra.jwtToken' || e.key === 'mentra.wsUrl') {
        const { connectWebSocket } = useAppStore.getState();
        connectWebSocket();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="w-screen h-screen bg-transparent overflow-hidden relative">
      <HUDRenderer layout={currentLayout} />
      <StatusBar />
    </div>
  );
};

export default HUDPage;
