import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectionManager from '../components/ConnectionManager';

const ConnectionPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">MentraSim</h1>
          <p className="text-gray-400">Connect to MentraOS WebSocket server</p>
        </div>
        
        <ConnectionManager />
        
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            Mentra Simulator for testing MentraOS applications
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/control')}
            className="w-full bg-mentra-600 hover:bg-mentra-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Ir al Panel de Control
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionPage;
