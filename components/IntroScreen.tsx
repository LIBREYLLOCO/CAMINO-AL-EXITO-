import React, { useState, useEffect } from 'react';
import { playSound, initAudio } from '../utils/soundManager';

interface IntroScreenProps {
    onNext: () => void;
}

const introQuotes = [
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "No te detengas cuando estés cansado, detente cuando hayas terminado.",
    "La mejor forma de predecir el futuro es creándolo.",
    "Tu actitud, no tu aptitud, determinará tu altitud.",
    "El único lugar donde el éxito viene antes que el trabajo es en el diccionario.",
    "Cree que puedes y ya estarás a medio camino.",
    "No sueñes tu vida, vive tus sueños.",
    "El fracaso es solo la oportunidad de comenzar de nuevo con más inteligencia.",
    "Tu única competencia es quien eras ayer.",
    "Hazlo con pasión o no lo hagas."
];

const IntroScreen: React.FC<IntroScreenProps> = ({ onNext }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [quote, setQuote] = useState("");

    useEffect(() => {
        setQuote(introQuotes[Math.floor(Math.random() * introQuotes.length)]);
    }, []);

    const handleInitialInteraction = () => {
        initAudio(); // Inicializa el contexto de audio con la interacción del usuario
        playSound('welcome', 0.6);
        setHasStarted(true);
    };

    const handleNext = () => {
        initAudio(); 
        playSound('uiClick', 0.3);
        onNext();
    };

    if (!hasStarted) {
        return (
            <div 
                id="screen-intro-start" 
                onClick={handleInitialInteraction}
                className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 cursor-pointer overflow-hidden text-center"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-2xl mx-auto">
                    
                    {/* Mano Saludando - Regresada según solicitud */}
                    <div className="text-7xl md:text-8xl mb-6 animate__animated animate__tada animate__infinite animate__slow drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] transform hover:scale-110 transition-transform">
                        👋
                    </div>

                    <div className="mb-8 animate__animated animate__fadeInDown">
                        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200 italic uppercase drop-shadow-[0_0_25px_rgba(234,179,8,0.4)] tracking-wider">
                            Bienvenido
                        </h1>
                        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.8)]"></div>
                    </div>

                    <div className="mb-12 min-h-[100px] flex items-center justify-center animate__animated animate__fadeInUp animate__delay-1s px-4">
                        <p className="text-xl md:text-3xl text-white font-light italic leading-relaxed drop-shadow-lg max-w-lg">
                            "{quote}"
                        </p>
                    </div>

                    <div className="animate__animated animate__pulse animate__infinite group">
                        <button 
                            className="btn-gold px-10 py-4 rounded-full font-black text-base uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(234,179,8,0.4)] transform transition-transform group-hover:scale-105 group-hover:shadow-[0_0_50px_rgba(234,179,8,0.6)]"
                        >
                            Toca para Iniciar
                        </button>
                        <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] mt-4 font-bold">Inicia tu camino</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="screen-intro" className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 overflow-hidden animate__animated animate__fadeIn">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            
            <div className="glass w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10">
                <h1 className="text-4xl font-black text-yellow-500 mb-6 italic text-center uppercase drop-shadow-md">
                    Instrucciones
                </h1>

                <div className="space-y-6 text-white/90">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-lg shrink-0">1</div>
                        <div>
                            <h3 className="font-bold text-lg mb-1 text-blue-300">Selecciona Jugadores</h3>
                            <p className="text-sm opacity-80 leading-relaxed">Elige cuántas personas jugarán en este dispositivo (1 a 4).</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-lg shrink-0">2</div>
                        <div>
                            <h3 className="font-bold text-lg mb-1 text-purple-300">Configura tu Perfil</h3>
                            <p className="text-sm opacity-80 leading-relaxed">Ingresa tu <strong>Nombre</strong> y <strong>Edad</strong>. La edad te dará puntos base de "Tiempo".</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-lg shrink-0">3</div>
                        <div>
                            <h3 className="font-bold text-lg mb-1 text-green-300">Tu Fórmula del Éxito</h3>
                            <p className="text-sm opacity-80 leading-relaxed mb-2">Ajusta las barras para que sumen exactamente <strong>100</strong> puntos:</p>
                            <div className="grid grid-cols-3 gap-2 text-[10px] font-black uppercase text-center">
                                <div className="bg-white/10 rounded p-1 text-yellow-400">💰 Dinero</div>
                                <div className="bg-white/10 rounded p-1 text-red-400">❤️ Salud</div>
                                <div className="bg-white/10 rounded p-1 text-orange-400">😊 Felicidad</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <button 
                        onClick={handleNext}
                        className="btn-gold w-full py-4 rounded-xl font-black text-xl uppercase tracking-widest shadow-xl hover:scale-105 transition active:scale-95"
                    >
                        Comenzar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IntroScreen;