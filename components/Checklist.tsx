
import React from 'react';
import { Objective } from '../types';

interface ChecklistProps {
  objectives: Objective[];
  completedCount: number;
  totalCount: number;
}

const Checklist: React.FC<ChecklistProps> = ({ objectives, completedCount, totalCount }) => {
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-black/20 p-3 rounded-lg border-2 border-yellow-800 shadow-md h-64 flex flex-col">
      <h2 className="text-center text-yellow-300 text-lg mb-2">목표</h2>
      <div className="w-full bg-black/30 rounded-full h-2.5 mb-2">
        <div className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <p className="text-center text-xs text-yellow-200 mb-2">{completedCount} / {totalCount} 완료</p>
      <div className="space-y-2 overflow-y-auto flex-grow pr-1">
        {objectives.map((obj) => (
          <div key={obj.id} className={`flex items-center p-2 rounded transition-colors duration-1000 ${obj.completed ? 'bg-green-700/30' : 'bg-black/30'}`}>
            <span className="mr-2">{obj.completed ? '✅' : '⬜️'}</span>
            <span className={`text-sm ${obj.completed ? 'line-through text-gray-400' : 'text-yellow-100'}`}>
              {obj.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checklist;
