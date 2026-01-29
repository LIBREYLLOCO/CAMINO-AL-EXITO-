import React from 'react';

interface PassiveIncomeBannerProps {
    amount: number;
    healthGain: number;
    playerName: string;
    lap: number;
}

const PassiveIncomeBanner: React.FC<PassiveIncomeBannerProps> = ({ amount, healthGain, playerName, lap }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[10000] p-6 bg-black/60 backdrop-blur-sm">
            
            {/* Contenedor Unificado (Banner único) */}
            <div 
                className="relative bg-slate-900 border-2 border-yellow-500/50 text-white rounded-3xl font-black uppercase tracking-wider shadow-[0_0_60px_rgba(234,179,8,0.4)] w-full max-w-sm overflow-hidden transform transition-all"
                style={{ animation: 'zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
            >
                {/* Cabecera del Banner */}
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-4 text-center relative overflow-hidden shadow-lg z-20">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    <h2 className="relative z-10 text-slate-900 font-black text-sm md:text-base flex items-center justify-center gap-2">
                        <span>🏁</span>
                        <span>{playerName}</span>
                        <span className="opacity-50">•</span>
                        <span>Vuelta {lap}</span>
                        <span>🏁</span>
                    </h2>
                </div>

                {/* Cuerpo del Banner */}
                <div className="p-6 space-y-6 bg-gradient-to-b from-slate-800 to-slate-900 relative">
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/5 to-transparent"></div>

                    {/* Fila 1: Ingreso Pasivo */}
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl drop-shadow-md">💸</div>
                            <div className="text-left">
                                <div className="text-[10px] text-green-400 mb-0.5 tracking-widest">INGRESO PASIVO</div>
                                <div className="text-4xl text-yellow-300 drop-shadow-lg tabular-nums leading-none">
                                    +${amount.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Separador */}
                    <div className="h-px bg-white/10 w-full"></div>

                    {/* Fila 2: Salud */}
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl drop-shadow-md animate-pulse">❤️</div>
                            <div className="text-left">
                                <div className="text-[10px] text-red-400 mb-0.5 tracking-widest">SALUD EXTRA</div>
                                <div className="text-4xl text-white drop-shadow-lg tabular-nums leading-none">
                                    +{healthGain}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 px-2 py-1 rounded text-[8px] font-bold text-white/50 max-w-[80px] text-right leading-tight">
                            Premio por constancia
                        </div>
                    </div>
                </div>

                {/* Pie del Banner */}
                <div className="bg-black/40 p-2 text-center text-[9px] text-white/30 font-bold uppercase tracking-[0.2em]">
                    ¡Sigue avanzando!
                </div>
            </div>
        </div>
    );
};

export default PassiveIncomeBanner;