
import { GameState, TileData, Crop, BuildItem, Objective, Season, ResearchItem, UnlockedItems, Animal, Produce, CraftedItem, Fish } from './types';

export const GRID_SIZE = 10;
export const TICKS_PER_DAY = 12; // 24 seconds per day if tick is 2s
export const DAYS_PER_SEASON = 30;
export const SEASONS: Season[] = ['봄', '여름', '가을', '겨울'];

export const CROPS: Record<string, Crop> = {
  // Base Crops
  turnip: { id: 'turnip', name: '순무', icon: '🥬', cost: 10, sellPrice: 30, growthTime: 12, seasons: ['봄', '가을'] }, // 1 day
  carrot: { id: 'carrot', name: '당근', icon: '🥕', cost: 30, sellPrice: 80, growthTime: 24, seasons: ['봄', '가을'] }, // 2 days
  strawberry: { id: 'strawberry', name: '딸기', icon: '🍓', cost: 80, sellPrice: 200, growthTime: 48, seasons: ['봄'] }, // 4 days
  tomato: { id: 'tomato', name: '토마토', icon: '🍅', cost: 50, sellPrice: 120, growthTime: 36, seasons: ['여름'] }, // 3 days
  bell_pepper: { id: 'bell_pepper', name: '피망', icon: '🫑', cost: 60, sellPrice: 150, growthTime: 48, seasons: ['여름'] }, // 4 days
  pumpkin: { id: 'pumpkin', name: '호박', icon: '🎃', cost: 100, sellPrice: 250, growthTime: 60, seasons: ['가을'] }, // 5 days
  corn: { id: 'corn', name: '옥수수', icon: '🌽', cost: 150, sellPrice: 350, growthTime: 72, seasons: ['여름'] }, // 6 days
  wheat: { id: 'wheat', name: '밀', icon: '🌾', cost: 20, sellPrice: 40, growthTime: 36, seasons: ['봄', '가을'] }, // 3 days
  winter_root: { id: 'winter_root', name: '겨울 순무', icon: '🥔', cost: 40, sellPrice: 90, growthTime: 36, seasons: ['겨울'] }, // 3 days
};

export const PRODUCE: Record<string, Produce> = {
    egg: { id: 'egg', name: '달걀', icon: '🥚', sellPrice: 50 },
    milk: { id: 'milk', name: '우유', icon: '🥛', sellPrice: 120 },
    wool: { id: 'wool', name: '양털', icon: '🧶', sellPrice: 250 },
};

export const ANIMALS: Record<string, Animal> = {
    chicken: { id: 'chicken', name: '닭', icon: '🐔', cost: 300, produceId: 'egg', produceTime: 24 }, // 2 days
    cow: { id: 'cow', name: '소', icon: '🐄', cost: 1000, produceId: 'milk', produceTime: 48 }, // 4 days
    sheep: { id: 'sheep', name: '양', icon: '🐑', cost: 800, produceId: 'wool', produceTime: 72 }, // 6 days
};

export const BUILD_ITEMS: Record<string, BuildItem> = {
  road: { id: 'road', name: '흙길', icon: '🟫', cost: 20, type: 'ROAD' },
  sprinkler: { id: 'sprinkler', name: '스프링클러', icon: '💧', cost: 500, type: 'SPRINKLER' },
  warehouse: { id: 'warehouse', name: '창고', icon: '📦', cost: 1000, type: 'WAREHOUSE' },
  greenhouse: { id: 'greenhouse', name: '온실', icon: '🌿', cost: 2000, type: 'GREENHOUSE' },
  barn: { id: 'barn', name: '외양간', icon: '🛖', cost: 1200, type: 'BARN' },
  workshop: { id: 'workshop', name: '공방', icon: '🛠️', cost: 2000, type: 'WORKSHOP' },
  kitchen: { id: 'kitchen', name: '주방', icon: '🍳', cost: 3000, type: 'KITCHEN' },
  fishing_pond: { id: 'fishing_pond', name: '낚시터', icon: '🎣', cost: 3000, type: 'FISHING_POND' },
};

export const CRAFTING_RECIPES: Record<string, CraftedItem> = {
    flour: { id: 'flour', name: '밀가루', icon: '🥡', sellPrice: 100, ingredients: { wheat: 2 } },
    bread: { id: 'bread', name: '빵', icon: '🍞', sellPrice: 250, ingredients: { flour: 2 } },
    cheese: { id: 'cheese', name: '치즈', icon: '🧀', sellPrice: 350, ingredients: { milk: 2 } },
    yarn: { id: 'yarn', name: '실타래', icon: '🧵', sellPrice: 750, ingredients: { wool: 2 } },
    turnip_pickle: { id: 'turnip_pickle', name: '순무절임', icon: '🫙', sellPrice: 150, ingredients: { turnip: 3 } },
};

export const DISH_RECIPES: Record<string, CraftedItem> = {
    omelette: { id: 'omelette', name: '오믈렛', icon: '🍳', sellPrice: 600, ingredients: { egg: 2, cheese: 1 } },
    strawberry_cake: { id: 'strawberry_cake', name: '딸기 케이크', icon: '🍰', sellPrice: 1200, ingredients: { strawberry: 3, milk: 1, flour: 2 } },
    pumpkin_porridge: { id: 'pumpkin_porridge', name: '호박죽', icon: '🥣', sellPrice: 900, ingredients: { pumpkin: 2, milk: 1 } },
    cornbread: { id: 'cornbread', name: '옥수수빵', icon: '🍞', sellPrice: 1300, ingredients: { corn: 3, egg: 1, flour: 1 } },
    stuffed_pepper: { id: 'stuffed_pepper', name: '피망 볶음', icon: '🥘', sellPrice: 700, ingredients: { bell_pepper: 2, turnip: 1, carrot: 1 } },
    roasted_root: { id: 'roasted_root', name: '구운 뿌리채소', icon: '🍠', sellPrice: 500, ingredients: { winter_root: 3, carrot: 1 } },
};

export const FISH: Record<string, Fish> = {
    carp: { id: 'carp', name: '잉어', icon: '🐟', sellPrice: 100, rarity: '흔함' },
    tuna: { id: 'tuna', name: '참치', icon: '🐠', sellPrice: 350, rarity: '희귀' },
    eel: { id: 'eel', name: '장어', icon: '🐍', sellPrice: 650, rarity: '희귀' },
    legendary_fish: { id: 'legendary_fish', name: '전설의 물고기', icon: '🐡', sellPrice: 7500, rarity: '전설' },
};

export const RESEARCH_ITEMS: Record<string, ResearchItem> = {
    advanced_farming: {
        id: 'advanced_farming',
        name: '고급 농업',
        description: '새로운 고수익 작물인 옥수수를 재배할 수 있게 됩니다.',
        cost: 20,
        unlocks: { crops: ['corn'] },
    },
     summer_veggies: {
        id: 'summer_veggies',
        name: '여름 채소 연구',
        description: '더운 여름에도 잘 자라는 새로운 작물, 피망을 재배할 수 있게 됩니다.',
        cost: 60,
        unlocks: { crops: ['bell_pepper'] },
    },
    winter_farming: {
        id: 'winter_farming',
        name: '겨울 농법 연구',
        description: '추운 겨울에도 수확할 수 있는 강인한 작물, 겨울 순무를 재배할 수 있습니다.',
        cost: 120,
        unlocks: { crops: ['winter_root'] },
    },
    cereal_farming: {
        id: 'cereal_farming',
        name: '곡물 농업',
        description: '빵이나 다른 요리의 기본 재료인 밀을 재배할 수 있습니다.',
        cost: 40,
        unlocks: { crops: ['wheat'] },
    },
    automation: {
        id: 'automation',
        name: '자동화',
        description: '농장 관리를 도와주는 스프링클러를 건설할 수 있게 됩니다.',
        cost: 50,
        unlocks: { builds: ['sprinkler'] },
    },
    logistics: {
        id: 'logistics',
        name: '물류학',
        description: '수확한 작물을 보관하고 한번에 판매할 수 있는 창고를 건설할 수 있게 됩니다.',
        cost: 80,
        unlocks: { builds: ['warehouse'] },
    },
    animal_husbandry: {
        id: 'animal_husbandry',
        name: '축산학',
        description: '동물을 키울 수 있는 외양간을 짓고 닭을 구매할 수 있습니다.',
        cost: 100,
        unlocks: { builds: ['barn'], livestock: ['chicken'] },
    },
    cattle_breeding: {
        id: 'cattle_breeding',
        name: '낙농업',
        description: '소를 키워 우유를 생산할 수 있습니다. (축산학 필요)',
        cost: 200,
        unlocks: { livestock: ['cow'] },
    },
    sheep_farming: {
        id: 'sheep_farming',
        name: '목양',
        description: '양을 키워 양털을 생산할 수 있습니다. (축산학 필요)',
        cost: 180,
        unlocks: { livestock: ['sheep'] },
    },
    horticulture: {
        id: 'horticulture',
        name: '원예학',
        description: '계절에 상관없이 작물을 재배할 수 있는 온실을 건설할 수 있습니다.',
        cost: 150,
        unlocks: { builds: ['greenhouse'] },
    },
    processing: {
        id: 'processing',
        name: '가공 기술',
        description: '수확물을 가공하여 더 높은 가치의 상품을 만들 수 있는 공방을 건설할 수 있습니다.',
        cost: 250,
        unlocks: { builds: ['workshop'] },
    },
    culinary_arts: {
        id: 'culinary_arts',
        name: '요리법',
        description: '주방을 건설하여 수확한 작물과 생산품으로 맛있는 요리를 만들 수 있습니다.',
        cost: 300,
        unlocks: { builds: ['kitchen'] },
    },
    fishing: {
        id: 'fishing',
        name: '낚시',
        description: '물고기를 잡을 수 있는 낚시터를 건설할 수 있게 됩니다.',
        cost: 280,
        unlocks: { builds: ['fishing_pond'] },
    },
}

export const EVENT_CONFIG = {
    spring_festival: {
        triggerDay: 15,
    },
    summer_fishing_tournament: {
        triggerDay: 15,
    }
};

export const WEATHER_CONFIG = {
    CHANCES: {
        '비': 0.15,
        '흐림': 0.25,
        '맑음': 0.60,
    }
};

export const INITIAL_UNLOCKED_ITEMS: UnlockedItems = {
    crops: ['turnip', 'carrot', 'strawberry', 'tomato', 'pumpkin'],
    builds: ['road'],
    research: [],
    livestock: [],
};

export const INITIAL_OBJECTIVES: Objective[] = [
  {
    id: 'harvest_1_turnip',
    description: '첫 순무를 수확하세요.',
    isCompleted: (state: GameState) => (state.stats.harvestedItems?.['turnip'] || 0) >= 1,
    completed: false,
    reward: { money: 100, researchPoints: 5 },
  },
  {
    id: 'earn_1000_gold',
    description: '총 1000G를 버세요.',
    isCompleted: (state: GameState) => state.stats.totalEarned >= 1000,
    completed: false,
    reward: { money: 200, researchPoints: 10 },
  },
  {
    id: 'build_a_road',
    description: '길을 한 칸 건설하세요.',
    isCompleted: (state: GameState) => state.grid.flat().some(tile => tile.type === 'ROAD'),
    completed: false,
    reward: { money: 100 },
  },
   {
    id: 'harvest_5_carrots',
    description: '당근 5개를 수확하세요.',
    isCompleted: (state: GameState) => (state.stats.harvestedItems?.['carrot'] || 0) >= 5,
    completed: false,
    reward: { money: 500, researchPoints: 20 },
  },
  {
    id: 'harvest_10_bell_peppers',
    description: '피망 10개를 수확하세요.',
    isCompleted: (state: GameState) => (state.stats.harvestedItems?.['bell_pepper'] || 0) >= 10,
    completed: false,
    reward: { money: 1000, researchPoints: 30 },
  },
  {
    id: 'harvest_10_winter_roots',
    description: '겨울 순무 10개를 수확하세요.',
    isCompleted: (state: GameState) => (state.stats.harvestedItems?.['winter_root'] || 0) >= 10,
    completed: false,
    reward: { money: 800, researchPoints: 40 },
  },
  {
    id: 'build_a_barn',
    description: '외양간을 건설하세요.',
    isCompleted: (state: GameState) => state.grid.flat().some(tile => tile.buildId === 'barn'),
    completed: false,
    reward: { money: 500, researchPoints: 20 },
  },
  {
    id: 'get_an_egg',
    description: '첫 달걀을 수확하세요.',
    isCompleted: (state: GameState) => (state.inventory?.['egg'] || 0) >= 1,
    completed: false,
    reward: { money: 300, researchPoints: 15 },
  },
  {
    id: 'get_milk',
    description: '첫 우유를 얻으세요.',
    isCompleted: (state: GameState) => (state.inventory?.['milk'] || 0) >= 1,
    completed: false,
    reward: { money: 500, researchPoints: 25 },
  },
  {
    id: 'get_wool',
    description: '첫 양털을 얻으세요.',
    isCompleted: (state: GameState) => (state.inventory?.['wool'] || 0) >= 1,
    completed: false,
    reward: { money: 800, researchPoints: 30 },
  },
  {
    id: 'build_a_workshop',
    description: '공방을 건설하세요.',
    isCompleted: (state: GameState) => state.grid.flat().some(tile => tile.buildId === 'workshop'),
    completed: false,
    reward: { money: 1000, researchPoints: 50 },
  },
  {
    id: 'craft_cheese',
    description: '첫 치즈를 만드세요.',
    isCompleted: (state: GameState) => (state.inventory?.['cheese'] || 0) >= 1,
    completed: false,
    reward: { money: 500, researchPoints: 25 },
  },
  {
    id: 'craft_5_bread',
    description: '빵 5개를 만드세요.',
    isCompleted: (state: GameState) => (state.inventory?.['bread'] || 0) >= 5,
    completed: false,
    reward: { money: 1200, researchPoints: 40 },
  },
  {
    id: 'build_a_kitchen',
    description: '주방을 건설하세요.',
    isCompleted: (state: GameState) => state.grid.flat().some(tile => tile.buildId === 'kitchen'),
    completed: false,
    reward: { money: 2000, researchPoints: 80 },
  },
  {
    id: 'cook_an_omelette',
    description: '첫 오믈렛을 요리하세요.',
    isCompleted: (state: GameState) => (state.inventory?.['omelette'] || 0) >= 1,
    completed: false,
    reward: { money: 1000, researchPoints: 40 },
  },
  {
    id: 'become_a_master_chef',
    description: '5종류의 다른 요리를 만드세요.',
    isCompleted: (state: GameState) => Object.keys(DISH_RECIPES).filter(dishId => (state.inventory?.[dishId] || 0) > 0).length >= 5,
    completed: false,
    reward: { money: 5000, researchPoints: 100 },
  },
  {
    id: 'build_a_fishing_pond',
    description: '낚시터를 건설하세요.',
    isCompleted: (state: GameState) => state.grid.flat().some(tile => tile.buildId === 'fishing_pond'),
    completed: false,
    reward: { money: 1500, researchPoints: 60 },
  },
  {
    id: 'catch_first_fish',
    description: '첫 물고기를 낚으세요.',
    isCompleted: (state: GameState) => Object.keys(FISH).some(fishId => (state.inventory?.[fishId] || 0) > 0),
    completed: false,
    reward: { money: 500, researchPoints: 20 },
  },
  {
    id: 'catch_tuna',
    description: '희귀 등급인 참치를 낚으세요.',
    isCompleted: (state: GameState) => (state.inventory?.['tuna'] || 0) >= 1,
    completed: false,
    reward: { money: 1000, researchPoints: 50 },
  },
  {
    id: 'win_gold_prize',
    description: '봄 작물 축제에서 금상 수상하기',
    isCompleted: (state: GameState) => (state.stats.festivalWins?.gold || 0) >= 1,
    completed: false,
    reward: { money: 10000, researchPoints: 200 },
  },
  {
    id: 'win_prize_in_two_festivals',
    description: '서로 다른 축제에서 2번 이상 입상하기',
    isCompleted: (state: GameState) => ((state.stats.festivalWins?.gold || 0) + (state.stats.festivalWins?.silver || 0) + (state.stats.festivalWins?.bronze || 0)) >= 2,
    completed: false,
    reward: { money: 3000, researchPoints: 80 },
  },
];

export const createInitialState = (): GameState => {
  const grid: TileData[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({
      id: Math.random(),
      type: 'SOIL',
      cropId: null,
      growth: 0,
      buildId: null,
      animalId: null,
      produceProgress: 0,
    }))
  );
  return {
    grid,
    money: 700,
    researchPoints: 10,
    day: 1,
    season: '봄',
    weather: '맑음',
    objectives: INITIAL_OBJECTIVES,
    logs: ['픽셀 농장 이야기에 오신 것을 환영합니다!'],
    stats: {
      totalHarvested: 0,
      totalEarned: 0,
      harvestedItems: {},
      festivalWins: { gold: 0, silver: 0, bronze: 0 },
    },
    unlockedItems: INITIAL_UNLOCKED_ITEMS,
    inventory: {},
    currentEvent: null,
  };
};
