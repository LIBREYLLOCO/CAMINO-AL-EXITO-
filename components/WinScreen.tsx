
import React, { Dispatch } from 'react';
import { Player } from '../types';
import { Action } from '../state/gameReducer';
import PlayerStatusCard from './PlayerStatusCard';

interface WinScreenProps {
    winner: Player;
    allPlayers: Player[];
    dispatch: Dispatch<Action>;
}

const Firework: React.FC<{ left: string; top: string; delay?: string }> = ({ left, top, delay }) => (
    <div className="firework" style={{ left, top, animationDelay: delay }} />
);

const WinScreen: React.FC<WinScreenProps> = ({ winner, allPlayers, dispatch }) => {
    
    const calculateSuccess = (p: Player): number => {
        const m = Math.min(Math.floor(p.actual.money / 1000), p.metas.d);
        const h = Math.min(p.actual.health, p.metas.s);
        const ha = Math.min(p.actual.happy, p.metas.h);
        return p.metas.t + m + h + ha;
    }

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-center p-6 overflow-y-auto custom-scroll modal-active">
            <div className="absolute inset-0 opacity-50">
                <Firework left="20%" top="30%" />
                <Firework left="80%" top="20%" delay="0.5s" />
                <Firework left="50%" top="50%" delay="0.2s" />
                <Firework left="30%" top="70%" delay="0.7s" />
                <Firework left="70%" top="60%" delay="0.4s" />
            </div>
            <div className="z-10 animate__animated animate__zoomInDown relative w-full pt-8">
                <div className="text-9xl mb-4">🏆</div>
                <h1 className="text-6xl font-black text-yellow-500 mb-2 drop-shadow-[0_0_20px_rgba(241,196,15,0.8)]">¡VICTORIA!</h1>
                <h2 className="text-4xl text-white font-bold mb-6 uppercase italic" style={{ color: winner.color }}>{winner.name}</h2>
                <p className="text-gray-300 uppercase tracking-widest text-sm mb-12 max-w-md mx-auto leading-relaxed">
                    Has alcanzado el equilibrio perfecto en tu Fórmula del Éxito.
                </p>
                
                <div className="mt-12 w-full max-w-5xl mx-auto">
                    <h3 className="text-2xl font-bold uppercase tracking-widest text-gray-400 mb-6">Resultados Finales</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
                        {allPlayers
                            .sort((a, b) => calculateSuccess(b) - calculateSuccess(a))
                            .map(p => (
                                <PlayerStatusCard key={p.id} player={p} isCurrent={p.id === winner.id} />
                        ))}
                    </div>
                </div>

                <button onClick={() => dispatch({ type: 'RESET_GAME' })} className="mt-12 bg-white text-black px-12 py-5 rounded-full font-black text-xl uppercase shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:scale-110 hover:shadow-[0_0_80px_rgba(255,255,255,0.8)] transition transform cursor-pointer">
                    Volver a Jugar
                </button>
            </div>
        </div>
    );
};

export default WinScreen;
