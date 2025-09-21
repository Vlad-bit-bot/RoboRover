import React from 'react';
import { Wifi, WifiOff, Clock } from 'lucide-react';

interface StatusBarProps {
  isConnected: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ isConnected }) => {
  const currentTime = new Date().toLocaleString();
  
  return (
    <footer className="bg-gray-800 border-t border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
            <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className="text-gray-400">
            Version 2.1.0
          </div>
          
          <div className="text-gray-400">
            Latency: 12ms
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-400">
          <Clock className="h-4 w-4" />
          <span>{currentTime}</span>
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;