import React from 'react';
import { AlertTriangle, Power } from 'lucide-react';

interface EmergencyStopProps {
  active: boolean;
  onToggle: () => void;
}

const EmergencyStop: React.FC<EmergencyStopProps> = ({ active, onToggle }) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`
          relative p-4 rounded-full border-4 transition-all duration-300 font-bold text-sm
          ${active 
            ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-500/50 animate-pulse' 
            : 'bg-red-500 border-red-300 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30'
          }
        `}
      >
        <div className="flex items-center space-x-2">
          {active ? <Power className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          <span>E-STOP</span>
        </div>
        
        {active && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-400 rounded-full animate-ping"></div>
        )}
      </button>
      
      <div className="absolute top-full right-0 mt-2 text-xs text-gray-400 whitespace-nowrap">
        {active ? 'Click to reset' : 'Emergency stop'}
      </div>
    </div>
  );
};

export default EmergencyStop;