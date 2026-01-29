import React from 'react';
import { Tile, Player } from '../../types';
import { routeCosts } from '../../constants';
import { playSound } from '../../utils/soundManager';

interface RouteModalProps {
    tile: Tile;
    player: Player;
    onDecision: (enter: boolean) => void;
}

const RouteModal: React.FC<RouteModalProps> = ({ tile, player, onDecision }) => {
    const routeId = tile.r;
    if (!routeId) return null;

    const alreadyVisited = player.visitedRoutes.includes(routeId);
    const cost = alreadyVisited ? 0 : (routeCosts[routeId] || 3000);

    const handleDecision = (enter: boolean) => {
        playSound('uiClick', 0.3);
        onDecision(enter);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center p-6 bg-black/50 backdrop-blur-[2px] modal-active z-[100]">
            <div className="glass w-full max-w-xs p-8 rounded-[2.5rem] text-center border-2 border-yellow-500 shadow-2xl animate__animated animate__fadeInUp">
                <h2 className="text-2xl font-black text-yellow-500 uppercase italic mb-2">¿Entrar a Ruta?</h2>
                <p className="text-xs font-bold uppercase text-white mb-4">{tile.n}</p>
                <div className="bg-yellow-500/20 rounded-xl p-4 mb-4 border border-yellow-500/30">
                    <p className="text-[10px] uppercase font-bold text-yellow-200 mb-1">COSTO DE ENTRADA</p>
                    <p className={`text-4xl font-black text-white ${alreadyVisited ? 'line-through text-gray-500' : ''}`}>
                        ${cost.toLocaleString()}
                    </p>
                    {alreadyVisited && (
                        <p className="text-xs font-black text-green-400 mt-2 bg-black/40 px-2 py-1 rounded">✨ YA VISITADA = GRATIS ✨</p>
                    )}
                </div>
                <p className="text-gray-400 text-[10px] mb-6 font-bold uppercase leading-relaxed">
                    Ruta interior. Generas cartas en cada paso. Al salir, tu Ingreso Pasivo sube.
                </p>
                <div className="space-y-3">
                    <button onClick={() => handleDecision(true)} className="btn-gold w-full py-4 rounded-xl font-black text-sm uppercase shadow-lg">✅ Entrar</button>
                    <button onClick={() => handleDecision(false)} className="w-full py-4 bg-white/10 rounded-xl text-white font-bold text-xs uppercase hover:bg-white/20">🚫 Seguir por fuera</button>
                </div>
            </div>
        </div>
    );
};

export default RouteModal;