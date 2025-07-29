import React from 'react';
import { TileData } from '../types';
import { CROPS, BUILD_ITEMS, ANIMALS, PRODUCE } from '../constants';

interface TileProps {
  tile: TileData;
  onMouseDown: () => void;
  onMouseEnter: () => void;
}

const Tile: React.FC<TileProps> = ({ tile, onMouseDown, onMouseEnter }) => {
  const buildItem = tile.buildId ? BUILD_ITEMS[tile.buildId] : null;
  const crop = tile.cropId ? CROPS[tile.cropId] : null;
  const animal = tile.animalId ? ANIMALS[tile.animalId] : null;

  let baseBg = 'soil-bg';
  let buildContent = null;
  let cropContent = null;
  let animalContent = null;

  if (buildItem) {
    switch(buildItem.type) {
        case 'ROAD':
            baseBg = 'bg-orange-900';
            buildContent = <div className="w-full h-full flex items-center justify-center text-2xl">{buildItem.icon}</div>;
            break;
        case 'WAREHOUSE':
            baseBg = 'bg-amber-800';
            buildContent = <div className="w-full h-full flex items-center justify-center text-4xl">{buildItem.icon}</div>;
            break;
        case 'WORKSHOP':
            baseBg = 'bg-stone-800 hover:bg-stone-700';
            buildContent = <div className="w-full h-full flex items-center justify-center text-4xl">{buildItem.icon}</div>;
            break;
        case 'KITCHEN':
            baseBg = 'bg-pink-800 hover:bg-pink-700';
            buildContent = <div className="w-full h-full flex items-center justify-center text-4xl">{buildItem.icon}</div>;
            break;
        case 'FISHING_POND':
            baseBg = 'bg-blue-800 hover:bg-blue-700';
            buildContent = <div className="w-full h-full flex items-center justify-center text-4xl">{buildItem.icon}</div>;
            break;
        case 'BARN':
            baseBg = 'bg-red-900/80 hover:bg-red-800/80';
            buildContent = <div className="w-full h-full flex items-center justify-center text-5xl opacity-80">{buildItem.icon}</div>;
            break;
        case 'SPRINKLER':
            buildContent = <div className="absolute w-full h-full flex items-center justify-center text-3xl z-10 pointer-events-none">{buildItem.icon}</div>;
            break;
        case 'GREENHOUSE':
            baseBg = 'bg-cyan-800/50 hover:bg-cyan-700/50';
            buildContent = <span className="absolute text-4xl opacity-20 pointer-events-none">{buildItem.icon}</span>;
            break;
    }
  }

  if (crop) {
    const isReady = tile.growth >= 100;
    const bgColor = isReady ? 'bg-yellow-600/50' : 'bg-transparent';
    const iconAnimation = isReady ? 'harvest-ready-animation' : '';
    cropContent = (
      <div className={`w-full h-full ${bgColor} absolute top-0 left-0 flex items-center justify-center transition-colors duration-500`}>
        <div className="absolute bottom-0 left-0 h-1 bg-green-400" style={{ width: `${tile.growth}%` }}></div>
        <span className={`text-2xl z-10 ${iconAnimation}`}>{crop.icon}</span>
      </div>
    );
  }

  if (animal) {
    const isReady = tile.produceProgress >= 100;
    const produce = PRODUCE[animal.produceId];
    const iconAnimation = isReady ? 'harvest-ready-animation' : '';
    animalContent = (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
            {/* Show animal icon */}
            <span className="text-3xl z-10 opacity-90">{animal.icon}</span>
            {/* Show produce icon when ready */}
            {isReady && produce && (
                <span className={`absolute text-2xl z-20 ${iconAnimation}`} style={{ top: '0%', right: '0%' }}>
                    {produce.icon}
                </span>
            )}
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-blue-400" style={{ width: `${tile.produceProgress}%` }}></div>
        </div>
    );
  }
  
  const isInteractable = !buildItem || ['GREENHOUSE', 'SPRINKLER', 'BARN', 'WAREHOUSE', 'WORKSHOP', 'KITCHEN', 'FISHING_POND'].includes(buildItem.type);

  return (
    <div
      className={`aspect-square border border-yellow-800 flex items-center justify-center relative transition-all duration-150 ${baseBg} hover:border-yellow-400 hover:z-10 hover:scale-105`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      style={{ cursor: isInteractable ? undefined : 'default' }}
    >
      {buildContent}
      {cropContent}
      {animalContent}
    </div>
  );
};

export default Tile;