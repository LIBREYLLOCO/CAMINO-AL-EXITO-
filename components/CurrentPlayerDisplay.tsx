import React from 'react';
import { Player } from '../types';

interface CurrentPlayerDisplayProps {
    player: Player;
    pozo: number;
}

const CurrentPlayerDisplay: React.FC<CurrentPlayerDisplayProps> = ({ player, pozo }) => {
    // Show only first 4 letters for aesthetics as requested
    const displayName = player.name.substring(0, 4).toUpperCase();

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Círculo Principal: Aumentado de tamaño (w-64) y overflow-hidden para contener el diseño interno */}
            <div className="relative w-64 h-64 rounded-full border-[6px] border-yellow-500 shadow-[0_0_80px_rgba(234,179,8,0.5)] z-10 pointer-events-auto ring-4 ring-black/40 overflow-hidden bg-slate-900">
                
                {/* Fondo con gradiente y efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-indigo-950 to-slate-900 opacity-100"></div>
                
                {/* 1. SECCIÓN SUPERIOR: JUGADOR (Ocupa el espacio restante arriba) */}
                <div className="absolute inset-x-0 top-0 bottom-[35%] flex flex-col items-center justify-center pt-4 z-20">
                    <p className="text-[9px] text-yellow-400/80 font-black uppercase mb-1 tracking-[0.3em] drop-shadow-md">
                        TURNO DE
                    </p>
                    
                    <h3 className="text-6xl font-black uppercase leading-none tracking-wider drop-shadow-2xl" 
                        style={{ 
                            color: player.color, 
                            fontFamily: 'monospace', 
                            textShadow: `0 0 30px ${player.color}, 0 4px 4px rgba(0,0,0,0.8)` 
                        }}>
                        {displayName}
                    </h3>
                </div>

                {/* 2. SECCIÓN INFERIOR: POZO (Diseño estilo panel de control integrado) */}
                <div className="absolute bottom-0 inset-x-0 h-[38%] bg-black/60 backdrop-blur-md border-t border-white/10 flex flex-col items-center justify-center z-20 pb-1">
                    {/* Efecto de luz en el borde superior del panel */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
                    
                    <div className="flex items-center gap-1 mb-1 opacity-90">
                        <span className="text-[10px]">🍀</span>
                        <span className="text-[8px] font-black text-green-400 uppercase tracking-[0.25em]">POZO ACUMULADO</span>
                        <span className="text-[10px]">🍀</span>
                    </div>
                    
                    <span className="text-3xl font-bold text-white tracking-tight drop-shadow-md tabular-nums" 
                          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                        <span className="text-green-500 mr-1">$</span>
                        {pozo.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CurrentPlayerDisplay;