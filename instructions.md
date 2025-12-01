​

1. Arquitectura general del simulador
MentraOS Cloud mantiene dos WebSocket servers: uno para apps (/app-ws) y otro para gafas (/glasses-ws).​

Tu app hoy se conecta como “app server” (terceros) y las gafas reales se conectarían al endpoint de glasses; tu simulador sería un cliente que imita esas gafas y habla el mismo protocolo (button_press, head_position, layouts, etc.).​

Esquema mínimo:

Backend simulador (Node/TS o lo que prefieras) que abre un WebSocket a wss://.../glasses-ws con el JWT correcto.​

Frontend “HUD viewer” (React/Electron o web normal) que recibe del backend los mensajes de layout y eventos y renderiza la UI.​

2. Entender mensajes y eventos
El SDK describe claramente los eventos que se esperan (button_press, head_position, photo, location, etc.) y cómo las apps los consumen vía session.events.onHeadPosition, onButtonPress, etc.​

En la Cloud docs tienes la lista de message types (button_press, head_position, location_update, etc.) que viajan por WebSocket entre Cloud y gafas.​

Lo que tienes que hacer es el “inverso” de tu app:

Tu simulador envía mensajes tipo button_press y head_position al Cloud, de forma que el EventManager del SDK los vea igual que si vinieran de hardware.​

Tu simulador recibe mensajes de “display/layout” del Cloud (los que normalmente hacen que cambie lo que ve el usuario) y los traduce a componentes en tu HUD.​

3. Conexión WebSocket como gafas
Obtener cómo se autentican las gafas: en la Cloud API se explica que tanto apps como glasses se autentican con un JWT en el Authorization: Bearer <token> al abrir el WebSocket.​

Mirar en la doc de “WebSocket Service / glasses-ws” la ruta y headers adicionales (por ejemplo x-user-id, x-session-id para apps; gafas pueden tener algo equivalente).​

Implementar un pequeño cliente de prueba en Node:

Usa la librería ws o similar.​

Abre conexión a /glasses-ws con el JWT.​

Haz console.log de todos los mensajes entrantes (para ver cómo llegan layouts, notificaciones, etc.).​

Con esa fase ya “sniffeas” el protocolo real sin hardware: puedes ver qué JSON te manda el Cloud cuando tu app llama a session.layouts.*.​

4. Diseñar el formato de layouts del HUD
El SDK expone un DisplayManager y layouts de alto nivel (por ejemplo showTextWall, estados, etc.), y la Cloud docs tiene una sección de “Message types” donde se ven los payloads usados.​

A partir de lo que veas en el sniffer de arriba, defines un modelo de datos en tu simulador, por ejemplo:

type LayoutMessage = { type: 'TEXT_WALL' | 'DASHBOARD' | 'TOAST', text: string, ... }. ​

Mapeas 1‑1 los campos del JSON entrante a tus componentes React (p.ej. <TextWallLayout msg={layout} />).​

Frontend:

Puedes copiar la estructura del ejemplo “MentraOS-React-Example-App” (usa Vite + React + Tailwind) y cambiar el TranscriptDisplay por un LayoutDisplay que en vez de SSE consuma WebSocket.​

Ese frontend se comunica con tu backend simulador por un WebSocket local o por postMessage si usas Electron.​

5. Simular inputs (head, botones…)
En el EventManager ves qué espera la app: onHeadPosition({ position: 'up' | 'down' }), onButtonPress({ buttonId, pressType }), etc. ​

Desde tu frontend pones controles para enviar estos eventos:

Teclas del teclado mapeadas a botones físicos (espacio = botón principal, flechas = up/down head).​

UI de debug con botones “Head up”, “Head down”, “Short press”, “Long press”.​

Esos eventos los mandas al backend simulador (tu proceso Node) y este los empaqueta en el JSON correcto y los envía por el WebSocket /glasses-ws al Cloud como si fueran las gafas.​

6. Integrarlo en tu ciclo de desarrollo
Tu app MentraOS sigue igual: un AppServer corriendo en tu máquina y registrado en la Developer Console.​

Levantas tres procesos:

App server (Mentra app) con hot‑reload.​

Simulador backend (cliente glasses‑ws).​

HUD viewer (React/Electron) conectado al simulador backend.​

Desde ese punto:

Llamadas a session.layouts.* de tu app se reflejan en la ventana del simulador.​

Eventos de teclado/UI del simulador llegan a tu app como session.events.onButtonPress y onHeadPosition.​