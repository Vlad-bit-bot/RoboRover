import React, { useState } from 'react';
import { Settings, Wifi, Monitor, Gamepad2, Shield, Vibrate as Calibrate, Save, RotateCcw, Bell } from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState({
    networkSSID: 'RoboRover_Network',
    cameraQuality: 'high',
    controlSensitivity: 75,
    emergencyTimeout: 10,
    autoCalibrate: true,
    soundAlerts: true,
    recordingLocation: '/recordings',
    maxSpeed: 80
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    console.log('Settings saved:', settings);
    // Here you would normally save to backend/local storage
  };

  const resetSettings = () => {
    setSettings({
      networkSSID: 'RoboRover_Network',
      cameraQuality: 'high',
      controlSensitivity: 75,
      emergencyTimeout: 10,
      autoCalibrate: true,
      soundAlerts: true,
      recordingLocation: '/recordings',
      maxSpeed: 80
    });
  };

  const SettingSection: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode;
  }> = ({ title, icon, children }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <div className="space-y-4 pl-6 border-l-2 border-gray-700">
        {children}
      </div>
    </div>
  );

  const Setting: React.FC<{
    label: string;
    description?: string;
    children: React.ReactNode;
  }> = ({ label, description, children }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="text-gray-300 font-medium">{label}</label>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">System Settings</h2>
        <div className="flex space-x-2">
          <button
            onClick={resetSettings}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={saveSettings}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <SettingSection title="Network Configuration" icon={<Wifi className="h-5 w-5 text-cyan-400" />}>
          <Setting 
            label="Network SSID" 
            description="Primary network identifier for robot communication"
          >
            <input
              type="text"
              value={settings.networkSSID}
              onChange={(e) => handleSettingChange('networkSSID', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300"
            />
          </Setting>
          
          <Setting label="Connection Type">
            <select className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300">
              <option>WiFi 5GHz</option>
              <option>WiFi 2.4GHz</option>
              <option>Ethernet</option>
              <option>4G/LTE</option>
            </select>
          </Setting>
        </SettingSection>

        <SettingSection title="Camera & Video" icon={<Monitor className="h-5 w-5 text-green-400" />}>
          <Setting 
            label="Video Quality" 
            description="Higher quality requires more bandwidth"
          >
            <select 
              value={settings.cameraQuality}
              onChange={(e) => handleSettingChange('cameraQuality', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300"
            >
              <option value="low">Low (480p)</option>
              <option value="medium">Medium (720p)</option>
              <option value="high">High (1080p)</option>
              <option value="ultra">Ultra (4K)</option>
            </select>
          </Setting>
          
          <Setting label="Recording Location">
            <input
              type="text"
              value={settings.recordingLocation}
              onChange={(e) => handleSettingChange('recordingLocation', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300"
            />
          </Setting>
          
          <Setting label="Auto Recording">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-300">Record on movement</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-300">Record audio</span>
              </label>
            </div>
          </Setting>
        </SettingSection>

        <SettingSection title="Control Settings" icon={<Gamepad2 className="h-5 w-5 text-purple-400" />}>
          <Setting 
            label="Control Sensitivity" 
            description="Adjust responsiveness of all movement controls"
          >
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="10"
                max="100"
                value={settings.controlSensitivity}
                onChange={(e) => handleSettingChange('controlSensitivity', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-gray-300 w-12">{settings.controlSensitivity}%</span>
            </div>
          </Setting>
          
          <Setting 
            label="Maximum Speed Limit" 
            description="Global speed limit for all movement systems"
          >
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="20"
                max="100"
                value={settings.maxSpeed}
                onChange={(e) => handleSettingChange('maxSpeed', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-gray-300 w-12">{settings.maxSpeed}%</span>
            </div>
          </Setting>
          
          <Setting label="Control Mode">
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="controlMode" defaultChecked />
                <span className="text-gray-300">Manual (Operator controlled)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="controlMode" />
                <span className="text-gray-300">Semi-autonomous (Assisted)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="controlMode" />
                <span className="text-gray-300">Waypoint following</span>
              </label>
            </div>
          </Setting>
        </SettingSection>

        <SettingSection title="Safety & Security" icon={<Shield className="h-5 w-5 text-red-400" />}>
          <Setting 
            label="Emergency Stop Timeout" 
            description="Time before automatic shutdown after emergency stop"
          >
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="5"
                max="30"
                value={settings.emergencyTimeout}
                onChange={(e) => handleSettingChange('emergencyTimeout', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-gray-300 w-16">{settings.emergencyTimeout}s</span>
            </div>
          </Setting>
          
          <Setting label="Geofencing">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Range (m)</label>
                <input
                  type="number"
                  defaultValue="100"
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Altitude (m)</label>
                <input
                  type="number"
                  defaultValue="50"
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300"
                />
              </div>
            </div>
          </Setting>
        </SettingSection>

        <SettingSection title="System Maintenance" icon={<Calibrate className="h-5 w-5 text-orange-400" />}>
          <Setting label="Auto Calibration">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={settings.autoCalibrate}
                onChange={(e) => handleSettingChange('autoCalibrate', e.target.checked)}
                className="rounded" 
              />
              <span className="text-gray-300">Enable automatic calibration on startup</span>
            </label>
          </Setting>
          
          <Setting label="Sound Alerts">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={settings.soundAlerts}
                onChange={(e) => handleSettingChange('soundAlerts', e.target.checked)}
                className="rounded" 
              />
              <span className="text-gray-300">Enable audio notifications</span>
            </label>
          </Setting>
          
          <Setting label="Diagnostic Tools">
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors">
                <Calibrate className="h-4 w-4" />
                <span>Run Diagnostics</span>
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2 transition-colors">
                <Settings className="h-4 w-4" />
                <span>Calibrate All</span>
              </button>
            </div>
          </Setting>
        </SettingSection>
      </div>
    </div>
  );
};

export default SettingsPanel;