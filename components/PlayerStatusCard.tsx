import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types';
import { playSound, SoundEffect } from '../utils/soundManager';

interface PlayerStatusCardProps {
    player: Player;
    isCurrent: boolean;
    compact?: boolean;
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const useAnimatedStat = (endValue: number, duration = 1500) => {
    const [animatedValue, setAnimatedValue] = useState(endValue);
    const prevEndValue = usePrevious(endValue);

    useEffect(() => {
        const startValue = prevEndValue ?? endValue;
        if (startValue === endValue) return;

        let startTime: number | null = null;
        const animationFrame = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Ease-out cubic function
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = Math.round(startValue + (endValue - startValue) * easedProgress);
            setAnimatedValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animationFrame);
            } else {
                setAnimatedValue(endValue);
            }
        };

        requestAnimationFrame(animationFrame);
    }, [endValue, prevEndValue, duration]);

    return animatedValue;
};


const PlayerStatusCard: React.FC<PlayerStatusCardProps> = ({ player, isCurrent, compact = false }) => {
    
    const calculateSuccess = (p: Player): number => {
        const m = Math.min(Math.floor(p.actual.money / 1000), p.metas.d);
        const h = Math.min(p.actual.health, p.metas.s);
        const ha = Math.min(p.actual.happy, p.metas.h);
        return p.metas.t + m + h + ha;
    }

    const mPerc = Math.min(100, (player.actual.money / (player.metas.d * 1000)) * 100) || 0;
    const sPerc = Math.min(100, (player.actual.health / player.metas.s) * 100) || 0;
    const hPerc = Math.min(100, (player.actual.happy / player.metas.h) * 100) || 0;
    const totalSucc = calculateSuccess(player);

    const animatedMoney = useAnimatedStat(player.actual.money);
    const animatedHealth = useAnimatedStat(player.actual.health);
    const animatedHappy = useAnimatedStat(player.actual.happy);
    const animatedPassive = useAnimatedStat(player.actual.passive);

    const [moneyChange, setMoneyChange] = useState<'increase' | 'decrease' | null>(null);
    const [healthChange, setHealthChange] = useState<'increase' | 'decrease' | null>(null);
    const [happyChange, setHappyChange] = useState<'increase' | 'decrease' | null>(null);
    const [passiveChange, setPassiveChange] = useState<'increase' | 'decrease' | null>(null);

    const prevPlayer = usePrevious(player);

    useEffect(() => {
        if (!prevPlayer || prevPlayer.id !== player.id) return;

        const checkStat = (
            current: number, 
            previous: number, 
            setter: React.Dispatch<React.SetStateAction<'increase' | 'decrease' | null>>,
            incSound: SoundEffect,
            decSound: SoundEffect,
        ) => {
            if (current > previous) {
                setter('increase');
                playSound(incSound, 0.4);
            } else if (current < previous) {
                setter('decrease');
                playSound(decSound, 0.4);
            }
        };
        
        checkStat(player.actual.money, prevPlayer.actual.money, setMoneyChange, 'moneyGain', 'moneyLoss');
        checkStat(player.actual.health, prevPlayer.actual.health, setHealthChange, 'statIncrease', 'statDecrease');
        checkStat(player.actual.happy, prevPlayer.actual.happy, setHappyChange, 'statIncrease', 'statDecrease');
        checkStat(player.actual.passive, prevPlayer.actual.passive, setPassiveChange, 'statIncrease', 'statDecrease');

        if (
            player.actual.money !== prevPlayer.actual.money ||
            player.actual.health !== prevPlayer.actual.health ||
            player.actual.happy !== prevPlayer.actual.happy ||
            player.actual.passive !== prevPlayer.actual.passive
        ) {
            const timer = setTimeout(() => {
                setMoneyChange(null);
                setHealthChange(null);
                setHappyChange(null);
                setPassiveChange(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [player, prevPlayer]);

    const getChangeClass = (change: 'increase' | 'decrease' | null) => {
        if (!change) return '';
        return change === 'increase' ? 'animate-flash-increase' : 'animate-flash-decrease';
    };

    const containerClasses = `bg-white/5 rounded-xl ${compact ? 'p-3' : 'p-4'} border ${isCurrent ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10'} transition-all`;
    const initials = player.name.substring(0, 2).toUpperCase();

    return (
        <div className={containerClasses}>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                     <span className="text-xl font-black uppercase" style={{ color: player.color, fontFamily: 'monospace' }}>{initials}</span>
                     <span className="text-[9px] opacity-40 uppercase truncate max-w-[50px]">{player.name}</span>
                </div>
                <span className="text-xs font-bold text-white bg-black/40 px-2 py-1 rounded-lg">{totalSucc}% Éxito</span>
            </div>
            <div className="space-y-2">
                <div className={`rounded-md transition-colors ${getChangeClass(moneyChange)}`}>
                    <div className="flex justify-between text-[9px] text-gray-400 font-bold mb-0.5">
                        <span>DINERO</span> <span>${(animatedMoney / 1000).toFixed(0)}k / ${player.metas.d}k</span>
                    </div>
                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden relative"><div className="h-full bg-yellow-400 absolute stat-bar-inner" style={{ width: `${mPerc}%` }}></div></div>
                </div>
                <div className={`rounded-md transition-colors ${getChangeClass(healthChange)}`}>
                    <div className="flex justify-between text-[9px] text-gray-400 font-bold mb-0.5">
                        <span>SALUD</span> <span>{animatedHealth} / {player.metas.s}</span>
                    </div>
                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden relative"><div className="h-full bg-red-400 absolute stat-bar-inner" style={{ width: `${sPerc}%` }}></div></div>
                </div>
                <div className={`rounded-md transition-colors ${getChangeClass(happyChange)}`}>
                    <div className="flex justify-between text-[9px] text-gray-400 font-bold mb-0.5">
                        <span>FELICIDAD</span> <span>{animatedHappy} / {player.metas.h}</span>
                    </div>
                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden relative"><div className="h-full bg-orange-400 absolute stat-bar-inner" style={{ width: `${hPerc}%` }}></div></div>
                </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 space-y-1">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-blue-300">🕰️ Puntos Edad</span>
                    <span className="text-sm font-black text-white">{player.metas.t}</span>
                </div>
                <div className={`flex justify-between items-center rounded-md transition-colors ${getChangeClass(passiveChange)}`}>
                    <span className="text-[10px] font-bold uppercase text-green-400">🔄 Ingreso Pasivo</span>
                    <span className="text-sm font-black text-white">${animatedPassive.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default PlayerStatusCard;