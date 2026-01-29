import React from 'react';
import { Card } from '../../types';
import { playSound } from '../../utils/soundManager';

interface CardModalProps {
    card: Card;
    category: string;
    onResolve: (success: boolean) => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, category, onResolve }) => {
    const showActionButtons = category.includes("RETO") || category.includes("Ruta") || (card.r && (card.r.money! > 0 || card.r.happy! > 0) && !card.r.pozoReset && !card.r.globalDonate);
    
    const handleResolve = (success: boolean) => {
        playSound('uiClick', 0.3);
        onResolve(success);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-6 bg-black/50 backdrop-blur-[2px] z-[100] modal-active">
            <div className={`w-full max-w-sm rounded-[2.5rem] p-6 flex flex-col text-center shadow-2xl border-4 border-white/10 animate__animated animate__zoomIn text-slate-900 max-h-[85vh] ${card.c || 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4 border-b border-black/10 pb-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{category}</p>
                    <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                </div>
                <div className="text-7xl mb-6 animate-bounce">{card.i || "⭐"}</div>
                <div className="flex-grow overflow-y-auto custom-scroll mb-6 px-2">
                    <h3 className="text-lg font-black leading-tight text-slate-800 text-left">{card.t}</h3>
                </div>
                <div className="mb-6 flex flex-wrap justify-center gap-2">
                    {card.r?.money && <span className={`text-xs font-bold ${card.r.money > 0 ? 'text-green-600' : 'text-red-600'} bg-gray-100 px-2 py-1 rounded`}>Dinero: ${card.r.money}</span>}
                    {card.r?.health && <span className={`text-xs font-bold ${card.r.health > 0 ? 'text-green-500' : 'text-red-500'} bg-gray-100 px-2 py-1 rounded`}>Salud: {card.r.health}</span>}
                    {card.r?.happy && <span className={`text-xs font-bold ${card.r.happy > 0 ? 'text-orange-500' : 'text-gray-500'} bg-gray-100 px-2 py-1 rounded`}>Felicidad: {card.r.happy}</span>}
                    {card.r?.passive && <span className="text-xs font-bold text-blue-500 bg-gray-100 px-2 py-1 rounded">Pasivo: ${card.r.passive}</span>}
                </div>
                {showActionButtons ? (
                     <div className="grid grid-cols-2 gap-3 w-full">
                        <button onClick={() => handleResolve(true)} className="py-4 bg-green-500 text-white rounded-xl font-black uppercase shadow-lg text-xs hover:bg-green-600">✅ ¡LOGRADO!</button>
                        <button onClick={() => handleResolve(false)} className="py-4 bg-red-500 text-white rounded-xl font-black uppercase shadow-lg text-xs hover:bg-red-600">❌ FALLÉ</button>
                    </div>
                ) : (
                    <button onClick={() => handleResolve(true)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest shadow-lg">Entendido</button>
                )}
            </div>
        </div>
    );
};

export default CardModal;