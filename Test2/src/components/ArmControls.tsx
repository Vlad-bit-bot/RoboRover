import React, { useState } from 'react';
import { 
  Zap, 
  RotateCcw,
  RotateCw,
  ArrowUp,
  ArrowDown,
  Grip,
  Home,
  Target,
  Settings,
  Play
} from 'lucide-react';

interface ArmControlsProps {
  disabled: boolean;
}

const ArmControls: React.FC<ArmControlsProps> = ({ disabled }) => {
  const [joints, setJoints] = useState([0, 0, 0, 0, 0, 0]);
  const [gripperOpen, setGripperOpen] = useState(50);
  const [selectedJoint, setSelectedJoint] = useState(0);
  const [currentPreset, setCurrentPreset] = useState('custom');

  const jointNames = ['Base', 'Shoulder', 'Elbow', 'Wrist 1', 'Wrist 2', 'Wrist 3'];
  const presets = {
    home: [0, 0, 0, 0, 0, 0],
    ready: [0, -45, 90, -45, 0, 0],
    pick: [0, -60, 120, -60, 0, 0],
    stow: [0, 90, -90, 0, 0, 0]
  };

  const updateJoint = (index: number, value: number) => {
    if (disabled) return;
    const newJoints = [...joints];
    newJoints[index] = Math.max(-180, Math.min(180, value));
    setJoints(newJoints);
    setCurrentPreset('custom');
  };

  const loadPreset = (presetName: string) => {
    if (disabled) return;
    setJoints([...presets[presetName as keyof typeof presets]]);
    setCurrentPreset(presetName);
  };

  const JointControl: React.FC<{ index: number; name: string; value: number }> = ({ index, name, value }) => (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${
      selectedJoint === index 
        ? 'border-cyan-400 bg-cyan-400/10' 
        : 'border-gray-600'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-200">{name}</span>
        <span className="text-sm text-gray-400">{value}°</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateJoint(index, value - 5)}
          disabled={disabled}
          className={`p-1 rounded border transition-all duration-200 ${
            disabled
              ? 'border-gray-600 text-gray-500'
              : 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
          }`}
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        
        <input
          type="range"
          min="-180"
          max="180"
          value={value}
          onChange={(e) => updateJoint(index, parseInt(e.target.value))}
          onClick={() => setSelectedJoint(index)}
          disabled={disabled}
          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        
        <button
          onClick={() => updateJoint(index, value + 5)}
          disabled={disabled}
          className={`p-1 rounded border transition-all duration-200 ${
            disabled
              ? 'border-gray-600 text-gray-500'
              : 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
          }`}
        >
          <RotateCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">6DOF Robotic Arm</h2>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-green-400 rounded-full"></div>
          <span className="text-sm text-gray-300">Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Joint Controls */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-200">Joint Control</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {joints.map((angle, index) => (
              <JointControl
                key={index}
                index={index}
                name={jointNames[index]}
                value={angle}
              />
            ))}
          </div>

          {/* Gripper Control */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-200 flex items-center">
                <Grip className="h-4 w-4 mr-2" />
                End Effector
              </h4>
              <span className="text-sm text-gray-400">{gripperOpen}%</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setGripperOpen(0)}
                disabled={disabled}
                className={`px-3 py-2 rounded border transition-all duration-200 ${
                  disabled
                    ? 'border-gray-600 text-gray-500'
                    : 'border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400'
                }`}
              >
                Close
              </button>
              
              <input
                type="range"
                min="0"
                max="100"
                value={gripperOpen}
                onChange={(e) => setGripperOpen(parseInt(e.target.value))}
                disabled={disabled}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              
              <button
                onClick={() => setGripperOpen(100)}
                disabled={disabled}
                className={`px-3 py-2 rounded border transition-all duration-200 ${
                  disabled
                    ? 'border-gray-600 text-gray-500'
                    : 'border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400'
                }`}
              >
                Open
              </button>
            </div>
          </div>
        </div>

        {/* Presets and Actions */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Preset Positions</h3>
            <div className="space-y-2">
              {Object.keys(presets).map((presetName) => (
                <button
                  key={presetName}
                  onClick={() => loadPreset(presetName)}
                  disabled={disabled}
                  className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center space-x-3 ${
                    currentPreset === presetName
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                      : disabled
                        ? 'border-gray-600 text-gray-500'
                        : 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
                  }`}
                >
                  <Home className="h-5 w-5" />
                  <span className="capitalize">{presetName}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                disabled={disabled}
                className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center space-x-3 ${
                  disabled
                    ? 'border-gray-600 text-gray-500'
                    : 'border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400'
                }`}
              >
                <Play className="h-5 w-5" />
                <span>Execute Sequence</span>
              </button>
              
              <button
                disabled={disabled}
                className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center space-x-3 ${
                  disabled
                    ? 'border-gray-600 text-gray-500'
                    : 'border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-400'
                }`}
              >
                <Target className="h-5 w-5" />
                <span>Calibrate</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-gray-200 mb-4 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Arm Status
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Preset:</span>
                <span className="text-gray-300 capitalize">{currentPreset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tool Load:</span>
                <span className="text-gray-300">2.1 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gripper Force:</span>
                <span className="text-gray-300">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Speed:</span>
                <span className="text-gray-300">Normal</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600/30">
            <h4 className="font-semibold text-blue-300 mb-2">Safety Notice</h4>
            <p className="text-xs text-blue-200">
              Always ensure the work area is clear before moving the arm. 
              Emergency stop is available at all times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArmControls;