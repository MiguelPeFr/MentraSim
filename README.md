# MentraSim

MentraSim is a desktop simulator for MentraOS glasses that allows developers to test MentraOS applications without needing the physical glasses hardware.

## Features

- **HUD Renderer**: Displays application layouts in a transparent overlay window
- **Head Tracker**: Simulates head movement with pitch, yaw, and roll controls
- **Button Simulator**: Virtual buttons for power, select, back, up, and down
- **WebSocket Connection**: Connects to MentraOS WebSocket server with JWT authentication
- **Real-time Communication**: Sends head position and button press events to the server

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

This will start:
- Vite development server on http://localhost:5173
- Electron application with HUD window and control panel

## Usage

- Connection: open `#/connect`, enter your WebSocket URL and JWT.
- Control Panel: go to `#/control` to simulate head movement and button presses.
- HUD: the main window `#/` renders layouts received from the server.
- No server: use “Load demo HUD” in the control panel to render a sample layout when you see “No layout received”.

### Push Layout from the panel
- In `#/control`, use the "Push Layout" panel to send layouts to the local Mock Cloud:
- Quick buttons: `Recorder`, `Translation`, `Camera`.
- Custom: paste a `HUDLayout` JSON and click `Send JSON`.
- Configurable endpoint: defaults to `http://localhost:8787/broadcast/layout`.

### Step-by-step (MentraOS Cloud)
- Set `WebSocket URL`: `wss://<your-cloud>/glasses-ws`
- Paste your `JWT` from the Developer Console
- Click `Connect` and wait for `authenticated`
- Run your MentraOS AppServer; when it calls `session.layouts.*`, the HUD will render the layout

### Step-by-step (no Cloud, demo)
- Open the control panel `#/control`
- Click “Load demo HUD” to render a local layout
- Adjust head sliders and try buttons to validate the UI

## Architecture

- **Frontend**: React + TypeScript + TailwindCSS
- **Desktop**: Electron
- **State Management**: Zustand
- **WebSocket**: Native WebSocket API with reconnection logic
- **Build**: Vite + electron-builder

## WebSocket Events

### Authentication
```javascript
// Send
{ type: 'auth', token: 'jwt_token_here' }

// Receive
{ type: 'auth_status', status: 'success' | 'failed' }
```

### Layout Updates
```javascript
// Receive
{
  type: 'layout_update',
  layout: {
    id: string,
    elements: Array<{
      type: 'text' | 'image' | 'button',
      position: { x: number, y: number },
      size: { width: number, height: number },
      content: string,
      style?: object
    }>
  }
}
```

### Head Position
```javascript
// Send
{
  type: 'head_position',
  data: { pitch: number, yaw: number, roll: number }
}
```

### Button Press
```javascript
// Send
{
  type: 'button_press',
  button: 'power' | 'select' | 'back' | 'up' | 'down'
}
```

## Building for Production

```bash
npm run build
```

This will create distributable packages for your platform in the `dist` directory.
