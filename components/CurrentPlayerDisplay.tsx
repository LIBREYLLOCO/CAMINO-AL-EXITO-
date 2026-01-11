
import React from 'react';
import { Player } from '../types';

interface CurrentPlayerDisplayProps {
    player: Player;
    pozo: number;
}

const CurrentPlayerDisplay: React.FC<CurrentPlayerDisplayProps> = ({ player, pozo }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-36 h-36 bg-slate-900/95 backdrop-blur-md rounded-full border-4 border-white/10 flex flex-col items-center justify-center text-center p-2 shadow-2xl z-10 pointer-events-auto">
                <p className="text-[7px] text-yellow-500 font-black uppercase mb-1">TURNO DE</p>
                <h3 className="text-lg font-black uppercase leading-none mb-2 truncate w-28" style={{ color: player.color }}>{player.name}</h3>
                <div className="flex flex-col gap-1 w-full px-2">
                    <div className="flex justify-between items-center text-[9px] font-black text-yellow-400 bg-white/5 px-2 py-0.5 rounded">
                        <span>💰</span><span>${player.actual.money.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black text-red-400 bg-white/5 px-2 py-0.5 rounded">
                        <span>❤️</span><span>{`${player.actual.health}/${player.metas.s}`}</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black text-orange-400 bg-white/5 px-2 py-0.5 rounded">
                        <span>😊</span><span>{`${player.actual.happy}/${player.metas.h}`}</span>
                    </div>
                </div>
                <div className="text-[8px] font-black uppercase text-green-400 mt-2 bg-green-900/30 px-2 py-1 rounded-full border border-green-500/30">
                    🍀 Pozo: ${pozo.toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default CurrentPlayerDisplay;
