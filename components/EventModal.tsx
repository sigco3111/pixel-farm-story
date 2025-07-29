import React from 'react';
import { Crop } from '../types';

// NOTE: This component is deprecated and should not be used.
// It is kept to avoid breaking changes if it was cached, but it will be removed.
// The active component is MerchantModal.tsx

interface DeprecatedMerchantModalProps {
  money: number;
  wares: Record<string, Crop>;
  onBuy: (itemId: string) => void;
  onClose: () => void;
}

const DeprecatedMerchantModal: React.FC<DeprecatedMerchantModalProps> = ({ money, wares, onBuy, onClose }) => {
    const items = Object.values(wares);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20" onClick={onClose}>
            <div className="bg-indigo-900/80 backdrop-blur-md border-4 border-yellow-800 rounded-lg p-6 w-full max-w-lg shadow-2xl text-white flex flex-col modal-enter-animation" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl text-center mb-1 text-yellow-300">🤠 떠돌이 상인 (Deprecated)</h2>
                <p className="text-center mb-4 text-indigo-200">"이곳저곳에서 구해온 특별한 물건들이 있다네!"</p>

                <div className="space-y-3 flex-grow overflow-y-auto pr-2 max-h-[60vh] bg-black/20 p-3 rounded-lg">
                    {items.map((item) => {
                        const canAfford = money >= item.cost;
                        return (
                            <div key={item.id} className={`w-full flex items-center justify-between p-3 rounded-lg bg-indigo-800/70`}>
                                <div className="flex items-center flex-grow">
                                    <span className="text-4xl mr-4">{item.icon}</span>
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold text-yellow-200">{item.name}</h3>
                                        <p className="text-sm text-indigo-100">{item.description}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { if (canAfford) onBuy(item.id); }}
                                    disabled={!canAfford}
                                    className={`font-bold text-lg p-2 rounded-lg w-32 text-center transition-colors
                                        ${canAfford ? 'bg-yellow-500 hover:bg-yellow-400 text-indigo-900' : 'bg-red-800/50 text-red-300 cursor-not-allowed'}`}
                                >
                                    {`${item.cost} G`}
                                </button>
                            </div>
                        );
                    })}
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 w-full p-2 bg-red-700 hover:bg-red-600 rounded-lg text-white font-bold flex-shrink-0"
                >
                    떠나기
                </button>
            </div>
        </div>
    );
};

export default DeprecatedMerchantModal;
