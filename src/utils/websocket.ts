import { WebSocketEvent, AuthMessage, HeadPositionMessage, ButtonPressMessage, HeadPosition } from '../types';

export class MentraWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private jwtToken: string | null = null;
  private reconnectInterval: number = 3000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'authenticated' = 'disconnected';

  constructor(url: string) {
    this.url = url;
  }

  public connect(token: string): void {
    this.jwtToken = token;
    this.connectionStatus = 'connecting';
    
    try {
      this.ws = new WebSocket(this.url);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.scheduleReconnect();
    }
  }

  public disconnect(): void {
    this.connectionStatus = 'disconnected';
    this.reconnectAttempts = 0;
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public sendHeadPosition(position: HeadPosition): void {
    if (this.connectionStatus === 'authenticated' && this.ws?.readyState === WebSocket.OPEN) {
      const message: HeadPositionMessage = {
        type: 'head_position',
        data: position
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  public sendButtonPress(button: 'power' | 'select' | 'back' | 'up' | 'down'): void {
    if (this.connectionStatus === 'authenticated' && this.ws?.readyState === WebSocket.OPEN) {
      const message: ButtonPressMessage = {
        type: 'button_press',
        button
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  public onMessage(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  public getConnectionStatus(): string {
    return this.connectionStatus;
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.connectionStatus = 'connected';
      this.reconnectAttempts = 0;
      const statusHandler = this.messageHandlers.get('connection_status');
      if (statusHandler) statusHandler({ status: this.connectionStatus });
      this.authenticate();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketEvent = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.connectionStatus = 'disconnected';
      const statusHandler = this.messageHandlers.get('connection_status');
      if (statusHandler) statusHandler({ status: this.connectionStatus });
      this.scheduleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionStatus = 'disconnected';
      const statusHandler = this.messageHandlers.get('connection_status');
      if (statusHandler) statusHandler({ status: this.connectionStatus });
    };
  }

  private authenticate(): void {
    if (!this.jwtToken || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const authMessage: AuthMessage = {
      type: 'auth',
      token: this.jwtToken
    };

    this.ws.send(JSON.stringify(authMessage));
  }

  private handleMessage(message: WebSocketEvent): void {
    switch (message.type) {
      case 'auth_status':
        if (message.status === 'success') {
          this.connectionStatus = 'authenticated';
          console.log('Authentication successful');
        } else {
          console.error('Authentication failed:', message.message);
          this.connectionStatus = 'connected'; // Stay connected but not authenticated
        }
        {
          const handler = this.messageHandlers.get('auth_status');
          if (handler) handler(message);
        }
        break;
      
      case 'layout_update':
      case 'head_position':
      case 'button_press':
        const handler = this.messageHandlers.get(message.type);
        if (handler) {
          handler(message.data || message);
        }
        break;
      
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting in ${this.reconnectInterval}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.jwtToken) {
        this.connect(this.jwtToken);
      }
    }, this.reconnectInterval);
  }
}
