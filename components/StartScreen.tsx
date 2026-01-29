import React from 'react';
import { playSound, initAudio } from '../utils/soundManager';

interface StartScreenProps {
    onStart: (playerCount: number) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    const handleStartClick = (num: number) => {
        initAudio(); // Unlock audio context on first user interaction
        playSound('uiClick', 0.3);
        onStart(num);
    };

    return (
        <div id="screen-start" className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Fondo Dinámico */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-[#050b14]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
            
            {/* Contenedor del Logo */}
            <div className="relative z-10 mb-10 flex flex-col items-center justify-center min-h-[160px]">
                {/* 
                   NOTA: La app buscará 'logo.png' en la carpeta pública (la misma donde está index.html).
                */}
                <img 
                    src="logo.png" 
                    alt="Logo Camino al Éxito" 
                    className="w-72 md:w-96 max-h-[40vh] object-contain drop-shadow-[0_0_35px_rgba(234,179,8,0.3)] animate__animated animate__zoomIn"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = document.getElementById('logo-fallback');
                        if (fallback) fallback.style.display = 'block';
                    }}
                />
                
                {/* Fallback de Texto (Visible solo si falla la imagen) */}
                <div id="logo-fallback" className="hidden text-center animate__animated animate__fadeIn">
                     <h1 className="text-6xl font-black text-yellow-500 italic drop-shadow-lg leading-tight">
                        CAMINO AL<br/>ÉXITO
                    </h1>
                </div>
            </div>

            <p className="mb-6 text-[10px] font-black uppercase text-white/40 tracking-[0.3em] relative z-10">Selecciona Jugadores</p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs relative z-10">
                {[1, 2, 3, 4].map(num => (
                    <button
                        key={num}
                        onClick={() => handleStartClick(num)}
                        className={`glass p-6 rounded-2xl text-3xl font-black transition-all duration-300 hover:scale-105 hover:bg-yellow-500/20 active:scale-95 group relative overflow-hidden ${num === 1 ? 'border-yellow-500/40 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.15)]' : 'border-white/10 text-white'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative group-hover:drop-shadow-[0_0_10px_currentColor] transition-all">{num}</span>
                    </button>
                ))}
            </div>
            
            <div className="absolute bottom-6 flex flex-col items-center gap-1 z-10 opacity-30">
                <p className="text-[10px] text-white font-mono">OFFICIAL BOARD GAME</p>
                <div className="w-8 h-1 bg-yellow-500 rounded-full"></div>
            </div>
        </div>
    );
};

export default StartScreen;