
import { GameState, Action, TileData, Crop, GameEvent, Weather } from '../types';
import { CROPS, BUILD_ITEMS, TICKS_PER_DAY, SEASONS, DAYS_PER_SEASON, RESEARCH_ITEMS, GRID_SIZE, EVENT_CONFIG, ANIMALS, PRODUCE, WEATHER_CONFIG, CRAFTING_RECIPES, DISH_RECIPES, FISH, createInitialState } from '../constants';

let tickCounter = 0;

const checkObjectives = (state: GameState): GameState => {
    let newState = { ...state };
    let objectiveCompleted = false;

    const newObjectives = newState.objectives.map(obj => {
        if (!obj.completed && obj.isCompleted(newState)) {
            objectiveCompleted = true;
            if (obj.reward.money) newState.money += obj.reward.money;
            if (obj.reward.researchPoints) newState.researchPoints += obj.reward.researchPoints;
            
            const message = `✅ 목표 달성: ${obj.description} (+${obj.reward.money || 0}G, +${obj.reward.researchPoints || 0}RP)`;
            newState.logs = [message, ...newState.logs].slice(0, 5);
            
            return { ...obj, completed: true };
        }
        return obj;
    });

    if (objectiveCompleted) {
        newState.objectives = newObjectives;
        return newState;
    }
    return state;
};

export const gameReducer = (state: GameState, action: Action): GameState => {
  let stateAfterAction: GameState;

  switch (action.type) {
    case 'RESET_GAME': {
      stateAfterAction = createInitialState();
      break;
    }
    case 'TICK': {
      tickCounter++;

      let newGrid = state.grid.map(row => row.map(tile => ({ ...tile })));
      let { day, season, currentEvent, weather } = state;
      let logs: string[] = [];

      if (tickCounter >= TICKS_PER_DAY) {
        tickCounter = 0;
        day++;

        // Determine new weather
        const rand = Math.random();
        let newWeather: Weather = '맑음';
        if (rand < WEATHER_CONFIG.CHANCES['비']) {
            newWeather = '비';
        } else if (rand < WEATHER_CONFIG.CHANCES['비'] + WEATHER_CONFIG.CHANCES['흐림']) {
            newWeather = '흐림';
        }
        weather = newWeather;

        logs.push(`☀️ 새로운 날이 밝았습니다! 오늘의 날씨는 ${weather}입니다. (${day}일차)`);
        
        // Clear previous event
        if (currentEvent) {
             currentEvent = null;
        }

        // --- Event Generation ---
        if (season === '봄') {
            const festivalConfig = EVENT_CONFIG.spring_festival;
            if (day % DAYS_PER_SEASON === festivalConfig.triggerDay) {
                currentEvent = { id: 'spring_festival', dayActive: day };
                logs.push('🌸 봄 작물 축제가 열렸습니다! 최고의 작물을 출품하여 상품을 획득하세요!');
            }
        }
        
        if (season === '여름') {
            const tournamentConfig = EVENT_CONFIG.summer_fishing_tournament;
            if (day % DAYS_PER_SEASON === tournamentConfig.triggerDay) {
                currentEvent = { id: 'summer_fishing_tournament', dayActive: day };
                logs.push('🎣 여름 낚시 대회가 열렸습니다! 가장 가치있는 물고기를 낚아 상품을 획득하세요!');
            }
        }
        
        if (weather === '비') {
            let wateredCount = 0;
            newGrid.forEach(row => row.forEach(tile => {
                if (tile.type === 'PLANTED' && tile.cropId && tile.growth < 100) {
                    const crop = CROPS[tile.cropId];
                    if (crop) {
                        const boost = (100 / crop.growthTime) * 4;
                        tile.growth = Math.min(100, tile.growth + boost);
                        wateredCount++;
                    }
                }
            }));
            if (wateredCount > 0) {
                logs.push(`☔️ 비가 내려 농장의 작물 ${wateredCount}개에 물을 주었습니다.`);
            }
        } else {
            const sprinklerPositions: { x: number; y: number }[] = [];
            state.grid.forEach((row, y) => {
              row.forEach((tile, x) => {
                if (tile.buildId === 'sprinkler') {
                  sprinklerPositions.push({ x, y });
                }
              });
            });

            if (sprinklerPositions.length > 0) {
                let wateredCount = 0;
                sprinklerPositions.forEach(({ x, y }) => {
                    const adjacentCoords = [
                        { x, y: y - 1 }, { x, y: y + 1 }, { x: x - 1, y }, { x: x + 1, y },
                    ];
                    adjacentCoords.forEach(coord => {
                        if (coord.y >= 0 && coord.y < GRID_SIZE && coord.x >= 0 && coord.x < GRID_SIZE) {
                            const tile = newGrid[coord.y][coord.x];
                            if (tile.type === 'PLANTED' && tile.cropId && tile.growth < 100) {
                                const crop = CROPS[tile.cropId];
                                if (crop) {
                                    const boost = (100 / crop.growthTime) * 4; 
                                    tile.growth = Math.min(100, tile.growth + boost);
                                    wateredCount++;
                                }
                            }
                        }
                    });
                });
                if (wateredCount > 0) {
                  logs.push(`💧 스프링클러가 주변 작물 ${wateredCount}개에 물을 주었습니다.`);
                }
            }
        }
        
        if ((day - 1) > 0 && (day - 1) % DAYS_PER_SEASON === 0) {
          const currentSeasonIndex = SEASONS.indexOf(season);
          season = SEASONS[(currentSeasonIndex + 1) % SEASONS.length];
          logs.push(`🍂 계절이 ${season}으로 바뀌었습니다.`);

          let witheredCount = 0;
          newGrid = newGrid.map(row => row.map(tile => {
            if (tile.type === 'PLANTED' && tile.cropId) {
              const crop = CROPS[tile.cropId];
              if (crop && !crop.seasons.includes(season) && crop.seasons.length > 0 && tile.buildId !== 'greenhouse') {
                witheredCount++;
                return { ...tile, id: Math.random(), type: 'SOIL' as const, cropId: null, growth: 0 };
              }
            }
            return tile;
          }));
          
          if (witheredCount > 0) {
            logs.push(`계절이 바뀌어 ${witheredCount}개의 작물이 시들었습니다.`);
          }
        }
      }

      const gridAfterUpdate = newGrid.map(row => 
        row.map(tile => {
          const newTile = {...tile};
          if (newTile.type === 'PLANTED' && newTile.cropId && newTile.growth < 100) {
            const crop = CROPS[newTile.cropId];
            if (crop) {
              const growthIncrement = 100 / crop.growthTime;
              newTile.growth = Math.min(100, newTile.growth + growthIncrement);
            }
          }
          if (newTile.buildId === 'barn' && newTile.animalId && newTile.produceProgress < 100) {
            const animal = ANIMALS[newTile.animalId];
            if(animal) {
                const produceIncrement = 100 / animal.produceTime;
                newTile.produceProgress = Math.min(100, newTile.produceProgress + produceIncrement);
            }
          }
          return newTile;
        })
      );

      stateAfterAction = { ...state, grid: gridAfterUpdate, day, season, currentEvent, weather, logs: [...logs, ...state.logs].slice(0, 5) };
      break;
    }
    case 'TILE_ACTION': {
      const { x, y, activeTool, selectedItem } = action.payload;
      const tile = state.grid[y][x];
      
      let tempState = { ...state, stats: {...state.stats}, inventory: {...state.inventory} };
      const newGrid = state.grid.map(r => r.map(c => ({...c})));
      tempState.grid = newGrid;
      let logMessage: string | null = null;

      switch (activeTool) {
        case 'PLANT': {
          const crop = selectedItem as Crop;
          const canPlantHere = (tile.type === 'SOIL' && !tile.cropId);
          
          if (!canPlantHere) {
             logMessage = `여기에 심을 수 없습니다!`;
          } else if (!crop || !('seasons' in crop)) {
            logMessage = `먼저 심을 작물을 선택하세요!`;
          } else if (state.money < crop.cost) {
            logMessage = `${crop.name}을(를) 심을 돈이 부족합니다.`;
          } else if (tile.buildId !== 'greenhouse' && crop.seasons.length > 0 && !crop.seasons.includes(state.season)) {
            logMessage = `계절에 맞지 않는 작물은 온실 타일에만 심을 수 있습니다.`;
          } else {
            newGrid[y][x] = { ...newGrid[y][x], type: 'PLANTED' as const, cropId: crop.id, growth: 0 };
            tempState.money -= crop.cost;
            logMessage = `${crop.name}을(를) ${crop.cost}G에 심었습니다.`;
          }
          break;
        }
        case 'HARVEST': {
          let harvested = false;
          const hasWarehouse = tempState.grid.flat().some(tile => tile.buildId === 'warehouse');

          if (tile.type === 'PLANTED' && tile.growth >= 100 && tile.cropId) {
            harvested = true;
            const crop = CROPS[tile.cropId];
            if (crop) {
              const newTotalHarvested = state.stats.totalHarvested + 1;
              tempState.stats.totalHarvested = newTotalHarvested;
              tempState.stats.harvestedItems = { ...state.stats.harvestedItems, [tile.cropId]: (state.stats.harvestedItems[tile.cropId] || 0) + 1 };
              newGrid[y][x] = { ...newGrid[y][x], type: 'SOIL' as const, cropId: null, growth: 0 };
              
              if(hasWarehouse) {
                 tempState.inventory[tile.cropId] = (tempState.inventory[tile.cropId] || 0) + 1;
                 logMessage = `📦 ${crop.name} 1개를 수확하여 창고에 보관했습니다.`;
              } else {
                 tempState.money += crop.sellPrice;
                 tempState.stats.totalEarned = (tempState.stats.totalEarned || 0) + crop.sellPrice;
                 logMessage = `💰 ${crop.name} 1개를 수확하여 ${crop.sellPrice}G에 즉시 판매했습니다.`;
              }

              if (newTotalHarvested > 0 && newTotalHarvested % 5 === 0) {
                tempState.researchPoints += 1;
                logMessage += ` (💡 연구 포인트 +1)`;
              }
            }
          }
          else if (tile.buildId === 'barn' && tile.animalId && tile.produceProgress >= 100) {
             harvested = true;
             const animal = ANIMALS[tile.animalId];
             const produce = PRODUCE[animal.produceId];
             if (animal && produce) {
                newGrid[y][x].produceProgress = 0;
                
                if (hasWarehouse) {
                    tempState.inventory[produce.id] = (tempState.inventory[produce.id] || 0) + 1;
                    logMessage = `📦 ${animal.name}에게서 ${produce.name} 1개를 얻어 창고에 보관했습니다.`;
                } else {
                    tempState.money += produce.sellPrice;
                    tempState.stats.totalEarned = (tempState.stats.totalEarned || 0) + produce.sellPrice;
                    logMessage = `💰 ${animal.name}에게서 얻은 ${produce.name}을(를) ${produce.sellPrice}G에 즉시 판매했습니다.`;
                }
             }
          }
          if (!harvested) {
             logMessage = `수확할 것이 없습니다.`;
          }
          break;
        }
        case 'BUILD': {
          const buildItem = selectedItem as any;
          if (tile.type === 'SOIL' && !tile.cropId && !tile.buildId && buildItem && !('seasons' in buildItem) && state.money >= buildItem.cost) {
              const buildType = (['SPRINKLER', 'WAREHOUSE', 'GREENHOUSE', 'BARN', 'WORKSHOP', 'KITCHEN', 'FISHING_POND'].includes(buildItem.type)) ? 'SOIL' : buildItem.type;
              newGrid[y][x] = { ...tile, type: buildType, buildId: buildItem.id, cropId: null, growth: 0 };
              tempState.money -= buildItem.cost;
              logMessage = `${buildItem.name}을(를) ${buildItem.cost}G에 건설했습니다.`;
          } else if(tile.type !== 'SOIL' || tile.cropId || tile.buildId){
              logMessage = `비어있는 흙 타일에만 건설할 수 있습니다!`;
          } else if (!buildItem || 'seasons' in buildItem) {
              logMessage = `먼저 건설할 아이템을 선택하세요!`;
          } else {
              logMessage = `${buildItem.name}을(를) 건설할 돈이 부족합니다.`;
          }
          break;
        }
        case 'DEMOLISH': {
            if (tile.buildId) {
                if (tile.animalId) {
                    logMessage = '동물이 들어있는 외양간은 철거할 수 없습니다!';
                    break;
                }
                const cost = 10;
                if(state.money >= cost){
                    tempState.money -= cost;
                    newGrid[y][x] = { ...newGrid[y][x], id: Math.random(), type: 'SOIL' as const, buildId: null };
                    logMessage = `${cost}G를 내고 철거했습니다.`;
                } else {
                    logMessage = `철거할 돈이 부족합니다.`;
                }
            } else {
                 logMessage = `철거할 것이 없습니다.`;
            }
            break;
        }
      }
      stateAfterAction = logMessage ? { ...tempState, logs: [logMessage, ...state.logs].slice(0, 5) } : tempState;
      break;
    }
    case 'RESEARCH_ITEM': {
      const { itemId } = action.payload;
      const researchItem = RESEARCH_ITEMS[itemId];
      let logMessage: string;

      if (!researchItem || state.researchPoints < researchItem.cost || state.unlockedItems.research.includes(itemId)) {
        logMessage = state.unlockedItems.research.includes(itemId) ? '이미 완료된 연구입니다.' : '연구 포인트가 부족합니다.';
        stateAfterAction = { ...state, logs: [logMessage, ...state.logs].slice(0, 5) };
        break;
      }

      logMessage = `🔬 연구 완료: ${researchItem.name}!`;
      stateAfterAction = {
        ...state,
        researchPoints: state.researchPoints - researchItem.cost,
        unlockedItems: {
          crops: [...state.unlockedItems.crops, ...(researchItem.unlocks.crops || [])],
          builds: [...state.unlockedItems.builds, ...(researchItem.unlocks.builds || [])],
          livestock: [...state.unlockedItems.livestock, ...(researchItem.unlocks.livestock || [])],
          research: [...state.unlockedItems.research, itemId],
        },
        logs: [logMessage, ...state.logs].slice(0, 5),
      };
      break;
    }
    case 'SELL_INVENTORY': {
        let totalSellPrice = 0;
        const itemIds = Object.keys(state.inventory);
        const SELLABLE_ITEMS = { ...CROPS, ...PRODUCE, ...CRAFTING_RECIPES, ...DISH_RECIPES, ...FISH };
        let logMessage: string;

        if (itemIds.length === 0) {
            logMessage = '판매할 아이템이 창고에 없습니다.';
            stateAfterAction = { ...state, logs: [logMessage, ...state.logs].slice(0, 5) };
            break;
        }

        for (const itemId of itemIds) {
            const quantity = state.inventory[itemId];
            const item = SELLABLE_ITEMS[itemId as keyof typeof SELLABLE_ITEMS];
            if (item && quantity > 0) {
                totalSellPrice += item.sellPrice * quantity;
            }
        }

        if (totalSellPrice > 0) {
            logMessage = `💰 창고의 모든 아이템을 판매하여 ${totalSellPrice}G를 얻었습니다!`;
            stateAfterAction = {
                ...state,
                money: state.money + totalSellPrice,
                inventory: {},
                stats: {
                    ...state.stats,
                    totalEarned: state.stats.totalEarned + totalSellPrice,
                },
                logs: [logMessage, ...state.logs].slice(0, 5),
            };
        } else {
            logMessage = '판매할 아이템이 창고에 없습니다.';
            stateAfterAction = { ...state, logs: [logMessage, ...state.logs].slice(0, 5) };
        }
        break;
    }
    case 'BUY_ANIMAL': {
        const { animalId, x, y } = action.payload;
        const animal = ANIMALS[animalId];
        let logMessage: string;
        if (!animal || state.money < animal.cost) {
            logMessage = '돈이 부족합니다.';
            stateAfterAction = { ...state, logs: [logMessage, ...state.logs].slice(0, 5) };
            break;
        }
        const newGrid = state.grid.map(r => r.map(c => ({...c})));
        newGrid[y][x] = { ...newGrid[y][x], animalId: animal.id, produceProgress: 0 };
        logMessage = `🛖 ${animal.name}을(를) ${animal.cost}G에 구매하여 외양간에 넣었습니다.`;
        stateAfterAction = {
            ...state,
            grid: newGrid,
            money: state.money - animal.cost,
            logs: [logMessage, ...state.logs].slice(0, 5),
        };
        break;
    }
    case 'CRAFT_ITEM': {
      const { itemId } = action.payload;
      const recipe = CRAFTING_RECIPES[itemId];
      let logMessage: string;

      if (!recipe) {
        stateAfterAction = state;
        break;
      }
      
      const newInventory = { ...state.inventory };
      let canCraft = true;
      for (const ingredientId in recipe.ingredients) {
        if ((newInventory[ingredientId] || 0) < recipe.ingredients[ingredientId]) {
          canCraft = false;
          break;
        }
      }

      if (canCraft) {
        for (const ingredientId in recipe.ingredients) {
          newInventory[ingredientId] -= recipe.ingredients[ingredientId];
          if (newInventory[ingredientId] === 0) delete newInventory[ingredientId];
        }
        newInventory[itemId] = (newInventory[itemId] || 0) + 1;
        logMessage = `✨ ${recipe.name} 1개를 제작했습니다.`;
        stateAfterAction = { ...state, inventory: newInventory, logs: [logMessage, ...state.logs].slice(0, 5) };
      } else {
        logMessage = `🛠️ 재료가 부족하여 ${recipe.name}을(를) 제작할 수 없습니다.`;
        stateAfterAction = { ...state, logs: [logMessage, ...state.logs].slice(0, 5) };
      }
      break;
    }
    case 'COOK_ITEM': {
      const { itemId } = action.payload;
      const recipe = DISH_RECIPES[itemId];
      let logMessage: string;
      if (!recipe) {
        stateAfterAction = state;
        break;
      }
      
      const newInventory = { ...state.inventory };
      let canCook = true;
      for (const ingredientId in recipe.ingredients) {
        if ((newInventory[ingredientId] || 0) < recipe.ingredients[ingredientId]) {
          canCook = false;
          break;
        }
      }

      if (canCook) {
        for (const ingredientId in recipe.ingredients) {
          newInventory[ingredientId] -= recipe.ingredients[ingredientId];
          if (newInventory[ingredientId] === 0) delete newInventory[ingredientId];
        }
        newInventory[itemId] = (newInventory[itemId] || 0) + 1;
        logMessage = `😋 ${recipe.name} 1개를 요리했습니다.`;
        stateAfterAction = { ...state, inventory: newInventory, logs: [logMessage, ...state.logs].slice(0, 5) };
      } else {
        logMessage = `🥣 재료가 부족하여 ${recipe.name}을(를) 요리할 수 없습니다.`;
        stateAfterAction = { ...state, logs: [logMessage, ...state.logs].slice(0, 5) };
      }
      break;
    }
    case 'CATCH_FISH': {
      const { fishId } = action.payload;
      const fish = FISH[fishId];
      if (!fish) {
        stateAfterAction = state;
        break;
      }
      const newInventory = { ...state.inventory, [fishId]: (state.inventory[fishId] || 0) + 1 };
      const logMessage = `🎣 ${fish.name}을(를) 낚았다! 창고에 보관했습니다.`;
      stateAfterAction = { ...state, inventory: newInventory, logs: [logMessage, ...state.logs].slice(0, 5) };
      break;
    }
     case 'SUBMIT_FESTIVAL_ENTRY': {
      const { itemId } = action.payload;
      const crop = CROPS[itemId];
      const inventory = { ...state.inventory };
      let logMessage: string;

      if (!crop || (inventory[itemId] || 0) < 1) {
        logMessage = '출품할 수 없는 아이템입니다.';
        stateAfterAction = { ...state, logs: [logMessage, ...state.logs].slice(0, 5) };
        break;
      }

      inventory[itemId]--;
      if (inventory[itemId] === 0) delete inventory[itemId];

      const score = crop.sellPrice * (Math.random() * 0.5 + 0.8);
      let moneyGained = 0;
      let rpGained = 0;
      
      const newStats = { ...state.stats, festivalWins: state.stats.festivalWins || { gold: 0, silver: 0, bronze: 0 }};

      if (score > 500) {
        moneyGained = 7000; rpGained = 100;
        newStats.festivalWins.gold = (newStats.festivalWins.gold || 0) + 1;
        logMessage = `🥇 봄 작물 축제에서 금상을 수상했습니다! (+${moneyGained}G, +${rpGained}RP)`;
      } else if (score > 250) {
        moneyGained = 3000; rpGained = 50;
        newStats.festivalWins.silver = (newStats.festivalWins.silver || 0) + 1;
        logMessage = `🥈 봄 작물 축제에서 은상을 수상했습니다! (+${moneyGained}G, +${rpGained}RP)`;
      } else if (score > 100) {
        moneyGained = 1000; rpGained = 20;
        newStats.festivalWins.bronze = (newStats.festivalWins.bronze || 0) + 1;
        logMessage = `🥉 봄 작물 축제에서 동상을 수상했습니다! (+${moneyGained}G, +${rpGained}RP)`;
      } else {
        rpGained = 10;
        logMessage = `🎉 봄 작물 축제에 참가해주셔서 감사합니다! (+${rpGained}RP)`;
      }

      stateAfterAction = {
        ...state,
        money: state.money + moneyGained,
        researchPoints: state.researchPoints + rpGained,
        inventory,
        stats: newStats,
        logs: [logMessage, ...state.logs].slice(0, 5),
      };
      break;
    }
    case 'SUBMIT_FISHING_TOURNAMENT_ENTRY': {
      const { fishId } = action.payload;
      const fish = FISH[fishId];
      const inventory = { ...state.inventory };
      let logMessage: string;

      if (!fish || (inventory[fishId] || 0) < 1) {
        logMessage = '출품할 수 없는 아이템입니다.';
        stateAfterAction = { ...state, logs: [logMessage, ...state.logs].slice(0, 5) };
        break;
      }

      inventory[fishId]--;
      if (inventory[fishId] === 0) delete inventory[fishId];

      const score = fish.sellPrice;
      let moneyGained = 0;
      let rpGained = 0;
      
      const newStats = { ...state.stats, festivalWins: state.stats.festivalWins || { gold: 0, silver: 0, bronze: 0 }};

      if (score >= 7500) { // Legendary
        moneyGained = 20000; rpGained = 250;
        newStats.festivalWins.gold = (newStats.festivalWins.gold || 0) + 1;
        logMessage = `🥇 낚시 대회에서 금상을 수상했습니다! (+${moneyGained}G, +${rpGained}RP)`;
      } else if (score >= 350) { // Rare
        moneyGained = 6000; rpGained = 120;
        newStats.festivalWins.silver = (newStats.festivalWins.silver || 0) + 1;
        logMessage = `🥈 낚시 대회에서 은상을 수상했습니다! (+${moneyGained}G, +${rpGained}RP)`;
      } else { // Common
        moneyGained = 1500; rpGained = 50;
        newStats.festivalWins.bronze = (newStats.festivalWins.bronze || 0) + 1;
        logMessage = `🥉 낚시 대회에서 동상을 수상했습니다! (+${moneyGained}G, +${rpGained}RP)`;
      }

      stateAfterAction = {
        ...state,
        money: state.money + moneyGained,
        researchPoints: state.researchPoints + rpGained,
        inventory,
        stats: newStats,
        logs: [logMessage, ...state.logs].slice(0, 5),
      };
      break;
    }
    case 'ADD_LOG': {
      const newLogs = [action.payload, ...state.logs].slice(0, 5);
      return { ...state, logs: newLogs };
    }
    default:
      return state;
  }
  
  return checkObjectives(stateAfterAction);
};
