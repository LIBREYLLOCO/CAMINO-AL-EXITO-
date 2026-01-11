
import React from 'react';
import { Player } from '../types';

interface TurnOverlayProps {
    player: Player;
    onStartTurn: () => void;
}

const TurnOverlay: React.FC<TurnOverlayProps> = ({ player, onStartTurn }) => {
    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300">
            <div className="text-center p-8">
                <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl border-4 bg-black" style={{ color: player.color, borderColor: player.color, boxShadow: `0 0 40px ${player.color}` }}>{player.icon}</div>
                <h2 className="text-white/60 font-bold text-xs uppercase tracking-[0.3em] mb-2">TURNO DE</h2>
                <h1 className="text-5xl font-black text-white mb-10 uppercase italic drop-shadow-lg" style={{ color: player.color }}>{player.name}</h1>
                <button onClick={onStartTurn} className="bg-white text-slate-900 px-12 py-4 rounded-full font-black text-lg uppercase shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 transition animate-pulse">¡JUGAR!</button>
            </div>
        </div>
    );
};

export default TurnOverlay;