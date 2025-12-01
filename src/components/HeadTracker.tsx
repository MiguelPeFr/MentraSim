import React from 'react';
import { useAppStore } from '../stores/appStore';

const HeadTracker: React.FC = () => {
  const { headPosition, setHeadPosition } = useAppStore();

  const handlePitchChange = (value: number) => {
    setHeadPosition({ ...headPosition, pitch: value });
  };

  const handleYawChange = (value: number) => {
    setHeadPosition({ ...headPosition, yaw: value });
  };

  const handleRollChange = (value: number) => {
    setHeadPosition({ ...headPosition, roll: value });
  };

  const resetPosition = () => {
    setHeadPosition({ pitch: 0, yaw: 0, roll: 0 });
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h3 className="text-white text-lg font-semibold mb-4">Head Tracker</h3>
      
      <div className="space-y-6">
        {/* Pitch Control */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Pitch: {headPosition.pitch}°
          </label>
          <input
            type="range"
            min="-90"
            max="90"
            value={headPosition.pitch}
            onChange={(e) => handlePitchChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>-90°</span>
            <span>0°</span>
            <span>90°</span>
          </div>
        </div>

        {/* Yaw Control */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Yaw: {headPosition.yaw}°
          </label>
          <input
            type="range"
            min="-180"
            max="180"
            value={headPosition.yaw}
            onChange={(e) => handleYawChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>-180°</span>
            <span>0°</span>
            <span>180°</span>
          </div>
        </div>

        {/* Roll Control */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Roll: {headPosition.roll}°
          </label>
          <input
            type="range"
            min="-90"
            max="90"
            value={headPosition.roll}
            onChange={(e) => handleRollChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>-90°</span>
            <span>0°</span>
            <span>90°</span>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetPosition}
          className="w-full bg-mentra-600 hover:bg-mentra-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Reset Position
        </button>

        {/* Current Position Display */}
        <div className="bg-gray-800 p-3 rounded-lg">
          <h4 className="text-white text-sm font-medium mb-2">Current Position</h4>
          <div className="text-gray-300 text-xs space-y-1">
            <div>Pitch: <span className="text-mentra-400">{headPosition.pitch}°</span></div>
            <div>Yaw: <span className="text-mentra-400">{headPosition.yaw}°</span></div>
            <div>Roll: <span className="text-mentra-400">{headPosition.roll}°</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadTracker;