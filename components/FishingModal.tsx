
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FISH } from '../constants';
import { Fish } from '../types';

interface FishingModalProps {
  onCatch: (fishId: string) => void;
  onClose: () => void;
}

type GameStatus = 'IDLE' | 'WAITING' | 'HOOKED' | 'SUCCESS' | 'FAIL';

const FishingModal: React.FC<FishingModalProps> = ({ onCatch, onClose }) => {
    const [status, setStatus] = useState<GameStatus>('IDLE');
    const [caughtFish, setCaughtFish] = useState<Fish | null>(null);
    const [reactionTime, setReactionTime] = useState(1500); // ms for reaction
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimers = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);
    
    useEffect(() => {
        return () => {
            clearTimers();
        };
    }, [clearTimers]);

    const determineCatch = (): Fish => {
        const rand = Math.random();
        const fishList = Object.values(FISH);

        if (rand < 0.01) { // 1% for legendary
            return fishList.find(f => f.rarity === '전설')!;
        }
        if (rand < 0.30) { // 29% for rare (1% + 29% = 30%)
            const rareFish = fishList.filter(f => f.rarity === '희귀');
            return rareFish[Math.floor(Math.random() * rareFish.length)];
        }
        // 70% for common
        const commonFish = fishList.filter(f => f.rarity === '흔함');
        return commonFish[Math.floor(Math.random() * commonFish.length)];
    }

    const startFishing = () => {
        setStatus('WAITING');
        const waitTime = Math.random() * 3000 + 2000; // 2-5 seconds
        timerRef.current = setTimeout(() => {
            setStatus('HOOKED');
        }, waitTime);
    }
    
    useEffect(() => {
        if (status === 'HOOKED') {
            timerRef.current = setTimeout(() => {
                setStatus('FAIL');
            }, reactionTime);
        }
    }, [status, reactionTime]);

    const handleHookClick = () => {
        if (status !== 'HOOKED') return;
        
        clearTimers();
        const fish = determineCatch();
        setCaughtFish(fish);
        onCatch(fish.id);
        setStatus('SUCCESS');
    }

    const renderContent = () => {
        switch (status) {
            case 'IDLE':
                return (
                    <>
                        <p className="text-xl text-center text-blue-200 mb-6">낚시를 시작해 보세요.</p>
                        <button onClick={startFishing} className="w-full p-4 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold text-xl">
                            미끼 던지기
                        </button>
                    </>
                );
            case 'WAITING':
                return <p className="text-xl text-center text-blue-200 animate-pulse">입질을 기다리는 중...</p>;
            case 'HOOKED':
                return (
                    <div className="flex flex-col items-center justify-center cursor-pointer" onClick={handleHookClick}>
                        <div className="text-8xl animate-ping absolute opacity-50">❗️</div>
                        <div className="text-8xl z-10">❗️</div>
                        <p className="text-2xl mt-4 font-bold">지금이야!</p>
                        <div className="w-full bg-gray-600 rounded-full h-4 mt-4 overflow-hidden">
                            <div className="bg-yellow-400 h-4 rounded-full reaction-bar-animation" style={{ animationDuration: `${reactionTime}ms` }}></div>
                        </div>
                    </div>
                );
            case 'SUCCESS':
                return (
                    <>
                        <h3 className="text-2xl text-center text-yellow-300">물고기를 낚았다!</h3>
                        <div className="my-4 p-4 bg-black/30 rounded-lg flex items-center justify-center gap-4">
                            <span className="text-6xl">{caughtFish?.icon}</span>
                            <div>
                                <p className="text-2xl font-bold">{caughtFish?.name}</p>
                                <p className="text-yellow-400">{caughtFish?.sellPrice}G</p>
                            </div>
                        </div>
                        <button onClick={startFishing} className="w-full p-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold text-lg">
                            다시 낚시하기
                        </button>
                    </>
                );
            case 'FAIL':
                 return (
                    <>
                        <p className="text-2xl text-center text-red-400 mb-6">아깝다, 놓쳤다!</p>
                        <button onClick={startFishing} className="w-full p-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold text-lg">
                            다시 시도하기
                        </button>
                    </>
                );
        }
    }

    return (
        <>
        <style>{`
            @keyframes shrink-bar {
                from { width: 100%; }
                to { width: 0%; }
            }
            .reaction-bar-animation {
                animation: shrink-bar linear forwards;
            }
        `}</style>
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20" onClick={onClose}>
            <div className="bg-blue-900/80 backdrop-blur-md border-4 border-yellow-800 rounded-lg p-6 w-full max-w-md shadow-2xl text-white flex flex-col modal-enter-animation" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl text-center mb-4 text-yellow-300">🎣 낚시터</h2>
                <div className="min-h-[200px] flex items-center justify-center p-4 bg-black/20 rounded-lg">
                    {renderContent()}
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 w-full p-2 bg-red-700 hover:bg-red-600 rounded-lg text-white font-bold flex-shrink-0"
                >
                    그만하기
                </button>
            </div>
        </div>
        </>
    );
};

export default FishingModal;
