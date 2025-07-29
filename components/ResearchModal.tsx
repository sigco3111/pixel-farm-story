
import React from 'react';
import { UnlockedItems, ResearchItem } from '../types';
import { RESEARCH_ITEMS, CROPS, BUILD_ITEMS, ANIMALS } from '../constants';

interface ResearchModalProps {
  researchPoints: number;
  unlockedItems: UnlockedItems;
  onResearch: (itemId: string) => void;
  onClose: () => void;
}

const ResearchModal: React.FC<ResearchModalProps> = ({ researchPoints, unlockedItems, onResearch, onClose }) => {
  const items = Object.values(RESEARCH_ITEMS);

  const getUnlockableIcon = (item: ResearchItem) => {
    if (item.unlocks.crops?.length) {
        const crop = CROPS[item.unlocks.crops[0]];
        return crop ? crop.icon : '🔬';
    }
    if (item.unlocks.builds?.length) {
        const build = BUILD_ITEMS[item.unlocks.builds[0]];
        return build ? build.icon : '🔬';
    }
    if (item.unlocks.livestock?.length) {
        const animal = ANIMALS[item.unlocks.livestock[0]];
        return animal ? animal.icon : '🔬';
    }
    return '🔬';
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10" onClick={onClose}>
      <div className="bg-blue-900/80 backdrop-blur-md border-4 border-yellow-800 rounded-lg p-6 w-full max-w-lg shadow-2xl text-white flex flex-col modal-enter-animation" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl text-center mb-1 text-yellow-300">연구소</h2>
        <p className="text-center mb-4 text-blue-200">현재 RP: <span className="font-bold text-white">{researchPoints}</span>💡</p>

        <div className="space-y-3 flex-grow overflow-y-auto pr-2 max-h-[60vh]">
          {items.map((item) => {
              const isResearched = unlockedItems.research.includes(item.id);
              const canAfford = researchPoints >= item.cost;
              const isDisabled = isResearched || !canAfford;

              // This is a special check for researches that depend on another.
              // A more robust system would define prerequisites in constants.ts
              let isLocked = false;
              if (item.id === 'cattle_breeding' || item.id === 'sheep_farming') {
                  if (!unlockedItems.research.includes('animal_husbandry')) {
                      isLocked = true;
                  }
              }

              return (
                <div key={item.id} className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${isResearched ? 'bg-green-800/50' : 'bg-blue-800/70'}`}>
                  <div className="flex items-center flex-grow">
                    <span className="text-4xl mr-4">{getUnlockableIcon(item)}</span>
                    <div className="flex-grow">
                        <h3 className={`text-lg font-bold ${isResearched || isLocked ? 'text-gray-400' : 'text-yellow-200'} ${isResearched && 'line-through'}`}>{item.name}</h3>
                        <p className={`text-sm ${isResearched || isLocked ? 'text-gray-500' : 'text-blue-100'}`}>{item.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { if (!isDisabled && !isLocked) onResearch(item.id); }}
                    disabled={isDisabled || isLocked}
                    className={`font-bold text-lg p-2 rounded-lg w-32 text-center transition-colors
                        ${isResearched ? 'bg-gray-600 cursor-default' : isLocked ? 'bg-gray-700 cursor-not-allowed' : canAfford ? 'bg-yellow-500 hover:bg-yellow-400 text-blue-900' : 'bg-red-800/50 text-red-300 cursor-not-allowed'}`}
                    >
                    {isResearched ? '연구 완료' : isLocked ? '잠김' : `${item.cost} RP`}
                  </button>
                </div>
              );
            })
          }
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full p-2 bg-red-700 hover:bg-red-600 rounded-lg text-white font-bold flex-shrink-0"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default ResearchModal;