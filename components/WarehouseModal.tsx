
import React from 'react';
import { CROPS, PRODUCE, CRAFTING_RECIPES, DISH_RECIPES, FISH } from '../constants';

interface WarehouseModalProps {
  inventory: Record<string, number>;
  onSell: () => void;
  onClose: () => void;
}

const WarehouseModal: React.FC<WarehouseModalProps> = ({ inventory, onSell, onClose }) => {
    const SELLABLE_ITEMS = { ...CROPS, ...PRODUCE, ...CRAFTING_RECIPES, ...DISH_RECIPES, ...FISH };

    const inventoryItems = Object.entries(inventory)
        .map(([id, quantity]) => {
            const item = SELLABLE_ITEMS[id as keyof typeof SELLABLE_ITEMS];
            return item ? { ...item, quantity } : null;
        })
        .filter(item => item !== null) as ({ id: string; name: string; icon: string; sellPrice: number; quantity: number; })[];

    const totalSellValue = inventoryItems.reduce((acc, item) => {
        return acc + (item.sellPrice * item.quantity);
    }, 0);

    const hasItems = inventoryItems.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10" onClick={onClose}>
            <div className="bg-yellow-900/80 backdrop-blur-md border-4 border-yellow-800 rounded-lg p-6 w-full max-w-lg shadow-2xl text-white flex flex-col modal-enter-animation" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl text-center mb-4 text-yellow-300">📦 창고</h2>
                <div className="space-y-3 flex-grow overflow-y-auto pr-2 min-h-[200px] max-h-[50vh] bg-black/20 p-3 rounded-lg">
                    {hasItems ? (
                        inventoryItems.map((item) => (
                            <div
                                key={item.id}
                                className={`w-full flex items-center justify-between p-2 rounded-lg bg-yellow-800/50`}
                            >
                                <div className="flex items-center">
                                    <span className="text-3xl mr-4">{item.icon}</span>
                                    <span className="text-lg">{item.name}</span>
                                </div>
                                <span className={`font-bold text-yellow-200`}>x {item.quantity}</span>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-center text-yellow-200 p-4 rounded-lg">창고가 비어있습니다.</p>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex flex-col gap-2 flex-shrink-0">
                    <button
                        onClick={onSell}
                        disabled={!hasItems}
                        className={`w-full p-3 rounded-lg text-white font-bold transition-all text-lg
                            ${hasItems ? 'bg-green-700 hover:bg-green-600' : 'bg-gray-600 opacity-50 cursor-not-allowed'}
                        `}
                    >
                        모두 판매 (+{totalSellValue}G)
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full p-2 bg-red-700 hover:bg-red-600 rounded-lg text-white font-bold"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WarehouseModal;