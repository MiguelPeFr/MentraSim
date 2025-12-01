export interface LayoutElement {
  id: string;
  type: 'text' | 'image' | 'button';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  style?: Record<string, any>;
}

export interface HUDLayout {
  id: string;
  elements: LayoutElement[];
}

export interface HeadPosition {
  pitch: number; // -90 to 90
  yaw: number;   // -180 to 180
  roll: number;  // -90 to 90
}

export interface WebSocketMessage {
  type: string;
  data?: any;
}

export interface AuthMessage extends WebSocketMessage {
  type: 'auth';
  token: string;
}

export interface AuthStatusMessage extends WebSocketMessage {
  type: 'auth_status';
  status: 'success' | 'failed';
  message?: string;
}

export interface LayoutUpdateMessage extends WebSocketMessage {
  type: 'layout_update';
  layout: HUDLayout;
}

export interface HeadPositionMessage extends WebSocketMessage {
  type: 'head_position';
  data: HeadPosition;
}

export interface ButtonPressMessage extends WebSocketMessage {
  type: 'button_press';
  button: 'power' | 'select' | 'back' | 'up' | 'down';
}

export type WebSocketEvent = 
  | AuthMessage
  | AuthStatusMessage
  | LayoutUpdateMessage
  | HeadPositionMessage
  | ButtonPressMessage;