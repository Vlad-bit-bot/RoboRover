import React from 'react';
import { 
  Activity, 
  Battery,
  Thermometer,
  Wifi,
  Clock,
  Cpu,
  HardDrive,
  Signal
} from 'lucide-react';

interface TelemetryPanelProps {
  systemStatus: {
    robot: { status: string; battery: number };
    camera: { status: string; recording: boolean };
    arm: { status: string; position: string };
    drone: { status: string; battery: number; altitude: number };
  };
}

const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ systemStatus }) => {
  const currentTime = new Date().toLocaleTimeString();

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    unit?: string;
    icon: React.ReactNode;
    status?: 'good' | 'warning' | 'error';
  }> = ({ title, value, unit, icon, status = 'good' }) => {
    const statusColors = {
      good: 'text-green-400 border-green-400/30',
      warning: 'text-yellow-400 border-yellow-400/30',
      error: 'text-red-400 border-red-400/30'
    };

    return (
      <div className={`bg-gray-900 rounded-lg p-3 border ${statusColors[status]}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider">{title}</span>
          <div className={statusColors[status]}>{icon}</div>
        </div>
        <div className="flex items-baseline">
          <span className="text-lg font-bold text-white">{value}</span>
          {unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-cyan-400" />
            Live Telemetry
          </h3>
          
          <div className="grid gap-4">
            <MetricCard
              title="System Time"
              value={currentTime}
              icon={<Clock className="h-4 w-4" />}
            />
            
            <MetricCard
              title="Connection"
              value="Strong"
              icon={<Wifi className="h-4 w-4" />}
              status="good"
            />
            
            <MetricCard
              title="Signal Quality"
              value="98"
              unit="%"
              icon={<Signal className="h-4 w-4" />}
              status="good"
            />
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-200 mb-3">Power Systems</h4>
          <div className="grid gap-3">
            <MetricCard
              title="Robot Battery"
              value={systemStatus.robot.battery}
              unit="%"
              icon={<Battery className="h-4 w-4" />}
              status={systemStatus.robot.battery > 30 ? 'good' : 'warning'}
            />
            
            <MetricCard
              title="Drone Battery"
              value={systemStatus.drone.battery}
              unit="%"
              icon={<Battery className="h-4 w-4" />}
              status={systemStatus.drone.battery > 30 ? 'good' : 'warning'}
            />
            
            <MetricCard
              title="System Voltage"
              value="24.1"
              unit="V"
              icon={<Activity className="h-4 w-4" />}
            />
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-200 mb-3">Environmental</h4>
          <div className="grid gap-3">
            <MetricCard
              title="CPU Temp"
              value="42"
              unit="°C"
              icon={<Thermometer className="h-4 w-4" />}
            />
            
            <MetricCard
              title="Motor Temp"
              value="38"
              unit="°C"
              icon={<Thermometer className="h-4 w-4" />}
            />
            
            <MetricCard
              title="Ambient Temp"
              value="22"
              unit="°C"
              icon={<Thermometer className="h-4 w-4" />}
            />
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-200 mb-3">System Performance</h4>
          <div className="grid gap-3">
            <MetricCard
              title="CPU Usage"
              value="23"
              unit="%"
              icon={<Cpu className="h-4 w-4" />}
            />
            
            <MetricCard
              title="Memory"
              value="2.1"
              unit="GB"
              icon={<HardDrive className="h-4 w-4" />}
            />
            
            <MetricCard
              title="Network"
              value="15.2"
              unit="Mbps"
              icon={<Wifi className="h-4 w-4" />}
            />
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-200 mb-3">Component Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
              <span className="text-sm text-gray-300">Robot Base</span>
              <span className={`px-2 py-1 rounded text-xs ${
                systemStatus.robot.status === 'idle' ? 'bg-yellow-600' : 'bg-green-600'
              }`}>
                {systemStatus.robot.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
              <span className="text-sm text-gray-300">FPV Camera</span>
              <span className="px-2 py-1 rounded text-xs bg-green-600">
                {systemStatus.camera.recording ? 'Recording' : systemStatus.camera.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
              <span className="text-sm text-gray-300">Robotic Arm</span>
              <span className="px-2 py-1 rounded text-xs bg-green-600">
                {systemStatus.arm.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
              <span className="text-sm text-gray-300">Drone</span>
              <span className={`px-2 py-1 rounded text-xs ${
                systemStatus.drone.status === 'landed' ? 'bg-blue-600' : 'bg-green-600'
              }`}>
                {systemStatus.drone.status}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-200 mb-3">Recent Events</h4>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-gray-900 rounded text-gray-300">
              <span className="text-gray-500">{currentTime}</span> - System initialized
            </div>
            <div className="p-2 bg-gray-900 rounded text-gray-300">
              <span className="text-gray-500">{currentTime}</span> - All components ready
            </div>
            <div className="p-2 bg-gray-900 rounded text-gray-300">
              <span className="text-gray-500">{currentTime}</span> - Camera feed active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryPanel;