import React, { useState } from 'react';
import { 
  Plane, 
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  RotateCw,
  Navigation,
  Compass,
  Wind,
  Gauge,
  Square,
  Home
} from 'lucide-react';

interface DroneControlsProps {
  disabled: boolean;
}

const DroneControls: React.FC<DroneControlsProps> = ({ disabled }) => {
  const [droneStatus, setDroneStatus] = useState('landed');
  const [altitude, setAltitude] = useState(0);
  const [speed, setSpeed] = useState(5);
  const [heading, setHeading] = useState(0);
  const [battery, setBattery] = useState(92);
  const [gpsLocked, setGpsLocked] = useState(true);

  const handleTakeoffLanding = () => {
    if (disabled) return;
    
    if (droneStatus === 'landed') {
      setDroneStatus('flying');
      setAltitude(2);
    } else {
      setDroneStatus('landing');
      setTimeout(() => {
        setDroneStatus('landed');
        setAltitude(0);
      }, 3000);
    }
  };

  const handleMovement = (direction: string) => {
    if (disabled || droneStatus === 'landed') return;
    
    // Simulate movement feedback
    console.log(`Drone moving: ${direction}`);
  };

  const adjustAltitude = (delta: number) => {
    if (disabled || droneStatus === 'landed') return;
    setAltitude(Math.max(0, Math.min(50, altitude + delta)));
  };

  const ControlButton: React.FC<{ 
    onClick: () => void;
    icon: React.ReactNode;
    disabled?: boolean;
    className?: string;
  }> = ({ onClick, icon, disabled: buttonDisabled = false, className = '' }) => (
    <button
      onClick={onClick}
      disabled={disabled || buttonDisabled}
      className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
        disabled || buttonDisabled
          ? 'border-gray-600 text-gray-500 cursor-not-allowed'
          : 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-400/10'
      } ${className}`}
    >
      {icon}
    </button>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Drone Control</h2>
        <div className="flex items-center space-x-4">
          <div className={`h-3 w-3 rounded-full ${
            droneStatus === 'flying' ? 'bg-green-400' : 
            droneStatus === 'landing' ? 'bg-yellow-400 animate-pulse' : 'bg-gray-500'
          }`}></div>
          <span className="text-sm text-gray-300 capitalize">{droneStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Flight Controls */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-200">Flight Control</h3>
          
          {/* Takeoff/Landing */}
          <div className="flex justify-center">
            <button
              onClick={handleTakeoffLanding}
              disabled={disabled}
              className={`px-8 py-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                disabled
                  ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                  : droneStatus === 'landed'
                    ? 'border-green-500 bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'border-red-500 bg-red-500/20 text-red-400 hover:bg-red-500/30'
              }`}
            >
              <Plane className="h-6 w-6" />
              <span className="font-semibold">
                {droneStatus === 'landed' ? 'Takeoff' : 'Land'}
              </span>
            </button>
          </div>

          {/* Movement Controls */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-300">Horizontal Movement</h4>
            <div className="grid grid-cols-3 gap-2 w-fit mx-auto">
              <div></div>
              <ControlButton
                onClick={() => handleMovement('forward')}
                icon={<ArrowUp className="h-6 w-6" />}
                disabled={droneStatus === 'landed'}
              />
              <div></div>
              
              <ControlButton
                onClick={() => handleMovement('left')}
                icon={<ArrowLeft className="h-6 w-6" />}
                disabled={droneStatus === 'landed'}
              />
              <ControlButton
                onClick={() => handleMovement('hover')}
                icon={<Square className="h-6 w-6" />}
                disabled={droneStatus === 'landed'}
                className="border-yellow-600 hover:border-yellow-500 text-yellow-400"
              />
              <ControlButton
                onClick={() => handleMovement('right')}
                icon={<ArrowRight className="h-6 w-6" />}
                disabled={droneStatus === 'landed'}
              />
              
              <div></div>
              <ControlButton
                onClick={() => handleMovement('backward')}
                icon={<ArrowDown className="h-6 w-6" />}
                disabled={droneStatus === 'landed'}
              />
              <div></div>
            </div>
          </div>

          {/* Rotation Controls */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-300">Rotation</h4>
            <div className="flex justify-center space-x-4">
              <ControlButton
                onClick={() => handleMovement('rotate-left')}
                icon={<RotateCcw className="h-6 w-6" />}
                disabled={droneStatus === 'landed'}
              />
              <ControlButton
                onClick={() => handleMovement('rotate-right')}
                icon={<RotateCw className="h-6 w-6" />}
                disabled={droneStatus === 'landed'}
              />
            </div>
          </div>

          {/* Altitude Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-300">Altitude</h4>
              <span className="text-gray-400">{altitude.toFixed(1)}m</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <ControlButton
                onClick={() => adjustAltitude(-0.5)}
                icon={<ArrowDown className="h-5 w-5" />}
                disabled={droneStatus === 'landed'}
                className="p-2"
              />
              
              <div className="flex-1 bg-gray-700 rounded-lg h-12 relative">
                <div 
                  className="bg-cyan-400 h-full rounded-lg transition-all duration-300"
                  style={{ width: `${Math.min(100, (altitude / 50) * 100)}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                  {altitude.toFixed(1)}m
                </div>
              </div>
              
              <ControlButton
                onClick={() => adjustAltitude(0.5)}
                icon={<ArrowUp className="h-5 w-5" />}
                disabled={droneStatus === 'landed'}
                className="p-2"
              />
            </div>
          </div>
        </div>

        {/* Status and Settings */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-200">Status & Telemetry</h3>
          
          {/* Flight Data */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-gray-200 mb-4">Flight Data</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Battery:</span>
                  <span className={`${battery > 30 ? 'text-green-400' : 'text-red-400'}`}>
                    {battery}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GPS:</span>
                  <span className={`${gpsLocked ? 'text-green-400' : 'text-red-400'}`}>
                    {gpsLocked ? 'Locked' : 'Searching'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Altitude:</span>
                  <span className="text-gray-300">{altitude.toFixed(1)}m</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Speed:</span>
                  <span className="text-gray-300">{speed} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Heading:</span>
                  <span className="text-gray-300">{heading}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wind:</span>
                  <span className="text-gray-300">3.2 m/s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-300">Flight Settings</h4>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Speed Limit</label>
              <div className="flex items-center space-x-4">
                <Gauge className="h-4 w-4 text-gray-400" />
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  disabled={disabled}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-300 w-12">{speed} m/s</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Flight Mode</label>
              <select 
                disabled={disabled}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300"
              >
                <option>Stabilized</option>
                <option>Position Hold</option>
                <option>Return to Home</option>
                <option>Follow Me</option>
              </select>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-300">Quick Actions</h4>
            
            <button
              disabled={disabled || droneStatus === 'landed'}
              className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center space-x-3 ${
                disabled || droneStatus === 'landed'
                  ? 'border-gray-600 text-gray-500'
                  : 'border-gray-600 text-gray-300 hover:border-orange-500 hover:text-orange-400'
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Return to Home</span>
            </button>
            
            <button
              disabled={disabled || droneStatus === 'landed'}
              className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center space-x-3 ${
                disabled || droneStatus === 'landed'
                  ? 'border-gray-600 text-gray-500'
                  : 'border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400'
              }`}
            >
              <Navigation className="h-5 w-5" />
              <span>Waypoint Mission</span>
            </button>
          </div>

          {/* Safety Warning */}
          <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-600/30">
            <h4 className="font-semibold text-yellow-300 mb-2 flex items-center">
              <Wind className="h-4 w-4 mr-2" />
              Weather Alert
            </h4>
            <p className="text-xs text-yellow-200">
              Wind conditions are moderate. Monitor flight stability and consider landing if conditions worsen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneControls;