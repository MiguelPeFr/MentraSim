import React from 'react';
import { useAppStore } from '../stores/appStore';

const StatusBar: React.FC = () => {
  const { connectionStatus } = useAppStore();

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'authenticated':
        return 'bg-green-500';
      case 'connected':
        return 'bg-yellow-500';
      case 'connecting':
        return 'bg-blue-500';
      default:
        return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'authenticated':
        return 'Connected';
      case 'connected':
        return 'Connected (Not Auth)';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Disconnected';
    }
  };

  return (
    <div className="fixed top-4 right-4 hud-element p-3 backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <span className="hud-text text-xs font-medium">{getStatusText()}</span>
      </div>
    </div>
  );
};

export default StatusBar;