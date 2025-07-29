
export type TileType = 'SOIL' | 'PLANTED' | 'ROAD';
export type Season = '봄' | '여름' | '가을' | '겨울';
export type Weather = '맑음' | '흐림' | '비';

export interface TileData {
  id: number;
  type: TileType;
  cropId: string | null;
  growth: number; // 0 to 100
  buildId: string | null;
  animalId: string | null;
  produceProgress: number; // 0 to 100
}

export interface Crop {
  id: string;
  name: string;
  icon: string;
  cost: number;
  sellPrice: number;
  growthTime: number; // in game ticks
  seasons: Season[];
  description?: string; // For event items
}

export interface BuildItem {
  id:string;
  name: string;
  icon: string;
  cost: number;
  type: 'ROAD' | 'SPRINKLER' | 'WAREHOUSE' | 'GREENHOUSE' | 'BARN' | 'WORKSHOP' | 'KITCHEN' | 'FISHING_POND';
}

export interface Animal {
    id: string;
    name: string;
    icon: string;
    cost: number;
    produceId: string;
    produceTime: number; // in game ticks
}

export interface Produce {
    id: string;
    name: string;
    icon: string;
    sellPrice: number;
}

export interface CraftedItem {
  id: string;
  name: string;
  icon: string;
  sellPrice: number;
  ingredients: Record<string, number>; // e.g., { milk: 2 }
}

export interface Fish {
  id: string;
  name: string;
  icon: string;
  sellPrice: number;
  rarity: '흔함' | '희귀' | '전설';
}


export type Tool = 'SELECT' | 'PLANT' | 'HARVEST' | 'BUILD' | 'DEMOLISH' | 'RESEARCH';

export interface Objective {
  id: string;
  description: string;
  isCompleted: (state: GameState) => boolean;
  completed: boolean;
  reward: {
    money?: number;
    researchPoints?: number;
  };
}

export interface ResearchItem {
    id: string;
    name:string;
    description: string;
    cost: number; // RP cost
    unlocks: {
        crops?: string[];
        builds?: string[];
        livestock?: string[];
    };
}

export interface UnlockedItems {
    crops: string[];
    builds: string[];
    research: string[];
    livestock: string[];
}

export interface GameStats {
  totalHarvested: number;
  totalEarned: number;
  harvestedItems: Record<string, number>;
  festivalWins?: {
    gold: number;
    silver: number;
    bronze: number;
  }
}

export interface GameEvent {
  id: 'spring_festival' | 'summer_fishing_tournament';
  dayActive: number;
}

export interface GameState {
  grid: TileData[][];
  money: number;
  researchPoints: number;
  day: number;
  season: Season;
  weather: Weather;
  objectives: Objective[];
  logs: string[];
  stats: GameStats;
  unlockedItems: UnlockedItems;
  inventory: Record<string, number>;
  currentEvent: GameEvent | null;
}

export type Action =
  | { type: 'TICK'; payload: { addLog: (message: string) => void } } // TICK still needs addLog for now until full refactor
  | { type: 'TILE_ACTION'; payload: { x: number; y: number; activeTool: Tool; selectedItem: Crop | BuildItem | null; addLog: (message: string) => void } } // TILE_ACTION still needs addLog for now
  | { type: 'ADD_LOG'; payload: string }
  | { type: 'RESEARCH_ITEM'; payload: { itemId: string } }
  | { type: 'SELL_INVENTORY' }
  | { type: 'BUY_ANIMAL'; payload: { animalId: string; x: number; y: number } }
  | { type: 'CRAFT_ITEM'; payload: { itemId: string } }
  | { type: 'COOK_ITEM'; payload: { itemId: string } }
  | { type: 'CATCH_FISH'; payload: { fishId: string } }
  | { type: 'SUBMIT_FESTIVAL_ENTRY', payload: { itemId: string } }
  | { type: 'SUBMIT_FISHING_TOURNAMENT_ENTRY', payload: { fishId: string } }
  | { type: 'RESET_GAME' };
