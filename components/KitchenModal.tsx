
import React from 'react';
import { DISH_RECIPES, CROPS, PRODUCE, CRAFTING_RECIPES } from '../constants';

interface KitchenModalProps {
  inventory: Record<string, number>;
  onCook: (itemId: string) => void;
  onClose: () => void;
}

const ALL_INGREDIENTS: Record<string, { name: string, icon: string }> = { ...CROPS, ...PRODUCE, ...CRAFTING_RECIPES };

const KitchenModal: React.FC<KitchenModalProps> = ({ inventory, onCook, onClose }) => {
  const recipes = Object.values(DISH_RECIPES);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10" onClick={onClose}>
      <div className="bg-pink-900/80 backdrop-blur-md border-4 border-yellow-800 rounded-lg p-6 w-full max-w-2xl shadow-2xl text-white flex flex-col modal-enter-animation" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl text-center mb-4 text-yellow-300">🍳 주방</h2>
        
        <div className="space-y-3 flex-grow overflow-y-auto pr-2 max-h-[60vh] bg-black/20 p-3 rounded-lg">
          {recipes.map((recipe) => {
            const ingredients = Object.entries(recipe.ingredients);
            const canCook = ingredients.every(([id, qty]) => (inventory[id] || 0) >= qty);

            return (
              <div key={recipe.id} className={`w-full flex flex-col sm:flex-row items-center justify-between p-3 rounded-lg transition-all ${canCook ? 'bg-pink-700/70' : 'bg-pink-900/70 opacity-80'}`}>
                <div className="flex items-center flex-grow mb-2 sm:mb-0">
                  <span className="text-4xl mr-4">{recipe.icon}</span>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-yellow-200">{recipe.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-pink-200">
                      <span>재료:</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {ingredients.map(([id, qty]) => {
                          const itemInfo = ALL_INGREDIENTS[id];
                          const hasEnough = (inventory[id] || 0) >= qty;
                          return (
                            <span key={id} className={`flex items-center gap-1 p-1 rounded ${hasEnough ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                              <span>{itemInfo?.icon || '?'}</span>
                              <span className="text-xs">{inventory[id] || 0}/{qty}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { if (canCook) onCook(recipe.id); }}
                  disabled={!canCook}
                  className={`font-bold text-lg py-2 px-4 rounded-lg w-full sm:w-32 text-center transition-colors
                    ${canCook ? 'bg-yellow-500 hover:bg-yellow-400 text-pink-900' : 'bg-red-800/50 text-red-300 cursor-not-allowed'}`}
                >
                  요리하기
                </button>
              </div>
            );
          })}
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

export default KitchenModal;