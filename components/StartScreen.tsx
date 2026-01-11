
import React from 'react';

interface StartScreenProps {
    onStart: (playerCount: number) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    return (
        <div id="screen-start" className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6">
            <h1 className="text-6xl font-black text-yellow-500 mb-4 italic text-center drop-shadow-lg animate__animated animate__pulse animate__infinite" style={{ animationDuration: '3s' }}>
                CAMINO AL<br/>ÉXITO
            </h1>
            <p className="mb-4 text-xs font-bold uppercase text-white/50">Selecciona Jugadores:</p>
            <div className="grid grid-cols-4 gap-3 w-full max-w-xs">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <button
                        key={num}
                        onClick={() => onStart(num)}
                        className={`glass p-4 rounded-xl text-xl font-black transition-colors hover:bg-yellow-500/20 ${num === 1 ? 'border border-yellow-500/30 text-yellow-500' : ''}`}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StartScreen;