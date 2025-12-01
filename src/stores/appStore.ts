import { create } from 'zustand';
import { HUDLayout, HeadPosition } from '../types';
import { MentraWebSocketClient } from '../utils/websocket';

interface AppState {
  // Connection state
  wsUrl: string;
  jwtToken: string;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'authenticated';
  
  // HUD state
  currentLayout: HUDLayout | null;
  
  // Head tracking state
  headPosition: HeadPosition;
  
  // WebSocket client
  wsClient: MentraWebSocketClient | null;
  
  // Actions
  setWsUrl: (url: string) => void;
  setJwtToken: (token: string) => void;
  setConnectionStatus: (status: 'disconnected' | 'connecting' | 'connected' | 'authenticated') => void;
  setCurrentLayout: (layout: HUDLayout | null) => void;
  setHeadPosition: (position: HeadPosition) => void;
  loadDemoLayout: () => void;
  initializeWebSocket: () => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  sendHeadPosition: () => void;
  sendButtonPress: (button: 'power' | 'select' | 'back' | 'up' | 'down') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  wsUrl: (typeof window !== 'undefined' && localStorage.getItem('mentra.wsUrl')) || 'ws://localhost:8787/glasses-ws',
  jwtToken: (typeof window !== 'undefined' && localStorage.getItem('mentra.jwtToken')) || '',
  connectionStatus: 'disconnected',
  currentLayout: null,
  headPosition: { pitch: 0, yaw: 0, roll: 0 },
  wsClient: null,

  // Actions
  setWsUrl: (url) => {
    if (typeof window !== 'undefined') localStorage.setItem('mentra.wsUrl', url);
    set({ wsUrl: url });
  },
  
  setJwtToken: (token) => {
    if (typeof window !== 'undefined') localStorage.setItem('mentra.jwtToken', token);
    set({ jwtToken: token });
  },
  
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  setCurrentLayout: (layout) => set({ currentLayout: layout }),
  
  setHeadPosition: (position) => {
    set({ headPosition: position });
    // Send head position to server if connected
    const { wsClient, connectionStatus } = get();
    if (connectionStatus === 'authenticated' && wsClient) {
      wsClient.sendHeadPosition(position);
    }
  },

  loadDemoLayout: () => {
    const demo = {
      id: 'demo-1',
      elements: [
        {
          id: 'title',
          type: 'text',
          position: { x: 40, y: 40 },
          size: { width: 720, height: 60 },
          content: 'MentraSim HUD Demo',
          style: {
            fontSize: '24px',
            color: '#ffffff',
            textAlign: 'center',
            background: 'rgba(0, 102, 255, 0.2)',
            borderRadius: '12px'
          }
        },
        {
          id: 'subtitle',
          type: 'text',
          position: { x: 80, y: 120 },
          size: { width: 640, height: 40 },
          content: 'No layout received → usa este demo',
          style: {
            fontSize: '16px',
            color: '#cbd5e1'
          }
        },
        {
          id: 'image',
          type: 'image',
          position: { x: 300, y: 200 },
          size: { width: 200, height: 120 },
          content: 'https://dummyimage.com/200x120/0a0a0a/ffffff&text=HUD',
          style: {
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.15)'
          }
        },
        {
          id: 'btn',
          type: 'button',
          position: { x: 320, y: 340 },
          size: { width: 160, height: 40 },
          content: 'Simular Select',
          style: {
            background: 'rgba(16, 185, 129, 0.25)',
            borderRadius: '8px',
            color: '#ffffff'
          }
        }
      ]
    };
    set({ currentLayout: demo });
  },
  
  initializeWebSocket: () => {
    const { wsUrl } = get();
    const wsClient = new MentraWebSocketClient(wsUrl);
    
    // Set up message handlers
    wsClient.onMessage('layout_update', (data) => {
      set({ currentLayout: data.layout });
    });
    
    wsClient.onMessage('auth_status', (data) => {
      if (data.status === 'success') {
        set({ connectionStatus: 'authenticated' });
      } else {
        set({ connectionStatus: 'connected' });
      }
    });

    wsClient.onMessage('connection_status', (data) => {
      const status = data.status as 'disconnected' | 'connecting' | 'connected' | 'authenticated';
      set({ connectionStatus: status });
    });
    
    set({ wsClient });
  },
  
  connectWebSocket: () => {
    const { wsClient, jwtToken } = get();
    if (wsClient && jwtToken) {
      set({ connectionStatus: 'connecting' });
      wsClient.connect(jwtToken);
    }
  },
  
  disconnectWebSocket: () => {
    const { wsClient } = get();
    if (wsClient) {
      wsClient.disconnect();
      set({ connectionStatus: 'disconnected' });
    }
  },
  
  sendHeadPosition: () => {
    const { wsClient, headPosition, connectionStatus } = get();
    if (connectionStatus === 'authenticated' && wsClient) {
      wsClient.sendHeadPosition(headPosition);
    }
  },
  
  sendButtonPress: (button) => {
    const { wsClient, connectionStatus } = get();
    if (connectionStatus === 'authenticated' && wsClient) {
      wsClient.sendButtonPress(button);
    }
  },
}));
