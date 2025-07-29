
import React, { useState, useReducer, useEffect, useCallback, useRef } from 'react';
import { GameState, Action, TileData, Tool, Crop, BuildItem, Season, GameEvent, Animal, Weather } from './types';
import { INITIAL_OBJECTIVES, GRID_SIZE, INITIAL_UNLOCKED_ITEMS, createInitialState } from './constants';
import { gameReducer } from './services/gameReducer';
import StatusBar from './components/StatusBar';
import FarmGrid from './components/FarmGrid';
import ControlPanel from './components/ControlPanel';
import Checklist from './components/Checklist';
import ShopModal from './components/ShopModal';
import MessageLog from './components/MessageLog';
import ResearchModal from './components/ResearchModal';
import WarehouseModal from './components/WarehouseModal';
import AnimalShopModal from './components/AnimalShopModal';
import CraftingModal from './components/CraftingModal';
import KitchenModal from './components/KitchenModal';
import FishingModal from './components/FishingModal';
import FestivalModal from './components/FestivalModal';
import FishingTournamentModal from './components/FishingTournamentModal';

const SAVE_GAME_KEY = 'pixelFarmStorySave';

const initializer = (initialStateCreator: () => GameState): GameState => {
    try {
        const savedStateJSON = localStorage.getItem(SAVE_GAME_KEY);
        if (savedStateJSON) {
            const savedState = JSON.parse(savedStateJSON);
            if (savedState.grid && typeof savedState.money === 'number') {
                console.log("Loaded game from localStorage.");

                // Merge objectives to support adding/removing/updating objectives in new versions
                const savedObjectivesById = (savedState.objectives || []).reduce((acc: any, obj: any) => {
                    if (obj && obj.id) {
                        acc[obj.id] = obj.completed;
                    }
                    return acc;
                }, {});
                savedState.objectives = INITIAL_OBJECTIVES.map(templateObj => ({
                    ...templateObj,
                    completed: savedObjectivesById[templateObj.id] || false,
                }));

                savedState.inventory = savedState.inventory || {};
                savedState.currentEvent = savedState.currentEvent || null;
                // --- Data Migration for Animal Update ---
                if (savedState.stats.harvestedCrops) {
                  savedState.stats.harvestedItems = savedState.stats.harvestedCrops;
                  delete savedState.stats.harvestedCrops;
                }
                savedState.stats.harvestedItems = savedState.stats.harvestedItems || {};
                savedState.stats.festivalWins = savedState.stats.festivalWins || { gold: 0, silver: 0, bronze: 0 };
                savedState.unlockedItems.livestock = savedState.unlockedItems.livestock || [];
                 // Ensure new tile properties exist
                savedState.grid = savedState.grid.map((row: any[]) => row.map((tile: any) => ({
                  ...tile,
                  animalId: tile.animalId || null,
                  produceProgress: tile.produceProgress || 0,
                })));
                // --- End Migration ---
                savedState.weather = savedState.weather || '맑음';
                return savedState;
            }
        }
    } catch (e) {
        console.error("Failed to load or parse saved game. Starting a new game.", e);
        localStorage.removeItem(SAVE_GAME_KEY);
    }
    console.log("No valid save game found. Starting a new game.");
    return initialStateCreator();
};


const App: React.FC = () => {
  const [gameState, dispatch] = useReducer(gameReducer, createInitialState, initializer);
  const [activeTool, setActiveTool] = useState<Tool>('SELECT');
  const [selectedShopItem, setSelectedShopItem] = useState<Crop | BuildItem | null>(null);
  const [isShopOpen, setShopOpen] = useState(false);
  const [isResearchOpen, setResearchOpen] = useState(false);
  const [isWarehouseOpen, setWarehouseOpen] = useState(false);
  const [isFestivalModalOpen, setFestivalModalOpen] = useState(false);
  const [isFishingTournamentModalOpen, setFishingTournamentModalOpen] = useState(false);
  const [isAnimalShopOpen, setAnimalShopOpen] = useState(false);
  const [isCraftingOpen, setCraftingOpen] = useState(false);
  const [isKitchenOpen, setKitchenOpen] = useState(false);
  const [isFishingOpen, setFishingOpen] = useState(false);
  const [selectedBarnTile, setSelectedBarnTile] = useState<{x: number, y: number} | null>(null);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVED'>('IDLE');
  const [isNewGameConfirmOpen, setNewGameConfirmOpen] = useState(false);
  
  const [isDragging, setIsDragging] = useState(false);
  const draggedTilesRef = useRef<Set<string>>(new Set());

  const addLog = useCallback((message: string) => {
    dispatch({ type: 'ADD_LOG', payload: message });
  }, []);

  useEffect(() => {
    const isAnyModalOpen = isFestivalModalOpen || isFishingTournamentModalOpen;
    if (gameState.currentEvent && !isAnyModalOpen) {
      const hasSeenEventForDay = sessionStorage.getItem(`seenEvent_${gameState.currentEvent.id}_${gameState.day}`);
      if (!hasSeenEventForDay) {
        if (gameState.currentEvent.id === 'spring_festival') {
          setFestivalModalOpen(true);
        }
        if (gameState.currentEvent.id === 'summer_fishing_tournament') {
          setFishingTournamentModalOpen(true);
        }
        sessionStorage.setItem(`seenEvent_${gameState.currentEvent.id}_${gameState.day}`, 'true');
      }
    }
    if (!gameState.currentEvent) {
        if (isFestivalModalOpen) setFestivalModalOpen(false);
        if (isFishingTournamentModalOpen) setFishingTournamentModalOpen(false);
    }
  }, [gameState.currentEvent, gameState.day, isFestivalModalOpen, isFishingTournamentModalOpen]);


  const handleSaveGame = useCallback(() => {
    if (saveStatus === 'SAVED') return;
    try {
      const stateString = JSON.stringify(gameState);
      localStorage.setItem(SAVE_GAME_KEY, stateString);
      addLog('💾 게임이 저장되었습니다.');
      setSaveStatus('SAVED');
      setTimeout(() => {
        setSaveStatus('IDLE');
      }, 2000);
    } catch (e) {
      console.error("Failed to save game.", e);
      addLog('❌ 저장에 실패했습니다.');
    }
  }, [gameState, addLog, saveStatus]);

  const handleNewGame = useCallback(() => {
    setNewGameConfirmOpen(true);
  }, []);

  const confirmNewGame = useCallback(() => {
    localStorage.removeItem(SAVE_GAME_KEY);
    sessionStorage.clear();
    dispatch({ type: 'RESET_GAME' });
    setNewGameConfirmOpen(false);
  }, [dispatch]);

  const handleOpenEventModal = useCallback(() => {
    if (gameState.currentEvent?.id === 'spring_festival') {
        setFestivalModalOpen(true);
    }
    if (gameState.currentEvent?.id === 'summer_fishing_tournament') {
        setFishingTournamentModalOpen(true);
    }
  }, [gameState.currentEvent]);

  const handleSellFromWarehouse = useCallback(() => {
    dispatch({ type: 'SELL_INVENTORY' });
    setWarehouseOpen(false);
  }, []);

  const handleBuyAnimal = useCallback((animalId: string) => {
    if (selectedBarnTile) {
        dispatch({ type: 'BUY_ANIMAL', payload: { animalId, x: selectedBarnTile.x, y: selectedBarnTile.y } });
        setAnimalShopOpen(false);
        setSelectedBarnTile(null);
    }
  }, [selectedBarnTile]);

  const handleCraftItem = useCallback((itemId: string) => {
    dispatch({ type: 'CRAFT_ITEM', payload: { itemId } });
  }, []);

  const handleCookItem = useCallback((itemId: string) => {
    dispatch({ type: 'COOK_ITEM', payload: { itemId } });
  }, []);

  const handleCatchFish = useCallback((fishId: string) => {
    dispatch({ type: 'CATCH_FISH', payload: { fishId } });
  }, []);

  const handleFestivalSubmit = useCallback((itemId: string) => {
    dispatch({ type: 'SUBMIT_FESTIVAL_ENTRY', payload: { itemId } });
  }, []);

  const handleFishingTournamentSubmit = useCallback((fishId: string) => {
    dispatch({ type: 'SUBMIT_FISHING_TOURNAMENT_ENTRY', payload: { fishId } });
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      // The addLog dependency for TICK is temporarily kept for stability until a full refactor.
      // The core issue of impurity for other actions has been resolved.
      dispatch({ type: 'TICK', payload: { addLog } });
    }, 2000);

    return () => clearInterval(gameLoop);
  }, [addLog]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleToolSelect = (tool: Tool) => {
    setActiveTool(tool);
    setSelectedShopItem(null);
    setShopOpen(false);
    setResearchOpen(false);

    if (tool === 'PLANT' || tool === 'BUILD') {
      setShopOpen(true);
    } else if (tool === 'RESEARCH') {
      setResearchOpen(true);
    }
  };

  const performActionOnTile = (x: number, y: number) => {
    const tileKey = `${x}-${y}`;
    if (draggedTilesRef.current.has(tileKey)) {
        return;
    }

    dispatch({
      type: 'TILE_ACTION',
      payload: { x, y, activeTool, selectedItem: selectedShopItem, addLog }
    });

    draggedTilesRef.current.add(tileKey);
  };

  const handleTileMouseDown = (x: number, y: number) => {
    const tile = gameState.grid[y][x];
    if (activeTool === 'SELECT') {
      if (tile.buildId === 'warehouse') {
        setWarehouseOpen(true);
        return;
      }
      if (tile.buildId === 'workshop') {
        setCraftingOpen(true);
        return;
      }
      if (tile.buildId === 'kitchen') {
        setKitchenOpen(true);
        return;
      }
      if (tile.buildId === 'fishing_pond') {
        setFishingOpen(true);
        return;
      }
      if (tile.buildId === 'barn' && !tile.animalId) {
        setSelectedBarnTile({x, y});
        setAnimalShopOpen(true);
        return;
      }
    }
    
    const isDraggableTool = activeTool === 'PLANT' || activeTool === 'HARVEST';

    if (isDraggableTool) {
      setIsDragging(true);
      draggedTilesRef.current.clear();
      performActionOnTile(x, y);
    } else {
      dispatch({
        type: 'TILE_ACTION',
        payload: { x, y, activeTool, selectedItem: selectedShopItem, addLog }
      });
    }
  };

  const handleTileMouseEnter = (x: number, y: number) => {
    if (isDragging) {
      performActionOnTile(x, y);
    }
  };

  const handleShopSelect = (item: Crop | BuildItem) => {
    setSelectedShopItem(item);
    setShopOpen(false);
  };

  const handleResearch = (itemId: string) => {
    dispatch({ type: 'RESEARCH_ITEM', payload: { itemId } });
  };
  
  const completedObjectives = gameState.objectives.filter(o => o.completed).length;
  const totalObjectives = gameState.objectives.length;

  const hasGreenhouse = gameState.grid.flat().some(tile => tile.buildId === 'greenhouse');

  const getSeasonBgColor = (season: Season): string => {
    switch (season) {
      case '봄': return 'bg-green-900';
      case '여름': return 'bg-teal-900';
      case '가을': return 'bg-orange-900';
      case '겨울': return 'bg-slate-900';
      default: return 'bg-green-900';
    }
  }

  return (
    <div className={`text-white min-h-screen flex flex-col items-center justify-center p-4 font-mono select-none transition-colors duration-1000 ${getSeasonBgColor(gameState.season)}`}>
      <div className="w-full max-w-7xl border-4 border-yellow-800 bg-black/30 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h1 className="text-3xl text-center mb-4 text-yellow-300 tracking-wider">픽셀 농장 이야기</h1>
        <StatusBar 
          money={gameState.money} 
          researchPoints={gameState.researchPoints} 
          day={gameState.day} 
          season={gameState.season}
          weather={gameState.weather}
          currentEvent={gameState.currentEvent}
          onSave={handleSaveGame}
          onNewGame={handleNewGame}
          onOpenEventModal={handleOpenEventModal}
          saveStatus={saveStatus}
        />
        
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="flex-grow">
            <FarmGrid 
              grid={gameState.grid} 
              onTileMouseDown={handleTileMouseDown} 
              onTileMouseEnter={handleTileMouseEnter} 
              activeTool={activeTool} 
            />
          </div>

          <div className="lg:w-1/3 flex flex-col gap-4">
            <ControlPanel 
              activeTool={activeTool} 
              onToolSelect={handleToolSelect} 
              selectedItem={selectedShopItem} 
              money={gameState.money}
            />
            <MessageLog logs={gameState.logs} />
            <Checklist 
              objectives={gameState.objectives}
              completedCount={completedObjectives}
              totalCount={totalObjectives}
            />
          </div>
        </div>
      </div>
      {isShopOpen && (
        <ShopModal
          type={activeTool === 'PLANT' ? 'CROP' : 'BUILD'}
          money={gameState.money}
          season={gameState.season}
          unlockedItems={gameState.unlockedItems}
          onSelect={handleShopSelect}
          onClose={() => {
            setShopOpen(false);
            if (!selectedShopItem) {
              setActiveTool('SELECT');
            }
          }}
          hasGreenhouse={hasGreenhouse}
        />
      )}
      {isResearchOpen && (
        <ResearchModal
          researchPoints={gameState.researchPoints}
          unlockedItems={gameState.unlockedItems}
          onResearch={handleResearch}
          onClose={() => {
            setResearchOpen(false);
            setActiveTool('SELECT');
          }}
        />
      )}
      {isWarehouseOpen && (
        <WarehouseModal
          inventory={gameState.inventory}
          onSell={handleSellFromWarehouse}
          onClose={() => setWarehouseOpen(false)}
        />
      )}
      {isAnimalShopOpen && (
        <AnimalShopModal
          money={gameState.money}
          unlockedItems={gameState.unlockedItems}
          onBuy={handleBuyAnimal}
          onClose={() => {
            setAnimalShopOpen(false);
            setSelectedBarnTile(null);
          }}
        />
      )}
      {isCraftingOpen && (
        <CraftingModal
          inventory={gameState.inventory}
          onCraft={handleCraftItem}
          onClose={() => setCraftingOpen(false)}
        />
      )}
      {isKitchenOpen && (
        <KitchenModal
          inventory={gameState.inventory}
          onCook={handleCookItem}
          onClose={() => setKitchenOpen(false)}
        />
      )}
      {isFishingOpen && (
        <FishingModal
          onCatch={handleCatchFish}
          onClose={() => setFishingOpen(false)}
        />
      )}
      {isFestivalModalOpen && gameState.currentEvent?.id === 'spring_festival' && (
        <FestivalModal
            inventory={gameState.inventory}
            onSubmit={handleFestivalSubmit}
            onClose={() => setFestivalModalOpen(false)}
        />
      )}
      {isFishingTournamentModalOpen && gameState.currentEvent?.id === 'summer_fishing_tournament' && (
        <FishingTournamentModal
            inventory={gameState.inventory}
            onSubmit={handleFishingTournamentSubmit}
            onClose={() => setFishingTournamentModalOpen(false)}
        />
      )}
      {isNewGameConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30" onClick={() => setNewGameConfirmOpen(false)}>
            <div className="bg-red-900/80 backdrop-blur-md border-4 border-yellow-800 rounded-lg p-6 w-full max-w-sm shadow-2xl text-white flex flex-col modal-enter-animation" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl text-center mb-4 text-yellow-300">새 게임 시작</h2>
                <p className="text-center text-red-200 mb-6">정말로 새 게임을 시작하시겠습니까? 현재 진행 상황이 모두 삭제되며, 이 작업은 되돌릴 수 없습니다.</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setNewGameConfirmOpen(false)}
                        className="w-full p-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-bold transition-all text-lg"
                    >
                        취소
                    </button>
                    <button
                        onClick={confirmNewGame}
                        className="w-full p-3 bg-red-700 hover:bg-red-600 rounded-lg text-white font-bold transition-all text-lg"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
