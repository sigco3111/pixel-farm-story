
import React from 'react';
import { UnlockedItems } from '../types';
import { ANIMALS } from '../constants';

interface AnimalShopModalProps {
  money: number;
  unlockedItems: UnlockedItems;
  onBuy: (animalId: string) => void;
  onClose: () => void;
}

const AnimalShopModal: React.FC<AnimalShopModalProps> = ({ money, unlockedItems, onBuy, onClose }) => {
  const items = unlockedItems.livestock.map(id => ANIMALS[id]);
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10" onClick={onClose}>
      <div className="bg-red-900/80 backdrop-blur-md border-4 border-yellow-800 rounded-lg p-6 w-full max-w-md shadow-2xl text-white flex flex-col modal-enter-animation" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl text-center mb-4 text-yellow-300">동물 상점</h2>
        <div className="space-y-3 flex-grow overflow-y-auto pr-2">
          {items.length > 0 ? (
            items.map((item) => {
              const canAfford = money >= item.cost;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (canAfford) onBuy(item.id);
                  }}
                  disabled={!canAfford}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all 
                    ${canAfford ? 'bg-red-700 hover:bg-yellow-500 hover:text-red-900' : 'bg-gray-600 opacity-50 cursor-not-allowed'}
                  `}
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{item.icon}</span>
                    <span className="text-lg">{item.name}</span>
                  </div>
                  <span className={`font-bold ${canAfford ? 'text-yellow-300' : 'text-red-400'}`}>{item.cost}G</span>
                </button>
              );
            })
          ) : (
            <p className="text-center text-yellow-200 p-4 bg-black/20 rounded-lg">구매할 수 있는 동물이 없습니다. 먼저 연구를 진행하세요.</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold flex-shrink-0"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default AnimalShopModal;
