import React from 'react';
import { Crop, BuildItem, Season, UnlockedItems } from '../types';
import { CROPS, BUILD_ITEMS } from '../constants';

interface ShopModalProps {
  type: 'CROP' | 'BUILD';
  money: number;
  season: Season;
  unlockedItems: UnlockedItems;
  onSelect: (item: Crop | BuildItem) => void;
  onClose: () => void;
  hasGreenhouse?: boolean;
}

const ShopModal: React.FC<ShopModalProps> = ({ type, money, season, unlockedItems, onSelect, onClose, hasGreenhouse }) => {
  const items = (type === 'CROP' 
    ? unlockedItems.crops.map(id => CROPS[id]) 
    : unlockedItems.builds.map(id => BUILD_ITEMS[id]))
    .filter(Boolean); // Remove any potential null/undefined items
    
  const title = type === 'CROP' ? '씨앗 상점' : '시설 건설';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10" onClick={onClose}>
      <div className="bg-green-900/80 backdrop-blur-md border-4 border-yellow-800 rounded-lg p-6 w-full max-w-md shadow-2xl text-white flex flex-col modal-enter-animation" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl text-center mb-4 text-yellow-300">{title}</h2>
        <div className="space-y-3 flex-grow overflow-y-auto pr-2 max-h-[60vh]">
          {items.length > 0 ? (
            items.map((item) => {
              if (!item) return null;
              
              const canAfford = money >= item.cost;
              const isCrop = 'seasons' in item;

              // Is this crop generally out of season right now?
              const isActuallyOutOfSeason = isCrop && item.seasons.length > 0 && !item.seasons.includes(season);

              // Is the item disabled because it's out of season AND the player lacks a greenhouse?
              const isDisabledBySeason = !hasGreenhouse && isActuallyOutOfSeason;
              
              const isDisabled = !canAfford || isDisabledBySeason;

              // Does this item require a greenhouse to be planted right now?
              // This is true if it's out of season, but the player has a greenhouse, making it available.
              const requiresGreenhouse = hasGreenhouse && isActuallyOutOfSeason;

              const getTitle = () => {
                if (isDisabledBySeason) return `${item.seasons.join(', ')}에 심을 수 있습니다.`;
                if (!canAfford) return '돈이 부족합니다.';
                if (requiresGreenhouse) return '계절에 맞지 않아 온실에만 심을 수 있습니다.';
                return `선택: ${item.name}`;
              };

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!isDisabled) onSelect(item);
                  }}
                  disabled={isDisabled}
                  title={getTitle()}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all 
                    ${isDisabled ? 'bg-gray-600 opacity-60 cursor-not-allowed' : 'bg-green-700 hover:bg-yellow-500 hover:text-green-900'}
                  `}
                >
                  <div className="flex items-center text-left">
                    <span className="text-3xl mr-4">{item.icon}</span>
                    <div>
                      <span className="text-lg">{item.name}</span>
                      {isDisabledBySeason && <span className="block text-xs text-red-300 font-semibold">다른 계절 작물</span>}
                      {requiresGreenhouse && (
                        <span className="block text-xs text-cyan-300 font-semibold flex items-center gap-1">
                          🌿 온실 필요
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`font-bold ${canAfford ? 'text-yellow-300' : 'text-red-400'}`}>{item.cost}G</span>
                </button>
              );
            })
          ) : (
            <p className="text-center text-yellow-200 p-4 bg-black/20 rounded-lg">구매할 수 있는 아이템이 없습니다.</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full p-2 bg-red-700 hover:bg-red-600 rounded-lg text-white font-bold flex-shrink-0"
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default ShopModal;