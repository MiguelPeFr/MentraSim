import React, { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

const ConnectionManager: React.FC = () => {
  const {
    wsUrl,
    jwtToken,
    connectionStatus,
    setWsUrl,
    setJwtToken,
    initializeWebSocket,
    connectWebSocket,
    disconnectWebSocket
  } = useAppStore();

  useEffect(() => {
    initializeWebSocket();
  }, []);

  const handleConnect = () => {
    if (jwtToken && wsUrl) {
      connectWebSocket();
    }
  };

  const handleDisconnect = () => {
    disconnectWebSocket();
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'authenticated':
        return 'text-green-400';
      case 'connected':
        return 'text-yellow-400';
      case 'connecting':
        return 'text-blue-400';
      default:
        return 'text-red-400';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'authenticated':
        return '✓';
      case 'connected':
        return '!';
      case 'connecting':
        return '⟳';
      default:
        return '✗';
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h3 className="text-white text-lg font-semibold mb-4">Connection Settings</h3>
      
      {/* WebSocket URL */}
      <div className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">
          WebSocket URL
        </label>
        <input
          type="text"
          value={wsUrl}
          onChange={(e) => setWsUrl(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mentra-500"
          placeholder="ws://localhost:8080/glasses-ws"
        />
      </div>

      {/* JWT Token */}
      <div className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">
          JWT Token
        </label>
        <textarea
          value={jwtToken}
          onChange={(e) => setJwtToken(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mentra-500 h-20 resize-none"
          placeholder="Enter your JWT token..."
        />
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium">Status</span>
          <div className="flex items-center space-x-2">
            <span className={`text-lg ${getStatusColor()}`}>{getStatusIcon()}</span>
            <span className={`text-sm font-medium capitalize ${getStatusColor()}`}>
              {connectionStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleConnect}
          disabled={!jwtToken || connectionStatus === 'connecting' || connectionStatus === 'authenticated'}
          className="flex-1 bg-mentra-600 hover:bg-mentra-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
        </button>
        
        <button
          onClick={handleDisconnect}
          disabled={connectionStatus === 'disconnected' || connectionStatus === 'connecting'}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Disconnect
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-800 rounded-lg">
        <h4 className="text-white text-sm font-medium mb-2">Instructions</h4>
        <ul className="text-gray-300 text-xs space-y-1">
          <li>• Enter your WebSocket server URL</li>
          <li>• Provide a valid JWT token</li>
          <li>• Click Connect to establish connection</li>
          <li>• Status will show "authenticated" when ready</li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectionManager;