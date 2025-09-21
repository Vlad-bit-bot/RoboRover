import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  RotateCcw,
  RotateCw,
  Gauge,
  Navigation,
  Square,
  Camera,
  Video,
  VideoOff,
  ZoomIn,
  ZoomOut,
  Monitor,
  Settings,
  Maximize,
  Minimize,
  Play,
  Pause
} from 'lucide-react';
import nipplejs from 'nipplejs';

interface RobotControlsProps {
  disabled: boolean;
}

const RobotControls: React.FC<RobotControlsProps> = ({ disabled }) => {
  const [speed, setSpeed] = useState(50);
  const [isMoving, setIsMoving] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [joystickData, setJoystickData] = useState({ x: 0, y: 0, force: 0 });
  
  const joystickRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<any>(null);

  useEffect(() => {
    if (joystickRef.current && !disabled) {
      managerRef.current = nipplejs.create({
        zone: joystickRef.current,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'cyan',
        size: 120,
        threshold: 0.1,
        fadeTime: 250,
        multitouch: false,
        maxNumberOfNipples: 1,
        dataOnly: false,
        restJoystick: true,
        restOpacity: 0.5,
        lockX: false,
        lockY: false
      });

      managerRef.current.on('move', (evt: any, data: any) => {
        const force = Math.min(data.force, 2);
        const angle = data.angle.degree;
        
        // Convert polar to cartesian coordinates
        const x = Math.cos(data.angle.radian) * force;
        const y = Math.sin(data.angle.radian) * force;
        
        setJoystickData({ x, y, force });
        setIsMoving(force > 0.1);
        
        // Determine primary direction
        if (force > 0.3) {
          if (angle >= 315 || angle < 45) setCurrentDirection('right');
          else if (angle >= 45 && angle < 135) setCurrentDirection('forward');
          else if (angle >= 135 && angle < 225) setCurrentDirection('left');
          else if (angle >= 225 && angle < 315) setCurrentDirection('backward');
        }
      });

      managerRef.current.on('end', () => {
        setJoystickData({ x: 0, y: 0, force: 0 });
        setIsMoving(false);
        setCurrentDirection(null);
      });

      return () => {
        if (managerRef.current) {
          managerRef.current.destroy();
        }
      };
    }
  }, [disabled]);

  const handlePanTilt = (direction: string, amount: number = 5) => {
    if (disabled) return;
    
    switch (direction) {
      case 'pan-left':
        setPan(Math.max(-90, pan - amount));
        break;
      case 'pan-right':
        setPan(Math.min(90, pan + amount));
        break;
      case 'tilt-up':
        setTilt(Math.max(-45, tilt - amount));
        break;
      case 'tilt-down':
        setTilt(Math.min(45, tilt + amount));
        break;
    }
  };

  const resetCameraPosition = () => {
    if (disabled) return;
    setPan(0);
    setTilt(0);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const ControlButton: React.FC<{ 
    direction: string; 
    icon: React.ReactNode; 
    onClick: () => void;
    className?: string;
  }> = ({ direction, icon, onClick, className = '' }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
        ${disabled 
          ? 'border-gray-600 text-gray-500 cursor-not-allowed' 
          : currentDirection === direction
            ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400 shadow-lg'
            : 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-400/10'
        }
        ${className}
      `}
    >
      {icon}
    </button>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Rover Control & FPV</h2>
        <div className="flex items-center space-x-4">
          <div className={`h-3 w-3 rounded-full ${isMoving ? 'bg-green-400' : 'bg-gray-500'}`}></div>
          <span className="text-sm text-gray-300">
            {isMoving ? 'Moving' : 'Idle'}
          </span>
          <div className={`h-3 w-3 rounded-full ${isRecording ? 'bg-red-400 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className="text-sm text-gray-300">
            {isRecording ? 'Recording' : 'Standby'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* FPV Video Feed */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-200">Live FPV Feed</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsRecording(!isRecording)}
                disabled={disabled}
                className={`p-2 rounded-lg border transition-all duration-200 flex items-center space-x-2 ${
                  disabled
                    ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                    : isRecording
                      ? 'border-red-500 bg-red-500/20 text-red-400'
                      : 'border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400'
                }`}
              >
                {isRecording ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg border border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-200"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div 
            ref={videoRef}
            className="bg-black rounded-lg border border-gray-600 aspect-video relative overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Monitor className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">FPV Camera Feed</p>
                <p className="text-sm text-gray-600 mt-2">1080p • 30fps • Live</p>
              </div>
            </div>
            
            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <div className="w-8 h-0.5 bg-green-400/60 absolute -left-4 top-1/2 transform -translate-y-1/2"></div>
                <div className="w-8 h-0.5 bg-green-400/60 absolute -right-4 top-1/2 transform -translate-y-1/2"></div>
                <div className="w-0.5 h-8 bg-green-400/60 absolute left-1/2 -top-4 transform -translate-x-1/2"></div>
                <div className="w-0.5 h-8 bg-green-400/60 absolute left-1/2 -bottom-4 transform -translate-x-1/2"></div>
                <div className="w-2 h-2 border border-green-400/60 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>

            {/* Status Overlays */}
            <div className="absolute top-4 left-4 bg-black/60 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">LIVE</span>
              </div>
            </div>

            {isRecording && (
              <div className="absolute top-4 right-4 bg-red-600/80 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">REC</span>
                </div>
              </div>
            )}

            {/* Camera Info Overlay */}
            <div className="absolute bottom-4 left-4 bg-black/60 rounded-lg px-3 py-2">
              <div className="text-xs text-gray-300 space-y-1">
                <div>Pan: {pan}° | Tilt: {tilt}°</div>
                <div>Zoom: {zoom}%</div>
              </div>
            </div>

            {/* Movement Indicator */}
            {isMoving && (
              <div className="absolute bottom-4 right-4 bg-cyan-600/80 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white font-medium capitalize">{currentDirection || 'Moving'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pan/Tilt Controls */}
            <div>
              <h4 className="font-medium text-gray-300 mb-3">Camera Pan/Tilt</h4>
              <div className="grid grid-cols-3 gap-2 w-fit mx-auto">
                <div></div>
                <button
                  onClick={() => handlePanTilt('tilt-up')}
                  disabled={disabled}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    disabled
                      ? 'border-gray-600 text-gray-500'
                      : 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
                  }`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <div></div>
                
                <button
                  onClick={() => handlePanTilt('pan-left')}
                  disabled={disabled}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    disabled
                      ? 'border-gray-600 text-gray-500'
                      : 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={resetCameraPosition}
                  disabled={disabled}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    disabled
                      ? 'border-gray-600 text-gray-500'
                      : 'border-yellow-600 text-yellow-400 hover:border-yellow-500'
                  }`}
                >
                  <Square className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePanTilt('pan-right')}
                  disabled={disabled}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    disabled
                      ? 'border-gray-600 text-gray-500'
                      : 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
                  }`}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
                
                <div></div>
                <button
                  onClick={() => handlePanTilt('tilt-down')}
                  disabled={disabled}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    disabled
                      ? 'border-gray-600 text-gray-500'
                      : 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
                  }`}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <div></div>
              </div>
            </div>

            {/* Zoom Control */}
            <div>
              <h4 className="font-medium text-gray-300 mb-3">Camera Zoom</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                    disabled={disabled}
                    className={`p-2 rounded-lg border transition-all duration-200 ${
                      disabled
                        ? 'border-gray-600 text-gray-500'
                        : 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
                    }`}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={zoom}
                    onChange={(e) => setZoom(parseInt(e.target.value))}
                    disabled={disabled}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <button
                    onClick={() => setZoom(Math.min(300, zoom + 10))}
                    disabled={disabled}
                    className={`p-2 rounded-lg border transition-all duration-200 ${
                      disabled
                        ? 'border-gray-600 text-gray-500'
                        : 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
                    }`}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-center text-sm text-gray-400">
                  {zoom}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Movement Controls */}
        <div className="space-y-6">
          {/* Joystick Control */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Movement Control</h3>
            <div className="bg-gray-900 rounded-lg p-6">
              <div 
                ref={joystickRef}
                className={`relative w-32 h-32 mx-auto mb-4 rounded-full border-2 ${
                  disabled ? 'border-gray-600' : 'border-gray-500'
                } bg-gray-800`}
                style={{ 
                  opacity: disabled ? 0.5 : 1,
                  pointerEvents: disabled ? 'none' : 'auto'
                }}
              >
                {disabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Disabled</span>
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-sm text-gray-400">
                  Force: {(joystickData.force * 50).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500">
                  X: {joystickData.x.toFixed(2)} | Y: {joystickData.y.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Speed Control */}
          <div>
            <h4 className="font-medium text-gray-300 mb-3">Speed Control</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Gauge className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">Speed: {speed}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                disabled={disabled}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>
          </div>

          {/* Navigation Mode */}
          <div>
            <h4 className="font-medium text-gray-300 mb-3">Navigation Mode</h4>
            <div className="space-y-2">
              <button
                disabled={disabled}
                className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center space-x-3 ${
                  disabled
                    ? 'border-gray-600 text-gray-500'
                    : 'border-cyan-600 bg-cyan-600/20 text-cyan-400'
                }`}
              >
                <Navigation className="h-5 w-5" />
                <span>Manual Control</span>
              </button>
              <button
                disabled={disabled}
                className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center space-x-3 ${
                  disabled
                    ? 'border-gray-600 text-gray-500'
                    : 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
                }`}
              >
                <Navigation className="h-5 w-5" />
                <span>Auto Navigate</span>
              </button>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-gray-200 mb-3 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Rover Status
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Position:</span>
                <span className="text-gray-300">X: 12.5, Y: 8.3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Heading:</span>
                <span className="text-gray-300">45°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Speed:</span>
                <span className="text-gray-300">{isMoving ? `${Math.round(joystickData.force * speed)}%` : '0%'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Camera:</span>
                <span className="text-gray-300">{isRecording ? 'Recording' : 'Live'}</span>
              </div>
            </div>
          </div>

          {/* Camera Settings */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-gray-200 mb-3 flex items-center">
              <Camera className="h-4 w-4 mr-2" />
              Camera Settings
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Resolution</label>
                <select 
                  disabled={disabled}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-300 text-sm"
                >
                  <option>1080p (1920x1080)</option>
                  <option>720p (1280x720)</option>
                  <option>480p (854x480)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Night Vision</label>
                <button 
                  disabled={disabled}
                  className={`w-full p-2 rounded border transition-all duration-200 text-sm ${
                    disabled
                      ? 'border-gray-600 text-gray-500'
                      : 'border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400'
                  }`}
                >
                  Auto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotControls;