
import React from 'react';
import { Tool, Crop, BuildItem } from '../types';

interface ControlPanelProps {
  activeTool: Tool;
  onToolSelect: (tool: Tool) => void;
  selectedItem?: Crop | BuildItem | null;
  money: number;
}

const ToolButton: React.FC<{
  label: string;
  icon: string;
  tool: Tool;
  activeTool: Tool;
  onToolSelect: (tool: Tool) => void;
}> = ({ label, icon, tool, activeTool, onToolSelect }) => (
  <button
    onClick={() => onToolSelect(tool)}
    className={`flex-1 p-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200
      ${activeTool === tool ? 'bg-yellow-500 text-green-900 scale-105 shadow-lg' : 'bg-green-700/50 hover:bg-green-600/50 text-yellow-200'}
    `}
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-xs font-bold">{label}</span>
  </button>
);

const ControlPanel: React.FC<ControlPanelProps> = ({ activeTool, onToolSelect, selectedItem, money }) => {
  return (
    <div className="bg-black/20 p-3 rounded-lg border-2 border-yellow-800 shadow-md">
      <h2 className="text-center text-yellow-300 text-lg mb-2">도구</h2>
      <div className="grid grid-cols-3 gap-2">
        <ToolButton label="선택" icon="👆" tool="SELECT" activeTool={activeTool} onToolSelect={onToolSelect} />
        <ToolButton label="심기" icon="🌱" tool="PLANT" activeTool={activeTool} onToolSelect={onToolSelect} />
        <ToolButton label="수확" icon="🪓" tool="HARVEST" activeTool={activeTool} onToolSelect={onToolSelect} />
        <ToolButton label="건설" icon="🏠" tool="BUILD" activeTool={activeTool} onToolSelect={onToolSelect} />
        <ToolButton label="철거" icon="💣" tool="DEMOLISH" activeTool={activeTool} onToolSelect={onToolSelect} />
        <ToolButton label="연구" icon="🔬" tool="RESEARCH" activeTool={activeTool} onToolSelect={onToolSelect} />
      </div>
      <div className="mt-3 text-center bg-black/30 p-2 rounded h-12 flex items-center justify-center">
        {activeTool === 'RESEARCH' ? (
           <span className="text-yellow-200">연구 메뉴를 확인하세요.</span>
        ) : selectedItem ? (
            <span className="text-yellow-200 flex items-center justify-center gap-2">
              <span className="text-2xl">{selectedItem.icon}</span>
              <span>선택됨: <span className="font-bold text-white">{selectedItem.name}</span></span>
            </span>
        ) : (
            <span className="text-gray-400">선택된 아이템 없음</span>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;