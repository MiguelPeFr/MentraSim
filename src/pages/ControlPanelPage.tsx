import React from 'react';
import HeadTracker from '../components/HeadTracker';
import ButtonSimulator from '../components/ButtonSimulator';
import DemoControls from '../components/DemoControls';
import PushLayoutPanel from '../components/PushLayoutPanel';

const ControlPanelPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-2xl font-bold mb-6">MentraSim Control Panel</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Head Tracker */}
          <div>
            <HeadTracker />
          </div>
          
          {/* Button Simulator */}
          <div>
            <ButtonSimulator />
          </div>
        </div>

        {/* Demo Controls */}
        <div className="mt-6">
          <DemoControls />
        </div>

        {/* Push Layout Panel */}
        <div className="mt-6">
          <PushLayoutPanel />
        </div>
        
        {/* Instructions */}
        <div className="mt-6 bg-gray-900 p-6 rounded-lg">
          <h3 className="text-white text-lg font-semibold mb-3">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
            <div>
              <h4 className="text-white font-medium mb-2">Head Tracker</h4>
              <ul className="space-y-1">
                <li>• Adjust pitch (-90° to 90°)</li>
                <li>• Control yaw (-180° to 180°)</li>
                <li>• Set roll (-90° to 90°)</li>
                <li>• Use Reset to return to center</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Button Simulator</h4>
              <ul className="space-y-1">
                <li>• Power button (red) - System control</li>
                <li>• Select button (green) - Confirm actions</li>
                <li>• Back button (gray) - Navigate back</li>
                <li>• Up/Down arrows - Navigate menus</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanelPage;
