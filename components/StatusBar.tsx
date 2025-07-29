
import React from 'react';
import { Season, GameEvent, Weather } from '../types';

interface StatusBarProps {
  money: number;
  researchPoints: number;
  day: number;
  season: Season;
  weather: Weather;
  currentEvent: GameEvent | null;
  onSave: () => void;
  onNewGame: () => void;
  onOpenEventModal: () => void;
  saveStatus: 'IDLE' | 'SAVED';
}

const StatusBar: React.FC<StatusBarProps> = ({ money, researchPoints, day, season, weather, currentEvent, onSave, onNewGame, onOpenEventModal, saveStatus }) => {
  const isSaved = saveStatus === 'SAVED';
  
  const weatherIcon: Record<Weather, string> = {
    '맑음': '☀️',
    '흐림': '☁️',
    '비': '🌧️',
  };

  const getEventDetails = () => {
    if (!currentEvent) return null;
    switch (currentEvent.id) {
        case 'spring_festival':
            return { icon: '🌸', text: '봄 축제', title: '봄 작물 축제가 열렸습니다! 클릭해서 참가하세요.' };
        case 'summer_fishing_tournament':
            return { icon: '🎣', text: '낚시 대회', title: '여름 낚시 대회가 열렸습니다! 클릭해서 참가하세요.' };
        default:
            return { icon: '✨', text: '이벤트', title: '특별 이벤트 발생! 클릭해서 확인하세요.' };
    }
  }
  const eventDetails = getEventDetails();

  return (
    <div className="flex justify-between items-center bg-black/20 border-2 border-yellow-800 p-2 rounded-lg text-yellow-200 shadow-inner">
      <div className="flex items-center space-x-4">
        <span className="text-lg">💰 골드: <span className="font-bold text-yellow-300">{money}G</span></span>
        <span className="text-lg">💡 RP: <span className="font-bold text-blue-300">{researchPoints}</span></span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          {eventDetails && (
            <button 
              onClick={onOpenEventModal}
              title={eventDetails.title}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg border border-purple-400 event-active-animation flex items-center gap-1"
            >
              <span>{eventDetails.icon}</span>
              <span>{eventDetails.text}</span>
            </button>
          )}
        </div>
        <span className="text-lg flex items-center gap-2">
            <span>{weatherIcon[weather]}</span>
            <span>{season} {day % 30 === 0 ? 30 : day % 30}일차</span>
        </span>
        <div className="flex items-center space-x-2">
            <button 
              onClick={onSave}
              title="현재 게임 진행 상황을 저장합니다."
              disabled={isSaved}
              className={`px-3 py-1 text-sm rounded border transition-all duration-300 ${
                isSaved
                  ? 'bg-green-500 text-white border-green-400 cursor-default'
                  : 'bg-green-700/50 hover:bg-green-600/50 text-yellow-200 border-yellow-800'
              }`}
            >
              {isSaved ? '✅ 저장 완료!' : '💾 저장'}
            </button>
            <button 
              onClick={onNewGame}
              title="모든 진행 상황을 초기화하고 새 게임을 시작합니다."
              className="px-3 py-1 bg-red-800/50 hover:bg-red-700/50 text-yellow-200 text-sm rounded border border-yellow-800 transition-colors"
            >
              🔄 새 게임
            </button>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;