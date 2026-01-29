import React from 'react';
import { playSound } from '../utils/soundManager';
import AnimatedDie from './AnimatedDie';

interface ControlsProps {
    dice: [number, number];
    isRolling: boolean;
    disabled: boolean;
    inRoute: boolean;
    onRoll: () => void;
}

const Controls: React.FC<ControlsProps> = ({ dice, isRolling, disabled, inRoute, onRoll }) => {
    
    const handleRollClick = () => {
        if (!disabled) {
            playSound('diceRoll', 0.7);
            onRoll();
        }
    };

    return (
        <div className="p-6 bg-slate-800 rounded-t-[3rem] border-t border-white/10 flex flex-col items-center shadow-[0_-10px_50px_rgba(0,0,0,0.6)] z-20 shrink-0">
            <div className="flex gap-6 mb-4 h-16 items-center">
                <AnimatedDie value={dice[0]} isRolling={isRolling} size="lg" />
                {inRoute ? (
                     <div className="w-16 h-16 bg-black/20 border border-white/10 text-white/40 rounded-2xl flex items-center justify-center text-4xl font-black shadow-inner opacity-80">-</div>
                ) : (
                    <AnimatedDie value={dice[1]} isRolling={isRolling} size="lg" />
                )}
            </div>
            <button
                onClick={handleRollClick}
                disabled={disabled}
                className="btn-gold w-full max-w-xs py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:scale-105 transition active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isRolling ? 'Lanzando...' : 'Lanzar Dados'}
            </button>
        </div>
    );
};

export default Controls;