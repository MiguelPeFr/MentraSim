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

- **Abrir conexión**: La ventana de control se abre en `#/connect`. Introduce la URL del WebSocket y tu JWT.
- **Panel de control**: Ve a `#/control` para simular movimiento de cabeza y botones.
- **HUD**: La ventana principal `#/` muestra los layouts recibidos.
- **Sin servidor**: Usa el botón “Cargar HUD de ejemplo” en el panel de control para ver un layout de prueba cuando veas “No layout received”.

### Push Layout desde el panel
- En `#/control`, usa el panel "Push Layout" para enviar layouts al Mock Cloud:
- Botones rápidos: `Recorder`, `Translation`, `Camera`.
- Personalizado: pega un JSON `HUDLayout` y pulsa `Enviar JSON`.
- Endpoint configurable: por defecto `http://localhost:8787/broadcast/layout`.

### Paso a paso (MentraOS Cloud)
- Configura `WebSocket URL`: `wss://<tu-cloud>/glasses-ws`
- Pega tu `JWT` de la Developer Console
- Pulsa `Connect` y espera estado `authenticated`
- Lanza tu AppServer de MentraOS; cuando llame a `session.layouts.*`, verás el layout en el HUD

### Paso a paso (sin Cloud, demo)
- Abre la ventana de control `#/control`
- Pulsa “Cargar HUD de ejemplo” para renderizar un layout local
- Ajusta sliders de cabeza y prueba botones para validar la UI

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
