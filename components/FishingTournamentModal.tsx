
import React, { useState } from 'react';
import { FISH } from '../constants';
import { Fish } from '../types';

interface FishingTournamentModalProps {
  inventory: Record<string, number>;
  onSubmit: (itemId: string) => void;
  onClose: () => void;
}

const FishingTournamentModal: React.FC<FishingTournamentModalProps> = ({ inventory, onSubmit, onClose }) => {
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const submittableItems = Object.entries(inventory)
        .map(([id, quantity]) => {
            const item = FISH[id];
            return item ? { ...item, quantity } : null;
        })
        .filter(item => item !== null && item.quantity > 0) as (Fish & { quantity: number })[];
    
    submittableItems.sort((a, b) => b.sellPrice - a.sellPrice);

    const handleItemClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    const handleSubmit = () => {
        if (selectedItemId) {
            onSubmit(selectedItemId);
            setSubmitted(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20" onClick={onClose}>
            <div className="bg-blue-900/80 backdrop-blur-md border-4 border-yellow-800 rounded-lg p-6 w-full max-w-2xl shadow-2xl text-white flex flex-col modal-enter-animation" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-3xl text-center mb-2 text-yellow-300">🎣 여름 낚시 대회 🎣</h2>
                
                {submitted ? (
                    <div className="text-center p-8 flex-grow flex flex-col items-center justify-center">
                        <p className="text-6xl mb-4">🎉</p>
                        <h3 className="text-2xl font-bold text-yellow-200 mb-2">출품해주셔서 감사합니다!</h3>
                        <p className="text-blue-200">결과는 게임 로그에서 확인하실 수 있습니다.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-center mb-4 text-blue-200">가장 희귀하고 값비싼 물고기를 출품하여 실력을 뽐내보세요! (하나만 선택 가능)</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 flex-grow overflow-y-auto pr-2 min-h-[200px] max-h-[50vh] bg-black/20 p-3 rounded-lg">
                            {submittableItems.length > 0 ? (
                                submittableItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleItemClick(item.id)}
                                        className={`p-3 rounded-lg flex flex-col items-center justify-between transition-all aspect-square
                                            ${selectedItemId === item.id 
                                                ? 'bg-yellow-500 text-blue-900 ring-4 ring-yellow-300 scale-105' 
                                                : 'bg-blue-800/70 hover:bg-blue-700/70'}`
                                        }
                                    >
                                        <span className="text-4xl">{item.icon}</span>
                                        <div className="text-center">
                                            <p className="font-bold">{item.name}</p>
                                            <p className="text-xs">x{item.quantity}</p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-full flex items-center justify-center h-full">
                                    <p className="text-center text-blue-200 p-4 rounded-lg">출품할 물고기가 없습니다.</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedItemId}
                            className={`w-full mt-6 p-3 rounded-lg text-white font-bold transition-all text-lg
                                ${selectedItemId ? 'bg-green-700 hover:bg-green-600' : 'bg-gray-600 opacity-50 cursor-not-allowed'}
                            `}
                        >
                            {selectedItemId ? `${FISH[selectedItemId]?.name} 출품하기` : '물고기를 선택하세요'}
                        </button>
                    </>
                )}
                
                <button
                    onClick={onClose}
                    className="mt-2 w-full p-2 bg-red-700 hover:bg-red-600 rounded-lg text-white font-bold flex-shrink-0"
                >
                    {submitted ? '닫기' : '나중에 하기'}
                </button>
            </div>
        </div>
    );
};

export default FishingTournamentModal;