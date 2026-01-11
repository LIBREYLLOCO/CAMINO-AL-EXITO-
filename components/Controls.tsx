
import React, { useState, useEffect } from 'react';

interface ControlsProps {
    dice: [number, number];
    isRolling: boolean;
    inRoute: boolean;
    onRoll: () => void;
}

const Controls: React.FC<ControlsProps> = ({ dice, isRolling, inRoute, onRoll }) => {
    const [d1Text, setD1Text] = useState<string | number>('?');
    const [d2Text, setD2Text] = useState<string | number>('?');

    useEffect(() => {
        if (isRolling) {
            const interval = setInterval(() => {
                setD1Text(Math.floor(Math.random() * 6) + 1);
                if (!inRoute) {
                    setD2Text(Math.floor(Math.random() * 6) + 1);
                } else {
                    setD2Text('-');
                }
            }, 50);
            return () => clearInterval(interval);
        } else {
            setD1Text(dice[0] === 0 ? '?' : dice[0]);
            setD2Text(inRoute ? '-' : (dice[1] === 0 ? '?' : dice[1]));
        }
    }, [isRolling, dice, inRoute]);

    return (
        <div className="p-6 bg-slate-800 rounded-t-[3rem] border-t border-white/10 flex flex-col items-center shadow-[0_-10px_50px_rgba(0,0,0,0.6)] z-20 shrink-0">
            <div className="flex gap-6 mb-4">
                <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center text-4xl font-black shadow-inner">{d1Text}</div>
                <div className={`w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center text-4xl font-black shadow-inner transition-opacity ${inRoute ? 'opacity-50' : 'opacity-100'}`}>{d2Text}</div>
            </div>
            <button
                onClick={onRoll}
                disabled={isRolling}
                className="btn-gold w-full max-w-xs py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:scale-105 transition active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isRolling ? 'Lanzando...' : 'Lanzar Dados'}
            </button>
        </div>
    );
};

export default Controls;
