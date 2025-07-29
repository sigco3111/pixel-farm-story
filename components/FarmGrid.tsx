
import React from 'react';
import { TileData, Tool } from '../types';
import Tile from './Tile';

interface FarmGridProps {
  grid: TileData[][];
  onTileMouseDown: (x: number, y: number) => void;
  onTileMouseEnter: (x: number, y: number) => void;
  activeTool: Tool;
}

const FarmGrid: React.FC<FarmGridProps> = ({ grid, onTileMouseDown, onTileMouseEnter, activeTool }) => {
  const cursorStyle = () => {
    switch (activeTool) {
      case 'PLANT': return 'cursor-copy';
      case 'HARVEST': return 'cursor-grab';
      case 'BUILD': return 'cursor-crosshair';
      case 'DEMOLISH': return 'cursor-not-allowed';
      default: return 'cursor-pointer';
    }
  };

  return (
    <div 
      className={`grid grid-cols-10 gap-1 p-2 bg-black/30 border-2 border-yellow-800 rounded-lg ${cursorStyle()}`}
      onDragStart={(e) => e.preventDefault()}
    >
      {grid.map((row, y) =>
        row.map((tile, x) => (
          <Tile 
            key={`${x}-${y}-${tile.id}`} 
            tile={tile} 
            onMouseDown={() => onTileMouseDown(x, y)} 
            onMouseEnter={() => onTileMouseEnter(x, y)}
          />
        ))
      )}
    </div>
  );
};

export default FarmGrid;
