import React from 'react';
import { useAppStore } from '../stores/appStore';

const DemoControls: React.FC = () => {
  const { setCurrentLayout } = useAppStore();

  const handleLoadDemo = async () => {
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
        }
      ]
    };
    try {
      await fetch('http://localhost:8787/broadcast/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout: demo })
      });
    } catch (e) {
      // Fallback: set locally
      setCurrentLayout(demo as any);
    }
  };

  const handleClear = () => {
    setCurrentLayout(null);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h3 className="text-white text-lg font-semibold mb-4">Demo</h3>
      <div className="flex space-x-3">
        <button
          onClick={handleLoadDemo}
          className="flex-1 bg-mentra-600 hover:bg-mentra-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Cargar HUD de ejemplo
        </button>
        <button
          onClick={handleClear}
          className="flex-1 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Limpiar HUD
        </button>
      </div>
      <p className="text-gray-400 text-xs mt-3">Usa esto si aún no tienes conexión al WebSocket de MentraOS.</p>
    </div>
  );
};

export default DemoControls;
