import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';

const ButtonSimulator: React.FC = () => {
  const { sendButtonPress, connectionStatus } = useAppStore();
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  const handleButtonPress = (button: 'power' | 'select' | 'back' | 'up' | 'down') => {
    if (connectionStatus === 'authenticated') {
      sendButtonPress(button);
      setPressedButton(button);
      setTimeout(() => setPressedButton(null), 200); // Visual feedback
    }
  };

  const isAuthenticated = connectionStatus === 'authenticated';

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h3 className="text-white text-lg font-semibold mb-4">Button Simulator</h3>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Power Button - Top Left */}
        <button
          onClick={() => handleButtonPress('power')}
          disabled={!isAuthenticated}
          className={`col-start-1 row-start-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            pressedButton === 'power'
              ? 'bg-red-700 scale-95'
              : isAuthenticated
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
          } text-white`}
        >
          Power
        </button>

        {/* Up Button - Top Center */}
        <button
          onClick={() => handleButtonPress('up')}
          disabled={!isAuthenticated}
          className={`col-start-2 row-start-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            pressedButton === 'up'
              ? 'bg-mentra-700 scale-95'
              : isAuthenticated
              ? 'bg-mentra-600 hover:bg-mentra-700'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
          } text-white`}
        >
          ↑
        </button>

        {/* Select Button - Center */}
        <button
          onClick={() => handleButtonPress('select')}
          disabled={!isAuthenticated}
          className={`col-start-2 row-start-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            pressedButton === 'select'
              ? 'bg-green-700 scale-95'
              : isAuthenticated
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
          } text-white`}
        >
          Select
        </button>

        {/* Back Button - Left */}
        <button
          onClick={() => handleButtonPress('back')}
          disabled={!isAuthenticated}
          className={`col-start-1 row-start-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            pressedButton === 'back'
              ? 'bg-gray-700 scale-95'
              : isAuthenticated
              ? 'bg-gray-600 hover:bg-gray-700'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
          } text-white`}
        >
          Back
        </button>

        {/* Down Button - Bottom Center */}
        <button
          onClick={() => handleButtonPress('down')}
          disabled={!isAuthenticated}
          className={`col-start-2 row-start-3 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            pressedButton === 'down'
              ? 'bg-mentra-700 scale-95'
              : isAuthenticated
              ? 'bg-mentra-600 hover:bg-mentra-700'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
          } text-white`}
        >
          ↓
        </button>
      </div>

      {/* Connection Status */}
      <div className="mt-6 p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium">Connection Status</span>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'authenticated'
                  ? 'bg-green-500'
                  : connectionStatus === 'connected'
                  ? 'bg-yellow-500'
                  : connectionStatus === 'connecting'
                  ? 'bg-blue-500 animate-pulse'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-gray-300 text-xs capitalize">{connectionStatus}</span>
          </div>
        </div>
        {!isAuthenticated && (
          <p className="text-gray-400 text-xs mt-2">
            Connect and authenticate to enable button controls
          </p>
        )}
      </div>
    </div>
  );
};

export default ButtonSimulator;