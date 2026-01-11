
import React from 'react';
import { Player } from '../types';

interface PlayerStatusCardProps {
    player: Player;
    isCurrent: boolean;
    compact?: boolean;
}

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

    const containerClasses = `bg-white/5 rounded-xl ${compact ? 'p-3' : 'p-4'} border ${isCurrent ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10'} transition-all`;

    return (
        <div className={containerClasses}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-black uppercase truncate max-w-[100px]" style={{ color: player.color }}>{player.name}</span>
                <span className="text-xs font-bold text-white bg-black/40 px-2 py-1 rounded-lg">{totalSucc}% Éxito</span>
            </div>
            <div className="space-y-2">
                <div>
                    <div className="flex justify-between text-[9px] text-gray-400 font-bold mb-0.5">
                        <span>DINERO</span> <span>${(player.actual.money / 1000).toFixed(0)}k / ${player.metas.d}k</span>
                    </div>
                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden relative"><div className="h-full bg-yellow-400 absolute" style={{ width: `${mPerc}%` }}></div></div>
                </div>
                <div>
                    <div className="flex justify-between text-[9px] text-gray-400 font-bold mb-0.5">
                        <span>SALUD</span> <span>{player.actual.health} / {player.metas.s}</span>
                    </div>
                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden relative"><div className="h-full bg-red-400 absolute" style={{ width: `${sPerc}%` }}></div></div>
                </div>
                <div>
                    <div className="flex justify-between text-[9px] text-gray-400 font-bold mb-0.5">
                        <span>FELICIDAD</span> <span>{player.actual.happy} / {player.metas.h}</span>
                    </div>
                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden relative"><div className="h-full bg-orange-400 absolute" style={{ width: `${hPerc}%` }}></div></div>
                </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-blue-300">🔄 Ingreso Pasivo</span>
                <span className="text-sm font-black text-white">${player.actual.passive.toLocaleString()}</span>
            </div>
        </div>
    );
};

export default PlayerStatusCard;