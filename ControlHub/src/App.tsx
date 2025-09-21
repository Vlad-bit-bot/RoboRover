import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Power, 
  AlertTriangle, 
  Wifi,
  Battery,
  Camera,
  Move,
  Zap,
  Plane
} from 'lucide-react';
import RobotControls from './components/RobotControls';
import ArmControls from './components/ArmControls';
import DroneControls from './components/DroneControls';
import TelemetryPanel from './components/TelemetryPanel';
import SettingsPanel from './components/SettingsPanel';
import EmergencyStop from './components/EmergencyStop';
import StatusBar from './components/StatusBar';

type ActiveTab = 'rover' | 'arm' | 'drone' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('rover');
  const [isConnected, setIsConnected] = useState(false);
  const [emergencyStop, setEmergencyStop] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    robot: { status: 'idle', battery: 85 },
    camera: { status: 'active', recording: false },
    arm: { status: 'ready', position: 'home' },
    drone: { status: 'landed', battery: 92, altitude: 0 }
  });

  useEffect(() => {
    // Simulate connection status
    const timer = setTimeout(() => setIsConnected(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'rover', label: 'Rover Control', icon: Move },
    { id: 'arm', label: 'Arm', icon: Zap },
    { id: 'drone', label: 'Drone', icon: Plane },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'rover':
        return <RobotControls disabled={emergencyStop} />;
      case 'arm':
        return <ArmControls disabled={emergencyStop} />;
      case 'drone':
        return <DroneControls disabled={emergencyStop} />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <RobotControls disabled={emergencyStop} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Power className="h-6 w-6 text-cyan-400" />
              <h1 className="text-xl font-bold">RoboRover Control</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-300">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Battery className="h-4 w-4" />
              <span>Robot: {systemStatus.robot.battery}%</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Wifi className="h-4 w-4" />
              <span>Signal: Strong</span>
            </div>
            <EmergencyStop 
              active={emergencyStop}
              onToggle={() => setEmergencyStop(!emergencyStop)}
            />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Navigation Tabs */}
        <nav className="w-64 bg-gray-800 border-r border-gray-700">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Control Panels
            </h2>
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-cyan-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* System Status */}
          <div className="p-4 border-t border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              System Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Robot</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  systemStatus.robot.status === 'idle' ? 'bg-yellow-600' : 'bg-green-600'
                }`}>
                  {systemStatus.robot.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Camera</span>
                <span className="px-2 py-1 rounded text-xs bg-green-600">
                  {systemStatus.camera.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Arm</span>
                <span className="px-2 py-1 rounded text-xs bg-green-600">
                  {systemStatus.arm.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Drone</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  systemStatus.drone.status === 'landed' ? 'bg-blue-600' : 'bg-green-600'
                }`}>
                  {systemStatus.drone.status}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex">
          {/* Control Panel */}
          <div className="flex-1 p-6">
            {emergencyStop && (
              <div className="bg-red-600/20 border border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <span className="font-semibold text-red-400">
                    EMERGENCY STOP ACTIVE - All systems disabled
                  </span>
                </div>
              </div>
            )}
            
            <div className="bg-gray-800 rounded-lg border border-gray-700 h-full overflow-auto">
              {renderActiveComponent()}
            </div>
          </div>

          {/* Telemetry Panel */}
          <div className="w-80 bg-gray-800 border-l border-gray-700">
            <TelemetryPanel systemStatus={systemStatus} />
          </div>
        </main>
      </div>

      {/* Status Bar */}
      <StatusBar isConnected={isConnected} />
    </div>
  );
}

export default App;